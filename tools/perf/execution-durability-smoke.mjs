import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getTheme } from '../../src/features/theme/registry/index.ts';
const base = process.argv[2] ?? 'http://localhost:3482', output = process.env.SMOKE_OUTPUT ?? 'work/execution-durability';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const results = [], errors = [];
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); page.on('pageerror', error => errors.push(error.message));
 await page.goto(base, { waitUntil: 'networkidle' }); await page.getByRole('button', { name: 'Open window picker; Shift click minimizes windows', exact: true }).click();
 await page.getByRole('dialog', { name: 'Windows', exact: true }).getByRole('button', { name: 'Calculator', exact: true }).click();
 const frame = page.getByRole('dialog', { name: 'Calculator', exact: true }); await frame.waitFor(); await page.waitForTimeout(750);
 await page.evaluate(() => { const probe = document.createElement('input'); probe.id = 'gesture-focus-probe'; document.body.append(probe); window.gestureWrites = 0; const original = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { if(key==='zw.windows') window.gestureWrites++; return original.call(this,key,value); }; document.addEventListener('pointerdown', event => { window.gesturePointer = event.pointerId; }, true); });
 for (const kind of ['drag','resize']) for (const cancel of ['Escape','pointercancel','lostpointercapture']) {
  await page.locator('#gesture-focus-probe').evaluate(node=>node.focus({preventScroll:true})); const before = await frame.boundingBox(), stored = await page.evaluate(() => localStorage.getItem('zw.windows'));
  const target = kind === 'drag' ? frame.getByRole('button', { name: /^Move Calculator/ }) : frame.getByRole('separator', { name: 'Resize from the bottom right', exact: true });
  const box = await target.boundingBox(); const x=box.x+box.width/2, y=box.y+box.height/2;
  await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+75,y-25,{steps:5}); await page.waitForTimeout(50);
  const held = await frame.boundingBox(); assert.notDeepEqual(held,before);
  assert.equal(await frame.evaluate(node=>node.contains(document.activeElement)),true,'Resize from outside focus must own keyboard cancellation');
  const writes = await page.evaluate(() => window.gestureWrites);
  if(cancel==='Escape') await page.keyboard.press('Escape');
  else if(cancel==='pointercancel') await target.evaluate(node=>node.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:window.gesturePointer})));
  else { await target.evaluate(node=>node.releasePointerCapture(window.gesturePointer)); await page.mouse.move(x+76,y-25); }
  await page.mouse.up(); await page.waitForTimeout(600);
  const after = await frame.boundingBox(); assert.deepEqual(after,before); assert.equal(await frame.getAttribute('data-zw-gesture-active'),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('zw.windows')),stored); assert.equal(await page.evaluate(()=>window.gestureWrites),writes,'Cancellation must not persist geometry');
  results.push({kind,cancel,before,held,after});
 }
 await page.screenshot({path:`${output}/window-restored.png`}); await page.close();
 const source = structuredClone(getTheme('home')); source.id='scene-binding-probe'; source.name='Scene binding probe'; source.appearance=undefined; source.schemes={kind:'single',scheme:'light',roles:source.schemes.kind==='single'?source.schemes.roles:source.schemes.light}; source.backdrop={scenes:[{id:'sky',palette:{glow:{kind:'tone',at:.25}}}]};
 const scenePage=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});scenePage.on('pageerror',error=>errors.push(error.message));
 await scenePage.addInitScript(source=>{const active={kind:'profile',index:0};localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active,scheme:'light',schemePreference:'light',profiles:[source],seasonal:false,shuffle:false,byRoute:{home:active,themeMaker:active}}}));},source);
 await scenePage.goto(base+'/design/theme-maker',{waitUntil:'networkidle'});
 const preview=scenePage.locator('[data-backdrop-focus-scope] [data-scene-id="sky"]'), background=scenePage.locator('[data-scope="viewport"] [data-scene-id="sky"]'); await preview.waitFor(); await background.waitFor();
 await preview.evaluate(node=>{window.bindingScene=node;node.style.setProperty('--zw-artwork-probe','preserved');});
 const old=await preview.evaluate(node=>node.style.getPropertyValue('--zw-scene-glow'));assert(old);assert.equal(await background.evaluate(node=>node.style.getPropertyValue('--zw-scene-glow')),old);
 await scenePage.getByRole('tab',{name:'Profiles',exact:true}).click();const next={...source,backdrop:{scenes:[{id:'sky',params:{speed:2}}]}};
 await scenePage.locator('input[type=file][accept*=json]').setInputFiles({name:'scene-probe.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(next))});
 await scenePage.waitForFunction(()=>window.bindingScene.style.getPropertyValue('--zw-scene-glow')==='');
 assert.equal(await preview.evaluate(node=>node===window.bindingScene),true);assert.equal(await preview.evaluate(node=>node.style.getPropertyValue('--zw-scene-speed')),'2');assert.equal(await preview.evaluate(node=>node.style.getPropertyValue('--zw-artwork-probe')),'preserved');assert.equal(await background.evaluate(node=>node.style.getPropertyValue('--zw-scene-glow')),old);
 await scenePage.screenshot({path:`${output}/scene-binding.png`});results.push({sceneBinding:'retired draft slot removed without remounting or changing published background'}); await scenePage.close();
 assert.deepEqual(errors,[]);await writeFile(`${output}/report.json`,JSON.stringify({results,errors},null,2));console.log(JSON.stringify({pass:true,cases:results.length}));
} finally { await browser.close(); }
