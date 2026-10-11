import {readdir,readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {getTheme,themeIds} from "../src/features/theme/registry";
import {resolve,schemesOf} from "../src/features/theme/model/resolve";
import {parseColorLiteral,parseColorLiteralAlpha,deltaEOk} from "../src/features/theme/color";
import type {Oklch} from "../src/features/theme/color";
const root="public/theme/animated-background",output="public/theme/palette-artwork";
const excluded=new Set(["birthday","birthday19","birthday20","blog","photos","projects","gallery3D","whiteout"]);
const check=process.argv.includes("--check");
const round=(value:number)=>Math.round(value*1e6)/1e6;
await mkdir(output,{recursive:true});
for(const folder of (await readdir(root,{withFileTypes:true})).filter(entry=>entry.isDirectory()&&!excluded.has(entry.name))){
 const id=themeIds.find(id=>id===folder.name);if(!id)throw new Error(`Unknown artwork theme ${folder.name}`);
 const source=getTheme(id);const theme=resolve(source,source.surfaceScheme??schemesOf(source)[0]??"light");
 const palette=theme.backdrop?.scenes[0]?.palette??{};const assets:Record<string,unknown>={};
 const visit=async(directory:string):Promise<void>=>{
  for(const entry of await readdir(directory,{withFileTypes:true})){
   const file=path.join(directory,entry.name);if(entry.isDirectory()){await visit(file);continue;}
   if(!entry.name.endsWith(".svg")&&!entry.name.endsWith(".png"))continue;
   const url=`/${file.slice("public/".length)}`;
   if(entry.name.endsWith(".png")){assets[url]={kind:"raster",reference:palette.mid};continue;}
   const paints:Array<{color:Oklch;key:string;reference:Oklch;alpha:number}> = [];
   const text=await readFile(file,"utf8");
   const svg=text.replace(/((?:fill|stroke|stop-color|flood-color|color)(?:\s*=\s*["']|\s*:\s*))([^;"'}]+)(?=[;"'}])/g,(match:string,prefix:string,value:string)=>{
    let color:Oklch;try{color=parseColorLiteral(value.trim());}catch{return match;}
    const candidates=Object.entries(palette);if(candidates.length===0)return match;
    const closest=candidates.reduce((best,item)=>deltaEOk(color,item[1])<deltaEOk(color,best[1])?item:best);
    const index=paints.length;paints.push({color:{l:round(color.l),c:round(color.c),h:round(color.h)},key:closest[0],reference:closest[1],alpha:parseColorLiteralAlpha(value.trim())});return `${prefix}{{${index}}}`;
   });
   assets[url]={kind:"vector",svg,paints};
  }
 };
 await visit(path.join(root,folder.name));
 const destination=`${output}/${folder.name}.json`,text=`${JSON.stringify(assets)}\n`;
 if(check){if(await readFile(destination,"utf8").catch(()=>"")!==text)throw new Error(`Stale palette artwork ${folder.name}`);}
 else await writeFile(destination,text);
 console.log(`${folder.name}: ${Object.keys(assets).length} painted assets`);
}
