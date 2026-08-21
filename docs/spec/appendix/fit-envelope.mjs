import {cMax,hexToOklch} from "./oklch.mjs";
import fs from "fs"; import path from "path";
const L_MAX=0.985,L_MIN=0.165;
const easeL=(t)=>t-0.10*Math.sin(2*Math.PI*t)/(2*Math.PI);
const toneL=(t)=>L_MAX-(L_MAX-L_MIN)*easeL(t);
const ENV=process.env.ENV||"flat";
const envelope=(t)=> ENV==="flat"?1: ENV==="gentle"?(0.80+0.20*(1-Math.pow(Math.abs(2*t-1),1.6))) : (0.35+0.65*(1-Math.pow(Math.abs(2*t-1),1.6)));
const relCcurve=(t,chroma)=>chroma*envelope(t);
const tFromL=(L)=>{let lo=0,hi=1;for(let k=0;k<60;k++){const m=(lo+hi)/2;if(toneL(m)>L)lo=m;else hi=m;}return (lo+hi)/2;};
const dir="/Users/zimoluo/zimo-web/components/theme/config";
const rgbToHex=(r,g,b)=>"#"+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("");
const rows=[];
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(".ts")).sort()){
  const src=fs.readFileSync(path.join(dir,file),"utf8"); const acc={};
  for(const r of ["primary","saturated","pastel","light"]){
    const m=src.match(new RegExp(r+"\\s*:\\s*(?:transformRgb\\()?\\[\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\]"));
    if(m) acc[r]=[+m[1],+m[2],+m[3]];
  }
  if(Object.keys(acc).length<4) continue;
  const dec=Object.fromEntries(Object.entries(acc).map(([k,v])=>{const [L,C,h]=hexToOklch(rgbToHex(...v));return [k,{L,C,h}];}));
  const roles=["primary","saturated","pastel","light"];
  const wx=roles.reduce((a,k)=>a+Math.cos(dec[k].h*Math.PI/180)*dec[k].C,0);
  const wy=roles.reduce((a,k)=>a+Math.sin(dec[k].h*Math.PI/180)*dec[k].C,0);
  let hue=(Math.atan2(wy,wx)*180/Math.PI+360)%360;
  const ts=Object.fromEntries(roles.map(k=>[k,tFromL(dec[k].L)]));
  const relT=roles.map(k=>dec[k].C/Math.max(cMax(dec[k].L,dec[k].h),1e-9));
  const envAt=roles.map(k=>envelope(ts[k]));
  let chroma=Math.min(1,relT.reduce((a,v,i)=>a+v/envAt[i],0)/roles.length);
  const dC=roles.map((k,i)=>relT[i]-relCcurve(ts[k],chroma));
  const dh=roles.map(k=>{let x=dec[k].h-hue;while(x>180)x-=360;while(x<-180)x+=360;return x;});
  rows.push({achromatic:roles.every(k=>dec[k].C<0.012),maxAbsDC:Math.max(...dC.map(Math.abs)),maxAbsDh:Math.max(...dh.map(Math.abs))});
}
const q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor((a.length-1)*p)];
const dc=rows.filter(r=>!r.achromatic).map(r=>r.maxAbsDC);
console.log("envelope="+ENV.padEnd(7)+" |ΔrelC| p50="+q(dc,.5).toFixed(3)+" p90="+q(dc,.9).toFixed(3)+" max="+q(dc,1).toFixed(3)+
  "   pure-seed(|ΔrelC|<=0.12,|Δh|<=10): "+rows.filter(r=>r.achromatic||(r.maxAbsDC<=0.12&&r.maxAbsDh<=10)).length+"/"+rows.length);
