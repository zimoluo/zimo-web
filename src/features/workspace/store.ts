"use client";
import { create } from "zustand";
import { persist,subscribeWithSelector } from "zustand/middleware";
import { createThrottledJsonStorage } from "../../lib/store/throttled-storage";
import { defaultWorkspace,workspaceSchema } from "./model";
import type { WorkspaceData } from "./model";
import { newPage,normalizeSpans,shiftSpans } from "../notebook/model";
import type { Span } from "../notebook/model";
export type WorkspaceStore = WorkspaceData & {
  readonly addPage:(text?:string)=>string;
  readonly removePage:(id:string)=>void;
  readonly selectPage:(id:string)=>void;
  readonly updatePage:(id:string,text:string,spans?:readonly Span[])=>void;
  readonly movePage:(id:string,offset:number)=>void;
  readonly markTreeViewed:(id:string)=>void;
  readonly setStickyNotesOpened:(opened:boolean)=>void;
  readonly setCalculatorAppearance:(appearance:WorkspaceData["calculatorAppearance"])=>void;
  readonly restoreWorkspace:(value:unknown)=>boolean;
};
export const workspaceDataOf = (state:WorkspaceData):WorkspaceData => ({version:state.version,revision:state.revision,notebook:state.notebook,stickyNotes:state.stickyNotes,calculatorAppearance:state.calculatorAppearance,christmasTree:state.christmasTree});
export const useWorkspace = create<WorkspaceStore>()(subscribeWithSelector(persist((set,get)=>({
  ...defaultWorkspace,
  addPage:(text="")=>{const page=newPage(text);set((state)=>({revision:state.revision+1,notebook:{pages:[...state.notebook.pages,page],activeId:page.id}}));return page.id;},
  removePage:(id)=>set((state)=>{const index=state.notebook.pages.findIndex((page)=>page.id===id);if(index<0)return state;const pages=state.notebook.pages.filter((page)=>page.id!==id);return {revision:state.revision+1,notebook:{pages,activeId:state.notebook.activeId===id ? pages[Math.min(index,pages.length-1)]?.id??null : state.notebook.activeId}};}),
  selectPage:(id)=>{if(get().notebook.pages.some((page)=>page.id===id))set((state)=>({revision:state.revision+1,notebook:{...state.notebook,activeId:id}}));},
  updatePage:(id,text,spans)=>set((state)=>({revision:state.revision+1,notebook:{...state.notebook,pages:state.notebook.pages.map((page)=>page.id===id?{...page,text,spans:[...normalizeSpans(spans??shiftSpans(page.spans,page.text,text),text)],updatedAt:new Date().toISOString()}:page)}})),
  movePage:(id,offset)=>set((state)=>{const pages=[...state.notebook.pages],index=pages.findIndex((page)=>page.id===id),target=Math.max(0,Math.min(pages.length-1,index+offset));const page=pages[index];if(page===undefined||index===target)return state;pages.splice(index,1);pages.splice(target,0,page);return {revision:state.revision+1,notebook:{...state.notebook,pages}};}),
  markTreeViewed:(id)=>{if(!get().christmasTree.viewedIds.includes(id))set((state)=>({revision:state.revision+1,christmasTree:{viewedIds:[...state.christmasTree.viewedIds,id]}}));},
  setStickyNotesOpened:(opened)=>set((state)=>({revision:state.revision+1,stickyNotes:{opened}})),
  setCalculatorAppearance:(calculatorAppearance)=>set((state)=>({revision:state.revision+1,calculatorAppearance})),
  restoreWorkspace:(value)=>{const parsed=workspaceSchema.safeParse(value);if(!parsed.success)return false;set(parsed.data);return true;},
}),{name:"zw.workspace",skipHydration:true,version:1,storage:createThrottledJsonStorage<WorkspaceStore>({delayMs:500}),partialize:(state)=>workspaceDataOf(state) as WorkspaceStore,merge:(persisted,current)=>{const parsed=workspaceSchema.safeParse(persisted);return parsed.success?{...current,...parsed.data}:current;}})));
export const workspaceStore={getState:useWorkspace.getState,subscribe:useWorkspace.subscribe};
