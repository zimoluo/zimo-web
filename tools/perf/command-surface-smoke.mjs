import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = process.env.SMOKE_OUTPUT ?? 'work/command-surface-smoke';
const base = process.argv[2] ?? 'http://localhost:3482';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const report = [];
try {
 for (const [width, height, reducedMotion] of [[1440,900,'no-preference'],[779,900,'no-preference'],[390,844,'no-preference'],[320,300,'no-preference'],[390,844,'reduce']]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('zw.theme', JSON.stringify({ version: 1, state: { revision: 0, active: { kind: 'builtIn', id: 'whiteout' }, scheme: 'light', schemePreference: 'light', profiles: [], seasonal: false, shuffle: false, byRoute: { home: { kind: 'builtIn', id: 'whiteout' } } } })));
  await page.goto(base, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  const bar = page.locator('[data-command-origin]'), palette = page.locator('#zw-command-palette'), input = page.getByRole('combobox', { name: 'Search commands and entries' });
  const origin = await bar.boundingBox(); assert(origin);
  await page.evaluate(() => { window.commandFrames = []; const start = performance.now(); const sample = () => { const popup = document.querySelector('#zw-command-palette'), box = popup.getBoundingClientRect(); window.commandFrames.push({ time: performance.now()-start, x: box.x, y: box.y, width: box.width, height: box.height, phase: popup.dataset.commandPhase, open: popup.matches(':popover-open') }); if (performance.now()-start<500) requestAnimationFrame(sample); }; requestAnimationFrame(sample); });
  await page.keyboard.press('Control+k'); await input.waitFor(); await page.waitForFunction(() => document.querySelector('#zw-command-palette').dataset.commandPhase === 'open');
  const bounds = await palette.boundingBox(); assert(bounds); assert(Math.abs(bounds.y-origin.y)<1); assert(Math.abs(bounds.x+bounds.width-origin.x-origin.width)<1); assert(bounds.x>=0 && bounds.x+bounds.width<=width+1 && bounds.y+bounds.height<=height+1);
  assert.equal(await bar.getAttribute('data-palette-covered'),'true');
  assert.equal(await input.evaluate(node => getComputedStyle(node).fontSize),'14px');
  await page.waitForTimeout(220); const frames = await page.evaluate(() => window.commandFrames);
  if(reducedMotion === 'no-preference') assert(frames.some(frame=>frame.phase==='opening'&&frame.height>origin.height+5&&frame.height<bounds.height-5),'Opening must paint intermediate geometry');
  await page.screenshot({path:`${output}/open-${width}-${height}-${reducedMotion}.png`});
  await input.fill('not a matching command'); await page.waitForTimeout(220); const filtered = await palette.boundingBox(); assert(filtered.height<bounds.height);
  await input.fill('Home'); await page.waitForTimeout(45); const before = await palette.boundingBox(); await input.fill(''); await page.waitForTimeout(20); const after = await palette.boundingBox(); if(reducedMotion==='no-preference') assert(Math.abs(after.height-before.height)<100,`Retargeting must continue from the painted height: ${width} ${JSON.stringify({before,after})}`);
  await page.keyboard.press('Escape'); await page.keyboard.press('Control+k'); await input.waitFor(); assert.equal(await input.inputValue(),''); await page.waitForFunction(() => document.querySelector('#zw-command-palette').dataset.commandPhase === 'open');
  await page.evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true,repeat:true,bubbles:true,cancelable:true}))); assert.equal(await palette.evaluate(node=>node.matches(':popover-open')),true);
  await page.keyboard.press('Escape'); await page.waitForTimeout(80); await page.keyboard.press('Control+k'); await page.waitForFunction(() => document.querySelector('#zw-command-palette').dataset.commandPhase === 'open');
  await page.keyboard.press('Escape'); await page.waitForFunction(() => document.querySelector('#zw-command-palette').dataset.commandPhase === 'closed'); assert.equal(await bar.getAttribute('data-palette-covered'),null);
  if(width===1440){
   await page.getByRole('button',{name:'Open command palette',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#zw-command-palette').dataset.commandPhase==='open');await page.keyboard.press('Escape');await page.keyboard.press('Control+k');await input.waitFor();await page.waitForFunction(()=>document.querySelector('#zw-command-palette').dataset.commandPhase==='open');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelector('#zw-command-palette').dataset.commandPhase==='closed');assert.equal(await page.getByRole('button',{name:'Open command palette',exact:true}).evaluate(node=>node===document.activeElement),true);
   await page.evaluate(()=>{const input=document.createElement('input');input.id='command-outside-probe';input.style.cssText='position:fixed;left:20px;top:220px;width:160px;height:44px;z-index:var(--z-chrome)';document.body.append(input);});
   await page.keyboard.press('Control+k'); await page.waitForFunction(()=>document.querySelector('#zw-command-palette').dataset.commandPhase==='open'); await page.locator('#command-outside-probe').click(); await page.waitForTimeout(400); assert.equal(await page.evaluate(()=>document.activeElement.id),'command-outside-probe');
   await page.evaluate(()=>{const dialog=document.createElement('dialog');dialog.id='command-modal-probe';dialog.innerHTML='<input aria-label="Modal focus probe">';document.body.append(dialog);dialog.showModal();dialog.querySelector('input').focus();});
   await page.keyboard.press('Control+k'); await input.waitFor(); await page.waitForFunction(()=>document.querySelector('#zw-command-palette').dataset.commandPhase==='open'); assert.equal(await palette.evaluate(node=>node.parentElement.id),'command-modal-probe'); assert.equal(await bar.getAttribute('data-palette-covered'),null);
   await page.keyboard.press('Escape'); await page.waitForTimeout(400); assert.equal(await page.getByRole('textbox',{name:'Modal focus probe'}).evaluate(node=>node===document.activeElement),true);
   await page.keyboard.press('Control+k'); await input.waitFor(); await page.evaluate(()=>document.querySelector('#command-modal-probe').close()); await page.waitForTimeout(400); assert.equal(await palette.evaluate(node=>node.matches(':popover-open')),false);
   await page.locator('#command-outside-probe').focus(); await page.keyboard.press('Control+k'); await input.waitFor(); await page.emulateMedia({reducedMotion:'reduce'}); await page.waitForFunction(()=>document.querySelector('#zw-command-palette').dataset.commandPhase==='open'); await page.keyboard.press('Escape'); await page.waitForFunction(()=>document.querySelector('#zw-command-palette').dataset.commandPhase==='closed');
  }
  assert.deepEqual(errors,[]); report.push({width,height,reducedMotion,origin,bounds,filtered,frames}); await page.close();
 }
 await writeFile(`${output}/report.json`,JSON.stringify(report,null,2)); console.log(JSON.stringify({pass:true,cases:report.length}));
} finally { await browser.close(); }
