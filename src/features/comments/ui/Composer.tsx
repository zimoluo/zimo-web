"use client";
import { useState } from "react";
import LoginIcon from "../../../ui/icons/user/LoginIcon";
import styles from "./comments.module.css";
export function Composer({ label, disabled, onSubmit, onSignIn }: { readonly label: string; readonly disabled: boolean; readonly onSubmit: (text: string) => Promise<boolean>; readonly onSignIn?: (() => void) | undefined }) {
  const [text, setText] = useState("");
  const submit = async () => { if (text.trim().length === 0 || disabled) return; if (await onSubmit(text)) setText(""); };
  return <form onSubmit={async (event) => { event.preventDefault(); await submit(); }} className={styles.composer}>
    <label><span className="sr-only">{label}</span><textarea value={text} onChange={(event) => setText(event.target.value)} disabled={disabled} maxLength={4000} rows={3} placeholder="Say something…" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.nativeEvent.isComposing) { event.preventDefault(); void submit(); } }} /></label>
    {onSignIn ? <button type="button" className={styles.login} aria-label="Sign in to comment" onClick={onSignIn}><LoginIcon className={styles.loginIcon ?? ""} /></button> : text.trim().length > 0 ? <button type="submit" aria-label="Send" disabled={disabled || text.trim().length === 0} className={styles.send}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 437" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={66.667} d="M200.001 33.332v369.5m0-369.5L33.334 199.999M200.001 33.332l166.666 166.667" /></svg></button> : null}
  </form>;
}
