import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE??'playwright');
const base=process.argv[2]??'http://localhost:3482',output=process.env.SMOKE_OUTPUT??'work/album-gallery-craft';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[],steps=[],captures=[];page.on('pageerror',error=>errors.push(error.message));
const frame=()=>page.locator('main [data-section=album] [data-positioned]').first();
const tiles=()=>frame().locator(':scope > button');
async function step(label,run){await run();steps.push(label);console.log(`PASS ${label}`);}
try{
 await page.goto(`${base}/album`,{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Show all photographs',exact:true}).click();await frame().waitFor();
 await tiles().first().scrollIntoViewIfNeeded();
 await step('authored pane hue filters survive themed SVG adaptation',async()=>{
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-scene-id=photos] img[data-palette-src]')].some(image=>image.src.startsWith('data:image/svg+xml')));
  const filters=await page.locator('[data-scene-id=photos] img[data-palette-src$="/filled.svg"]').evaluateAll(nodes=>nodes.map(image=>({css:getComputedStyle(image).filter,inline:image.style.filter})));
  assert(filters.length>=5);
  for(const angle of [12,16,20,24])assert(filters.some(filter=>filter.css===`hue-rotate(${angle}deg)`));
  assert(filters.every(filter=>filter.inline===''));
 });
 await step('gallery uses native widths, exact gaps, and original public-URL crop',async()=>{
  for(const width of [1440,910,768,767,390,320]){
   await page.setViewportSize({width,height:width>=768?1000:844});
   await page.waitForFunction(node=>{const root=node.closest('[data-positioned]'),size=Number.parseFloat(getComputedStyle(root).getPropertyValue('--album-column-size'));return Math.abs(node.getBoundingClientRect().width-Math.min(size,root.clientWidth))<.05;},await tiles().first().elementHandle());
   const geometry=await frame().evaluate(root=>({root:root.getBoundingClientRect().toJSON(),columns:Number(root.dataset.columns),size:Number.parseFloat(getComputedStyle(root).getPropertyValue('--album-column-size')),tiles:[...root.children].map(tile=>({rect:tile.getBoundingClientRect().toJSON(),label:tile.getAttribute('aria-label'),ratio:Number.parseFloat(getComputedStyle(tile).aspectRatio),loaded:tile.querySelector('img')?.complete}))}));
   assert.equal(geometry.size,width>=768?288:168);
   assert(geometry.tiles.every(tile=>Math.abs(tile.rect.width-Math.min(geometry.size,geometry.root.width))<1&&tile.rect.x>=geometry.root.x-1&&tile.rect.right<=geometry.root.right+1));
   const first=geometry.tiles[0],next=geometry.tiles[geometry.columns];
   if(next)assert(Math.abs(next.rect.top-first.rect.bottom-8)<.05);
   assert(Math.abs(first.ratio-.7311101443483494)<.00001);
   assert(geometry.root.bottom>=Math.max(...geometry.tiles.map(tile=>tile.rect.bottom))-1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await tiles().first().scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/gallery-${width}.png`});captures.push({width,geometry});
  }
 });
 await step('resizing preserves the actual focused tile and lightbox return target',async()=>{
  await page.setViewportSize({width:1440,height:1000});await tiles().nth(2).focus();
  await tiles().nth(2).evaluate(node=>{window.__galleryTile=node;});
  for(const width of [390,910,767,1440]){
   await page.setViewportSize({width,height:width>=768?1000:844});
   await page.waitForFunction(()=>window.__galleryTile?.isConnected&&document.activeElement===window.__galleryTile);
   assert.equal(await page.evaluate(()=>document.activeElement===window.__galleryTile),true);
  }
  await tiles().nth(2).click();const lightbox=page.locator('dialog[data-kind=lightbox]');await lightbox.waitFor();
  await page.setViewportSize({width:390,height:844});await page.keyboard.press('Escape');await lightbox.waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>document.activeElement===window.__galleryTile&&window.__galleryTile.isConnected),true);
 });
 await step('gallery labels, filters, mode preference, and captions remain coherent',async()=>{
  assert.notEqual(await tiles().first().getAttribute('aria-label'),await tiles().nth(1).getAttribute('aria-label'));
  const search=page.getByRole('searchbox',{name:'Search Album',exact:true});await search.fill('gallery-no-match');await page.getByRole('status').filter({hasText:'No entries match'}).waitFor();
  await page.getByRole('button',{name:'Clear Album search',exact:true}).click();assert.equal(await search.evaluate(node=>document.activeElement===node),true);
  assert.equal(await page.getByRole('button',{name:'Show all photographs',exact:true}).getAttribute('aria-pressed'),'true');
  const caption=frame().locator('[class*=photoCaption]').first();if(await caption.count()){
   await caption.locator('..').hover();const paint=await caption.evaluate(node=>({color:getComputedStyle(node).color,background:getComputedStyle(node).backgroundColor,spacing:getComputedStyle(node).letterSpacing}));
   assert.equal(paint.color,'rgba(250, 250, 250, 0.9)');assert.equal(paint.background,'rgba(38, 38, 38, 0.5)');assert.equal(paint.spacing,'0.3px');
  }
  await page.reload({waitUntil:'domcontentloaded'});await tiles().first().waitFor();assert.equal(await page.getByRole('button',{name:'Show all photographs',exact:true}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Show album entries',exact:true}).click();await frame().locator(':scope > a').first().waitFor();
  const cover=frame().locator(':scope > a').first();await cover.hover();
  await page.waitForFunction(node=>getComputedStyle(node.querySelector('[class*=photoShade]')).opacity==='0.9',await cover.elementHandle());
  const overlay=await cover.evaluate(node=>({shade:getComputedStyle(node.querySelector('[class*=photoShade]')).backgroundColor,paint:getComputedStyle(node.querySelector('[class*=photoHover]')).backgroundColor,color:getComputedStyle(node.querySelector('[class*=photoHover]')).color}));
  assert.deepEqual(overlay,{shade:'rgba(0, 0, 0, 0.6)',paint:'rgba(0, 0, 0, 0)',color:'rgb(245, 245, 245)'});
  await page.screenshot({path:`${output}/entries-390.png`});
 });
 assert.deepEqual(errors,[]);await writeFile(`${output}/report.json`,JSON.stringify({base,steps,captures,errors},null,2));
}catch(error){await page.screenshot({path:`${output}/failure.png`}).catch(()=>{});await writeFile(`${output}/report.json`,JSON.stringify({base,steps,captures,errors,failure:String(error)},null,2));throw error;}finally{await browser.close();}
