import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const axe=require('axe-core');
const baseUrl=process.argv[2]??'http://localhost:3481',output=process.env.SMOKE_OUTPUT??'work/accessibility-smoke';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const results=[];
async function scan(name){await page.addScriptTag({content:axe.source});const result=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));results.push({name,url:page.url(),violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>v.id)});console.log(`${result.violations.length===0?'PASS':'FAIL'} axe ${name}: ${result.violations.length} violations`);}
try{
 for(const route of ['/','/blog','/blog/on-gradients','/album','/projects','/management','/about','/design','/design/theme-maker','/notebook','/christmas-tree']){await page.goto(`${baseUrl}${route}`,{waitUntil:'domcontentloaded'});await page.waitForTimeout(700);await scan(route);}
 await page.goto(`${baseUrl}/album`,{waitUntil:'domcontentloaded'});const search=page.getByRole('searchbox',{name:'Search Album',exact:true});await search.fill('axe-no-matching-entry');await page.getByRole('status').filter({hasText:'No entries match'}).waitFor();await search.fill('');await page.locator('a[href="/album/kyoto-in-spring"]').click();const modal=page.locator('dialog[data-kind="album-entry"]');await modal.locator('[aria-roledescription="carousel"]').waitFor();await scan('album entry modal');await page.keyboard.press('Escape');await modal.waitFor({state:'detached'});
 await page.goto(baseUrl,{waitUntil:'domcontentloaded'});await page.waitForTimeout(400);await page.keyboard.press('Control+k');await page.getByRole('dialog',{name:'Command palette',exact:true}).waitFor();await scan('command palette');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Open window picker; Shift click minimizes windows'}).click();await page.getByRole('dialog',{name:'Windows',exact:true}).getByRole('button',{name:'Calculator',exact:true}).click();await page.getByRole('dialog',{name:'Calculator',exact:true}).waitFor();await scan('window calculator');
 await page.setViewportSize({width:390,height:844});await page.goto(baseUrl,{waitUntil:'domcontentloaded'});await page.waitForTimeout(400);await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('dialog',{name:'Site menu',exact:true}).waitFor();await scan('mobile menu');
 await writeFile(`${output}/report.json`,JSON.stringify(results,null,2));assert.equal(results.reduce((count,result)=>count+result.violations.length,0),0,'Accessibility violations: see report.json');
}finally{await writeFile(`${output}/report.json`,JSON.stringify(results,null,2));await browser.close();}
