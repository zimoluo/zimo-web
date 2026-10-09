import { v7 as uuidv7 } from "uuid";
import { normalizeSpans } from "../notebook/model";
import type { Span,NotebookPage } from "../notebook/model";
import { defaultWorkspace,workspaceSchema } from "./model";
import type { WorkspaceData } from "./model";
const object=(value:unknown):Record<string,unknown>=>typeof value==="object"&&value!==null?value as Record<string,unknown>:{};
const date=(value:unknown):string=>{const parsed=new Date(typeof value==="string"?value:0);return Number.isNaN(parsed.getTime())?new Date(0).toISOString():parsed.toISOString();};
export function migrateWorkspace(input:unknown, idForPage: (at:string,index:number)=>string = (at)=>uuidv7({msecs:Date.parse(at)})):WorkspaceData {
  const existing=workspaceSchema.safeParse(input);if(existing.success)return existing.data;
  const old=object(input);
  const pages:NotebookPage[]=Array.isArray(old.notebookData)?old.notebookData.map((value,index)=>{const page=object(value),text=typeof page.content==="string"?page.content:"",createdAt=date(page.date);const spans:Span[]=Array.isArray(page.contentStyles)?page.contentStyles.flatMap((value)=>{const span=object(value);if(typeof span.fromIndex!=="number"||typeof span.toIndex!=="number"||typeof span.style!=="string")return [];const style=span.style==="email"?"link":span.style;if(!["bold","italic","code","mark","strike","link"].includes(style))return [];const href=typeof span.additionalData==="string"?span.style==="email"&&!span.additionalData.startsWith("mailto:")?`mailto:${span.additionalData}`:span.additionalData:undefined;return [{from:span.fromIndex,to:span.toIndex+1,style:style as Span["style"],...(href===undefined?{}:{href})}];}):[];return {id:idForPage(createdAt,index),text,spans:[...normalizeSpans(spans,text)],createdAt,updatedAt:date(page.lastEditedDate??page.date)};}):[];
  const index=typeof old.notebookIndex==="number"?Math.max(0,Math.min(pages.length-1,old.notebookIndex)):0;
  return {...defaultWorkspace,notebook:{pages,activeId:pages[index]?.id??null},stickyNotes:{opened:old.hasOpenedStickyNotes===true},calculatorAppearance:old.calculatorAppearance==="border"||old.calculatorAppearance==="contrast"?old.calculatorAppearance:"normal",christmasTree:{viewedIds:Array.isArray(old.viewedChristmasTreeMessages)?old.viewedChristmasTreeMessages.filter((value):value is string=>typeof value==="string"):[]}};
}
