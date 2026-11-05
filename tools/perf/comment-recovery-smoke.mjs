import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/comment-recovery';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];let requests=0;
page.on('pageerror',error=>errors.push(error.message));
try{
 await page.route('**/*',async route=>{const request=route.request();if(request.method()==='POST'&&request.headers()['next-action']&&request.postData()==='["home","home"]'&&++requests===1)await route.fulfill({status:503,body:'Unavailable'});else await route.continue();});
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.getByRole('alert').filter({hasText:'Could not load comments.'}).waitFor();
 const retry=page.getByRole('button',{name:'Retry comments',exact:true});assert((await retry.boundingBox()).height>=44);await retry.scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/error.png`});
 await retry.click();await page.getByRole('region',{name:'Comments',exact:true}).waitFor();await page.getByRole('button',{name:'Sign in to comment',exact:true}).waitFor();assert.equal(await retry.count(),0);assert(requests>=3);assert.deepEqual(errors,[]);
 await page.screenshot({path:`${output}/recovered.png`});await writeFile(`${output}/report.json`,JSON.stringify({pass:true,requests,errors},null,2));console.log('PASS comment read failure, accessible Retry, and recovered signed-out composer; no content writes');
}catch(error){await writeFile(`${output}/report.json`,JSON.stringify({pass:false,requests,errors,error:String(error)},null,2));throw error;}finally{await browser.close();}
