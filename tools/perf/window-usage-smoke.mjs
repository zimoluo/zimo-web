import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/window-usage';
await mkdir(output,{recursive:true});
let page;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),report=[],errors=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 if(process.env.SMOKE_THEME)await context.addInitScript(({id,scheme})=>{const active={kind:'builtIn',id};localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active,scheme,schemePreference:scheme,profiles:[],seasonal:false,shuffle:false,byRoute:Object.fromEntries(['home','blog','photos','projects','about','management','design','themeMaker','notebook','christmasTree'].map(route=>[route,active]))}}));},{id:process.env.SMOKE_THEME,scheme:process.env.SMOKE_SCHEME??'light'});
 page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base,{waitUntil:'networkidle'});
 const open=async(name)=>{await page.getByRole('button',{name:'Open window picker; Shift click minimizes windows',exact:true}).click();const picker=page.getByRole('dialog',{name:'Windows',exact:true});await picker.getByRole('button',{name,exact:true}).click();await page.getByRole('button',{name:'Open window picker; Shift click minimizes windows',exact:true}).click();await picker.getByRole('button',{name:'Close Windows',exact:true}).click();const frame=page.getByRole('dialog',{name,exact:true});await frame.waitFor();await frame.evaluate(node=>Promise.allSettled(node.getAnimations().map(animation=>animation.finished)));return frame;};
 const frame=await open('Calculator'),bar=frame.getByRole('button',{name:/^Move Calculator/});
 const pose=()=>frame.evaluate(node=>({x:node.getBoundingClientRect().x,y:node.getBoundingClientRect().y,width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height}));
 const near=(a,b,label)=>{for(const key of ['x','y','width','height'])assert(Math.abs(a[key]-b[key])<1,`${label}: ${key} ${a[key]} != ${b[key]}`);};
 for(let index=0;index<8;index++){
  const start=await pose(),handle=await bar.boundingBox(),dx=index%2===0?90:-55,dy=index%2===0?-30:20;
  await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);await page.mouse.down();await page.mouse.move(handle.x+handle.width/2+dx,handle.y+handle.height/2+dy,{steps:12});
  await page.waitForTimeout(40);const held=await pose();await page.mouse.up();const released=await pose();
  assert(Math.abs(released.x-start.x-dx)<=13,'Release must retain requested movement apart from a nearby snap');
  await page.waitForTimeout(700);near(await pose(),released,'Delayed pose');
  await frame.getByRole('button',{name:'7',exact:true}).click();near(await pose(),released,'Content render');
  report.push({kind:'repeat-drag',index,start,held,released});
 }
 await page.reload({waitUntil:'networkidle'});await frame.waitFor();await page.waitForTimeout(700);near(await pose(),report.at(-1).released,'Saved pose after reload');
 report.push({kind:'persistence',pose:await pose()});
 await page.goto(base+'/design/theme-maker',{waitUntil:'networkidle'});await frame.waitFor();
 const name=page.getByRole('textbox',{name:'Theme name',exact:true}),display=frame.locator('p').last();await name.waitFor();const beforeKeys=await display.innerText();
 await name.fill('');await name.pressSequentially('Theme 123');assert.equal(await name.inputValue(),'Theme 123','A calculator window must not steal text input from the page');assert.equal(await display.innerText(),beforeKeys);
 await page.keyboard.press('Control+k');const search=page.getByRole('combobox',{name:'Search commands and entries',exact:true});await search.fill('');await search.pressSequentially('projects');assert.equal(await search.inputValue(),'projects','Window shortcuts must not steal command search');await page.keyboard.press('Escape');
 report.push({kind:'keyboard-ownership',typing:'Theme 123',search:'projects'});
 const corners=await frame.locator('[data-edge]').evaluateAll(nodes=>nodes.map(node=>({edge:node.dataset.edge,rect:node.getBoundingClientRect().toJSON()})));
 const bounds=await pose();
 for(const edge of ['nw','ne','sw','se']){
  const rect=corners.find(item=>item.edge===edge).rect;
  const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
  assert(Math.abs(x-(bounds.x+(edge.endsWith('e')?bounds.width:0)))<30,`${edge} must be on its own horizontal corner`);
  assert(Math.abs(y-(bounds.y+(edge.startsWith('s')?bounds.height:0)))<30,`${edge} must be on its own vertical corner`);
  const hit=await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('[data-edge]')?.dataset.edge,{x,y});
  assert.equal(hit,edge,`${edge} must be independently reachable`);
 }
 report.push({kind:'corner-hit-targets',corners});
 const grow=frame.getByRole('separator',{name:'Resize from the right',exact:true});let grip=await grow.boundingBox();await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();await page.mouse.move(grip.x+grip.width/2+480,grip.y+grip.height/2,{steps:12});await page.mouse.up();
 assert((await pose()).width>=700,'Calculator must reach its scientific layout');
 assert.equal(await frame.getByRole('button',{name:'7',exact:true}).evaluate(node=>getComputedStyle(node.parentElement).gridTemplateColumns.split(' ').length),8);
 await page.screenshot({path:`${output}/calculator-scientific.png`});report.push({kind:'scientific-calculator',pose:await pose()});
 await frame.getByRole('button',{name:'Close Calculator',exact:true}).click();await frame.waitFor({state:'detached'});
 const blank=await open('Blank');
 for(const edge of ['n','s','w','e','nw','ne','sw','se']){
  const before=await blank.boundingBox(),target=blank.locator(`[data-edge="${edge}"]`),grip=await target.boundingBox();
  const dx=edge.includes('w')?-20:edge.includes('e')?20:0,dy=edge.includes('n')?-20:edge.includes('s')?20:0;
  const hit=await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('[data-edge]')?.dataset.edge,{x:grip.x+grip.width/2,y:grip.y+grip.height/2});assert.equal(hit,edge,`${edge} must win its resize hit area`);
  await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();await page.mouse.move(grip.x+grip.width/2+dx,grip.y+grip.height/2+dy,{steps:8});await page.mouse.up();
  const after=await blank.boundingBox();if(dx)assert(after.width>before.width,`${edge} must resize width`);if(dy)assert(after.height>before.height,`${edge} must resize height`);
  report.push({kind:'resize-edge',edge,before,after});
 }
 const move=blank.getByRole('button',{name:/^Move Blank/}),gripBox=await move.boundingBox();await page.mouse.move(gripBox.x+gripBox.width/2,gripBox.y+gripBox.height/2);await page.mouse.down();await page.mouse.move(gripBox.x+gripBox.width/2+80,gripBox.y+gripBox.height/2-40,{steps:5});
 await page.getByRole('button',{name:'Open window picker; Shift click minimizes windows',exact:true}).focus();await page.getByRole('button',{name:'Tidy windows',exact:true}).focus();await page.keyboard.press('Enter');const tidied=await blank.boundingBox();
 await page.mouse.move(gripBox.x+gripBox.width/2+150,gripBox.y+gripBox.height/2-20);await page.mouse.up();await page.waitForTimeout(600);near(await blank.boundingBox(),tidied,'Geometry command handover');assert.equal(await blank.getAttribute('data-zw-gesture-active'),null);report.push({kind:'tidy-during-held-drag',tidied});
 const studio=await open('Studio');await studio.getByRole('button',{name:'Maximize Studio',exact:true}).click();await page.setViewportSize({width:1200,height:850});
 await page.waitForFunction(()=>{const node=document.querySelector('[role=dialog][aria-label=Studio]');return node&&Math.abs(node.getBoundingClientRect().width-1200)<1;});
 const expanded=await studio.boundingBox();assert(expanded.y+expanded.height+38<=851);await studio.getByRole('button',{name:'Restore Studio',exact:true}).click();const restored=await studio.boundingBox();assert(restored.width<expanded.width);assert(restored.y+restored.height+38<=851);report.push({kind:'maximized-viewport-restore',expanded,restored});
 await page.screenshot({path:`${output}/windows.png`});

 assert.deepEqual(errors,[]);
 await writeFile(`${output}/report.json`,JSON.stringify({pass:true,report,errors},null,2));console.log('PASS repeated drag/reload, keyboard ownership, all eight resize targets, scientific layout, Tidy handover, maximize/viewport/restore');
} catch(error) {await page?.screenshot({path:`${output}/failure.png`}).catch(()=>{});await writeFile(`${output}/report.json`,JSON.stringify({pass:false,error:String(error),report,errors},null,2));throw error;} finally {await browser.close();}
