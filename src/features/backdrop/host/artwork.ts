import {formatOklch,formatOklchWithAlpha,shortestArc} from "../../theme/color";
import type {Oklch} from "../../theme/color";
import type {SceneQuality,ScenePalette} from "../contract";
export type Paint={readonly color:Oklch;readonly key:string;readonly reference:Oklch;readonly alpha?:number};
export type Artwork={readonly kind:"vector";readonly svg:string;readonly paints:readonly Paint[]}|{readonly kind:"raster";readonly reference:Oklch};
const bounded=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
export function artworkColor(paint:Paint,palette:ScenePalette):Oklch {
 const target=palette[paint.key]??paint.reference;
 return {l:bounded(paint.color.l+(target.l-paint.reference.l),0,1),c:bounded(paint.reference.c>.005?paint.color.c*(target.c/paint.reference.c):paint.color.c+target.c-paint.reference.c,0,.4),h:paint.color.h+shortestArc(paint.reference.h,target.h)};
}
export function artworkUrl(source:string,artwork:Artwork,palette:ScenePalette,speed=1,quality:SceneQuality="rich"):string {
 if(artwork.kind==="raster")return source;
 const pace=bounded(speed,.05,4);
 let svg=artwork.svg.replace(/\{\{(\d+)\}\}/g,(_match,index:string)=>{const paint=artwork.paints[Number(index)];return paint?formatOklchWithAlpha(artworkColor(paint,palette),paint.alpha??1):"transparent";});
 svg=svg.replace(/(animation(?:-duration|-delay)?\s*:[^;"'}]+)/g, declaration=>declaration.replace(/(-?\d*\.?\d+)(ms|s)\b/g,(_match,value:string,unit:string)=>`${Number(value)/pace}${unit}`));
 if(quality==="still")svg=svg.replace(/<\/svg>/,"<style>*{animation-play-state:paused!important}</style></svg>");
 return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
export function artworkFilter(artwork:Artwork,palette:ScenePalette):string {
 if(artwork.kind==="vector")return "none";
 const target=palette.mid??artwork.reference;const reference=artwork.reference;
 return `hue-rotate(${shortestArc(reference.h,target.h)}deg) saturate(${bounded(reference.c>.005?target.c/reference.c:1,0,4)}) brightness(${bounded(target.l/Math.max(reference.l,.01),.15,4)})`;
}
export const artworkProperty=(source:string)=>`--zw-artwork-${source.replace(/^\/theme\/animated-background\//,"").replace(/[^a-zA-Z0-9-]/g,"-")}`;

export function artworkCss(paint: Paint): string {
 const number=(value:number)=>Math.round(value*1e6)/1e6;
 const chroma=paint.reference.c>.005?`c * ${number(paint.color.c/paint.reference.c)}`:`c + ${number(paint.color.c-paint.reference.c)}`;
 return `oklch(from var(--zw-scene-${paint.key}, ${formatOklch(paint.reference)}) clamp(0, calc(l + ${number(paint.color.l-paint.reference.l)}), 1) clamp(0, calc(${chroma}), 0.4) calc(h + ${number(shortestArc(paint.reference.h,paint.color.h))}) / ${paint.alpha??1})`;
}
