import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url), { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3483', baseline = process.argv.includes('--baseline');
const output = process.env.SMOKE_OUTPUT ?? 'work/studio-control-craft';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [], captures = [], checks = [];
page.on('pageerror', error => errors.push(error.message));
const step = async (name, run) => { await run(); checks.push(name); console.log(`PASS ${name}`); };
const layers = () => page.locator('[data-layer-list] [data-layer-id]');
const ids = () => layers().evaluateAll(nodes => nodes.map(node => node.dataset.layerId));
try {
  await page.goto(`${base}/design/theme-maker`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Theme Studio', exact: true }).waitFor();
  await page.waitForFunction(() => Object.keys(document.querySelector('[role=tab]') ?? {}).some(key => key.startsWith('__reactProps$')));
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('tab', { name: 'Surfaces', exact: true }).click();
  for (let index = 0; index < 2; index++) await page.getByRole('button', { name: 'Add layer', exact: true }).click();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    for (const panel of ['Color', 'Surfaces', 'Mark', 'Motion', 'Profiles']) {
      await page.getByRole('tab', { name: panel, exact: true }).click();
      const root = page.getByRole('tabpanel', { name: panel, exact: true });
      if (panel === 'Color') {
        const disclosure = root.getByText('Tone positions', { exact: true });
        if (!await disclosure.evaluate(node => node.closest('details').open)) await disclosure.click();
      }
      await page.evaluate(() => document.querySelectorAll('[class*="editor"],[class*="body"]').forEach(node => { node.scrollTop = 0; }));
      const geometry = await root.evaluate(node => ({
        root: node.getBoundingClientRect().toJSON(),
        controls: [...node.querySelectorAll('[data-layer-id] button,[data-role-tone]')].map(button => ({ label: button.getAttribute('aria-label'), rect: button.getBoundingClientRect().toJSON(), disabled: button.disabled })),
        overflow: document.documentElement.scrollWidth - innerWidth,
      }));
      if (!baseline) {
        assert(geometry.overflow <= 1, `${width} ${panel} page overflow`);
        assert(geometry.controls.every(control => control.rect.width >= 43.9 && control.rect.height >= 43.9), `${width} ${panel} small targets`);
        assert(geometry.controls.every(control => control.rect.x >= geometry.root.x - 1 && control.rect.right <= geometry.root.right + 1), `${width} ${panel} control overflow`);
      }
      await page.screenshot({ path: `${output}/${panel.toLowerCase()}-${width}.png` });
      captures.push({ width, panel, geometry });
    }
  }
  if (!baseline) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('tab', { name: 'Surfaces', exact: true }).click();
    await step('layer previews and visibility preserve real paint', async () => {
      const preview = layers().first().locator('[data-layer-preview]');
      await page.getByRole('spinbutton', { name: 'Direction', exact: true }).fill('123');
      const painted = await preview.evaluate(node => getComputedStyle(node).backgroundImage);
      assert(painted.includes('123deg'), painted);
      const rowHeight = await layers().first().evaluate(node => node.getBoundingClientRect().height);
      await layers().first().getByRole('button', { name: 'Hide layer', exact: true }).click();
      assert.equal(await layers().first().getAttribute('data-disabled'), 'true');
      assert.equal(await layers().first().evaluate(node => node.getBoundingClientRect().height), rowHeight);
      assert.equal(await preview.evaluate(node => getComputedStyle(node).backgroundImage), painted);
      await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-layer-id][data-disabled] [data-layer-preview]')).opacity === '0.5');
      await layers().first().getByRole('button', { name: 'Show layer', exact: true }).click();
    });
    await step('boundary actions and drag cancellation retain order', async () => {
      assert.equal(await layers().first().getByRole('button', { name: 'Move layer up', exact: true }).isDisabled(), true);
      assert.equal(await layers().last().getByRole('button', { name: 'Move layer down', exact: true }).isDisabled(), true);
      const before = await ids(), handle = layers().first().getByRole('button', { name: /^Drag / });
      await handle.scrollIntoViewIfNeeded();
      await handle.evaluate(node => node.addEventListener('pointerdown', event => { window.__studioPointer = event.pointerId; }, { once: true }));
      const box = await handle.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + 180, { steps: 6 });
      await handle.evaluate(node => node.dispatchEvent(new PointerEvent('pointercancel', { pointerId: window.__studioPointer, isPrimary: true, bubbles: true })));
      await page.mouse.up();
      assert.deepEqual(await ids(), before);
      assert.equal(await layers().first().evaluate(node => node.style.transform), '');
      assert.equal(await layers().first().getAttribute('data-dragging'), null);
    });
    await step('reorder, duplicate, deletion, and focus remain coherent', async () => {
      const before = await ids();
      await layers().nth(1).getByRole('button', { name: 'Move layer up', exact: true }).click();
      assert.equal((await ids())[0], before[1]);
      await layers().first().getByRole('button', { name: 'Duplicate layer', exact: true }).click();
      const selected = page.locator('[data-layer-id][data-selected]');
      const oldCount = await layers().count();
      await selected.getByRole('button', { name: 'Remove layer', exact: true }).click();
      assert.equal(await layers().count(), oldCount - 1);
      assert.equal(await selected.count(), 1);
      assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-layer-select')), true);
    });
    await page.getByRole('tab', { name: 'Color', exact: true }).click();
    const toneDisclosure = page.getByText('Tone positions', { exact: true });
    if (!await toneDisclosure.evaluate(node => node.closest('details').open)) await toneDisclosure.click();
    if (await page.locator('[data-role-tone]').count() === 0) await page.getByRole('button', { name: 'Use ramp', exact: true }).first().click();
    await step('tone keyboard bounds and held-key undo form one edit', async () => {
      const slider = page.locator('[data-role-tone]').first(); await slider.focus();
      await page.keyboard.press('End'); assert.equal(await slider.getAttribute('aria-valuenow'), '1');
      await page.keyboard.press('Home'); assert.equal(await slider.getAttribute('aria-valuenow'), '0');
      await page.keyboard.press('PageUp'); assert.equal(await slider.getAttribute('aria-valuenow'), '0.1');
      await page.keyboard.press('ArrowUp'); assert.equal(await slider.getAttribute('aria-valuenow'), '0.11');
      await page.keyboard.press('ArrowDown'); assert.equal(await slider.getAttribute('aria-valuenow'), '0.1');
      await page.keyboard.press('Home');
      for (let index = 0; index < 3; index++) await page.keyboard.down('ArrowRight');
      await page.keyboard.up('ArrowRight'); assert.equal(await slider.getAttribute('aria-valuenow'), '0.03');
      await page.getByRole('button', { name: 'Undo', exact: true }).click(); assert.equal(await slider.getAttribute('aria-valuenow'), '0');
      const track = slider.locator('..'); await track.scrollIntoViewIfNeeded(); const box = await track.boundingBox();
      await page.mouse.click(box.x + box.width * .75, box.y + box.height / 2);
      assert(Math.abs(Number(await slider.getAttribute('aria-valuenow')) - .75) < .02);
    });
    await step('unmounting a held palette drag closes its undo transaction', async () => {
      const hue = page.getByRole('spinbutton', { name: 'Hue', exact: true }), before = await hue.inputValue();
      await page.getByRole('tab', { name: 'Color', exact: true }).focus();
      const field = page.locator('[class*="seedField"]').first(); await field.scrollIntoViewIfNeeded(); const box = await field.boundingBox();
      await page.mouse.move(box.x + box.width * .1, box.y + box.height / 2); await page.mouse.down();
      await page.mouse.move(box.x + box.width * .75, box.y + box.height / 2, { steps: 6 });
      await page.getByRole('tab', { name: 'Mark', exact: true }).focus(); await page.keyboard.press('Enter'); await page.mouse.up();
      await page.getByRole('tab', { name: 'Color', exact: true }).click(); assert.notEqual(await hue.inputValue(), before);
      await page.getByRole('button', { name: 'Undo', exact: true }).click(); assert.equal(await hue.inputValue(), before);
    });
    await step('leaving Studio during a saved-theme drag retains its last paint', async () => {
      const name = 'Studio control persistence probe';
      await page.getByLabel('Theme name', { exact: true }).fill(name);
      await page.getByRole('button', { name: 'Save and apply', exact: true }).click();
      await page.waitForFunction(name => JSON.parse(localStorage.getItem('zw.theme') ?? '{}').state?.profiles.some(profile => profile.name === name), name);
      await page.getByRole('tab', { name: 'Color', exact: true }).focus();
      const field = page.locator('[class*="seedField"]').first(); await field.scrollIntoViewIfNeeded(); const box = await field.boundingBox();
      await page.mouse.move(box.x + box.width * .1, box.y + box.height / 2); await page.mouse.down();
      await page.mouse.move(box.x + box.width * .6, box.y + box.height / 2, { steps: 6 });
      const hue = Number(await page.getByRole('spinbutton', { name: 'Hue', exact: true }).inputValue());
      await page.locator('a[href="/about"]').first().focus(); await page.keyboard.press('Enter');
      await page.waitForURL(`${base}/about`); await page.mouse.up();
      await page.waitForFunction(({ name, hue }) => Math.abs(JSON.parse(localStorage.getItem('zw.theme') ?? '{}').state?.profiles.find(profile => profile.name === name)?.ramp.hue - hue) < .01, { name, hue });
      await page.goto(`${base}/design/theme-maker`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => Object.keys(document.querySelector('[role=tab]') ?? {}).some(key => key.startsWith('__reactProps$')));
      assert.equal(Number(await page.getByRole('spinbutton', { name: 'Hue', exact: true }).inputValue()), hue);
    });
    await page.setViewportSize({ width: 1440, height: 400 });
    await step('short Studio keeps its controls inside the scroll frame', async () => {
      const size = await page.locator('[data-backdrop-focus-scope]').evaluate(node => ({ height: node.getBoundingClientRect().height, parent: node.parentElement.getBoundingClientRect().height }));
      assert(size.height <= size.parent + 1, JSON.stringify(size));
      await page.getByRole('tab', { name: 'Surfaces', exact: true }).click();
      await page.getByRole('button', { name: 'Add layer', exact: true }).scrollIntoViewIfNeeded();
      const box = await page.getByRole('button', { name: 'Add layer', exact: true }).boundingBox(); assert(box.y >= 0 && box.y + box.height <= 400);
      await page.screenshot({ path: `${output}/short-studio.png` });
    });
    await page.setViewportSize({ width: 320, height: 400 });
    await step('short narrow Studio scrolls its header and editor within the rim', async () => {
      const root = page.locator('[data-backdrop-focus-scope]');
      const frame = await root.boundingBox();
      const save = page.getByRole('button', { name: 'Save and apply', exact: true });
      await save.scrollIntoViewIfNeeded();
      let box = await save.boundingBox(); assert(box.y >= frame.y && box.y + box.height <= frame.y + frame.height + 1);
      const add = page.getByRole('button', { name: 'Add layer', exact: true });
      await add.scrollIntoViewIfNeeded(); box = await add.boundingBox(); assert(box.y >= frame.y && box.y + box.height <= frame.y + frame.height + 1);
      await page.screenshot({ path: `${output}/short-narrow-studio.png` });
    });
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ base, baseline, captures, checks, errors }, null, 2));
  console.log(baseline ? 'Captured original v11 Studio control baseline' : 'PASS Studio control geometry, live layer paint, visibility, interrupted gestures, keyboard bounds, undo, focus, and short-screen scrolling');
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
  await writeFile(`${output}/report.json`, JSON.stringify({ base, failure: String(error), captures, checks, errors }, null, 2)); throw error;
} finally { await browser.close(); }
