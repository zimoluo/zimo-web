import {chromium} from 'playwright';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {sceneIds,sceneRegistry,getScene} from '../../src/features/backdrop/registry/index.ts';
import {getTheme,themeIds} from '../../src/features/theme/registry/index.ts';
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/scene-palette-smoke';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],executablePath:process.env.CHROME_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const report=[],errors=[];
try{
 for(const id of sceneIds.filter(id=>!process.env.SCENE_PROBE_IDS||process.env.SCENE_PROBE_IDS.split(',').includes(id))){const definition=sceneRegistry[id],themeId=themeIds.find(id=>getTheme(id).backdrop?.scenes.some(reference=>getScene(reference.id)?.id===definition.id));assert(themeId,`Missing ${id} source`);
  const authored=getTheme(themeId),scheme=authored.surfaceScheme??(authored.schemes.kind==='single'?authored.schemes.scheme:'light'),reference=authored.backdrop.scenes.find(reference=>getScene(reference.id)?.id===id);
  const source={...authored,id:'palette-fixture',name:'Palette fixture',appearance:undefined,backdrop:{scenes:[{...reference,id,only:undefined,params:{...reference.params,painting:true,fireworks:true}}]}};
  const context=await browser.newContext({viewport:{width:960,height:720},reducedMotion:definition.surface==='r3f'||id==='midnight'||id==='birthday-20'?'reduce':'no-preference'});
  await context.route('**/theme/palette-artwork/*.json',async route=>{const response=await route.fetch(),data=await response.json();for(const artwork of Object.values(data))if(artwork.kind==='vector')artwork.svg=artwork.svg.replace('</svg>',`<style>*{animation-play-state:paused!important;${id==='christmas'?'animation-delay:-.85s!important;':''}}</style></svg>`);await route.fulfill({response,json:data});});
  await context.addInitScript(({source,scheme})=>{let seed=0x5eed;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const stored=JSON.parse(sessionStorage.getItem('palette-probe-source')??'null')??source;localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active:{kind:'profile',index:0},scheme,schemePreference:scheme,profiles:[stored],seasonal:false,shuffle:false,byRoute:{home:{kind:'profile',index:0}}}}));},{source,scheme});
  const page=await context.newPage();page.on('pageerror',error=>errors.push({id,message:error.message}));
  const capture=async()=>{
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.documentElement.dataset.theme==='profile');
   if(definition.surface==='r3f')await page.locator('[data-webgl-host][data-live-renderer="true"] [data-frame="captured"]').waitFor({state:'attached'});
   else await page.waitForFunction(id=>{const node=document.querySelector(`[data-scene-id="${id}"]`);return node&&node.childElementCount>0&&!node.innerHTML.includes('staticField');},id);
   await page.addStyleTag({content:'body{visibility:hidden}.surface-page,[data-scope="viewport"]{visibility:visible}[data-scope="viewport"]{filter:none!important}*{animation-play-state:paused!important;transition:none!important}'});
   await page.waitForTimeout(1200);
   await page.evaluate(()=>{for(const animation of document.getAnimations()){animation.pause();animation.currentTime=2500;}});
   return page.screenshot();
  };
  const baseline=await capture(),steady=await capture();const firstPixels=await sharp(baseline).removeAlpha().raw().toBuffer(),steadyPixels=await sharp(steady).removeAlpha().raw().toBuffer();const drift=firstPixels.reduce((sum,value,index)=>sum+Math.abs(value-steadyPixels[index]),0)/firstPixels.length;assert(drift<.01,`${id}: unchanged artwork drifted by ${drift}`);await writeFile(`${output}/${id}-native.png`,baseline);const before=await sharp(baseline).removeAlpha().raw().toBuffer();
  for(const slot of Object.keys(definition.palette)){
   if(id==='planetoid'&&slot==='accent')continue;
   const changed=structuredClone(source);changed.backdrop.scenes[0].palette??={};changed.backdrop.scenes[0].palette[slot]={kind:'literal',value:'#ff126a'};
   await page.evaluate(source=>sessionStorage.setItem('palette-probe-source',JSON.stringify(source)),changed);
   const png=await capture(),after=await sharp(png).removeAlpha().raw().toBuffer();assert.equal(after.length,before.length);
   let difference=0,pixels=0;for(let index=0;index<after.length;index+=3){const delta=Math.abs(after[index]-before[index])+Math.abs(after[index+1]-before[index+1])+Math.abs(after[index+2]-before[index+2]);difference+=delta;if(delta>6)pixels++;}
   const mean=difference/after.length;report.push({id,slot,mean,pixels});await writeFile(`${output}/${id}-${slot}.png`,png);console.log(JSON.stringify(report.at(-1)));
   await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);const inactive=report.filter(result=>result.pixels<30||result.mean<.005);assert.deepEqual(inactive,[],'Advertised colors must change visible artwork');console.log(`PASS ${report.length} native scene color mutations`);
}finally{await writeFile(`${output}/errors.json`,JSON.stringify(errors,null,2));await browser.close();}
