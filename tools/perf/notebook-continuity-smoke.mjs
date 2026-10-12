import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { newPage } from '../../src/features/notebook/model.ts';
import { defaultWorkspace } from '../../src/features/workspace/model.ts';
const require = createRequire(import.meta.url), { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3482', output = process.env.SMOKE_OUTPUT ?? 'work/notebook-continuity', baseline = process.env.BASELINE === '1';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'], ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const first = newPage(`First note\n${Array.from({ length: 150 }, (_, index) => `Line ${index + 1}: A thought to return to.`).join('\n')}`), second = newPage('Second note\nA different page.');
await context.addInitScript(state => localStorage.setItem('zw.workspace', JSON.stringify({ version: 1, state })), { ...defaultWorkspace, notebook: { pages: [first, second], activeId: first.id } });
const page = await context.newPage(), errors = [], steps = [], geometries = [];
page.on('pageerror', error => errors.push(error.message));
const text = () => page.getByRole('textbox', { name: 'Page text', exact: true });
const position = () => text().evaluate(node => ({ from: node.selectionStart, to: node.selectionEnd, direction: node.selectionDirection, top: node.scrollTop, focused: document.activeElement === node }));
const selectPosition = async () => {
  await text().evaluate(node => { node.focus({ preventScroll: true }); node.setSelectionRange(12, 28, 'backward'); node.scrollTop = 220; });
  await page.waitForFunction(node => node.scrollTop === 220, await text().elementHandle());
};
async function step(label, run) { await run(); steps.push(label); console.log(`PASS ${label}`); }
try {
  await page.goto(`${base}/notebook`, { waitUntil: 'domcontentloaded' }); await text().waitFor();
  await page.waitForFunction(node => node.value.startsWith('First note'), await text().elementHandle());
  const notebook = page.getByRole('region', { name: 'Notebook', exact: true });
  for (const width of [1440, 1176, 1175, 900, 794, 793, 780, 779, 390, 320]) {
    await page.setViewportSize({ width, height: width >= 780 ? 1000 : 844 }); if (baseline) await page.waitForTimeout(100); else await page.waitForFunction(expected => getComputedStyle(document.querySelector('section[aria-label=Notebook]').parentElement).getPropertyValue('--tool-clearance').trim() === expected, width >= 1176 ? '5rem' : '9rem'); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(100);
    const geometry = { width, frame: await notebook.evaluate(node => node.getBoundingClientRect().toJSON()), browser:await page.evaluate(() => {const p=document.querySelector('section[aria-label=Notebook]').parentElement;const s=getComputedStyle(p);return {width:innerWidth,scroll:scrollY,media:matchMedia('(min-width:1176px)').matches,clearance:s.getPropertyValue('--tool-clearance'),margin:s.marginTop,height:s.height,transition:s.transition,class:p.className};}), header: await page.locator('[data-nav-expanded]').evaluate(node => node.getBoundingClientRect().toJSON()) };
    geometries.push(geometry);
    if (!baseline) {
      assert(geometry.frame.y >= geometry.header.y + geometry.header.height + 7, JSON.stringify(geometry));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
    await page.screenshot({ path: `${output}/notebook-${width}.png` });
    if (!baseline) {
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      const during = await notebook.evaluate(node => node.getBoundingClientRect().toJSON());
      assert.equal(during.y, geometry.frame.y, JSON.stringify({width, before:geometry, during, browser:await page.evaluate(() => ({width:innerWidth,scroll:scrollY, media:matchMedia('(min-width:1176px)').matches,clearance:getComputedStyle(document.querySelector('section[aria-label=Notebook]').parentElement).getPropertyValue('--tool-clearance')}))}));
      const openHeader = await page.locator('[data-nav-expanded]').evaluate(node => node.getBoundingClientRect().toJSON());
      assert(during.y >= openHeader.y + openHeader.height + 7, JSON.stringify({ width, during, openHeader }));
      await page.getByRole('button', { name: 'Close menu', exact: true }).first().click();
    }
  }
  if (baseline) { await writeFile(`${output}/report.json`, JSON.stringify({ geometries, errors }, null, 2)); console.log('Captured prior Notebook clearance'); }
  else {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await step('page switches restore their own writing selection and native scroll', async () => {
      await selectPosition();
      await page.getByRole('navigation', { name: 'Notebook pages', exact: true }).getByRole('button').filter({ hasText: 'Second note' }).click();
      assert.equal((await position()).from, 0); assert.equal((await position()).top, 0);
      await page.getByRole('navigation', { name: 'Notebook pages', exact: true }).getByRole('button').filter({ hasText: 'First note' }).click();
      assert.deepEqual({ ...(await position()), focused: false }, { from: 12, to: 28, direction: 'backward', top: 220, focused: false });
    });
    await step('preview return and duplication preserve editing position and focus', async () => {
      await selectPosition(); await page.getByRole('button', { name: 'Preview formatting', exact: true }).click();
      await page.getByRole('button', { name: 'Edit text', exact: true }).click();
      assert.deepEqual(await position(), { from: 12, to: 28, direction: 'backward', top: 220, focused: true });
      await page.getByRole('button', { name: 'Duplicate page', exact: true }).click();
      assert.deepEqual(await position(), { from: 12, to: 28, direction: 'backward', top: 220, focused: true });
      const typography = await text().evaluate(node => ({ title: getComputedStyle(node, '::first-line').fontWeight, titleSize: getComputedStyle(node, '::first-line').fontSize, inset: getComputedStyle(node).paddingLeft, footer: getComputedStyle(node.parentElement.nextElementSibling).paddingLeft }));
      assert.equal(typography.title, '700'); assert.equal(typography.titleSize, '20px'); assert.equal(typography.inset, typography.footer);
      await page.screenshot({ path: `${output}/editing-position.png` });
    });
    await step('last-page deletion keeps focus usable and importing starts writing', async () => {
      const cards = page.getByRole('navigation', { name: 'Notebook pages', exact: true }).getByRole('button');
      while (await cards.count()) await page.getByRole('button', { name: 'Delete page', exact: true }).click();
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'New page');
      await page.getByRole('button', { name: 'New page', exact: true }).click();
      assert.equal((await position()).focused, true);
      await page.locator('input[type=file]').setInputFiles({ name: 'imported.md', mimeType: 'text/markdown', buffer: Buffer.from('Imported note\n**Keep this thought.**') });
      await page.waitForFunction(node => node.value.startsWith('Imported note'), await text().elementHandle());
      assert.equal((await position()).focused, true);
    });
    await step('Studio shares the same stable header clearance', async () => {
      await page.goto(`${base}/design/theme-maker`, { waitUntil: 'domcontentloaded' });
      const studio = page.locator('main [data-backdrop-focus-scope]').first(); await studio.waitFor();
      for (const width of [1440, 1176, 1175, 900, 794, 793, 780, 779, 390, 320]) {
        await page.setViewportSize({ width, height: width >= 780 ? 1000 : 844 }); await page.waitForFunction(expected => getComputedStyle(document.querySelector('main [data-backdrop-focus-scope]').parentElement).getPropertyValue('--tool-clearance').trim() === expected, width >= 1176 ? '5rem' : '9rem'); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(100);
        const before = await studio.evaluate(node => node.getBoundingClientRect().toJSON()), header = await page.locator('[data-nav-expanded]').evaluate(node => node.getBoundingClientRect().toJSON());
        assert(before.y >= header.y + header.height + 7, JSON.stringify({ width, before, header }));
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        const open = await studio.evaluate(node => node.getBoundingClientRect().toJSON()), openHeader = await page.locator('[data-nav-expanded]').evaluate(node => node.getBoundingClientRect().toJSON());
        assert.equal(open.y, before.y); assert(open.y >= openHeader.y + openHeader.height + 7, JSON.stringify({ width, open, openHeader }));
        await page.getByRole('button', { name: 'Close menu', exact: true }).first().click();
      }
      await page.screenshot({ path: `${output}/studio-clearance-320.png` });
    });
    assert.deepEqual(errors, []); await writeFile(`${output}/report.json`, JSON.stringify({ geometries, steps, errors }, null, 2));
  }
} catch (error) { await page.screenshot({ path: `${output}/failure.png` }).catch(() => {}); await writeFile(`${output}/report.json`, JSON.stringify({ geometries, steps, errors, failure: String(error) }, null, 2)); throw error; }
finally { await browser.close(); }
