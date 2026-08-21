import {cMax,oklchToHex,hexToOklch} from "./oklch.mjs";
import fs from "fs"; import path from "path";

// ---- CANONICAL RAMP SPEC (candidate) ----
export const N=12;
export const L_MAX=0.985, L_MIN=0.165;
// lightness ladder: eased so ends get finer resolution
export const easeL=(t)=>t+0.10*Math.sin(2*Math.PI*t)/(2*Math.PI)*-1; // gentle S; identity-ish
export const toneL=(i)=>L_MAX-(L_MAX-L_MIN)*easeL(i/(N-1));
// relative-chroma envelope: tapers at both ends, plateau in the middle
export const envelope=(t,p=1.6)=>1-Math.pow(Math.abs(2*t-1),p);
export const toneRelC=(i,chroma)=>chroma*(0.35+0.65*envelope(i/(N-1)));
export function tone(i,{hue,chroma,torsion=0}){
  const t=i/(N-1);
  const L=toneL(i), h=(hue+torsion*(t-0.5)+360)%360;
  const C=Math.min(toneRelC(i,chroma)*cMax(L,h),cMax(L,h));
  return {L,C,h};
}
const dE=(a,b)=>{const A=[a.L,a.C*Math.cos(a.h*Math.PI/180),a.C*Math.sin(a.h*Math.PI/180)];
  const B=[b.L,b.C*Math.cos(b.h*Math.PI/180),b.C*Math.sin(b.h*Math.PI/180)];
  return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]);};

console.log("=== NOT canonical: this script uses the REJECTED taper envelope (ADR-003). ===");
console.log("=== The authoritative test vectors are in T2 §5.7 (flat envelope). This block exists  ===");
console.log("=== only to reproduce the discrete-rung fit numbers in T9 §1 / ADR-002.            ===");
console.log("i   L      relC    C       hex");
for(let i=0;i<N;i++){const t=tone(i,{hue:280,chroma:0.62});
  console.log(String(i).padStart(2)+"  "+t.L.toFixed(4)+"  "+toneRelC(i,0.62).toFixed(4)+"  "+t.C.toFixed(4)+"  "+oklchToHex(t.L,t.C,t.h));}

console.log("\n=== (also taper-based; not the T2 §5.7 table) ===");
console.log("i  "+[0,60,120,180,240,300].map(h=>("h"+h).padStart(9)).join(""));
for(let i=0;i<N;i+=2){process.stdout.write(String(i).padStart(2)+" "+[0,60,120,180,240,300].map(h=>oklchToHex(...Object.values(tone(i,{hue:h,chroma:0.62}))).padStart(9)).join("")+"\n");}

// ---- MIGRATION FIT ----
const dir="/Users/zimoluo/zimo-web/components/theme/config";
const rgbToHex=(r,g,b)=>"#"+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("");
const results=[];
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(".ts")).sort()){
  const src=fs.readFileSync(path.join(dir,file),"utf8"); const acc={};
  for(const role of ["primary","saturated","pastel","light"]){
    const m=src.match(new RegExp(role+"\\s*:\\s*(?:transformRgb\\()?\\[\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\]"));
    if(m) acc[role]=[+m[1],+m[2],+m[3]];
  }
  if(Object.keys(acc).length<4) continue;
  const target=Object.fromEntries(Object.entries(acc).map(([k,v])=>{const [L,C,h]=hexToOklch(rgbToHex(...v));return [k,{L,C,h}];}));
  // brute force: hue x chroma x torsion, roles snap to nearest tone index
  let best={err:Infinity};
  for(let hue=0;hue<360;hue+=3) for(let chroma=0;chroma<=1.001;chroma+=0.04) for(const torsion of [0,-30,30,-60,60]){
    const ladder=Array.from({length:N},(_,i)=>tone(i,{hue,chroma,torsion}));
    let err=0; const idx={};
    for(const [role,t] of Object.entries(target)){
      let bi=0,bd=Infinity; ladder.forEach((c,i)=>{const d=dE(c,t); if(d<bd){bd=d;bi=i;}});
      idx[role]=bi; err=Math.max(err,bd);
    }
    if(err<best.err) best={err,hue,chroma,torsion,idx};
  }
  results.push({name:file.replace(".ts",""),...best});
}
results.sort((a,b)=>a.err-b.err);
const q=(p)=>results[Math.floor((results.length-1)*p)].err;
console.log(`\n=== MIGRATION FIT: pure-seed reproduction of the 4 authored accents (max ΔE_OK per theme) ===`);
console.log(`themes fitted: ${results.length}`);
console.log(`ΔE_OK  p50=${q(.5).toFixed(4)}  p75=${q(.75).toFixed(4)}  p90=${q(.9).toFixed(4)}  max=${q(1).toFixed(4)}`);
console.log(`within 0.02 (JND):   ${results.filter(r=>r.err<=0.02).length}/${results.length}`);
console.log(`within 0.04:         ${results.filter(r=>r.err<=0.04).length}/${results.length}`);
console.log(`within 0.06:         ${results.filter(r=>r.err<=0.06).length}/${results.length}`);
console.log(`\nworst 8 (need explicit per-role overrides):`);
results.slice(-8).reverse().forEach(r=>console.log(`  ${r.name.padEnd(16)} dE=${r.err.toFixed(4)} hue=${r.hue} chroma=${r.chroma.toFixed(2)} torsion=${r.torsion} tones=[${["primary","saturated","pastel","light"].map(k=>r.idx[k]).join(",")}]`));
console.log(`\nbest 8 (pure seed suffices):`);
results.slice(0,8).forEach(r=>console.log(`  ${r.name.padEnd(16)} dE=${r.err.toFixed(4)} hue=${r.hue} chroma=${r.chroma.toFixed(2)} torsion=${r.torsion} tones=[${["primary","saturated","pastel","light"].map(k=>r.idx[k]).join(",")}]`));
