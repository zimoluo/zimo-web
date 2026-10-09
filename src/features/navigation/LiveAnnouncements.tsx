"use client";
import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";
import {activeThemeSource,effectiveScheme,useTheme} from "../theme";
import {destinations} from "./commands";
export function LiveAnnouncements(){
 const pathname=usePathname(),previousPath=useRef(pathname),route=useRef<HTMLSpanElement>(null),theme=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  if(previousPath.current===pathname)return;
  previousPath.current=pathname;
  const frame=requestAnimationFrame(()=>{if(route.current)route.current.textContent=destinations.find(([,path])=>path===pathname)?.[0]??document.title;});
  return()=>cancelAnimationFrame(frame);
 },[pathname]);
 useEffect(()=>useTheme.subscribe(state=>`${state.active.kind}:${state.active.kind==="builtIn"?state.active.id:state.active.index}:${state.scheme}`,
 ()=>{if(theme.current){const source=activeThemeSource();theme.current.textContent=`Theme: ${source.name}, ${effectiveScheme(source,useTheme.getState().scheme)} scheme`;}}
 ),[]);
 return <div className="sr-only"><span ref={route} role="status" aria-live="polite" aria-atomic="true"/><span ref={theme} role="status" aria-live="polite" aria-atomic="true"/></div>;
}
