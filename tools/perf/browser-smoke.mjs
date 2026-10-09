import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

// Run against a local preview: node tools/perf/browser-smoke.mjs http://localhost:3481.
// PLAYWRIGHT_MODULE may point to an existing Playwright installation; no install is performed.
const require = createRequire(import.meta.url);
const playwright = process.env.PLAYWRIGHT_MODULE ? require(process.env.PLAYWRIGHT_MODULE) : require("playwright");
const baseUrl = process.argv[2] ?? "http://localhost:3481";
const output = process.env.SMOKE_OUTPUT ?? "work/browser-smoke";
await mkdir(output, { recursive: true });
const browser = await playwright.chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE ? {executablePath:process.env.CHROME_EXECUTABLE} : {})});
const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
const page = await context.newPage();
const errors=[];const steps=[];const warnings=[];
page.on("pageerror",(error)=>errors.push(error.message));
page.on("console",(message)=>{if(message.type()==="warning")warnings.push(message.text());});
async function step(name,run){await run();steps.push(name);console.log(`PASS ${name}`);}
try {
  await page.goto(baseUrl,{waitUntil:"domcontentloaded"});
  await page.waitForTimeout(800);
  await step("home renders",async()=>{await page.getByRole("button",{name:"Open window picker; Shift click minimizes windows"}).waitFor();});
  await step("picker opens calculator",async()=>{
    await page.getByRole("button",{name:"Open window picker; Shift click minimizes windows"}).click();
    await page.getByRole("dialog",{name:"Windows",exact:true}).getByRole("button",{name:"Calculator",exact:true}).click();
    await page.getByRole("dialog",{name:"Calculator",exact:true}).waitFor();
  });
  await step("window drag and keyboard movement",async()=>{
    const calculator=page.getByRole("dialog",{name:"Calculator",exact:true});const bar=calculator.getByRole("button",{name:/^Move Calculator/});
    const before=await calculator.boundingBox();const box=await bar.boundingBox();assert(before&&box);
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+80,box.y+box.height/2+50,{steps:8});await page.mouse.up();
    const after=await calculator.boundingBox();assert(after&&after.x>before.x+50&&after.y>before.y+20);
    await bar.focus();await page.keyboard.press("Shift+ArrowRight");const shifted=await calculator.boundingBox();assert(shifted&&Math.abs(shifted.x-after.x-10)<2);
  });
  await step("minimize and restore",async()=>{
    const button=page.getByRole("button",{name:"Open window picker; Shift click minimizes windows"});await button.click({modifiers:["Shift"]});
    assert.equal(await page.locator('[role="dialog"][data-minimized]').count(),2);await button.click();assert.equal(await page.locator('[role="dialog"][data-minimized]').count(),0);
  });
  await step("window state survives refresh",async()=>{
    await page.waitForTimeout(650);await page.reload({waitUntil:"domcontentloaded"});await page.getByRole("dialog",{name:"Calculator",exact:true}).waitFor();
    await page.getByRole("dialog",{name:"Calculator",exact:true}).getByRole("button",{name:"Close Calculator",exact:true}).click();
    await page.getByRole("dialog",{name:"Windows",exact:true}).getByRole("button",{name:"Close Windows",exact:true}).click();
  });
  await step("album overlay focus and native image carousel",async()=>{
    await page.goto(`${baseUrl}/album`,{waitUntil:"domcontentloaded"});
    const search=page.getByRole("searchbox",{name:"Search Album",exact:true});
    await search.fill("smoke-no-matching-entry");await page.getByRole("status").filter({hasText:"No entries match"}).waitFor();await search.fill("");
    const link=page.locator('a[href^="/album/"]').first();await link.waitFor();await link.click();
    const dialog=page.locator('dialog[data-kind="album-entry"]');await dialog.waitFor();
    await dialog.locator('[aria-roledescription="carousel"]').first().waitFor();
    assert.equal(await dialog.evaluate((element)=>element.contains(document.activeElement)),true);
    await page.keyboard.press("Tab");assert.equal(await dialog.evaluate((element)=>element.contains(document.activeElement)),true);
    await dialog.getByRole("button",{name:"Expand",exact:true}).click();
    const lightbox=page.locator('dialog[data-kind="lightbox"]');await lightbox.waitFor();
    await lightbox.getByRole("link",{name:"Original",exact:true}).waitFor();
    await page.keyboard.press("Escape");await lightbox.waitFor({state:"detached"});
    await page.waitForFunction(()=>document.activeElement?.closest('dialog')?.dataset.kind==="album-entry");
    await page.keyboard.press("Escape");await dialog.waitFor({state:"detached"});
    await page.waitForFunction((element)=>document.activeElement===element,await link.elementHandle());
  });
  await step("notebook edits persist",async()=>{
    await page.goto(`${baseUrl}/notebook`,{waitUntil:"domcontentloaded"});await page.getByRole("button",{name:"New page",exact:true}).click();
    await page.getByRole("textbox",{name:"Page text",exact:true}).fill("Browser regression note");await page.waitForTimeout(650);await page.reload({waitUntil:"domcontentloaded"});
    assert.equal(await page.getByRole("textbox",{name:"Page text",exact:true}).inputValue(),"Browser regression note");
  });
  await page.screenshot({path:`${output}/desktop.png`,fullPage:true});
  await step("mobile menu focus and Escape",async()=>{
    await page.setViewportSize({width:390,height:844});await page.goto(baseUrl,{waitUntil:"domcontentloaded"});await page.getByRole("button",{name:"Open menu",exact:true}).click();
    const menu=page.getByRole("dialog",{name:"Site menu",exact:true});await menu.waitFor();assert.equal(await menu.evaluate((element)=>element.contains(document.activeElement)),true);
    await page.keyboard.press("Escape");await menu.waitFor({state:"hidden"});
  });
  assert.deepEqual(errors,[],`Browser errors: ${errors.join("; ")}`);
  await page.screenshot({path:`${output}/final.png`,fullPage:true});
  await writeFile(`${output}/report.json`,JSON.stringify({baseUrl,steps,errors,warnings},null,2));
} catch(error) {
  await page.screenshot({path:`${output}/failure.png`,fullPage:true}).catch(()=>{});
  await writeFile(`${output}/report.json`,JSON.stringify({baseUrl,steps,errors,warnings,active:await page.evaluate(()=>document.activeElement?.outerHTML.slice(0,600)).catch(()=>null),url:page.url(),failure:String(error)},null,2));
  throw error;
} finally {await browser.close();}
