/** Isolated, read-only browser regression. Start the local site before running. */
import assert from 'node:assert/strict';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseURL = process.env.NAVIGATION_TEST_URL ?? 'http://127.0.0.1:3000';
const output = path.resolve(process.env.NAVIGATION_TEST_OUTPUT ?? '/tmp/zimo-navigation-motion');
await mkdir(output, { recursive: true });
let executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
if (!executablePath && process.platform === 'darwin') {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  try { await access(chrome); executablePath = chrome; } catch { /* use Playwright's browser */ }
}
const browser = await chromium.launch({ headless: true, executablePath });
const failures = [], reports = [], errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', colorScheme: 'light' });
await context.addInitScript(() => {
  localStorage.setItem('websiteSettings', JSON.stringify({ disableSpecialTheme: true, disableComments: true, syncSettings: false, backgroundRichness: 'minimal', navigationBar: 'flexible' }));
});
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.setDefaultTimeout(10000);
const nav = () => page.locator('[data-search-trigger="navbar"]');
const menu = () => page.locator('[data-search-trigger="menu"]');
const panel = () => page.locator('#site-search');
const input = () => page.getByRole('combobox');
const settle = () => page.waitForTimeout(380);
const check = async (name, run) => {
  try { await run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, message: error.message }); console.log(`FAIL ${name}: ${error.message}`); await page.screenshot({ path: path.join(output, `failure-${failures.length}.png`) }); }
};
await page.goto(`${baseURL}/blog`, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.fonts.ready);

// The first sample is awaited before the action. This catches the old position,
// instead of accidentally starting the recording after the state changed.
async function record(name, action, { images = false, duration = 450 } = {}) {
  const cdp = images ? await context.newCDPSession(page) : null;
  const writes = [];
  let frameCount = 0;
  if (cdp) {
    await mkdir(path.join(output, name), { recursive: true });
    cdp.on('Page.screencastFrame', event => {
      const index = frameCount++;
      writes.push(writeFile(path.join(output, name, `${String(index).padStart(3, '0')}.jpg`), Buffer.from(event.data, 'base64')));
      void cdp.send('Page.screencastFrameAck', { sessionId: event.sessionId });
    });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, everyNthFrame: 1 });
  }
  await page.bringToFront();
  await page.evaluate(() => new Promise((resolve, reject) => {
    const watchdog = setTimeout(() => reject(new Error("No animation frame from browser")), 5000);
    cancelAnimationFrame(window.__navigationFrameHandle);
    window.__navigationFrames = [];
    window.__navigationRecording = true;
    const sample = () => {
      const frame = { time: performance.now(), scrollY, viewport: { width: innerWidth, height: innerHeight }, expanded: document.querySelector('[data-expanded]').dataset.expanded };
      for (const [key, selector] of Object.entries({ nav: '[data-search-trigger="navbar"]', menu: '[data-search-trigger="menu"]', panel: '#site-search', destinations: '[data-navbar-destinations]' })) {
        const element = document.querySelector(selector);
        const box = element.getBoundingClientRect(), style = getComputedStyle(element);
        frame[key] = { x: box.x, y: box.y, width: box.width, height: box.height, opacity: +style.opacity, display: style.display, open: element.matches(':popover-open'), animations: element.getAnimations().map(animation => ({ type: animation.constructor.name, property: animation.transitionProperty, frames: animation.effect.getKeyframes().map(({ offset, left, top, width, height }) => ({ offset, left, top, width, height })) })) };
      }
      window.__navigationFrames.push(frame);
      if (window.__navigationFrames.length === 1) { clearTimeout(watchdog); resolve(); }
      if (window.__navigationRecording) window.__navigationFrameHandle = requestAnimationFrame(sample);
    };
    window.__navigationFrameHandle = requestAnimationFrame(sample);
  }));
  await action();
  await page.waitForTimeout(duration);
  const frames = await page.evaluate(() => { window.__navigationRecording = false; cancelAnimationFrame(window.__navigationFrameHandle); return window.__navigationFrames; });
  if (cdp) { await cdp.send('Page.stopScreencast'); await cdp.detach(); await Promise.all(writes); }
  await writeFile(path.join(output, `${name}.json`), JSON.stringify(frames, null, 2));
  reports.push({ name, frames: frames.length, renderedImages: frameCount, elapsed: frames.at(-1).time - frames[0].time });
  return frames;
}
async function close() {
  if (await panel().evaluate(element => element.matches(':popover-open'))) await input().press('Escape');
  await settle();
}
async function closeMenu() {
  await close();
  if (await page.locator('#site-menu').evaluate(element => element.open)) {
    await page.locator('button[aria-label="Close menu"]').filter({ visible: true }).first().click();
    await settle();
  }
}
function stable(frames, property, label) {
  const values = frames.map(frame => frame.nav[property]);
  assert(Math.max(...values) - Math.min(...values) < 1, `${label}: range ${Math.min(...values)}–${Math.max(...values)}`);
}
function bounded(frames) {
  for (const frame of frames) if (frame.panel.open && frame.panel.opacity > .05) {
    assert(frame.panel.x >= -1 && frame.panel.y >= -1, `negative position at ${frame.time}`);
    assert(frame.panel.x + frame.panel.width <= frame.viewport.width + 1, `right overflow at ${frame.time}`);
    assert(frame.panel.y + frame.panel.height <= frame.viewport.height + 1, `bottom overflow at ${frame.time}`);
    assert(frame.panel.animations.every(animation => animation.type === 'CSSTransition'), 'motion must remain CSS-owned');
  }
}
function origin(frames, source) {
  const first = frames.find(frame => frame.panel.open && frame.panel.animations.some(animation => animation.property === 'left' || animation.property === 'width'));
  assert(first, 'entrance transition must be observed');
  for (const [property, key] of [['left', 'x'], ['width', 'width'], ['top', 'y']]) {
    const animation = first.panel.animations.find(animation => animation.property === property);
    if (animation) assert(Math.abs(parseFloat(animation.frames[0][property]) - first[source][key]) < 2, `${property} entrance remembered another trigger: ${animation.frames[0][property]} vs ${first[source][key]}`);
  }
  bounded(frames);
}

