"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ThemeMark, getTheme, useTheme, type ThemeId, type ThemeSource, type ThemeSourceController } from "@/src/features/theme";
import { reducedTransitions, watchReducedTransitions } from "@/src/features/settings/motion";
import styles from "./palette.module.css";

const groups: readonly { name: string; ids: readonly ThemeId[] }[] = [
  { name:"Foundations", ids:["about","photos","blog","projects","whiteout","home","perpetuity","unity"] },
  { name:"Light and color", ids:["gold","crimson","bubbles","vitreous","scintillating","memories","bewitched","planetoid"] },
  { name:"Atmospheres", ids:["sky","storm","penumbra","underwater","aquarium","energize","grass"] },
  { name:"Landscapes", ids:["dusk","eventide","meadowland","murk","pixelland"] },
  { name:"Seasons", ids:["vibrant","marina","mori","cherry","autumnal"] },
  { name:"Nightfall", ids:["glitter","celebration","midnight","stars","velvet","spookfest","halloween"] },
  { name:"Occasions", ids:["birthday","birthday19","birthday20","christmas","rainbow","gallery","gallery3-d"] },
];
function CyclingMark({ name, sources }: { readonly name: string; readonly sources: readonly ThemeSource[] }) {
  const [index,setIndex]=useState(0),[busy,setBusy]=useState(false);
  const operation=useRef<{ animation:Animation; timer:ReturnType<typeof setTimeout>; finish:()=>void } | null>(null);
  const source=sources[index%sources.length] ?? getTheme("default-editor");
  const controller=useMemo<ThemeSourceController>(()=>({read:()=>({source,scheme:source.surfaceScheme ?? (source.schemes.kind==="single" ? source.schemes.scheme : "light")}),subscribe:()=>()=>{}}),[source]);
  useEffect(()=>{
    const stop=watchReducedTransitions(()=>operation.current?.finish());
    return ()=>{stop();const pending=operation.current;operation.current=null;if(pending){clearTimeout(pending.timer);pending.animation.cancel();}};
  },[]);
  return <button type="button" className={styles.identitySample} aria-disabled={busy} aria-label={`${name} mark: ${source.name}. Show next design`} title={source.name} onClick={event=>{
    const element=event.currentTarget,next=()=>setIndex(value=>(value+1)%sources.length);
    if(operation.current)return;
    if(reducedTransitions() || typeof element.animate!=="function"){next();return;}
    setBusy(true);let swapped=false;
    const swap=()=>{if(!swapped){swapped=true;next();}};
    const animation=element.animate([{rotate:"0deg",offset:0},{rotate:"-20deg",offset:.4},{rotate:"-20deg",offset:.5},{rotate:"360deg",offset:1}],{duration:600,easing:"ease-in-out"});
    const timer=setTimeout(swap,300);
    const finish=()=>{if(operation.current?.animation!==animation)return;operation.current=null;clearTimeout(timer);swap();animation.cancel();setBusy(false);};
    operation.current={animation,timer,finish};void animation.finished.then(finish,()=>{if(operation.current?.animation===animation)finish();});
  }}><ThemeMark controller={controller} className="size-full" /></button>;
}
export function IdentityGallery() {
  const profiles=useTheme(state=>state.profiles);
  return <div className={styles.favicons} role="group" aria-label="Explore favicon designs">{groups.map(group=><CyclingMark key={group.name} name={group.name} sources={group.ids.map(getTheme)}/>)}<CyclingMark name="Your profiles" sources={[...profiles,getTheme("default-editor")]}/></div>;
}
