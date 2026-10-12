import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getTheme } from '../../src/features/theme/registry/index.ts';
const require = createRequire(import.meta.url), { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3482', output = process.env.SMOKE_OUTPUT ?? 'work/studio-history-craft';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await context.addInitScript(source => {
  const active = { kind: 'profile', index: 0 };
  localStorage.setItem('zw.theme', JSON.stringify({ version: 1, state: { revision: 0, active, scheme: 'light', schemePreference: 'light', profiles: [source], seasonal: false, shuffle: false, byRoute: { home: active, themeMaker: active } } }));
}, { ...getTheme('whiteout'), id: 'history-probe', name: 'History probe', backdrop: { scenes: [] } });
const page = await context.newPage(), errors = [], checks = [];
page.on('pageerror', error => errors.push(error.message));
const pageRoot = () => page.getByRole('heading', { name: 'Theme Studio', exact: true }).first().locator('xpath=ancestor::*[@data-backdrop-focus-scope][1]');
const hue = () => pageRoot().getByRole('spinbutton', { name: 'Hue', exact: true });
const step = async (name, run) => { await run(); checks.push(name); console.log(`PASS ${name}`); };
const undo = () => page.keyboard.press('Control+z');
const redo = () => page.keyboard.press('Control+Shift+z');
const drag = async (element, fraction) => { await element.scrollIntoViewIfNeeded(); const box = await element.boundingBox(); await page.mouse.move(box.x + box.width * fraction, box.y + box.height / 2); await page.mouse.down(); return box; };
try {
  await page.goto(`${base}/design/theme-maker`, { waitUntil: 'domcontentloaded' });
  await hue().waitFor();
  await page.waitForFunction(() => Object.keys(document.querySelector('[role=tab]') ?? {}).some(key => key.startsWith('__reactProps$')));
  await page.evaluate(() => document.fonts.ready);
  await step('held palette Undo releases capture and old movement cannot repaint', async () => {
    const before = await hue().inputValue(), plane = pageRoot().getByRole('group', { name: 'Theme seed color plane', exact: true });
    const box = await drag(plane, .25); await page.mouse.move(box.x + box.width * .65, box.y + box.height / 2, { steps: 5 });
    assert.notEqual(await hue().inputValue(), before);
    await undo(); assert.equal(await hue().inputValue(), before);
    await page.mouse.move(box.x + box.width * .9, box.y + box.height / 2, { steps: 5 }); await page.mouse.up();
    assert.equal(await hue().inputValue(), before);
    await redo(); assert.notEqual(await hue().inputValue(), before);
  });
  await step('native held range suppresses remaining input and a fresh drag works', async () => {
    const slider = pageRoot().getByRole('slider', { name: 'Hue slider', exact: true }), before = await hue().inputValue();
    const box = await drag(slider, .2); await page.mouse.move(box.x + box.width * .6, box.y + box.height / 2, { steps: 5 });
    assert.notEqual(await hue().inputValue(), before); await undo(); assert.equal(await hue().inputValue(), before);
    await page.mouse.move(box.x + box.width * .9, box.y + box.height / 2, { steps: 5 }); await page.mouse.up(); assert.equal(await hue().inputValue(), before);
    await drag(slider, .4); await page.mouse.up(); assert.notEqual(await hue().inputValue(), before);
  });
  await step('held tone-key repeats stop at Undo and a new key press works', async () => {
    await pageRoot().getByText('Tone positions', { exact: true }).click();
    if (await pageRoot().locator('[data-role-tone]').count() === 0) await pageRoot().getByRole('button', { name: 'Use ramp', exact: true }).first().click();
    const marker = pageRoot().locator('[data-role-tone]').first(); await marker.focus(); await page.keyboard.press('Home');
    await page.keyboard.down('ArrowRight'); await page.keyboard.down('ArrowRight'); assert.equal(await marker.getAttribute('aria-valuenow'), '0.02');
    await undo(); assert.equal(await marker.getAttribute('aria-valuenow'), '0');
    await page.keyboard.down('ArrowRight'); assert.equal(await marker.getAttribute('aria-valuenow'), '0');
    await page.keyboard.up('ArrowRight'); await page.keyboard.press('ArrowRight'); assert.equal(await marker.getAttribute('aria-valuenow'), '0.01');
  });
  await step('color popup pointer focus, history and two-stage Escape remain owned', async () => {
    await pageRoot().getByRole('button', { name: 'text role', exact: true }).click();
    const popup = page.getByRole('dialog', { name: 'Color: text role', exact: true });
    const before = await popup.getByRole('spinbutton', { name: 'Lightness', exact: true }).inputValue();
    const plane = popup.getByRole('group', { name: 'Color plane', exact: true }), box = await drag(plane, .65);
    await page.mouse.move(box.x + box.width * .85, box.y + box.height * .7, { steps: 4 });
    assert.equal(await plane.evaluate(node => node === document.activeElement), true);
    await undo(); assert.equal(await popup.getByRole('spinbutton', { name: 'Lightness', exact: true }).inputValue(), before);
    await page.mouse.move(box.x + box.width * .1, box.y + box.height * .9); await page.mouse.up();
    assert.equal(await popup.getByRole('spinbutton', { name: 'Lightness', exact: true }).inputValue(), before);
    await drag(plane, .5); await page.keyboard.press('Escape'); await page.mouse.up(); await popup.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape'); await popup.waitFor({ state: 'hidden' });
  });
  await step('second view joins unsaved draft and history; closing it retains page history', async () => {
    await hue().fill('147'); await hue().press('Tab');
    await page.getByRole('button', { name: 'Open window picker; Shift click minimizes windows' }).click();
    const picker = page.getByRole('dialog', { name: 'Windows', exact: true });
    await picker.getByRole('button', { name: 'Studio', exact: true }).click();
    await picker.getByRole('button', { name: 'Close Windows', exact: true }).focus();
    await page.keyboard.press('Enter');
    const window = page.getByRole('dialog', { name: 'Studio', exact: true });
    assert.equal(await window.getByRole('spinbutton', { name: 'Hue', exact: true }).inputValue(), '147');
    await window.getByRole('button', { name: 'Undo', exact: true }).click(); assert.notEqual(await hue().inputValue(), '147');
    await window.getByRole('button', { name: 'Redo', exact: true }).click(); assert.equal(await hue().inputValue(), '147');
    await page.screenshot({ path: `${output}/shared-studio.png` });
    await window.getByRole('button', { name: 'Close Studio', exact: true }).click();
    await pageRoot().getByRole('button', { name: 'Undo', exact: true }).click(); assert.notEqual(await hue().inputValue(), '147');
    await pageRoot().getByRole('button', { name: 'Redo', exact: true }).click(); assert.equal(await hue().inputValue(), '147');
  });
  await step('page departure leaves the window draft, popup and history intact', async () => {
    await page.getByRole('button', { name: 'Open window picker; Shift click minimizes windows' }).click();
    const picker = page.getByRole('dialog', { name: 'Windows', exact: true });
    await picker.getByRole('button', { name: 'Studio', exact: true }).click();
    await picker.getByRole('button', { name: 'Close Windows', exact: true }).focus(); await page.keyboard.press('Enter');
    const window = page.getByRole('dialog', { name: 'Studio', exact: true });
    await window.getByRole('button', { name: 'text role', exact: true }).click();
    const popup = page.getByRole('dialog', { name: 'Color: text role', exact: true }); await popup.waitFor();
    await page.locator('a[href="/"]').first().evaluate(node => node.click()); await page.waitForURL(base + '/');
    await popup.waitFor({ state: 'visible' });
    assert.equal(await window.getByRole('spinbutton', { name: 'Hue', exact: true }).inputValue(), '147');
    await popup.getByRole('button', { name: 'Close color picker', exact: true }).click();
    await window.getByRole('button', { name: 'Undo', exact: true }).click();
    assert.notEqual(await window.getByRole('spinbutton', { name: 'Hue', exact: true }).inputValue(), '147');
    await page.screenshot({ path: `${output}/remaining-studio-window.png` });
    await window.getByRole('button', { name: 'Close Studio', exact: true }).click();
  });
  await page.screenshot({ path: `${output}/restored-studio.png` });
  assert.deepEqual(errors, []); await writeFile(`${output}/report.json`, JSON.stringify({ checks, errors }, null, 2));
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
  await writeFile(`${output}/report.json`, JSON.stringify({ failure: String(error), checks, errors }, null, 2)); throw error;
} finally { await browser.close(); }
