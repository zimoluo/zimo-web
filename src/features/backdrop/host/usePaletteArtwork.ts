"use client";
import {useEffect,useRef} from "react";
import {artworkFilter,artworkProperty,artworkUrl,type Artwork} from "./artwork";
import type {SceneRuntime} from "../runtime";
const artworkScenes=new Set(["whiteout","projects","photos","blog","birthday","birthday-19","birthday-20","bewitched","bubbles","christmas","crimson","dusk","eventide","gallery","grass","halloween","home","meadowland","memories","murk","perpetuity","pixelland","sky","storm","verdant"]);
const cache=new Map<string,Promise<Readonly<Record<string,Artwork>>>>();
function load(id:string) {
 let promise=cache.get(id);
 if(!promise){promise=fetch(`/theme/palette-artwork/${id}.json`).then(async response=>response.ok?await response.json() as Readonly<Record<string,Artwork>>:{}).catch(()=>({}));cache.set(id,promise);}
 return promise;
}
export function usePaletteArtwork(id:string,runtime:SceneRuntime,themeable:boolean) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!themeable||!artworkScenes.has(id))return;
  let alive=true;let artworks:Readonly<Record<string,Artwork>>|undefined;
  const paint=()=>{
   const node=ref.current;if(!node||!artworks)return;
   for(const [source,artwork] of Object.entries(artworks)){
    const url=artworkUrl(source,artwork,runtime.input.palette,Number(runtime.input.params.speed??1),runtime.input.quality);
    node.style.setProperty(artworkProperty(source),`url("${url}")`);
    if(artwork.kind==="raster")node.style.setProperty("--zw-artwork-filter",artworkFilter(artwork,runtime.input.palette));
   }
   for(const image of node.querySelectorAll<HTMLImageElement>("img[data-palette-src]")){
    const source=image.dataset.paletteSrc??"",artwork=artworks[source];if(!artwork)continue;
    const url=artworkUrl(source,artwork,runtime.input.palette,Number(runtime.input.params.speed??1),runtime.input.quality);if(image.getAttribute("src")!==url)image.src=url;
    if(artwork.kind==="raster")image.style.filter=artworkFilter(artwork,runtime.input.palette);
   }
  };
  void load(id).then(value=>{if(alive){artworks=value;paint();}});
  runtime.listeners.add(paint);
  const observer=new MutationObserver(paint);if(ref.current)observer.observe(ref.current,{childList:true,subtree:true,attributes:true,attributeFilter:["data-palette-src"]});
  return ()=>{alive=false;runtime.listeners.delete(paint);observer.disconnect();};
 },[id,runtime,themeable]);
 return ref;
}
