import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/contained-layout';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000},locale:"en-GB"}),cases=[],failures=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));
const check=(condition,message)=>{if(!condition)failures.push(message);};
const open=async(name)=>{await page.getByRole('button',{name:'Open window picker; Shift click minimizes windows',exact:true}).click();const picker=page.getByRole('dialog',{name:'Windows',exact:true});await picker.getByRole('button',{name,exact:true}).click();await page.getByRole('button',{name:'Open window picker; Shift click minimizes windows',exact:true}).click();await picker.getByRole('button',{name:'Close Windows',exact:true}).click();const frame=page.getByRole('dialog',{name,exact:true});await frame.waitFor();await frame.evaluate(node=>Promise.allSettled(node.getAnimations().map(animation=>animation.finished)));return frame;};
const resize=async(frame,width,height)=>{const before=await frame.boundingBox(),handle=await frame.locator('[data-edge=se]').boundingBox();await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);await page.mouse.down();await page.mouse.move(handle.x+handle.width/2+width-before.width,handle.y+handle.height/2+height-before.height,{steps:12});await page.mouse.up();};
try{
 await page.addInitScript(()=>{const active={kind:'builtIn',id:'whiteout'};localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active,scheme:'light',schemePreference:'light',profiles:[],seasonal:false,shuffle:false,byRoute:Object.fromEntries(['home','blog','photos','projects','about','management','design','themeMaker','notebook'].map(key=>[key,active]))}}));});
 await page.goto(base,{waitUntil:'networkidle'});
 const studio=await open('Studio');await resize(studio,520,440);
 const compact=await studio.locator('[data-studio-scroll=frame]').evaluate(node=>({overflow:getComputedStyle(node).overflowY,height:node.clientHeight,scrollHeight:node.scrollHeight}));
 check(compact.overflow==='auto'&&compact.scrollHeight>compact.height,'Small Studio must scroll as a complete workbench independently of desktop viewport');
 await studio.getByRole('tab',{name:'Motion',exact:true}).click();await studio.getByRole('tab',{name:'Color',exact:true}).click();
 await studio.getByRole('button',{name:'text role',exact:true}).click();const popup=page.getByRole('dialog',{name:'Color: text role',exact:true});await popup.waitFor();const bounds=await popup.boundingBox();check(bounds.width>250&&bounds.height>100,'Color popup must retain intrinsic height beside a size-contained workbench');await page.keyboard.press('Escape');await popup.waitFor({state:'hidden'});
 await page.screenshot({path:`${output}/studio-compact.png`});cases.push({name:'small-studio',compact,popup:bounds});await studio.getByRole('button',{name:'Close Studio',exact:true}).click();await studio.waitFor({state:'detached'});
 for(const [name,section] of [['Album entry','album'],['Project','projects']]){
  const frame=await open(name);await frame.locator(`a[href^="/${section}/"]`).first().waitFor();await resize(frame,520,620);await frame.locator(`a[href^="/${section}/"]`).first().click();await frame.locator('article h1').first().waitFor();
  const geometry=await frame.locator('article').evaluate(node=>({width:node.clientWidth,scrollWidth:node.scrollWidth,columns:getComputedStyle(node).gridTemplateColumns,display:getComputedStyle(node).display,height:node.clientHeight}));
  check(geometry.width<=(await frame.boundingBox()).width+2,`${name}: article must fit its host window`);
  check(geometry.scrollWidth<=geometry.width+2,`${name}: article must not overflow its own width`);
  const summary=frame.getByText('Share or download',{exact:true}).locator('..');check(await summary.isVisible(),`${name}: narrow reader must use sharing disclosure`);
  if(await summary.isVisible()){
   await summary.click();await frame.getByRole('link',{name:'Bluesky',exact:true}).focus();await page.keyboard.press('Escape');check(await frame.isVisible(),`${name}: menu Escape must not close its window`);check(await summary.evaluate(node=>!node.parentElement.open),`${name}: Escape must retire sharing menu`);
  }
  const decoded=await frame.locator('[aria-roledescription=carousel] img').first().evaluate(async image=>{await image.decode();const url=new URL(image.currentSrc);return {width:image.naturalWidth,height:image.naturalHeight,source:url.protocol.startsWith("http")?url.pathname:"embedded",placeholder:image.style.backgroundImage!=="none"};});check(decoded.width>0,`${name}: displayed media must decode`);
  if(section==='projects'){
   const viewer=frame.locator('[aria-roledescription="carousel"]'),box=await viewer.boundingBox();check(box.height<=400,'Portrait project media must fit the window pane rather than the desktop viewport');
   const controls=frame.getByRole('button',{name:'Grid',exact:true});if(await controls.count()){const rect=await controls.boundingBox(),share=await summary.boundingBox();check(share.y>=rect.y+rect.height,'Project sharing must not collide with image controls');}
  }
  await page.screenshot({path:`${output}/${section}-compact.png`});cases.push({name,geometry,image:decoded});
  if(await frame.isVisible()){await frame.getByRole('button',{name:`Close ${name}`,exact:true}).click();await frame.waitFor({state:'detached'});}
 }
 await page.goto(base+'/design',{waitUntil:'networkidle'});
 const gallery=page.getByRole('group',{name:'Explore favicon designs',exact:true});await gallery.waitFor();const sample=gallery.getByRole('button').first(),label=await sample.getAttribute('aria-label');
 await sample.click();await page.waitForFunction(before=>document.querySelector('[aria-label="Explore favicon designs"] button')?.getAttribute('aria-label')!==before,label);await page.waitForFunction(()=>document.querySelector('[aria-label="Explore favicon designs"] button')?.getAttribute('aria-disabled')==='false');
 check(await gallery.getByRole('button').count()===8,'Original eight favicon families must be available');check(await sample.getAttribute('aria-label')!==label,'Favicon sample must cycle its own design');
 await sample.click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('[aria-label="Explore favicon designs"] button')?.getAttribute('aria-disabled')==='false');
 const reducedLabel=await sample.getAttribute('aria-label');await page.waitForTimeout(350);check(await sample.getAttribute('aria-label')===reducedLabel,'Reducing motion must not leave a late favicon swap');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.screenshot({path:`${output}/design-identities.png`});cases.push({name:'favicon-gallery',before:label,after:await sample.getAttribute('aria-label')});
 const articleDemo=page.locator('details').filter({has:page.locator('summary').filter({hasText:'Blog Article'})});await articleDemo.locator('summary').click();await articleDemo.locator('article h2').waitFor();check((await articleDemo.locator('a').first().getAttribute('href'))?.startsWith('/blog/'),'Design article preview must be a real shared entry card');
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);await writeFile(`${output}/report.json`,JSON.stringify({pass:true,cases,errors},null,2));console.log('PASS compact Studio, intrinsic color popup, contained album/project readers and sharing Escape');
}catch(error){await page.screenshot({path:`${output}/failure.png`});await writeFile(`${output}/report.json`,JSON.stringify({pass:false,cases,failures,errors,error:String(error)},null,2));throw error;}finally{await browser.close();}
