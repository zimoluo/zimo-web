import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getTheme } from '../../src/features/theme/registry/index.ts';
const require = createRequire(import.meta.url), { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3482', baseline = process.argv.includes('--baseline'), output = process.env.SMOKE_OUTPUT ?? 'work/studio-panel-continuity';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await context.addInitScript(source => { const active = { kind: 'profile', index: 0 }; localStorage.setItem('zw.theme', JSON.stringify({ version: 1, state: { revision: 0, active, scheme: 'light', schemePreference: 'light', profiles: [source], seasonal: false, shuffle: false, byRoute: { themeMaker: active } } })); }, { ...getTheme('whiteout'), id: 'panel-continuity', name: 'Panel continuity', ramp: { ...getTheme('whiteout').ramp, stops: undefined, torsion: 0 }, backdrop: { scenes: [] } });
const page = await context.newPage(), checks = [], errors = [], measurements = [];
page.on('pageerror', error => errors.push(error.message));
const root = () => page.getByRole('heading', { name: 'Theme Studio', exact: true }).first().locator('xpath=ancestor::*[@data-backdrop-focus-scope][1]');
const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const geometry = () => root().evaluate(node => {
  const nodes = ['studioContents', 'body', 'editor'].map(name => node.querySelector(`[class*="${name}"]`));
  const owner = nodes.find(value => /^(auto|scroll)$/.test(getComputedStyle(value).overflowY)) ?? nodes[2], editor = nodes[2];
  const origin = owner === editor ? 0 : editor.getBoundingClientRect().top - owner.getBoundingClientRect().top + owner.scrollTop - owner.clientTop;
  return { owner: ['frame', 'body', 'editor'][nodes.indexOf(owner)], top: owner.scrollTop, offset: owner.scrollTop - origin, max: owner.scrollHeight - owner.clientHeight };
});
const scroll = async amount => { await root().evaluate((node, amount) => { const nodes = ['studioContents', 'body', 'editor'].map(name => node.querySelector(`[class*="${name}"]`)), owner = nodes.find(value => /^(auto|scroll)$/.test(getComputedStyle(value).overflowY)) ?? nodes[2]; owner.scrollTop = amount; }, amount); await settle(); };
const check = (name, passed, data) => { checks.push({ name, passed, data }); console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`); if (!baseline) assert(passed, JSON.stringify({ name, data })); };
try {
  await page.goto(`${base}/design/theme-maker`, { waitUntil: 'domcontentloaded' }); await root().waitFor();
  await page.waitForFunction(() => Object.keys(document.querySelector('[role=tab]') ?? {}).some(key => key.startsWith('__reactProps$'))); await page.evaluate(() => document.fonts.ready);
  await root().getByText('Curve and stops', { exact: true }).click(); await root().getByText('Tone positions', { exact: true }).click();
  await scroll(250); const color = await geometry(); check('Color fixture actually scrolls', color.top >= 249, color);
  await root().getByRole('tab', { name: 'Surfaces', exact: true }).click(); await settle();
  const newSurface = await geometry(); check('unvisited tab starts at its top', newSurface.top <= 1, newSurface);
  await scroll(140); const surfaces = await geometry();
  await root().getByRole('tab', { name: 'Color', exact: true }).click(); await settle();
  const returned = await geometry(), open = await root().getByText('Curve and stops', { exact: true }).evaluate(node => node.closest('details').open);
  check('Color position and disclosure survive tab remount', Math.abs(returned.offset - color.offset) <= 1 && open, { returned, color, open });
  for (const [width, height, expectedOwner] of [[760, 844, 'body'], [760, 480, 'frame'], [1440, 1000, 'editor']]) {
    await page.setViewportSize({ width, height }); await settle(); const current = await geometry(); measurements.push({ width, height, ...current });
    check(`logical position survives ${expectedOwner} ownership`, current.owner === expectedOwner && Math.abs(current.offset - color.offset) <= 1, { current, color });
    await page.screenshot({ path: `${output}/${expectedOwner}-${width}.png` });
  }
  await root().getByRole('tab', { name: 'Surfaces', exact: true }).click(); await settle();
  const surfaceReturn = await geometry(); check('other tab retains its independent position', Math.abs(surfaceReturn.offset - surfaces.offset) <= 1, { surfaceReturn, surfaces });
  await root().getByRole('tab', { name: 'Color', exact: true }).click(); await settle();
  await page.getByRole('button', { name: 'Open window picker; Shift click minimizes windows' }).click(); const picker = page.getByRole('dialog', { name: 'Windows', exact: true });
  await picker.getByRole('button', { name: 'Studio', exact: true }).click(); await picker.getByRole('button', { name: 'Close Windows', exact: true }).focus(); await page.keyboard.press('Enter');
  const window = page.getByRole('dialog', { name: 'Studio', exact: true });
  await root().getByRole('button', { name: 'text role', exact: true }).focus(); await page.keyboard.press('Enter');
  const popup = page.getByRole('dialog', { name: 'Color: text role', exact: true }); const convert = popup.getByRole('button', { name: 'Use ramp tone', exact: true }); if (await convert.count()) await convert.click();
  await popup.getByRole('slider').last().evaluate(node => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(node, '.5'); node.dispatchEvent(new Event('input', { bubbles: true })); });
  await window.getByRole('spinbutton', { name: 'Hue', exact: true }).evaluate(node => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(node, '123'); node.dispatchEvent(new Event('input', { bubbles: true })); });
  await settle(); const hue = await popup.getByRole('spinbutton', { name: 'Hue value', exact: true }).inputValue();
  check('popup follows an unchanged tone reference through another view palette edit', hue === '123', { hue });
  const popupGeometry = await popup.evaluate(node => {
    const rect = node.getBoundingClientRect(), footer = node.querySelector('p[aria-live]')?.getBoundingClientRect(), rim = node.querySelector(':scope > .surface-rim');
    return { rect: rect.toJSON(), footer: footer?.toJSON(), position: getComputedStyle(node).position, rim: rim ? getComputedStyle(rim).display : null, shadow: getComputedStyle(node).boxShadow };
  });
  check('popup fits its content and viewport with the shared rim and shadow', popupGeometry.position === 'fixed' && popupGeometry.rect.y >= 7 && popupGeometry.rect.bottom <= 993 && popupGeometry.footer && Math.abs(popupGeometry.rect.bottom - popupGeometry.footer.bottom - 17) <= 2 && popupGeometry.rim === 'block' && popupGeometry.shadow !== 'none', popupGeometry);
  await page.screenshot({ path: `${output}/shared-popup.png` });
  for (const [width, height] of [[390, 844], [320, 480]]) {
    await page.setViewportSize({ width, height }); await settle();
    const bounds = await popup.evaluate(node => {
      const contents = node.querySelector('[class*=pickerContents]'); contents.scrollTop = contents.scrollHeight;
      const rect = node.getBoundingClientRect(), rim = node.querySelector(':scope > .surface-rim').getBoundingClientRect(), close = node.querySelector('button[aria-label="Close color picker"]').getBoundingClientRect();
      return { rect: rect.toJSON(), rim: rim.toJSON(), close: close.toJSON(), scroll: contents.scrollTop, max: contents.scrollHeight - contents.clientHeight };
    });
    check(`popup scrolls within its fixed rim at ${width} by ${height}`, bounds.rect.x >= 7 && bounds.rect.right <= width - 7 && bounds.rect.y >= 7 && bounds.rect.bottom <= height - 7 && Math.abs(bounds.rim.top - bounds.rect.top) <= 1 && bounds.close.y >= bounds.rect.y && bounds.close.bottom <= bounds.rect.bottom && (height > 500 || bounds.scroll > 0), bounds);
    await page.screenshot({ path: `${output}/popup-${width}-${height}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 }); await settle();
  await popup.getByRole('button', { name: 'Close color picker', exact: true }).click(); await window.getByRole('button', { name: 'Close Studio', exact: true }).click();
  await page.waitForTimeout(750);
  await root().evaluate(element => {
    const key = Object.keys(element).find(key => key.startsWith('__reactFiber$')); if (!key) throw new Error('Missing React host fiber');
    let fiber = element[key]; while (fiber.return) fiber = fiber.return;
    const tree = fiber.stateNode; if (!tree?.current) throw new Error('Missing React root');
    const metrics = window.__studioPanelPerf = { commits: 0, writes: [] }; let current = tree.current;
    const sample = () => { if (current !== tree.current) { metrics.commits++; current = tree.current; } requestAnimationFrame(sample); }; sample();
    const write = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { metrics.writes.push(key); return write.call(this, key, value); };
  });
  const calibration = await page.evaluate(() => window.__studioPanelPerf.commits);
  await root().getByRole('tab', { name: 'Surfaces', exact: true }).click(); await settle();
  await root().getByRole('tab', { name: 'Color', exact: true }).click(); await settle();
  assert((await page.evaluate(() => window.__studioPanelPerf.commits)) > calibration, 'React commit sampling must observe a discrete tab change');
  await scroll(0); await page.waitForTimeout(500);
  const cdp = await context.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const before = await page.evaluate(() => structuredClone(window.__studioPanelPerf));
  const editor = root().locator('aside[class*="editor"]'), bounds = await editor.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + Math.min(bounds.height / 2, 200));
  for (let index = 0; index < 24; index++) { await page.mouse.wheel(0, 30); await page.waitForTimeout(75); }
  await settle(); const after = await page.evaluate(() => structuredClone(window.__studioPanelPerf)), scrolled = await geometry();
  check('Studio scrolling records position without React commits or durable writes under fourfold CPU slowdown', scrolled.top > 100 && after.commits === before.commits && after.writes.length === before.writes.length, { before, after, scrolled });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  assert.deepEqual(errors, []);
} catch (error) { await page.screenshot({ path: `${output}/failure.png` }).catch(() => {}); await writeFile(`${output}/failure.json`, JSON.stringify({ error: String(error), checks, measurements, errors }, null, 2)); throw error;
} finally { await writeFile(`${output}/report.json`, JSON.stringify({ baseline, checks, measurements, errors }, null, 2)); await browser.close(); }
