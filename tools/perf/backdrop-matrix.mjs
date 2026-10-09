import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { getTheme } from '../../src/features/theme/registry/index.ts';
import { sceneIds, sceneRegistry } from '../../src/features/backdrop/registry/index.ts';
import { schemesOf } from '../../src/features/theme/model/resolve.ts';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const sharp=require('sharp');
const baseUrl=process.argv[2]??'http://localhost:3481';
const output=process.env.SMOKE_OUTPUT??'work/backdrop-matrix';
const themes=['home','velvet','whiteout','grass','crimson','midnight'];
const selected=process.env.SCENE_IDS?process.env.SCENE_IDS.split(','):sceneIds;
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const rows=[];const thumbnails=[];
try {
 for(let sceneIndex=0;sceneIndex<selected.length;sceneIndex++){
  const id=selected[sceneIndex];
  for(let themeIndex=0;themeIndex<themes.length;themeIndex++){
   const themeId=themes[themeIndex];const original=getTheme(themeId);const source={...original,id:`diagnostic-${themeId}-${id}`,name:`${themeId} / ${id}`,backdrop:{scenes:[{id}]}};
   const scheme=schemesOf(source)[0]??'light';
   const context=await browser.newContext({viewport:{width:640,height:480},reducedMotion:'reduce'});
   await context.addInitScript(({source,scheme})=>{
    const active={kind:'profile',index:0};
    localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active,scheme,schemePreference:scheme,profiles:[source],seasonal:false,shuffle:false,byRoute:{home:active}}}));
   },{source,scheme});
   const page=await context.newPage();const errors=[],warnings=[],failedAssets=[];
   page.on('pageerror',error=>errors.push(error.message));page.on('console',msg=>{if(msg.type()==='warning'||msg.type()==='error')warnings.push(msg.text());});
   page.on('response',res=>{if(res.status()>=400&&res.url().includes('/theme/'))failedAssets.push({url:res.url(),status:res.status()});});
   let failure;
   try {
    await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
    await page.locator(`[data-scene-id="${id}"]`).first().waitFor({timeout:15000});
    await page.addStyleTag({content:'body * {visibility:hidden!important} [data-scope="viewport"],[data-scope="viewport"] * {visibility:visible!important}'});
    await page.waitForTimeout(sceneRegistry[id]?.surface==='r3f'?1600:500);
    const diagnostics=await page.evaluate(()=>({canvases:document.querySelectorAll('canvas').length,hosts:[...document.querySelectorAll('[data-scene-id]')].map(el=>({id:el.dataset.sceneId,quality:el.dataset.quality,rect:el.getBoundingClientRect().toJSON()})),images:[...document.images].filter(img=>img.src.includes('/theme/')).map(img=>({src:img.src,complete:img.complete,width:img.naturalWidth}))}));
    const screenshot=await page.screenshot({path:`${output}/${id}-${themeId}.png`});
    thumbnails.push({input:await sharp(screenshot).resize(160,120).png().toBuffer(),left:themeIndex*160,top:sceneIndex*120});
    rows.push({scene:id,theme:themeId,...diagnostics,errors,warnings,failedAssets});
   }catch(error){failure=String(error);rows.push({scene:id,theme:themeId,errors,warnings,failedAssets,failure});await page.screenshot({path:`${output}/${id}-${themeId}-failure.png`}).catch(()=>{});}
   await context.close();console.log(`${failure?'FAIL':'CAPTURE'} ${id} / ${themeId}`);
  }
 }
 if(thumbnails.length)await sharp({create:{width:960,height:selected.length*120,channels:4,background:'#fff'}}).composite(thumbnails).png().toFile(`${output}/matrix.png`);
 const report={baseUrl,themes,scenes:selected,rows,total:rows.length,failed:rows.filter(row=>row.failure||row.errors.length||row.failedAssets.length).length};
 await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));console.log(`Matrix: ${report.total} cases, ${report.failed} runtime/asset failures. Screenshots are diagnostics, not A/B fidelity acceptance.`);
} finally {await browser.close();}
