import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const base=process.argv[2]??'http://localhost:3483',output=process.env.SMOKE_OUTPUT??'work/navigation-motion';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const page=await browser.newPage({viewport:{width:1024,height:900}}),results=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.addInitScript(()=>localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active:{kind:'builtIn',id:'penumbra'},scheme:'dark',schemePreference:'dark',profiles:[],seasonal:false,shuffle:false,byRoute:{home:{kind:'builtIn',id:'penumbra'}}}})));
const sample=async(action)=>{
 await page.evaluate(()=>{
  const frames=[],start=performance.now();window.__headerFrames=frames;
  const read=element=>{if(!element)return null;const box=element.getBoundingClientRect(),css=getComputedStyle(element);return{x:box.x,y:box.y,width:box.width,height:box.height,opacity:Number(css.opacity),visible:css.visibility!=='hidden',position:css.position};};
  const tick=()=>{const root=document.querySelector('[data-nav-expanded]');frames.push({at:performance.now()-start,state:root?.dataset.headerLayout,root:read(root),nav:read(document.querySelector('[data-navigation-destinations]')),command:read(document.querySelector('[data-context-slot]')),windows:read(document.querySelector('[data-window-control]')),menu:read(document.querySelector('dialog[aria-label="Site menu"]')),account:read(document.querySelector('[data-site-account]'))});if(performance.now()-start<500)requestAnimationFrame(tick);};tick();
 });
 await action();await page.waitForTimeout(530);return page.evaluate(()=>window.__headerFrames);
};
const overlaps=(a,b)=>a&&b&&a.x<b.x+b.width-1&&a.x+a.width>b.x+1&&a.y<b.y+b.height-1&&a.y+a.height>b.y+1;
try{
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('[data-header-layout]'));await page.waitForLoadState('networkidle');
 for(const width of [1440,1176,1175,1024,900,794,793,640,532,531,390]){
  await page.setViewportSize({width,height:900});await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(450);
  for(const direction of ['open','close']){
   const frames=await sample(()=>page.getByRole('button',{name:direction==='open'?'Open menu':'Close menu',exact:true}).click());
   const issues=frames.filter(frame=>frame.root.visible&&frame.root.opacity>.15&&frame.command.opacity>.15&&(frame.nav.opacity>.15&&overlaps(frame.command,frame.nav)||frame.windows.opacity>.15&&overlaps(frame.command,frame.windows)||frame.menu.opacity*frame.account.opacity>.15&&(overlaps(frame.command,frame.account)||frame.windows.opacity>.15&&overlaps(frame.windows,frame.account))));
   assert.deepEqual(issues,[],`Visible header surfaces overlap during ${direction} at ${width}: ${JSON.stringify(issues)}`);
   assert(frames.every(frame=>frame.command.position==='absolute'),'Search must retain one positioning model');
   assert(frames.every(frame=>Math.abs(frame.root.width-width)<1),'The header canvas must not cross animated container thresholds');
   results.push({width,direction,frames});
   await page.screenshot({path:`${output}/${width}-${direction}.png`});
  }
  console.log(`PASS sampled open/close motion at ${width}px`);
 }
 await page.setViewportSize({width:1024,height:900});await page.waitForTimeout(400);
 for(const wait of [50,120,220]){
  const frames=await sample(async()=>{await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(wait);await page.getByRole('button',{name:'Close menu',exact:true}).click();});
  results.push({reversalAfter:wait,frames});
  const active=await page.locator('[data-nav-expanded]').evaluate(element=>element.getAnimations({subtree:true}).filter(animation=>animation.playState==='running').length);
  assert.equal(active,0,'Interrupted motion must finish without orphan animations');
 }
 await page.setViewportSize({width:793,height:900});await page.waitForTimeout(450);await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(400);await page.getByRole('button',{name:'Close menu',exact:true}).click();await page.waitForTimeout(30);
 const windowButton=page.getByRole('button',{name:'Open window picker; Shift click minimizes windows',exact:true});assert.equal(await windowButton.locator('..').evaluate(element=>getComputedStyle(element).pointerEvents),'none','Invisible returning utilities must not intercept search clicks');await windowButton.focus();await page.waitForTimeout(20);assert.equal(Math.round((await windowButton.boundingBox()).x),793-136,'Keyboard focus finishes the move before revealing the utility');assert.equal(await windowButton.locator('..').evaluate(element=>getComputedStyle(element).opacity),'1');await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.waitForTimeout(80);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(20);assert.equal(await page.locator('[data-context-slot]').evaluate(element=>element.getAnimations().filter(animation=>animation.playState==='running').length),0,'Changing the motion preference cancels an active path');await page.getByRole('button',{name:'Close menu',exact:true}).click();await page.waitForTimeout(150);
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Open menu',exact:true}).click();
 assert.equal(await page.locator('[data-context-slot]').evaluate(element=>element.getAnimations().length),0,'Reduced motion must not interpolate geometry');
 await page.getByRole('button',{name:'Close menu',exact:true}).click();
 await page.goto(`${base}/blog`,{waitUntil:'domcontentloaded'});const search=page.getByRole('searchbox');await search.fill('design');
 const clear=page.getByRole('button',{name:/^Clear .* search$/});assert.equal(await clear.locator('svg').getAttribute('viewBox'),'0 0 1024 1024');await clear.click();assert.equal(await search.inputValue(),'');assert.equal(await search.evaluate(element=>document.activeElement===element),true);
 for(const height of [300,440,844]){await page.setViewportSize({width:390,height});await page.waitForTimeout(400);await page.keyboard.press('Control+k');const palette=page.getByRole('dialog',{name:'Command palette',exact:true});await palette.waitFor();await page.waitForTimeout(350);const box=await palette.boundingBox();assert(box&&box.y>=0&&box.y+box.height<=height-8,'Palette must fit the visible viewport');await page.screenshot({path:`${output}/palette-390-${height}.png`});await page.keyboard.press('Escape');}
 assert.deepEqual(errors,[]);await writeFile(`${output}/report.json`,JSON.stringify({results,errors},null,2));console.log('PASS interrupted motion, reduced motion, original entry search affordance and focus');
}catch(error){await page.screenshot({path:`${output}/failure.png`}).catch(()=>{});await writeFile(`${output}/report.json`,JSON.stringify({results,errors,failure:String(error)},null,2));throw error;}finally{await browser.close();}
