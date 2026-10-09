"use client";
import { useEffect, useId, type ComponentType, type ReactNode } from "react";
import {create} from "zustand";
export type StripContribution = {
  readonly id:string;readonly priority:number;readonly label:string;
  readonly icon?:ComponentType<{readonly className?:string}>;
  readonly detail?:ReactNode;readonly action?:()=>void;readonly ttl?:number;
};
type Registered=StripContribution&{readonly order:number};
type Contributions={readonly items:Readonly<Record<string,Registered>>;readonly register:(contribution:StripContribution)=>()=>void};
let sequence=0;
export const selectContribution=(items:Readonly<Record<string,Registered>>):Registered|undefined=>Object.values(items).sort((a,b)=>b.priority-a.priority||a.order-b.order)[0];
export const useStrip=create<Contributions>()((set,get)=>({items:{},register:(contribution)=>{
  const registered={...contribution,order:sequence++};let timer:ReturnType<typeof setTimeout>|undefined;
  set({items:{...get().items,[contribution.id]:registered}});
  const remove=()=>{if(timer!==undefined)clearTimeout(timer);if(get().items[contribution.id]!==registered)return;const items={...get().items};delete items[contribution.id];set({items});};
  if(contribution.ttl!==undefined)timer=setTimeout(remove,contribution.ttl);
  return remove;
}}));
export function useStripContribution(contribution:StripContribution|null):void{
  useEffect(()=>contribution===null?undefined:useStrip.getState().register(contribution),[contribution]);
}
export function ArticleReadingContribution({title}:{readonly title:string}){
  const id=useId();
  useEffect(()=>useStrip.getState().register({id:`article-reading:${id}`,priority:40,label:title,detail:<span role="progressbar" aria-label="Reading progress" className="zw-reading-progress"><span/></span>}),[title,id]);
  return null;
}
