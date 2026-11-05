"use client";
import { useEffect, useRef, useState } from "react";
import LoginIcon from "../../../ui/icons/user/LoginIcon";
import styles from "./comments.module.css";
export function Composer({ label, disabled, onSubmit, onSignIn }: { readonly label: string; readonly disabled: boolean; readonly onSubmit: (text: string) => Promise<boolean>; readonly onSignIn?: (() => void) | undefined }) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const draft = useRef({ text: "", revision: 0 });
  const sending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const submit = async () => {
    const submitted = draft.current;
    if (submitted.text.trim().length === 0 || disabled || sending.current) return;
    sending.current = true; setPending(true); setError("");
    try {
      const saved = await onSubmit(submitted.text);
      if (mounted.current && saved && draft.current.revision === submitted.revision) {
        draft.current = { text: "", revision: submitted.revision + 1 }; setText("");
      }
    } catch { if (mounted.current) setError("Could not send this comment. Your draft is kept."); }
    finally { sending.current = false; if (mounted.current) setPending(false); }
  };
  return <><form onSubmit={async (event) => { event.preventDefault(); await submit(); }} className={styles.composer} aria-busy={pending}>
    <label><span className="sr-only">{label}</span><textarea value={text} onChange={(event) => { draft.current = { text: event.target.value, revision: draft.current.revision + 1 }; setText(event.target.value); }} disabled={disabled} maxLength={4000} rows={3} placeholder="Say something…" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!event.repeat) void submit(); } }} /></label>
    {onSignIn ? <button type="button" className={styles.login} aria-label="Sign in to comment" onClick={onSignIn}><LoginIcon className={styles.loginIcon ?? ""} /></button> : text.trim().length > 0 ? <button type="submit" aria-label="Send" disabled={disabled || pending || text.trim().length === 0} className={styles.send}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 437" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={66.667} d="M200.001 33.332v369.5m0-369.5L33.334 199.999M200.001 33.332l166.666 166.667" /></svg></button> : null}
  </form>{error && <p role="alert">{error}</p>}</>;
}
