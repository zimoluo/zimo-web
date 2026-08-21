// sRGB <-> OKLab per Björn Ottosson; gamut search for Cmax(L,h)
const f = (x) => (x <= 0.0031308 ? 12.92*x : 1.055*Math.pow(x,1/2.4)-0.055);
const fi = (x) => (x <= 0.04045 ? x/12.92 : Math.pow((x+0.055)/1.055,2.4));

function oklabToLinearSrgb(L,a,b){
  const l_=L+0.3963377774*a+0.2158037573*b;
  const m_=L-0.1055613458*a-0.0638541728*b;
  const s_=L-0.0894841775*a-1.2914855480*b;
  const l=l_*l_*l_, m=m_*m_*m_, s=s_*s_*s_;
  return [
    +4.0767416621*l -3.3077115913*m +0.2309699292*s,
    -1.2684380046*l +2.6097574011*m -0.3413193965*s,
    -0.0041960863*l -0.7034186147*m +1.7076147010*s,
  ];
}
function linearSrgbToOklab(r,g,b){
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
  const m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
  const s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  return [
    0.2104542553*l+0.7936177850*m-0.0040720468*s,
    1.9779984951*l-2.4285922050*m+0.4505937099*s,
    0.0259040371*l+0.7827717662*m-0.8086757660*s,
  ];
}
const inGamut=(rgb,eps=1e-6)=>rgb.every(v=>v>=-eps&&v<=1+eps);
function oklchToLinear(L,C,h){const r=h*Math.PI/180;return oklabToLinearSrgb(L,C*Math.cos(r),C*Math.sin(r));}
export function cMax(L,h,eps=1e-5){
  let lo=0,hi=0.5;
  if(inGamut(oklchToLinear(L,hi,h)))return hi;
  while(hi-lo>eps){const mid=(lo+hi)/2;if(inGamut(oklchToLinear(L,mid,h)))lo=mid;else hi=mid;}
  return lo;
}
export function oklchToHex(L,C,h){
  const lin=oklchToLinear(L,C,h);
  const srgb=lin.map(v=>Math.min(1,Math.max(0,f(v))));
  return "#"+srgb.map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("");
}
export function hexToOklch(hex){
  const n=hex.replace("#","");
  const [r,g,b]=[0,2,4].map(i=>fi(parseInt(n.slice(i,i+2),16)/255));
  const [L,a,bb]=linearSrgbToOklab(r,g,b);
  const C=Math.hypot(a,bb);
  let h=Math.atan2(bb,a)*180/Math.PI; if(h<0)h+=360;
  return [L,C,h];
}
