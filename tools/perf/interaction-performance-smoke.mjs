import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const baseUrl=process.argv[2]??'http://localhost:3481',output=process.env.SMOKE_OUTPUT??'work/interaction-performance-smoke';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),scenarios=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.addInitScript(()=>{
 const metrics={commits:0,writes:[],longTasks:[]};window.__zwPerf=metrics;
 window.__zwObserveRoot=element=>{const key=Object.keys(element).find(key=>key.startsWith('__reactFiber$'));if(!key)throw new Error('Missing React host fiber');let fiber=element[key];while(fiber.return)fiber=fiber.return;const root=fiber.stateNode;if(!root?.current)throw new Error('Missing React root');let current=root.current;const sample=()=>{if(current!==root.current){metrics.commits++;current=root.current;}requestAnimationFrame(sample);};sample();};
 const write=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){metrics.writes.push({key,at:performance.now()});return write.call(this,key,value);};
 new PerformanceObserver(list=>{for(const entry of list.getEntries())metrics.longTasks.push({duration:entry.duration,start:entry.startTime});}).observe({type:'longtask',buffered:true});
});
const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
const snapshot=async()=>({browser:await page.evaluate(()=>structuredClone(window.__zwPerf)),metrics:(await cdp.send('Performance.getMetrics')).metrics});
const differences=(before,after)=>({commits:after.browser.commits-before.browser.commits,writes:after.browser.writes.slice(before.browser.writes.length),longTasks:after.browser.longTasks.slice(before.browser.longTasks.length),metrics:Object.fromEntries(after.metrics.filter(metric=>['LayoutCount','RecalcStyleCount','LayoutDuration','RecalcStyleDuration','TaskDuration','ScriptDuration'].includes(metric.name)).map(metric=>[metric.name,metric.value-(before.metrics.find(previous=>previous.name===metric.name)?.value??0)]))});
try{
 await page.goto(baseUrl,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>Object.keys(document.querySelector('button')??{}).some(key=>key.startsWith('__reactProps$')));await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Open window picker; Shift click minimizes windows'}).click();await page.getByRole('dialog',{name:'Windows',exact:true}).getByRole('button',{name:'Calculator',exact:true}).click();
 const calculator=page.getByRole('dialog',{name:'Calculator',exact:true}),bar=calculator.getByRole('button',{name:/^Move Calculator/});await bar.waitFor();await page.waitForTimeout(1000);
 await bar.evaluate(element=>window.__zwObserveRoot(element));const calibration=await page.evaluate(()=>window.__zwPerf.commits);await bar.focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(previous=>window.__zwPerf.commits>previous,calibration);await page.waitForTimeout(750);
 const box=await bar.boundingBox();assert(box);const x=box.x+box.width/2,y=box.y+box.height/2;
 await page.mouse.move(x,y);await page.mouse.down();await page.waitForTimeout(500);const start=await snapshot();
 for(let index=1;index<=40;index++){await page.mouse.move(x+index*2,y+Math.sin(index/5)*30);await page.waitForTimeout(75);}
 const held=await snapshot(),drag=differences(start,held);scenarios.push({name:'window-drag-held',cpuThrottle:4,durationMs:3000,...drag});assert.equal(drag.commits,0,'Window pointer moves must not cause React commits');assert.equal(drag.writes.length,0,'Window pointer moves must not write localStorage');
 await page.mouse.up();await page.waitForTimeout(750);const released=await snapshot();scenarios.push({name:'window-drag-release',...differences(held,released)});assert.equal(released.browser.writes.slice(held.browser.writes.length).filter(write=>write.key==='zw.windows').length,1,'Window geometry persists once after release');console.log('PASS three-second window drag: zero React commits/writes until release');
 await calculator.getByRole('button',{name:'Close Calculator',exact:true}).click();await page.locator('[role="dialog"][aria-label="Calculator"]').waitFor({state:'detached'});const picker=page.getByRole('dialog',{name:'Windows',exact:true});await picker.getByRole('button',{name:'Close Windows',exact:true}).click();await page.locator('[role="dialog"][aria-label="Windows"]').waitFor({state:'detached'});
 await page.setViewportSize({width:1440,height:300});await page.waitForTimeout(1000);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(300);const beforeScroll=await snapshot();
 for(let index=1;index<=30;index++){await page.evaluate(value=>window.scrollTo(0,value),index*12);await page.waitForTimeout(30);}
 const afterScroll=await snapshot(),scroll=differences(beforeScroll,afterScroll);scenarios.push({name:'navbar-scroll',cpuThrottle:4,...scroll});assert((await page.evaluate(()=>window.scrollY))>0,'Fixture must actually scroll');assert.equal(scroll.commits,0,'Navbar scrolling must not cause React commits');assert.equal(scroll.writes.length,0,'Navbar scrolling must not write preferences');console.log('PASS scrolling: zero React commits/preference writes');
 assert.deepEqual(errors,[]);await writeFile(`${output}/report.json`,JSON.stringify({baseUrl,measurement:'React root current alternation sampled every animation frame; discrete keyboard calibration required',scenarios,errors},null,2));
}catch(error){await writeFile(`${output}/report.json`,JSON.stringify({baseUrl,measurement:'React root current alternation sampled every animation frame; discrete keyboard calibration required',scenarios,errors,failure:String(error)},null,2));throw error;}finally{await browser.close();}
