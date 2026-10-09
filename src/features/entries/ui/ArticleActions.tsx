"use client";
import { useState } from "react";
import type { Entry } from "../model/types";
import { entryPath,apiEntryPath } from "../paths";
export function ArticleActions({entry}:{readonly entry:Entry}){
 const [status,setStatus]=useState("");
 const url=`https://www.zimoluo.me${entryPath(entry.section,entry.slug)}`,text=entry.title;
 const services=[{label:"Bluesky",href:`https://bsky.app/intent/compose?text=${encodeURIComponent(`${text}\n${url}`)}`},{label:"X",href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`},{label:"Facebook",href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`},{label:"Reddit",href:`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`},{label:"LinkedIn",href:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}];
 return <details className="my-4"><summary className="cursor-pointer">Share or download</summary><nav aria-label="Share this entry" className="flex flex-wrap gap-4 my-3"><button className="underline" onClick={async()=>{try{if(navigator.share)await navigator.share({title:text,url});else{await navigator.clipboard.writeText(url);setStatus("Link copied.");}}catch{setStatus("Sharing was canceled or unavailable.");}}}>Share</button><button className="underline" onClick={async()=>{try{await navigator.clipboard.writeText(url);setStatus("Link copied.");}catch{setStatus("Could not copy this link.");}}}>Copy link</button>{services.map((service)=><a key={service.label} href={service.href} target="_blank" rel="noopener noreferrer" className="underline">{service.label}</a>)}{entry.body.kind==="document"?<a className="underline" href={`${apiEntryPath(entry.section,entry.slug)}/document`} download={`${entry.slug}.md`}>Download Markdown</a>:null}{entry.section==="blog"?<a className="underline" href="/blog/feed.rss">RSS</a>:null}</nav>{status?<p role="status">{status}</p>:null}</details>;
}
