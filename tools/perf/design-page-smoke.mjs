import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://localhost:3482', output = process.env.SMOKE_OUTPUT ?? 'work/design-page-smoke';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const report = [];
try {
  for (const [width, height, scheme] of [[1440, 900, 'light'], [390, 844, 'dark']]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    await context.addInitScript(scheme => {
      const active = { kind: 'builtIn', id: 'whiteout' };
      localStorage.setItem('zw.theme', JSON.stringify({ version: 1, state: { revision: 0, active, scheme, schemePreference: scheme, profiles: [], seasonal: false, shuffle: false, byRoute: { design: active } } }));
    }, scheme);
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/design`, { waitUntil: 'domcontentloaded' });
    const group = page.getByRole('radiogroup', { name: 'Website theme', exact: true });
    await group.getByRole('radio', { name: 'Use Whiteout theme', exact: true }).waitFor();
    await page.waitForFunction(() => Object.keys(document.querySelector('[role=radio]') ?? {}).some(key => key.startsWith('__reactProps$')));
    const radios = group.getByRole('radio'), labels = await radios.evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label')));
    const original = labels.indexOf('Use Whiteout theme'), expected = labels[(original + 1) % labels.length];
    await group.getByRole('radio', { name: 'Use Whiteout theme', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    const chosen = group.getByRole('radio', { name: expected, exact: true });
    await page.waitForFunction(name => document.querySelector('[role=radio][aria-checked=true]')?.getAttribute('aria-label') === name, expected);
    assert.equal(await chosen.evaluate(node => node === document.activeElement), true);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await group.getByRole('radio', { name: 'Use Whiteout theme', exact: true }).getAttribute('aria-checked'), 'true');
    assert.equal(await group.locator('[tabindex="0"]').count(), 1);
    const palette = page.getByRole('region', { name: 'Current theme palette', exact: true });
    await palette.scrollIntoViewIfNeeded();
    assert.equal(await palette.getByRole('figure').count(), 2);
    const paints = await palette.locator('figure>div').evaluateAll(nodes => nodes.map(node => ({ color: getComputedStyle(node).backgroundColor, base: getComputedStyle(node).backgroundImage, layer: getComputedStyle(node, '::before').backgroundImage })));
    assert.equal(paints.length, 6); assert.notEqual(paints[4].layer, 'none'); assert.notEqual(paints[5].layer, 'none');
    assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width + 1);
    await page.screenshot({ path: `${output}/palette-${scheme}-${width}.png` });
    const curtain = page.locator('#backdrop-view');
    await curtain.evaluate(node => window.scrollTo(0, node.getBoundingClientRect().top + window.scrollY + node.clientHeight / 2 - window.innerHeight / 2));
    await page.waitForFunction(() => Number(document.querySelector('#backdrop-view').style.opacity) === 0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => Number(document.querySelector('#backdrop-view').style.opacity) === 1);
    await group.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/picker-${scheme}-${width}.png` });
    assert.deepEqual(errors, []); report.push({ width, height, scheme, choices: labels.length, paints, errors });
    await context.close();
  }
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log('PASS shared picker keyboard selection, six palette/material panels, scroll reveal and phone bounds in light/dark');
} finally { await browser.close(); }
