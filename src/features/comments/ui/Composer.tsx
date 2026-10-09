"use client";
import { useState } from "react";
export function Composer({ label, disabled, onSubmit }: { readonly label: string; readonly disabled: boolean; readonly onSubmit: (text: string) => Promise<boolean> }) {
  const [text, setText] = useState("");
  return <form onSubmit={async (event) => { event.preventDefault(); if (text.trim().length === 0 || disabled) return; if(await onSubmit(text)) setText(""); }} className="my-4">
    <label>{label}<textarea className="block w-full p-3 my-2 rounded-2xl surface-nested" value={text} onChange={(event) => setText(event.target.value)} disabled={disabled} maxLength={4000} rows={3} /></label>
    <button type="submit" disabled={disabled || text.trim().length === 0} className="rounded-full px-4 py-2 surface-raised disabled:opacity-50">Send</button>
  </form>;
}
