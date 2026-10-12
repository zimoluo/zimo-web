import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getTheme } from '../../src/features/theme/registry/index.ts';
const require = createRequire(import.meta.url), { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3482', output = process.env.SMOKE_OUTPUT ?? 'work/studio-profile-craft';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await context.addInitScript(profiles => {
  const active = { kind: 'profile', index: 1 };
  localStorage.setItem('zw.theme', JSON.stringify({ version: 1, state: { revision: 0, active, scheme: 'light', schemePreference: 'light', profiles, seasonal: false, shuffle: false, byRoute: { themeMaker: active } } }));
}, [{ ...getTheme('whiteout'), id: 'same-import', name: 'First imported' }, { ...getTheme('velvet'), id: 'same-import', name: 'Second imported' }]);
const page = await context.newPage(), errors = [], steps = [];
page.on('pageerror', error => errors.push(error.message));
const pane = () => page.getByRole('tabpanel', { name: 'Profiles', exact: true });
const rows = () => pane().locator('[data-profile-index]');
const name = () => page.getByLabel('Theme name', { exact: true });
const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('zw.theme')).state);
async function step(label, run) { await run(); steps.push(label); console.log(`PASS ${label}`); }
try {
  await page.goto(`${base}/design/theme-maker`, { waitUntil: 'domcontentloaded' });
  await name().waitFor();
  await page.waitForFunction(input => input.value === 'Second imported', await name().elementHandle());
  await step('duplicate-ID imports have one selected shelf tile', async () => {
    const shelf = page.getByRole('group', { name: 'Saved themes', exact: true });
    assert.equal(await shelf.locator('[aria-pressed=true]').count(), 1);
    const geometry = await shelf.getByRole('button', { name: 'Edit Second imported', exact: true }).evaluate(button => {
      const thumbnail = button.querySelector('[class*=thumbnail]'), paint = thumbnail.querySelector('span'), border = getComputedStyle(paint), glow = getComputedStyle(thumbnail, '::before');
      const rules = []; const collect = values => { for (const rule of values) { if (rule.cssRules) collect(rule.cssRules); if (rule.selectorText?.includes('thumbnailPaint') && paint.matches(rule.selectorText)) rules.push(rule); } }; for (const sheet of document.styleSheets) collect(sheet.cssRules);
      return { authoredBorder: rules.map(rule => rule.style.getPropertyValue('border').match(/^\S+/)?.[0]).find(value => value), rect: thumbnail.getBoundingClientRect().toJSON(), border: border.borderTopWidth, radius: border.borderTopLeftRadius, image: border.backgroundImage, glow: { opacity: glow.opacity, width: glow.width, shadow: glow.boxShadow } };
    });
    assert.equal(geometry.rect.width, 64); assert.equal(geometry.rect.height, 64);
    assert.equal(geometry.authoredBorder, '2.5px'); assert.equal(geometry.border, '2px'); assert.equal(geometry.radius, '16px');
    assert.equal(geometry.glow.opacity, '1'); assert.equal(geometry.glow.width, '0px');
    assert(geometry.glow.shadow.includes('16px 27.2px'));
    assert.equal(await shelf.getByRole('button', { name: 'Edit Second imported', exact: true }).getAttribute('aria-pressed'), 'true');
  });
  await page.getByRole('tab', { name: 'Profiles', exact: true }).click();
  await step('profile actions retain bounded 44-pixel targets at all widths', async () => {
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      await rows().first().scrollIntoViewIfNeeded();
      const tabs = await page.getByRole('tablist', { name: 'Theme controls', exact: true }).evaluate(node => ({ rect: node.getBoundingClientRect().toJSON(), frame: node.closest('aside').parentElement.getBoundingClientRect().toJSON() }));
      assert(tabs.rect.top >= tabs.frame.top - 1, `${width} clipped sticky tabs`);
      const geometry = await rows().evaluateAll(nodes => nodes.map(row => ({ row: row.getBoundingClientRect().toJSON(), actions: [...row.querySelectorAll('button')].map(button => button.getBoundingClientRect().toJSON()) })));
      assert(geometry.every(value => value.actions.every(action => action.height >= 43.9 && action.width >= 43.9 && action.x >= value.row.x - 1 && action.right <= value.row.right + 1)), JSON.stringify({ width, geometry }));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: `${output}/profiles-${width}.png` });
    }
    assert(await rows().first().getByRole('button', { name: 'Move First imported up', exact: true }).isDisabled());
    assert(await rows().last().getByRole('button', { name: 'Move Second imported down', exact: true }).isDisabled());
  });
  await step('reordering retains edit identity and restores focus at a boundary', async () => {
    await rows().last().getByRole('button', { name: 'Move Second imported up', exact: true }).click();
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Edit Second imported');
    assert.equal(await name().inputValue(), 'Second imported');
    await name().fill('Second revised'); await name().press('Tab');
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('zw.theme')).state.profiles[0]?.name === 'Second revised');
    assert.deepEqual((await stored()).profiles.map(profile => profile.name), ['Second revised', 'First imported']);
    assert.equal(await rows().locator('[aria-pressed=true]').count(), 1);
  });
  await step('duplication opens the independent copy and keyboard movement retains focus', async () => {
    await rows().first().getByRole('button', { name: 'Duplicate Second revised', exact: true }).click();
    assert.equal(await name().inputValue(), 'Second revised copy');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Edit Second revised copy');
    await page.keyboard.press('ArrowUp');
    assert.equal(await rows().nth(1).getByRole('button', { name: 'Edit Second revised copy', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Edit Second revised copy');
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('zw.theme')).state.profiles.length === 3);
    const profiles = (await stored()).profiles;
    assert.notEqual(profiles[0].id, profiles[1].id);
    assert.equal(profiles[0].name, 'Second revised');
  });
  await step('deletion preserves the working draft and focuses a surviving control', async () => {
    await rows().nth(1).getByRole('button', { name: 'Delete Second revised copy', exact: true }).click();
    assert.equal(await name().inputValue(), 'Second revised copy');
    assert.equal(await rows().locator('[aria-pressed=true]').count(), 0);
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Edit First imported');
    await rows().last().getByRole('button', { name: 'Delete First imported', exact: true }).click();
    await rows().first().getByRole('button', { name: 'Delete Second revised', exact: true }).click();
    assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-new-profile')), true);
    assert.equal(await rows().count(), 0);
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('zw.theme')).state.profiles.length === 0);
    await page.screenshot({ path: `${output}/empty-profiles-320.png` });
  });
  assert.deepEqual(errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ base, steps, errors }, null, 2));
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
  await writeFile(`${output}/report.json`, JSON.stringify({ base, steps, errors, failure: String(error) }, null, 2));
  throw error;
} finally { await browser.close(); }
