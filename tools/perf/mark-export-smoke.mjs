import { createRequire } from 'node:module';
import { writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { exportBackdropMarkSvg, rasterizeMarkSvg } from '../../src/features/backdrop/mark/export-backdrop.ts';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const sharp=require('sharp');
const output=process.env.SMOKE_OUTPUT??'work/mark-export-smoke';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
try {
 const page=await browser.newPage();
 await page.goto('about:blank');
 await page.addScriptTag({content:`window.rasterizeMarkSvg=${rasterizeMarkSvg.toString()}`});
 const svg=exportBackdropMarkSvg({image:'conic-gradient(from 40deg, #f43f5e, #8b5cf6, #14b8a6, #f43f5e), repeating-radial-gradient(circle, #fff8 0% 10%, #0000 10% 20%)',base:'linear-gradient(#fff,#fff)',stroke:'#1e293b'});
 const result=await page.evaluate(async svg=>{
  const before=document.querySelectorAll('canvas').length;
  const blob=await window.rasterizeMarkSvg(svg,256);
  const data=await blob.arrayBuffer();
  return {bytes:[...new Uint8Array(data)],type:blob.type,before,after:document.querySelectorAll('canvas').length};
 },svg);
 assert.equal(result.type,'image/png');assert.equal(result.before,result.after);assert(result.bytes.length>500);
 const pixels=await sharp(Buffer.from(result.bytes)).ensureAlpha().raw().toBuffer();const sample=[...pixels.subarray((60*256+128)*4,(60*256+128)*4+4)];assert(sample[3]>200,'Backdrop interior is painted');assert(Math.max(...sample.slice(0,3))-Math.min(...sample.slice(0,3))>10,'Backdrop retains its colored gradients');
 await writeFile(`${output}/mark.svg`,svg);await writeFile(`${output}/mark.png`,Buffer.from(result.bytes));
 await writeFile(`${output}/report.json`,JSON.stringify({type:result.type,bytes:result.bytes.length,canvasBefore:result.before,canvasAfter:result.after,interiorPixel:sample},null,2));
 console.log(`PASS CSS conic/multilayer SVG raster export: ${result.bytes.length} PNG bytes, no mounted canvas`);
} finally {await browser.close();}