try {
  await check('desktop scroll keeps search anchored in every frame', async () => {
    const down = await record('desktop-scroll-down', () => page.mouse.wheel(0, 450), { images: true });
    assert.equal(down.at(-1).expanded, 'false'); assert(down.at(-1).scrollY > 100);
    stable(down, 'x', 'horizontal scroll drift'); stable(down, 'width', 'scroll stretch');
    const up = await record('desktop-scroll-up', () => page.mouse.wheel(0, -250));
    assert.equal(up.at(-1).expanded, 'true'); stable(up, 'x', 'upward drift');
  });
  await page.evaluate(() => scrollTo(0, 0)); await settle();
  await check('navbar entrance uses current origin', async () => {
    const frames = await record('navbar-open', () => nav().click(), { images: true }); origin(frames, 'nav');
    assert(await input().evaluate(element => document.activeElement === element));
  });
  await close();
  await page.getByRole('button', { name: 'Open menu', exact: true }).click(); await settle();
  await check('menu entrance after navbar does not remember navbar', async () => {
    const frames = await record('menu-after-navbar', () => menu().click(), { images: true }); origin(frames, 'menu');
    assert.equal(await nav().getAttribute('data-search-covered'), null);
  });
  await close();
  await check('navbar entrance after menu does not remember menu', async () => {
    const frames = await record('navbar-after-menu', () => nav().click(), { images: true }); origin(frames, 'nav');
  });
  await closeMenu();
  await check('rapid close/reopen reverses continuously', async () => {
    const frames = await record('rapid-reversal', async () => {
      await nav().click(); await page.waitForTimeout(65); await input().press('Escape'); await page.waitForTimeout(40); await page.keyboard.press('Control+k');
    }, { images: true });
    bounded(frames);
    for (let i = 1; i < frames.length; i++) {
      const a = frames[i - 1], b = frames[i], dt = b.time - a.time;
      if (a.panel.display !== 'none' && b.panel.display !== 'none') assert(Math.abs(b.panel.x - a.panel.x) <= dt * 7 + 3, `left jumped ${b.panel.x - a.panel.x}px in ${dt}ms`);
    }
    assert(await panel().evaluate(element => element.matches(':popover-open')));
  });
  await close();
  await check('rapid change of invoker starts at the new trigger', async () => {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click(); await settle();
    await nav().click(); await input().press('Escape');
    const frames = await record('rapid-different-invoker', () => menu().click(), { images: true }); origin(frames, 'menu');
  });
  await closeMenu();
  await check('switch directly between two live search triggers', async () => {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click(); await settle();
    await nav().click(); await settle();
    const frames = await record('live-trigger-switch', () => menu().click(), { images: true }); origin(frames, 'menu');
    assert(await input().evaluate(element => document.activeElement === element));
  });
  await closeMenu();
  await check('opening during menu entrance has no delayed correction', async () => {
    const frames = await record('moving-menu-origin', async () => {
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      // DOM click deliberately exercises the still-moving invoker before
      // Playwright's ordinary "stable element" guard would allow a pointer click.
      await page.waitForTimeout(45); await menu().evaluate(element => element.click());
    }, { images: true, duration: 650 });
    bounded(frames);
    const late = frames.filter(frame => frame.panel.open && frame.time > frames[0].time + 450);
    assert(late.length > 2);
    assert(Math.max(...late.map(frame => frame.panel.y)) - Math.min(...late.map(frame => frame.panel.y)) < 1, 'late vertical correction');
  });
  await closeMenu();
  for (const width of [320, 390, 531, 532, 639, 640, 767, 768, 1024, 1135, 1136, 1280, 1440]) {
    await check(`viewport ${width}: scroll, open, query, menu origin`, async () => {
      await closeMenu(); await page.setViewportSize({ width, height: 900 }); await page.evaluate(() => scrollTo(0, 0)); await settle();
      const scroll = await record(`${width}-scroll`, () => page.mouse.wheel(0, 300), { images: width === 390 });
      assert.equal(scroll.at(-1).expanded, 'false');
      if (width >= 640) stable(scroll, 'x', 'desktop drift');
      else assert(Math.abs(scroll.at(-1).nav.y - 10) < 1);
      const frames = await record(`${width}-open`, () => nav().click(), { images: width === 390 }); bounded(frames);
      await input().fill('zzzznomatchingentry'); await settle();
      assert(await page.getByText('No results found', { exact: true }).isVisible());
      await input().fill('design'); await settle(); assert(await page.getByRole('option').count() > 0);
      await close();
      const up = await record(`${width}-scroll-up`, () => page.mouse.wheel(0, -300), { images: width === 390 });
      assert.equal(up.at(-1).expanded, 'true');
      if (width >= 640) stable(up, 'x', 'desktop upward drift');
      for (const frame of up) if (width < 640 && frame.destinations.opacity > .25) {
        const a = frame.nav, b = frame.destinations;
        const overlaps = a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height - 2 && a.y + a.height > b.y;
        assert(!overlaps, `phone destination handoff overlaps at ${frame.time}`);
      }
      await page.getByRole('button', { name: 'Open menu', exact: true }).click(); await settle();
      const menuFrames = await record(`${width}-menu`, () => menu().click(), { images: width === 390 }); bounded(menuFrames);
      assert(await input().evaluate(element => document.activeElement === element));
      if (width < 532) assert(await panel().evaluate(element => !!element.closest('dialog:modal')));
    });
  }
  await check('open search survives viewport and modal boundary changes', async () => {
    await input().fill('design');
    const frames = await record('resize-open', async () => {
      for (const width of [390, 640, 1440, 320, 532, 390]) { await page.setViewportSize({ width, height: width === 390 ? 500 : 900 }); await page.waitForTimeout(90); }
    }, { images: true }); bounded(frames);
    assert.equal(await input().inputValue(), 'design');
    assert(await input().evaluate(element => document.activeElement === element));
  });
  await closeMenu();
  await check('keyboard from an existing page search uses navbar and restores focus', async () => {
    await page.setViewportSize({ width: 1440, height: 900 }); await settle();
    const pageSearch = page.getByPlaceholder('Search blog article...');
    await pageSearch.focus();
    const frames = await record('page-search-keyboard', () => page.keyboard.press('Control+k')); origin(frames, 'nav');
    await input().press('Escape'); await settle();
    assert(await pageSearch.evaluate(element => document.activeElement === element));
  });
  await check('4x CPU throttling keeps scroll and interrupted search continuous', async () => {
    const cdp = await context.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    try {
      await page.locator('main').click({ position: { x: 400, y: 300 } });
      const scroll = await record('slow-cpu-scroll', async () => { await page.mouse.wheel(0, 250); await page.waitForTimeout(50); await page.mouse.wheel(0, -100); }); stable(scroll, 'x', 'slow CPU drift');
      const frames = await record('slow-cpu-interruption', async () => { await nav().click(); await page.waitForTimeout(65); await input().press('Escape'); await page.waitForTimeout(40); await page.keyboard.press('Control+k'); }); bounded(frames);
      assert(await panel().evaluate(element => element.matches(':popover-open')));
    } finally { await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }); await cdp.detach(); await close(); }
  });
  await check('short viewport and changing result heights remain bounded', async () => {
    await page.setViewportSize({ width: 390, height: 400 }); await page.evaluate(() => scrollTo(0, 0)); await settle();
    const frames = await record('short-viewport', async () => { await nav().click(); await input().fill('zzzznomatchingentry'); await page.waitForTimeout(100); await input().fill('design'); }); bounded(frames);
  });
  await close();
  await check('reduced motion removes all search and header transitions', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const frames = await record('reduced-motion', () => nav().click());
    assert(frames.every(frame => !frame.panel.animations.length && !frame.nav.animations.length)); bounded(frames);
  });
  await close(); await page.emulateMedia({ reducedMotion: 'no-preference' });
  await check('keyboard focus, held shortcut, Escape and tips', async () => {
    await page.keyboard.press('Control+k'); await settle();
    await input().fill('design'); await input().press('ArrowDown');
    assert(await input().getAttribute('aria-activedescendant'));
    await page.getByRole('button', { name: 'Search tips', exact: true }).click(); await settle();
    assert(await page.getByText('Search titles and descriptions.', { exact: false }).isVisible());
    await page.keyboard.down('Control'); await page.keyboard.down('k'); await page.keyboard.down('k'); await page.keyboard.up('k'); await page.keyboard.up('Control'); await settle();
    assert(!await panel().evaluate(element => element.matches(':popover-open')));
  });
  await closeMenu();
  await page.setViewportSize({ width: 1440, height: 900 }); await page.evaluate(() => scrollTo(0, 0)); await settle(); await nav().click(); await input().fill('design'); await settle();
  await page.screenshot({ path: path.join(output, 'search-desktop.png') });
  await close(); await page.setViewportSize({ width: 390, height: 844 }); await settle(); await nav().click(); await input().fill('design'); await settle();
  await page.screenshot({ path: path.join(output, 'search-phone.png') });
  assert.deepEqual(errors, [], 'browser runtime errors');
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify({ reports, failures, errors }, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ output, scenarios: reports.length, sampledFrames: reports.reduce((sum, report) => sum + report.frames, 0), failures }, null, 2));
if (failures.length) process.exitCode = 1;
