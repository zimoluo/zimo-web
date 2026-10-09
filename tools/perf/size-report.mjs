import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {gzipSync,brotliCompressSync,constants} from 'node:zlib';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const baseUrl=process.argv[2]??'http://localhost:3481',output=process.env.SMOKE_OUTPUT??'work/size-smoke';await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})}),routes=[];
try{
 for(const route of ['/','/blog/on-gradients','/album','/design/theme-maker']){
  const page=await browser.newPage({reducedMotion:'reduce'}),assets=[],pending=[];
  page.on('response',response=>{if(response.request().resourceType()!=='script'||new URL(response.url()).origin!==new URL(baseUrl).origin)return;pending.push((async()=>{const bytes=await response.body();assets.push({path:new URL(response.url()).pathname,status:response.status(),raw:bytes.length,gzip:gzipSync(bytes,{level:9}).length,brotli:brotliCompressSync(bytes,{params:{[constants.BROTLI_PARAM_QUALITY]:11}}).length});})());});
  const navigation=await page.goto(`${baseUrl}${route}`,{waitUntil:'domcontentloaded'});assert.equal(navigation?.status(),200,'Report route must exist');await page.waitForFunction(()=>Object.keys(document.querySelector('button')??{}).some(key=>key.startsWith('__reactProps$')));await page.waitForTimeout(750);await Promise.all(pending);
  assert(assets.length>0,'Route must load measurable scripts');assert(assets.every(asset=>asset.status===200),'Script fetch must succeed');const unique=[...new Map(assets.map(asset=>[asset.path,asset])).values()];routes.push({route,title:await page.title(),scripts:unique.sort((a,b)=>b.raw-a.raw),total:unique.reduce((total,asset)=>({raw:total.raw+asset.raw,gzip:total.gzip+asset.gzip,brotli:total.brotli+asset.brotli}),{raw:0,gzip:0,brotli:0})});console.log(`PASS size report ${route}: ${routes.at(-1).total.brotli} bytes Brotli`);await page.close();
 }
 await writeFile(`${output}/report.json`,JSON.stringify({baseUrl,measurement:'Current scripts fetched during initial route hydration; raw and independently recompressed gzip/Brotli bytes. This report has no pre-migration baseline and makes no reduction claim.',production:process.env.NODE_ENV==='production',routes},null,2));
}finally{await browser.close();}
