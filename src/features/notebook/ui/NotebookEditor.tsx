"use client";
import { useRef,useState } from "react";
import { useWorkspace,workspaceStore } from "../../workspace";
import { markdownToSpans,normalizeSpans,spansToMarkdown,SPAN_STYLES } from "../model";
import type { NotebookPage,SpanStyle } from "../model";

function Preview({page}:{readonly page:NotebookPage}) {
  const points=[...new Set([0,page.text.length,...page.spans.flatMap((span)=>[span.from,span.to])])].sort((a,b)=>a-b);
  return <div className="whitespace-pre-wrap min-h-40 p-4" aria-label="Formatted preview">{points.slice(0,-1).map((from,index)=>{const to=points[index+1]??from;const active=page.spans.filter((span)=>span.from<=from&&span.to>=to);const has=(style:SpanStyle)=>active.some((span)=>span.style===style);const link=active.find((span)=>span.style==="link");const value=<span style={{fontWeight:has("bold")?"bold":undefined,fontStyle:has("italic")?"italic":undefined,fontFamily:has("code")?"monospace":undefined,background:has("mark")?"var(--color-highlight)":undefined,textDecoration:has("strike")?"line-through":undefined}}>{page.text.slice(from,to)}</span>;return link?.href===undefined?<span key={from}>{value}</span>:<a key={from} href={link.href} className="underline" target="_blank" rel="noopener noreferrer">{value}</a>;})}</div>;
}
const download=(filename:string,text:string,type:string)=>{const url=URL.createObjectURL(new Blob([text],{type}));const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;anchor.click();URL.revokeObjectURL(url);};

export function NotebookEditor() {
  const pages=useWorkspace((state)=>state.notebook.pages),activeId=useWorkspace((state)=>state.notebook.activeId);
  const page=pages.find((candidate)=>candidate.id===activeId)??null;
  const textarea=useRef<HTMLTextAreaElement>(null);
  const [query,setQuery]=useState(""),[preview,setPreview]=useState(false),[href,setHref]=useState(""),[message,setMessage]=useState("");
  const filtered=pages.filter((candidate)=>candidate.text.toLowerCase().includes(query.toLowerCase()));
  const format=(style:SpanStyle)=>{const element=textarea.current;if(element===null||page===null)return;const from=element.selectionStart,to=element.selectionEnd;if(from===to){setMessage("Select text to format it.");return;}const span={from,to,style,...(style==="link"?{href}: {})};workspaceStore.getState().updatePage(page.id,page.text,[...page.spans,span]);setMessage("");element.focus();element.setSelectionRange(from,to);};
  return <section className="surface-widget surface-edge rounded-3xl p-4 md:p-6 w-full h-full overflow-auto" aria-label="Notebook">
    <header className="flex flex-wrap gap-3 items-center"><h1 className="font-display text-3xl">Notebook</h1><button className="surface-raised rounded-full px-4 py-2" onClick={()=>workspaceStore.getState().addPage()}>New page</button><label className="grow">Search pages<input type="search" value={query} onChange={(event)=>setQuery(event.target.value)} className="surface-nested rounded-xl w-full p-2" /></label></header>
    <div className="grid md:grid-cols-[14rem_1fr] gap-4 mt-4"><nav aria-label="Notebook pages"><ol className="space-y-2">{filtered.map((candidate)=><li key={candidate.id}><button className={`w-full p-3 rounded-xl text-start ${candidate.id===activeId?"surface-raised":"surface-nested"}`} aria-current={candidate.id===activeId?"page":undefined} onClick={()=>workspaceStore.getState().selectPage(candidate.id)}>{candidate.text.trim().split("\n")[0]?.slice(0,70)||"Untitled page"}</button></li>)}</ol></nav>
      {page===null?<p className="p-6">Create a page to start writing. Your notebook saves automatically.</p>:<div><div className="flex flex-wrap gap-2 mb-3" role="toolbar" aria-label="Text formatting">{SPAN_STYLES.map((style)=><button key={style} className="surface-raised rounded-lg px-3 py-2" disabled={preview} onPointerDown={(event)=>event.preventDefault()} onClick={()=>format(style)}>{style[0]?.toUpperCase()}{style.slice(1)}</button>)}<label>Link address<input type="url" value={href} onChange={(event)=>setHref(event.target.value)} placeholder="https://…" className="surface-nested rounded-lg p-2" /></label><button disabled={preview} onClick={()=>{const element=textarea.current;if(element===null)return;const from=element.selectionStart,to=element.selectionEnd;const spans=page.spans.flatMap((span)=>span.to<=from||span.from>=to?[span]:[...(span.from<from?[{...span,to:from}]:[]),...(span.to>to?[{...span,from:to}]:[])]);workspaceStore.getState().updatePage(page.id,page.text,normalizeSpans(spans,page.text));}}>Clear formatting</button></div>
        <button className="underline mb-3" aria-pressed={preview} onClick={()=>setPreview((value)=>!value)}>{preview?"Edit text":"Preview formatting"}</button>
        {preview?<Preview page={page}/>:<label className="block">Page text<textarea ref={textarea} value={page.text} onChange={(event)=>workspaceStore.getState().updatePage(page.id,event.target.value)} rows={18} className="block w-full mt-2 resize-y surface-nested rounded-2xl p-4" spellCheck/></label>}
        <p role="status" className="text-sm text-text-muted">{message||"Saved automatically on this device."}</p>
        <div className="flex flex-wrap gap-3 mt-4"><button onClick={()=>download(`notebook-${page.id}.md`,spansToMarkdown(page),"text/markdown")}>Export Markdown</button><button onClick={()=>download(`notebook-${page.id}.txt`,page.text,"text/plain")}>Export text</button><label className="underline cursor-pointer">Import Markdown<input type="file" accept=".md,.txt,text/markdown,text/plain" className="sr-only" onChange={async(event)=>{const file=event.target.files?.[0];if(file===undefined)return;const data=markdownToSpans(await file.text());const id=workspaceStore.getState().addPage(data.text);workspaceStore.getState().updatePage(id,data.text,data.spans);event.target.value="";}}/></label><button onClick={()=>workspaceStore.getState().movePage(page.id,-1)}>Move earlier</button><button onClick={()=>workspaceStore.getState().movePage(page.id,1)}>Move later</button><button onClick={()=>workspaceStore.getState().removePage(page.id)}>Delete page</button></div>
      </div>}
    </div>
  </section>;
}
