"use client";
import {useMemo} from "react";
import {useSettings} from "../settings";
import {useWindows,definitionOf} from "../windows";
import {InlineMarks} from "../document";
import {useNavigationUi} from "./store";
import {useStrip,selectContribution,useStripContribution} from "./contributions";
import {setPaletteOpen} from "./palette-actions";
import SearchBarIcon from "../../ui/icons/entries/SearchBarIcon";
import styles from "./strip.module.css";
export function WindowStripContribution(){
 const count=useWindows(state=>state.order.length),title=useWindows(state=>definitionOf(state.instances[state.order[state.order.length-1]??""]?.definitionId??"")?.title??"");
 const contribution=useMemo(()=>count===0?null:{id:"windows",priority:20,label:`${count} window${count===1?"":"s"} · ${title}`},[count,title]);useStripContribution(contribution);return null;
}
export function ContextStrip(){
 const enabled=useSettings(state=>state.navigation.contextStrip),open=useNavigationUi(state=>state.paletteOpen),contribution=useStrip(state=>selectContribution(state.items));
 const Icon=contribution?.icon;
 return <div className={styles.spacer}>{enabled&&<div className={`${styles.strip} surface-widget surface-edge shadow-md`} data-open={open}><button type="button" className={styles.command} aria-label="Open command palette" aria-keyshortcuts="Meta+K Control+K" onClick={()=>setPaletteOpen(true)}>{Icon?<Icon className={styles.icon??""}/>:<SearchBarIcon className={styles.icon??""}/>}<span className={styles.label}><InlineMarks>{contribution?.label??"Zimo Web"}</InlineMarks></span><kbd className={`${styles.shortcut} text-xs opacity-60`}>⌘K</kbd></button>{contribution?.detail!==undefined&&<span className={styles.detail}>{contribution.detail}</span>}{contribution?.action&&<button type="button" className="min-h-11 px-2" aria-label="Context action" onClick={contribution.action}>↗</button>}</div>}</div>;
}
