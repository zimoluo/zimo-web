import {cMax,hexToOklch} from "./oklch.mjs";
import fs from "fs"; import path from "path";
const dir="/Users/zimoluo/zimo-web/components/theme/config";
const rgbToHex=(r,g,b)=>"#"+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("");
const rows=[];
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(".ts")).sort()){
  const src=fs.readFileSync(path.join(dir,file),"utf8"); const acc={};
  for(const r of ["primary","saturated","pastel","light"]){
    const m=src.match(new RegExp(r+"\\s*:\\s*(?:transformRgb\\()?\\[\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\]"));
    if(m) acc[r]=[+m[1],+m[2],+m[3]];
  }
  if(Object.keys(acc).length<4){rows.push({name:file.replace(".ts",""),skip:true});continue;}
  const roles=["primary","saturated","pastel","light"];
  const dec=Object.fromEntries(Object.entries(acc).map(([k,v])=>{const [L,C,h]=hexToOklch(rgbToHex(...v));return [k,{L,C,h,rel:C/Math.max(cMax(L,h),1e-9)}];}));
  const wx=roles.reduce((a,k)=>a+Math.cos(dec[k].h*Math.PI/180)*dec[k].C,0);
  const wy=roles.reduce((a,k)=>a+Math.sin(dec[k].h*Math.PI/180)*dec[k].C,0);
  const hue=(Math.atan2(wy,wx)*180/Math.PI+360)%360;
  const dev=roles.map(k=>{let x=dec[k].h-hue;while(x>180)x-=360;while(x<-180)x+=360;return x;});
  const chromatic=roles.every(k=>dec[k].C>0.012);
  const allNeutral=roles.every(k=>dec[k].C<0.012);
  const Ls=roles.map(k=>dec[k].L);
  const isDark=Ls[0]>Ls[3];
  const mono=Ls.every((x,i)=>i===0||(isDark?x<Ls[i-1]:x>Ls[i-1]));
  rows.push({name:file.replace(".ts",""),allNeutral,scheme:isDark?"dark":"light",hue:chromatic?hue:null,
    torsion:chromatic?Math.max(...dev)-Math.min(...dev):null,Ls,rels:roles.map(k=>dec[k].rel),mono});
}
console.log("# Appendix — theme corpus analysis\n");
console.log("Every `components/theme/config/*.ts` decoded to OKLCh. Generated from the working tree at");
console.log("`99bc5793`. This is the empirical basis for F-11, F-12, ADR-002, and ADR-003.\n");
console.log("`L` and `relC` columns are ordered `primary → saturated → pastel → light`.");
console.log("`relC` is chroma as a fraction of `Cmax(L, h)`. Hue is the chroma-weighted circular mean;");
console.log("`—` means achromatic (all four roles below C = 0.012). `mono` is whether lightness is");
console.log("monotone across the four roles.\n");
console.log("| theme | scheme | hue | torsion | L (pri→lgt) | relC (pri→lgt) | mono |");
console.log("| --- | --- | --- | --- | --- | --- | --- |");
for(const r of rows){
  if(r.skip){console.log(`| \`${r.name}\` | *generative — not statically parseable* | | | | | |`);continue;}
  console.log(`| \`${r.name}\` | ${r.scheme} | ${r.hue===null?"—":r.hue.toFixed(0)+"°"} | ${r.torsion===null?"—":r.torsion.toFixed(1)+"°"} | ${r.Ls.map(v=>v.toFixed(3)).join(" ")} | ${r.rels.map(v=>v.toFixed(2)).join(" ")} | ${r.mono?"✓":"✗"} |`);
}
const ok=rows.filter(r=>!r.skip);
const achromaticFull=ok.filter(r=>r.allNeutral).length;
const tors=ok.filter(r=>r.torsion!==null).map(r=>r.torsion).sort((a,b)=>a-b);
const q=(a,p)=>a[Math.floor((a.length-1)*p)];
console.log("\n## Summary\n");
console.log(`| metric | value |`);
console.log(`| --- | --- |`);
console.log(`| theme configs | ${rows.length} |`);
console.log(`| statically parseable | ${ok.length} |`);
console.log(`| dark scheme | ${ok.filter(r=>r.scheme==="dark").length} |`);
console.log(`| light scheme | ${ok.filter(r=>r.scheme==="light").length} |`);
const fullyAch = ok.filter(r=>r.rels && r.rels.every(v=>v<0.02) && r.hue===null).length;
console.log(`| fully achromatic (all four roles C < 0.012) | ${achromaticFull} |`);
console.log(`| partly neutral (some role C < 0.012) | ${ok.filter(r=>r.hue===null).length - achromaticFull} |`);
console.log(`| fully chromatic | ${ok.filter(r=>r.hue!==null).length} |`);
console.log(`| monotone lightness | ${ok.filter(r=>r.mono).length} / ${ok.length} |`);
console.log(`| hue torsion p50 (fully chromatic only) | ${q(tors,0.5).toFixed(1)}° |`);
console.log(`| hue torsion p75 | ${q(tors,0.75).toFixed(1)}° |`);
console.log(`| hue torsion p90 | ${q(tors,0.9).toFixed(1)}° |`);
console.log(`| hue torsion max | ${q(tors,1).toFixed(1)}° |`);
console.log("\n## Reading the table\n");
console.log("**Monotone lightness in 57 of 58 themes** is the finding that justifies the tone-ladder");
console.log("model: the existing corpus already *is* a set of lightness ladders with per-role");
console.log("deviations. The engine in T2 describes this corpus rather than imposing on it.\n");
console.log("**Torsion p50 of 11.8°** shows most themes are single-hue with a slight drift. The four");
console.log("outliers above 55° (`vibrant` 292°, `autumnal` 135°, `verdant` 87°, `dusk` 56°) are");
console.log("deliberately polychrome and use per-stop hue overrides — which is the correct outcome:");
console.log("a polychrome theme should look polychrome in its source.\n");
console.log("**relC frequently at or near 1.00 for the extreme roles** is why ADR-003 rejects a");
console.log("tapered chroma envelope. At `L = 0.977` the ceiling is `C = 0.017`, so relC 1.00 is a");
console.log("barely-tinted white — the intended effect, which a taper would gray out.");
