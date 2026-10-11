"use client";
import { Toggle } from "../../../ui/Toggle";
import { useState } from "react";
import { z } from "zod";
import { useOverlayIdentity } from "../../overlays";
import { InlineMarks } from "../../document";
import { notify } from "../../notifications";
import { useWorkspace, workspaceStore } from "../../workspace";
import { useTree } from "../store";
import { SPRITES,SPRITE_BASE } from "../model";
import styles from "./tree.module.css";

export function TreeInfoOverlay() {return <div className={styles.modal}><h1 className="text-2xl font-display mb-4">Christmas Tree</h1><p>Leave a message on Zimo Web’s shared festive tree. Pick a decoration, drag it to an open spot, and enter your name and message.</p><p className="my-4">Public messages can be read by anyone. Private messages are visible to the site owner. Keep your message kind and appropriate.</p><p>You can wait until December 25 to open the messages and keep the surprise.</p></div>;}
export function TreeMessageOverlay(props:Record<string,unknown>) {
  const {id}=z.object({id:z.string()}).parse(props);
  const message=useTree((state)=>state.messages.find((entry)=>entry.id===id));
  const viewed=useWorkspace((state)=>state.christmasTree.viewedIds.includes(id));
  const {dismiss}=useOverlayIdentity();
  const [opened,setOpened]=useState(false);
  if(message===undefined)return <p className={styles.modal}>This message is no longer available.</p>;
  const now=new Date();const holidays=now.getMonth()===0 || now.getMonth()===11 && now.getDate()>=25;
  if(!holidays&&!viewed&&!opened&&!message.neverShowSpoilerWarning)return <div className={styles.modal}><h1 className="text-2xl mb-4">Save the surprise?</h1><p>This Christmas message is waiting for you. Open it now or come back on December 25.</p><div className="flex gap-3 mt-6"><button type="button" className="surface-raised rounded-xl p-3" onClick={()=>{workspaceStore.getState().markTreeViewed(id);setOpened(true);}}>Open message</button><button type="button" className="p-3" onClick={dismiss}>Maybe later</button></div></div>;
  return <div className={styles.modal}><h1 className="font-display text-2xl mb-4">From {message.from}</h1><img src={`${SPRITE_BASE}${message.sprite}.svg`} alt="" width={100} height={100} className="float-right"/><p className="text-lg whitespace-pre-wrap"><InlineMarks>{message.message}</InlineMarks></p><button type="button" className="surface-raised rounded-xl mt-6 p-3" onClick={dismiss}>Happy holidays!</button></div>;
}
export function TreeConfirmOverlay(props:Record<string,unknown>) {
  const initial=z.object({position:z.tuple([z.number(),z.number()]),sprite:z.string()}).parse(props);
  const {dismiss}=useOverlayIdentity();
  const [isPublic,setPublic]=useState(true);
  const [sprite,setSprite]=useState(initial.sprite);const [pending,setPending]=useState(false);const [error,setError]=useState("");
  return <form className={styles.modal} onSubmit={async(event)=>{
    event.preventDefault();if(pending)return;setPending(true);setError("");
    const form=new FormData(event.currentTarget);
    try {
      const response=await fetch("/api/v1/tree-messages",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({from:form.get("from"),message:form.get("message"),position:initial.position,sprite,isPublic:form.get("public")==="on"})});
      if(!response.ok){const problem:unknown=await response.json().catch(()=>null);throw new Error(typeof problem==="object"&&problem!==null&&"detail"in problem&&typeof problem.detail==="string"?problem.detail:"Could not add the message.");}
      const result:unknown=await response.json();
      if(typeof result==="object"&&result!==null&&"message"in result&&typeof result.message==="object"&&result.message!==null&&"id"in result.message&&typeof result.message.id==="string")workspaceStore.getState().markTreeViewed(result.message.id);
      await useTree.getState().refresh();notify({title:"Christmas Tree",body:"Message added to the tree!"});dismiss();
    }catch(cause){setError(cause instanceof Error?cause.message:"Could not add the message.");setPending(false);}
  }}>
    <h1 className="text-2xl font-display mb-4">Leave your message</h1>
    <label className="block">From<span className="surface-sunken block rounded-xl my-2"><input required name="from" maxLength={500} className="block w-full rounded-xl bg-transparent p-3" autoComplete="name" /></span></label>
    <label className="block">Decoration<span className="surface-sunken block rounded-xl my-2"><select value={sprite} onChange={(event)=>setSprite(event.target.value)} className="block w-full rounded-xl bg-transparent p-3">{SPRITES.map((option)=><option key={option} value={option}>{option}</option>)}</select></span></label>
    <label className="block">Message<span className="surface-sunken block rounded-xl my-2"><textarea required name="message" maxLength={4000} className="block w-full rounded-xl bg-transparent p-3 min-h-40" /></span></label>
    <label className="flex gap-2 my-3"><Toggle name="public" checked={isPublic} change={setPublic}/>Public message</label>
    <p className="text-sm text-text-muted">Private messages are visible to the site owner.</p>
    {error&&<p role="alert" className="mt-4">{error}</p>}
    <div className="flex gap-4 mt-6"><button type="submit" disabled={pending} className="surface-raised rounded-xl p-3">{pending?"Adding…":"Decorate!"}</button><button type="button" disabled={pending} className="p-3" onClick={dismiss}>Cancel</button></div>
  </form>;
}
