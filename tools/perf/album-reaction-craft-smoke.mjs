import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getTheme } from '../../src/features/theme/registry/index.ts';
const require = createRequire(import.meta.url), { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3482', output = process.env.SMOKE_OUTPUT ?? 'work/album-reaction-craft';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'], ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const errors = [], results = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  const countsResponse = await page.request.get(`${base}/api/v1/reactions/album`);
  assert.equal(countsResponse.status(), 200); assert.equal(countsResponse.headers()['cache-control'], 'no-store');
  const counts = await countsResponse.json();
  assert(Object.values(counts).every(count => Number.isInteger(count) && count >= 0));
  for (const [slug, count] of Object.entries(counts).slice(0, 3)) {
    const response = await page.request.get(`${base}/api/v1/entries/album/${slug}/reactions`);
    assert.equal((await response.json()).count, count);
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    const response = await page.goto(`${base}/album`, { waitUntil: 'domcontentloaded' });
    assert((await response.text()).includes('data-reaction-count='), 'initial page omits real counts');
    const cover = page.locator('main [data-section=album] a[href^="/album/"]').first();
    await cover.scrollIntoViewIfNeeded(); await cover.focus();
    await page.waitForFunction(node => getComputedStyle(node.querySelector('[class*=photoHover]')).opacity === '0.9', await cover.elementHandle());
    const painted = await cover.evaluate(node => {
      const hover = node.querySelector('[class*=photoHover]'), rows = [...hover.children], style = getComputedStyle(hover);
      return { href: node.getAttribute('href'), color: style.color, gap: style.rowGap, easing: style.transitionTimingFunction, rows: rows.map(row => ({ text: row.textContent, count: row.dataset.reactionCount, rect: row.getBoundingClientRect().toJSON(), icon: row.querySelector('svg').getBoundingClientRect().toJSON(), path: row.querySelector('path')?.getAttribute('d'), gap: getComputedStyle(row).columnGap, font: getComputedStyle(row).fontSize })) };
    });
    assert.equal(painted.rows.length, 2); assert.equal(painted.color, 'rgb(245, 245, 245)');
    assert.equal(painted.gap, width === 1440 ? '10px' : '4px');
    assert.equal(painted.rows[1].text, String(counts[painted.href.split('/').pop()]));
    assert.equal(painted.rows[0].rect.x, painted.rows[1].rect.x);
    assert.equal(painted.rows[1].icon.width, width === 1440 ? 28 : 20);
    assert.equal(painted.rows[1].gap, width === 1440 ? '10px' : '6px');
    assert.equal(painted.rows[1].font, width === 1440 ? '20px' : '16px');
    assert.equal(painted.easing, 'cubic-bezier(0, 0, 0.2, 1)');
    await page.screenshot({ path: `${output}/album-${width}.png` }); results.push({ width, painted });
  }
  const original = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await original.goto('https://zimoluo.me/photos', { waitUntil: 'domcontentloaded' });
  const oldCover = original.locator('main a[href^="/photos/"]').filter({ has: original.locator('img') }).first();
  await oldCover.scrollIntoViewIfNeeded(); await oldCover.hover();
  await original.waitForTimeout(400); await original.screenshot({ path: `${output}/original-album-1440.png` });
  await original.close();
  const source = getTheme('birthday19');
  for (const [appearance, palette] of [['native', undefined], ['edited', { mid: { kind: 'literal', value: '#46cbb2' } }]]) {
    const context = await browser.newContext({ viewport: { width: 1000, height: 800 } });
    await context.addInitScript(source => {
      const active = { kind: 'profile', index: 0 };
      localStorage.setItem('zw.theme', JSON.stringify({ version: 1, state: { revision: 0, active, scheme: 'dark', schemePreference: 'dark', profiles: [source], seasonal: false, shuffle: false, byRoute: { home: active } } }));
    }, { ...source, backdrop: { scenes: [{ id: 'birthday-19', ...(palette === undefined ? {} : { palette }) }] } });
    const scene = await context.newPage(); scene.on('pageerror', error => errors.push(error.message));
    await scene.goto(base, { waitUntil: 'domcontentloaded' });
    const image = scene.locator('[data-scene-id=birthday-19] img[data-palette-src$="/nineteen.svg"]');
    await image.waitFor(); await scene.waitForFunction(node => node.src.startsWith('data:image/svg+xml'), await image.elementHandle());
    const diagnostics = await image.evaluate(node => {
      const filter = getComputedStyle(node).filter, color = filter.match(/(?:oklch|color|rgb)[^(]*\([^)]*\)/)?.[0];
      const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
      if (color) { context.fillStyle = color; context.fillRect(0, 0, 1, 1); }
      return { filter, rgb: [...context.getImageData(0, 0, 1, 1).data], inlineFilter: node.style.filter, size: node.getBoundingClientRect().toJSON() };
    });
    if (appearance === 'native') for (const [index, target] of [245, 76, 47].entries()) assert(Math.abs(diagnostics.rgb[index] - target) <= 1, JSON.stringify(diagnostics));
    else assert.notDeepEqual(diagnostics.rgb.slice(0, 3), [245, 76, 47]);
    assert.equal(diagnostics.inlineFilter, ''); assert(diagnostics.filter.includes('12px'));
    const spinner = scene.locator('[data-scene-id=birthday-19] img[data-palette-src$="/colors.svg"]');
    const before = await spinner.evaluate(node => getComputedStyle(node).transform);
    await scene.waitForTimeout(200); const after = await spinner.evaluate(node => getComputedStyle(node).transform);
    assert.notEqual(before, after, 'native spinning color field is frozen');
    await scene.emulateMedia({ reducedMotion: 'reduce' }); await scene.waitForTimeout(100);
    assert.equal(await spinner.evaluate(node => getComputedStyle(node).animationPlayState), 'paused');
    await scene.screenshot({ path: `${output}/birthday19-${appearance}.png` }); results.push({ appearance, diagnostics }); await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ results, errors }, null, 2));
  console.log('PASS original album heart geometry, initial/live counts, native/edited glow, animation, and reduced motion');
} finally { await browser.close(); }
