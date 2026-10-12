import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url), { chromium } = require('playwright');
const base = process.argv[2] ?? 'http://localhost:3482', output = process.env.SMOKE_OUTPUT ?? 'work/navigation-fidelity';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => localStorage.setItem('zw.theme', JSON.stringify({ version: 1, state: { revision: 0, active: { kind: 'builtIn', id: 'whiteout' }, scheme: 'light', schemePreference: 'light', profiles: [], seasonal: false, shuffle: false, byRoute: { home: { kind: 'builtIn', id: 'whiteout' } } } })));
const page = await context.newPage(), steps = [], errors = [];
page.on('pageerror', error => errors.push(error.message));
const step = async (name, run) => { await run(); steps.push(name); console.log(`PASS ${name}`); };
const root = page.locator('[data-nav-expanded]'), entries = page.locator('[data-navigation-destinations]');
const scrollTo = async y => { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(350); };
const rect = async locator => { const box = await locator.boundingBox(); assert(box); return box; };
const command = page.getByRole('button', { name: 'Open command palette', exact: true });
try {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Object.keys(document.querySelector('button') ?? {}).some(key => key.startsWith('__reactProps$')));
  await page.waitForTimeout(700);
  for (const width of [1440, 1024, 794, 768, 767, 640, 532, 531, 390, 320]) {
    await step(`navigation and command geometry at ${width}px`, async () => {
      await page.setViewportSize({ width, height: 600 }); await scrollTo(0);
      assert.equal(await entries.getAttribute('aria-hidden'), 'false');
      const home = await rect(page.getByRole('link', { name: 'Zimo Web home', exact: true }));
      const nav = await rect(entries), search = await rect(command), menu = await rect(page.getByRole('button', { name: 'Open menu', exact: true }));
      assert(nav.x >= home.x + home.width + 4, `Home/navigation overlap at ${width}: ${JSON.stringify({ home, nav })}`);
      assert(nav.x + nav.width <= menu.x - 4, `Navigation/menu overlap at ${width}`);
      assert(search.x >= 0 && search.x + search.width <= width, `Command leaves viewport at ${width}`);
      if (width < 780) assert(search.y > nav.y + nav.height, `Compact command must occupy the second row at ${width}`);
      else {
        const windows = await rect(page.getByRole('button', { name: 'Open window picker; Shift click minimizes windows', exact: true }));
        const strip = await rect(command.locator('..'));
        assert(Math.abs(windows.x - strip.x - strip.width - 16) < 2, 'Search material sits sixteen pixels beside windows');
      }
      await scrollTo(300); assert.equal(await root.getAttribute('data-nav-expanded'), 'false');
      assert.equal(await entries.evaluate(element => element.inert), true);
      if (width < 780) {
        const collapsed = await rect(command); assert.equal(Math.round(collapsed.y), 10);
        assert(collapsed.x >= home.x + home.width + 4 && collapsed.x + collapsed.width <= menu.x - 4, 'Collapsed command fits between controls');
      }
      await scrollTo(280); assert.equal(await root.getAttribute('data-nav-expanded'), 'true');
      await page.screenshot({ path: `${output}/header-${width}.png` });
    });
  }
  await step('focused destinations stay reachable during scrolling', async () => {
    await page.setViewportSize({ width: 1440, height: 600 }); await scrollTo(0);
    await root.getByRole('link', { name: 'Album', exact: true }).focus(); await scrollTo(300);
    assert.equal(await root.getAttribute('data-nav-expanded'), 'true');
    await command.focus(); await page.waitForTimeout(350);
    assert.equal(await root.getAttribute('data-nav-expanded'), 'false');
    assert.equal(await entries.evaluate(element => element.inert), true);
    await scrollTo(280); assert.equal(await root.getAttribute('data-nav-expanded'), 'true');
  });
  await step('open-sidebar header clears the account card at intermediate widths', async () => {
    for (const width of [1440, 1024, 794, 793, 768, 640, 532]) {
      await page.setViewportSize({ width, height: 900 }); await scrollTo(0);
      await page.getByRole('button', { name: 'Open menu', exact: true }).click(); await page.waitForTimeout(500);
      const menu = page.getByRole('complementary', { name: 'Site menu', exact: true });
      const account = await rect(menu.getByRole('button', { name: 'Zimo Web Sign in to Zimo Web', exact: true }));
      if (await command.isVisible()) {
        const search = await rect(command);
        if (search.y + search.height > account.y) assert(search.x + search.width <= account.x - 8, `Open-sidebar command overlaps account at ${width}: ${JSON.stringify({ search, account })}`);
      }
      await page.screenshot({ path: `${output}/sidebar-${width}.png` });
      await page.getByRole('button', { name: 'Close menu', exact: true }).click(); await page.waitForTimeout(350);
    }
  });
  await step('sidebar keeps its content while switching between modal and nonmodal', async () => {
    await page.setViewportSize({ width: 390, height: 844 }); await scrollTo(0);
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    const menu = page.locator('dialog[aria-label="Site menu"]'); await page.waitForTimeout(350);
    assert.equal(await menu.evaluate(element => element.matches(':modal')), true);
    await menu.getByRole('radiogroup', { name: 'Website theme', exact: true }).evaluate(element => { element.dataset.continuityProbe = 'kept'; });
    await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(500);
    assert.equal(await menu.getByRole('radiogroup', { name: 'Website theme', exact: true }).getAttribute('data-continuity-probe'), 'kept');
    assert.equal(await menu.evaluate(element => element.open && !element.matches(':modal')), true);
    await page.getByRole('button', { name: 'Close menu', exact: true }).click(); await page.waitForTimeout(350);
    assert.equal(await menu.evaluate(element => element.open), false);
    assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).evaluate(element => document.activeElement === element), true);
    await page.getByRole('button', { name: 'Open menu', exact: true }).click(); await page.waitForTimeout(350);
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(500);
    assert.equal(await menu.evaluate(element => element.matches(':modal')), true);
    await page.keyboard.press('Escape'); await page.waitForTimeout(350); assert.equal(await menu.evaluate(element => element.open), false);
  });
  await step('pinned and hidden preferences retain their meaning', async () => {
    const menu = page.locator('dialog[aria-label="Site menu"]');
    for (const [choice, expanded] of [['Pinned', 'true'], ['Hidden', 'false'], ['Flexible', 'true']]) {
      await scrollTo(0); await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      await menu.getByRole('button', { name: choice, exact: true }).click();
      await menu.getByRole('button', { name: 'Close menu', exact: true }).click(); await page.waitForTimeout(350);
      assert.equal(await root.getAttribute('data-nav-expanded'), expanded);
      if (choice === 'Pinned') { await scrollTo(300); assert.equal(await root.getAttribute('data-nav-expanded'), 'true'); }
      if (choice === 'Hidden') { await scrollTo(300); await scrollTo(250); assert.equal(await entries.evaluate(element => element.inert), true); }
    }
  });
  await step('compact command opens a usable palette and Escape restores its opener', async () => {
    await scrollTo(0); await command.click();
    const input = page.getByRole('combobox', { name: 'Search commands and entries', exact: true }); await input.fill('Notebook');
    await page.getByRole('option').filter({ hasText: 'Notebook' }).first().waitFor();
    await page.keyboard.press('Escape'); assert.equal(await command.evaluate(element => document.activeElement === element), true);
  });
  assert.deepEqual(errors, []); await writeFile(`${output}/report.json`, JSON.stringify({ steps, errors }, null, 2));
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
  await writeFile(`${output}/report.json`, JSON.stringify({ steps, errors, failure: String(error), header: await root.evaluate(element => ({data: {...element.dataset}, style: element.getAttribute('style'), command: element.querySelector('[data-context-slot]')?.getBoundingClientRect().toJSON(), commandStyle: element.querySelector('[data-context-slot]') && getComputedStyle(element.querySelector('[data-context-slot]')).top, animations: element.getAnimations({subtree:true}).map(animation => ({state:animation.playState, time:animation.currentTime, frames:animation.effect?.getKeyframes()}))})) }, null, 2)); throw error;
} finally { await browser.close(); }
