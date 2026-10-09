"use client";
import { useEffect,useState } from "react";
import { fetchSummaries,entryPath,parseSlug } from "../../entries";
import type { EntrySummary,Section } from "../../entries";
import { InlineMarks } from "./InlineMarks";

export function DirectiveCard({section:rawSection="blog",slug:rawSlug}:{readonly section?:unknown;readonly slug?:unknown}) {
  const section:Section=rawSection==="album"||rawSection==="photos"?"album":rawSection==="projects"||rawSection==="management"?rawSection:"blog";
  const slug=typeof rawSlug==="string"?parseSlug(rawSlug):null;
  const [entry,setEntry]=useState<EntrySummary|null>(null);
  useEffect(()=>{
    if(slug===null)return;
    const controller=new AbortController();
    void fetchSummaries(section,controller.signal).then((items)=>setEntry(items.find((item)=>item.slug===slug)??null),()=>{});
    return()=>controller.abort();
  },[section,slug]);
  if(slug===null)return <p role="note">This article reference has an invalid slug.</p>;
  return <a className="zw-article-card surface-raised surface-edge block rounded-2xl p-4 my-4" href={entryPath(section,slug)}><h3 className="font-display text-xl"><InlineMarks>{entry?.title??slug.replaceAll("-"," ")}</InlineMarks></h3>{entry?.description===undefined?null:<p><InlineMarks>{entry.description}</InlineMarks></p>}<span className="text-sm text-text-muted">Read in {section}</span></a>;
}
