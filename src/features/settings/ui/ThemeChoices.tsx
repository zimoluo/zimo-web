"use client";
import Image from "next/image";
import type { CSSProperties, KeyboardEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { getTheme, listedThemeIds, useTheme, activeThemeSource, resolve, effectiveScheme, formatOklch, type ThemeSource, type Scheme, type ThemeId } from "../../theme";
import styles from "./settings.module.css";
const artworkAliases:Readonly<Record<string,string>>={"birthday-generic":"birthdayGeneric","gallery3-d":"gallery3D","plain-black":"plainBlack","plain-dark":"plainDark","plain-gray":"plainGray","plain-light":"plainLight"};
const withoutArtwork:readonly string[]=["cubistic","default-editor","lollipop","oasis","spring-field"];
export function themeArtwork(source:ThemeSource,scheme:Scheme):CSSProperties{
 const theme=resolve(source,effectiveScheme(source,scheme));
 return {background:`radial-gradient(ellipse at 22% 10%,${formatOklch(theme.tone(.15))},transparent 65%),linear-gradient(135deg,${formatOklch(theme.tone(.3))},${formatOklch(theme.tone(.75))})`};
}
function radioKeys(event:KeyboardEvent<HTMLElement>){
 const buttons=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')),current=buttons.findIndex(button=>button===document.activeElement),direction=event.key==="ArrowRight"||event.key==="ArrowDown"?1:event.key==="ArrowLeft"||event.key==="ArrowUp"?-1:0;
 if(direction===0)return;event.preventDefault();const next=buttons[(Math.max(0,current)+direction+buttons.length)%buttons.length];next?.click();next?.focus();
}
export function ThemeChoices({ choose = (id) => useTheme.getState().selectBuiltIn(id) }: { readonly choose?: (id: ThemeId) => void }) {
 const preferences=useTheme(useShallow(state=>({active:state.active,scheme:state.scheme,profiles:state.profiles})));
 const {active,scheme}=preferences,currentName=activeThemeSource().name,listedSelection=listedThemeIds.some(id=>active.kind==="builtIn"&&active.id===id);
 return <>
  <div className={styles.themeWell}><div className={styles.themeGrid} role="radiogroup" aria-label="Website theme" onKeyDown={radioKeys}>{listedThemeIds.map((id,index)=>{const source=getTheme(id),selected=active.kind==="builtIn"&&active.id===id;return <button type="button" className={styles.themeButton} key={id} role="radio" aria-label={`Use ${source.name} theme`} aria-checked={selected} tabIndex={selected||!listedSelection&&index===0?0:-1} title={source.name} onClick={()=>choose(id)}>{withoutArtwork.includes(id)?<span className={styles.themeArtwork} style={themeArtwork(source,scheme)}/>:<Image src={`/theme/picker/${artworkAliases[id]??id}.svg`} alt="" width={48} height={48} loading="lazy" draggable={false}/>}</button>;})}</div></div>
  <div className={styles.themeCaption}><span>Current theme</span><strong>{currentName}</strong></div>
 </>;
}
