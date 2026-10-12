import {chromium} from 'playwright';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {getTheme,themeIds} from '../../src/features/theme/registry/index.ts';
import {resolve} from '../../src/features/theme/model/resolve.ts';
import {compile} from '../../src/features/theme/compile/compile.ts';
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/theme-gradient-smoke';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[],errors=[];
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage(),fixture=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  for(const id of themeIds){const source=getTheme(id);if(source.schemes.kind!=='dual'||!source.surfaces?.page)continue;
   for(const scheme of ['light','dark']){
    const properties=[...compile(resolve(source,scheme))],css=properties.map(([key,value])=>`${key}:${value}`).join(';');
    await fixture.setContent(`<style>body{margin:0;${css};background-color:var(--zw-role-panel);background-image:var(--zw-surface-page-image);background-size:cover;background-position:center;height:100vh}</style>`);
    const image=await fixture.evaluate(()=>getComputedStyle(document.body).backgroundImage);
    assert.notEqual(image,'none',`${id}/${scheme}: invalid page gradient`);
    const png=await fixture.screenshot(),stats=await sharp(png).stats(),spread=stats.channels.slice(0,3).map(channel=>channel.stdev);
    if(id==='penumbra'&&scheme==='light')assert(spread.reduce((sum,value)=>sum+value,0)/3>5,'Penumbra rings must remain visible');
    if(id==='vitreous'&&scheme==='light')assert(Math.max(...spread)>15,'Vitreous must retain its cyan/violet separation');
    results.push({id,scheme,viewport,spread});
    if(!['penumbra','vitreous'].includes(id))continue;
    await writeFile(`${output}/${id}-${scheme}-${viewport.width}-artwork.png`,png);
    await page.evaluate(({id,scheme})=>localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active:{kind:'builtIn',id},scheme,schemePreference:scheme,profiles:[],seasonal:false,shuffle:false,byRoute:{home:{kind:'builtIn',id}}}})),{id,scheme});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(({id,scheme})=>document.documentElement.dataset.theme===id&&document.documentElement.dataset.scheme===scheme,{id,scheme});
    const paint=await page.locator('.surface-page').evaluate(node=>({image:getComputedStyle(node).backgroundImage,color:getComputedStyle(node).backgroundColor}));
    await fixture.evaluate(paint=>{document.body.style.backgroundImage=paint.image;document.body.style.backgroundColor=paint.color;},paint);
    const published=await fixture.screenshot(),expectedPixels=await sharp(png).removeAlpha().raw().toBuffer(),publishedPixels=await sharp(published).removeAlpha().raw().toBuffer();
    assert.equal(publishedPixels.length,expectedPixels.length);
    const difference=publishedPixels.reduce((sum,value,index)=>sum+Math.abs(value-expectedPixels[index]),0)/publishedPixels.length;
    assert(difference<1,`${id}/${scheme}: published artwork differs from resolved paint by ${difference}`);
    results.at(-1).publishedPixelDifference=difference;
    await page.evaluate(()=>document.fonts.ready);
    assert.notEqual(await page.locator('.surface-page').evaluate(node=>getComputedStyle(node).backgroundImage),'none');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:`${output}/${id}-${scheme}-${viewport.width}-site.png`});
   }
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(`${output}/report.json`,JSON.stringify(results,null,2));console.log(`PASS ${results.length} browser-rendered artwork cases and eight production page captures`);
}finally{await browser.close();}
