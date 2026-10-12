import {chromium} from 'playwright';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {getTheme} from '../../src/features/theme/registry/index.ts';
import {resolve} from '../../src/features/theme/model/resolve.ts';
import {formatOklch} from '../../src/features/theme/color/index.ts';
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/scene-live-palette';await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],executablePath:process.env.CHROME_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),results=[],errors=[];
try{
 for(const [themeId,id,slots] of [['birthday20','birthday-20',['mid','highlight','veil']],['planetoid','planetoid',['accent']]]){
  const source=structuredClone(getTheme(themeId)),scheme=source.surfaceScheme;source.appearance=undefined;source.id='live-palette';source.name='Live palette';source.backdrop.scenes[0].id=id;delete source.backdrop.scenes[0].only;
  const context=await browser.newContext({viewport:{width:960,height:720},reducedMotion:'no-preference'});await context.addInitScript(({source,scheme})=>{let seed=0x5eed;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const profile=JSON.parse(sessionStorage.getItem('live-source')??'null')??source;const active={kind:'profile',index:0};localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active,scheme,schemePreference:scheme,profiles:[profile],seasonal:false,shuffle:false,byRoute:{home:active}}}));},{source,scheme});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  const capture=async()=>{
   await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.dataset.theme==='profile');
   if(id==='birthday-20'){
    const image=page.locator('[data-scene-id="birthday-20"] img[data-palette-src$="/big.svg"]');await image.waitFor({state:'attached'});await page.waitForFunction(node=>node.src.startsWith('data:image/svg+xml'),await image.elementHandle());
    await image.evaluate(node=>node.decode());const png=await image.evaluate(node=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;canvas.getContext('2d').drawImage(node,0,0,256,256);return canvas.toDataURL('image/png');});return Buffer.from(png.split(',')[1],'base64');
   }
   await page.locator('[data-webgl-host] canvas').waitFor();await page.addStyleTag({content:'body{visibility:hidden}.surface-page,[data-scope="viewport"]{visibility:visible}[data-scope="viewport"]{filter:none!important}[data-webgl-host]{animation:none!important;opacity:1!important;filter:none!important}*{animation-play-state:paused!important;transition:none!important}'});await page.waitForTimeout(1600);return page.screenshot();
  };
  const before=await capture();await writeFile(`${output}/${id}-native.png`,before);
  for(const slot of slots){const next=structuredClone(source);next.backdrop.scenes[0].palette??={};const nativePaint=resolve(source,scheme).backdrop.scenes[0].palette[slot];next.backdrop.scenes[0].palette[slot]={kind:'literal',value:id==='planetoid'?formatOklch({...nativePaint,h:10}):'#ff126a'};await page.evaluate(source=>sessionStorage.setItem('live-source',JSON.stringify(source)),next);const png=await capture();await writeFile(`${output}/${id}-${slot}.png`,png);
   const first=await sharp(before).ensureAlpha().raw().toBuffer(),changed=await sharp(png).ensureAlpha().raw().toBuffer();
   if(id==='birthday-20'){const difference=first.reduce((sum,value,index)=>sum+Math.abs(value-changed[index]),0)/first.length;let alphaDifference=0;for(let index=3;index<first.length;index+=4)alphaDifference+=Math.abs(first[index]-changed[index]);alphaDifference/=first.length/4;assert(alphaDifference<.01,`Color edits must preserve glyph coverage: ${alphaDifference}`);assert(difference>.01,`${id}/${slot} must change the moving glyph's intrinsic paint`);results.push({id,slot,intrinsicDifference:difference,alphaDifference});}
   else{const pinkCount=data=>{let count=0;for(let index=0;index<data.length;index+=4)if(data[index]>12&&data[index+1]<data[index]*.65&&data[index+2]>data[index+1]*1.05)count++;return count;};const native=pinkCount(first),edited=pinkCount(changed);assert(edited>native+30,`Asteroid paint must introduce pink pixels: ${native} -> ${edited}`);results.push({id,slot,nativePinkPixels:native,editedPinkPixels:edited});}
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(`${output}/report.json`,JSON.stringify({results,errors},null,2));console.log(JSON.stringify({pass:true,results}));
}finally{await browser.close();}
