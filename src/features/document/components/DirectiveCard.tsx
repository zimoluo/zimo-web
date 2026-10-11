"use client";

import { useEffect,useState } from "react";
import { fetchSummaries,entryPath,parseSlug } from "../../entries";
import type { EntrySummary,Section } from "../../entries";
import { formatAbsolute } from "../../../lib/datetime";
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
  return <a className="zw-article-card surface-raised surface-outline block rounded-3xl px-4 pt-4 pb-7 my-4 shadow-lg backdrop-blur-[6px] relative" href={entryPath(section,slug)}><h3 className="text-lg font-bold"><InlineMarks>{entry?.title??slug.replaceAll("-"," ")}</InlineMarks></h3>{entry?.description===undefined?null:<p><InlineMarks>{entry.description}</InlineMarks></p>}<span className="absolute bottom-1 right-5 text-sm font-bold">{entry === null ? "" : `${formatAbsolute(entry.publishedAt)} · `}{section === "album" ? "Album" : section === "projects" ? "Project" : section === "management" ? "Management" : "Blog"}</span></a>;
}
