import {chromium} from 'playwright';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {getTheme} from '../../src/features/theme/registry/index.ts';
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/page-material-smoke';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),results=[],errors=[];
const layer=(id,color,alpha)=>({id,kind:'linear',alpha,direction:{kind:'angle',deg:0},stops:[{at:0,color:{kind:'literal',value:color}},{at:100,color:{kind:'literal',value:color}}]});
try{
 for(const alpha of [0,.25,1]){
  const source=structuredClone(getTheme('whiteout'));source.id='page-material';source.name='Page material';source.appearance=undefined;source.backdrop=undefined;source.surfaces.page={alpha,layers:[layer('scaled','#0000ff','scaled'),layer('fixed','#ff0000','fixed')]};
  const context=await browser.newContext({viewport:{width:1000,height:800},reducedMotion:'reduce'});await context.addInitScript(source=>{const active={kind:'profile',index:0};localStorage.setItem('zw.theme',JSON.stringify({version:1,state:{revision:0,active,scheme:'light',schemePreference:'light',profiles:[source],seasonal:false,shuffle:false,byRoute:{home:active,themeMaker:active}}}));},source);
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.dataset.theme==='profile');
  const paint=await page.locator('.surface-page[aria-hidden="true"]').evaluate(node=>({base:getComputedStyle(node).backgroundImage,image:getComputedStyle(node,'::before').backgroundImage,alpha:getComputedStyle(node,'::before').opacity}));assert.notEqual(paint.base,'none');assert.notEqual(paint.image,'none');assert.equal(Number(paint.alpha),alpha);
  await page.addStyleTag({content:'body{visibility:hidden}.surface-page{visibility:visible}'});const png=await page.screenshot(),pixel=await sharp(png).extract({left:500,top:400,width:1,height:1}).removeAlpha().raw().toBuffer();
  const expected=[255*(1-alpha),0,255*alpha];assert([...pixel].every((value,index)=>Math.abs(value-expected[index])<=2),`Page alpha ${alpha}: ${[...pixel]} versus ${expected}`);await writeFile(`${output}/page-${alpha}.png`,png);
  await page.goto(base+'/design/theme-maker',{waitUntil:'domcontentloaded'});await page.getByRole('textbox',{name:'Theme name',exact:true}).waitFor();await page.waitForFunction(input=>input.value==='Page material',await page.getByRole('textbox',{name:'Theme name',exact:true}).elementHandle());
  const preview=await page.getByLabel('Theme preview',{exact:true}).evaluate(node=>({base:getComputedStyle(node).backgroundImage,image:getComputedStyle(node,'::before').backgroundImage,alpha:getComputedStyle(node,'::before').opacity}));assert.notEqual(preview.base,'none');assert.notEqual(preview.image,'none');assert.equal(Number(preview.alpha),alpha);
  const label=page.getByRole('slider',{name:'Intensity · 60%',exact:true});
  const lightLabel=await label.evaluate(node=>getComputedStyle(node.closest('label')).color);
  const lightShadow=await page.getByLabel('Theme preview',{exact:true}).evaluate(node=>getComputedStyle(node).getPropertyValue('--zw-shadow-lg'));
  await page.getByRole('combobox',{name:'Preview scheme',exact:true}).selectOption('dark');
  await page.waitForFunction(({lightLabel})=>getComputedStyle(document.querySelector('[aria-label="Theme preview"] input[type="range"]').closest('label')).color!==lightLabel,{lightLabel});
  const darkLabel=await label.evaluate(node=>getComputedStyle(node.closest('label')).color);
  const darkShadow=await page.getByLabel('Theme preview',{exact:true}).evaluate(node=>getComputedStyle(node).getPropertyValue('--zw-shadow-lg'));
  assert.notEqual(darkLabel,lightLabel);assert.notEqual(darkShadow,lightShadow);
  await page.screenshot({path:`${output}/studio-${alpha}.png`});results.push({alpha,pixel:[...pixel],paint,preview,lightLabel,darkLabel,lightShadow,darkShadow});await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(`${output}/report.json`,JSON.stringify({results,errors},null,2));console.log('PASS fixed page paint, scaled opacity, composited pixels, and matching contained Studio material');
}finally{await browser.close();}
