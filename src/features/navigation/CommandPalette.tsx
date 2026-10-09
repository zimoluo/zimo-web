"use client";
import {useEffect,useLayoutEffect,useMemo,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {useRouter} from "next/navigation";
import {useTheme,getTheme,listedThemeIds} from "../theme";
import {fetchSummaries,entryPath,type EntrySummary,type Section} from "../entries";
import {openWindowDefinition,windowDefinitions,WINDOW_DEFINITION_IDS} from "../windows";
import {useSettings} from "../settings";
import {matchesQuery,parseQuery} from "../search";
import {useNavigationUi} from "./store";
import {setPaletteOpen} from "./palette-actions";
import {destinations,type Command} from "./commands";
import styles from "./strip.module.css";
const sections:readonly Section[]=["blog","album","projects","management"];
export function CommandPalette(){
 const container=useNavigationUi(state=>state.paletteContainer);
 const open=useNavigationUi(state=>state.paletteOpen);const profiles=useTheme(state=>state.profiles);const router=useRouter();
 const element=useRef<HTMLDivElement>(null),input=useRef<HTMLInputElement>(null),opener=useRef<HTMLElement|null>(null);
 const [query,setQuery]=useState(""),[active,setActive]=useState(0),[entries,setEntries]=useState<readonly EntrySummary[]>([]),[entryStatus,setEntryStatus]=useState(""),[loaded,setLoaded]=useState(false);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();setPaletteOpen(!useNavigationUi.getState().paletteOpen);}};document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key);},[]);
 useLayoutEffect(()=>{
  const popup=element.current;if(popup===null)return;
  if(open&&!popup.matches(":popover-open")){
   const active=document.activeElement;
   opener.current=active instanceof HTMLElement?active:null;popup.showPopover();input.current?.focus();
  }else if(!open){if(popup.matches(":popover-open"))popup.hidePopover();if(opener.current?.isConnected)opener.current.focus({preventScroll:true});}
 },[open,container]);
 useEffect(()=>{if(container===null)return;const closed=()=>setPaletteOpen(false);container.addEventListener("close",closed);return()=>container.removeEventListener("close",closed);},[container]);
 useEffect(()=>{if(!open||loaded)return;const abort=new AbortController();void Promise.allSettled(sections.map(section=>fetchSummaries(section,abort.signal))).then(results=>{if(abort.signal.aborted)return;setEntries(results.flatMap(result=>result.status==="fulfilled"?result.value:[]));setEntryStatus(results.some(result=>result.status==="rejected")?"Some entries could not be loaded. Other commands remain available.":"");setLoaded(true);});return()=>abort.abort();},[open,loaded]);
 const commands=useMemo<readonly Command[]>(()=>[
  ...destinations.map(([label,url])=>({id:`route:${url}`,label,detail:"Go to page",execute:()=>router.push(url)})),
  ...listedThemeIds.map(id=>({id:`theme:${id}`,label:`Apply theme · ${getTheme(id).name}`,detail:"Built-in theme",execute:()=>useTheme.getState().selectBuiltIn(id)})),
  ...profiles.map((profile,index)=>({id:`profile:${index}:${profile.id}`,label:`Apply profile · ${profile.name}`,detail:"Your saved theme",execute:()=>useTheme.getState().selectProfile(index)})),
  ...WINDOW_DEFINITION_IDS.map(id=>({id:`window:${id}`,label:`Open window · ${windowDefinitions[id].title}`,detail:"Window widget",execute:()=>openWindowDefinition(id,id==="blog-reader"?{section:"blog",slug:""}:id==="album-entry"?{section:"album",slug:""}:id==="project-entry"?{section:"projects",slug:""}:id==="management-reader"?{section:"management",slug:""}:{})})),
  {id:"settings:open",label:"Open Settings",detail:"Preferences and account",execute:()=>openWindowDefinition("settings")},
  {id:"settings:scheme",label:"Toggle dark color scheme",detail:"Display preference",execute:()=>useTheme.getState().setSchemePreference(useTheme.getState().scheme==="dark"?"light":"dark")},
  {id:"settings:serif",label:"Toggle serif reading font",detail:"Reading preference",execute:()=>{const state=useSettings.getState();state.setReading({serif:!state.reading.serif});}},
  {id:"settings:snap",label:"Toggle window snapping",detail:"Window preference",execute:()=>{const state=useSettings.getState();state.setWindows({snapping:!state.windows.snapping});}},
  {id:"settings:motion",label:"Toggle backdrop motion",detail:"Motion preference",execute:()=>{const state=useSettings.getState();state.setMotion({backdrop:state.motion.backdrop==="off"?"full":"off"});}},
  {id:"settings:strip",label:"Toggle context strip",detail:"Navigation preference",execute:()=>{const state=useSettings.getState();state.setNavigation({contextStrip:!state.navigation.contextStrip});}},
  ...entries.map(entry=>({id:`entry:${entry.section}:${entry.slug}`,label:entry.title,detail:`${entry.section} entry · ${entry.description??""}`,tags:entry.tags,authors:entry.authors.map(author=>author.name),execute:()=>router.push(entryPath(entry.section,entry.slug))})),
 ],[profiles,entries,router]);
 const results=useMemo(()=>{const parsed=parseQuery(query);return commands.filter(command=>matchesQuery({title:command.label,description:command.detail,tags:command.tags,authors:command.authors},parsed,text=>text)).slice(0,80);},[query,commands]);
 const chosen=Math.min(active,Math.max(0,results.length-1));
 useEffect(()=>{if(open)document.getElementById(`zw-command-${chosen}`)?.scrollIntoView({block:"nearest"});},[chosen,open]);
 const execute=(command:Command)=>{setPaletteOpen(false);command.execute();};
 const palette=<div ref={element} popover="auto" role="dialog" aria-label="Command palette" className={styles.palette} onToggle={event=>{if(!event.currentTarget.matches(":popover-open"))useNavigationUi.getState().setPaletteOpen(false);}}>
  <input ref={input} className={styles.input} role="combobox" aria-label="Search commands and entries" aria-autocomplete="list" aria-expanded={open} aria-controls="zw-command-results" aria-activedescendant={results.length>0?`zw-command-${chosen}`:undefined} placeholder="Search pages, themes, windows, settings, and entries" value={query} onChange={event=>{setQuery(event.target.value);setActive(0);}} onKeyDown={event=>{if(event.key==="ArrowDown"){event.preventDefault();setActive(Math.min(chosen+1,results.length-1));}else if(event.key==="ArrowUp"){event.preventDefault();setActive(Math.max(0,chosen-1));}else if(event.key==="Enter"){event.preventDefault();const command=results[chosen];if(command)execute(command);}}}/>
  <div id="zw-command-results" role="listbox" aria-label="Commands" className={styles.results}>{results.map((command,index)=><button key={command.id} id={`zw-command-${index}`} type="button" role="option" aria-selected={index===chosen} tabIndex={-1} className={styles.result} onPointerMove={()=>setActive(index)} onClick={()=>execute(command)}><span>{command.label}</span><small>{command.detail}</small></button>)}{results.length===0&&<p role="status" className="p-4">No commands match this search.</p>}</div>
  {entryStatus&&<p role="status" className="mt-3 text-sm">{entryStatus}</p>}
 </div>;
 return container===null?palette:createPortal(palette,container);
}
