import { z } from "zod";
import { definitionOf, validateWindowProps } from "./definitions";
import type { KnownWindowId } from "./definitions";
import type { PersistedLayout } from "./restore";

const legacyWindow = z.object({centerX:z.number().finite(),centerY:z.number().finite(),width:z.number().finite().positive(),height:z.number().finite().positive(),order:z.number().finite(),data:z.object({saveComponentKey:z.string()}),initialProps:z.record(z.string(),z.unknown()).default({})});
const layoutSchema=z.object({viewport:z.object({width:z.number().positive(),height:z.number().positive()}),windows:z.array(z.unknown())});
const definitionMap: Readonly<Record<string,KnownWindowId>> = {blog:"blog-reader",photos:"album-entry",projects:"project-entry",management:"management-reader",faviconWidget:"identity-mark",zimoWebInWindow:"web-frame",themeMakerToolset:"studio",settingsPanel:"settings",notebook:"notebook",navigator:"navigator",wikipedia:"wikipedia",calculator:"calculator",blank:"blank",signalGenerator:"signal-generator",debugger:"debugger",stickyNotes:"sticky-note"};
export function migrateWindowLayout(raw:unknown): {readonly layout:PersistedLayout|null;readonly issues:readonly string[]} {
  const input=layoutSchema.safeParse(raw);
  if(!input.success)return {layout:null,issues:["Saved window layout is invalid."]};
  const issues:string[]=[];
  const windows=input.data.windows.flatMap((candidate,index)=>{
    const parsed=legacyWindow.safeParse(candidate);
    if(!parsed.success){issues.push(`Window ${index} is invalid.`);return [];}
    const saved=parsed.data;const definitionId=definitionMap[saved.data.saveComponentKey];
    if(definitionId===undefined){issues.push(`Window ${index} has an unknown tool.`);return [];}
    const initial=saved.initialProps;
    const section=definitionId==="blog-reader"?"blog":definitionId==="album-entry"?"album":definitionId==="project-entry"?"projects":definitionId==="management-reader"?"management":null;
    const props=validateWindowProps(definitionId,section===null?(definitionId==="sticky-note"?{text:initial.storedText??""}:initial):{section,slug:initial.presetSlug??""});
    if(props===null){issues.push(`Window ${index} has invalid tool data.`);return [];}
    const definition=definitionOf(definitionId);
    return [{id:`migrated-window-${index}`,definitionId,props,rect:{x:saved.centerX-saved.width/2,y:saved.centerY-saved.height/2,width:saved.width,height:saved.height},group:definition?.group??0,order:saved.order}];
  }).sort((a,b)=>a.order-b.order).map(({order: _order,...window})=>window);
  return {layout:{viewport:input.data.viewport,windows},issues};
}
