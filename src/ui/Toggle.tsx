"use client";
import type { InputHTMLAttributes } from "react";
import styles from "./controls.module.css";
type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "defaultChecked" | "onChange"> & { readonly checked:boolean; readonly change:(value:boolean)=>void };
export function Toggle({checked,change,...props}:ToggleProps) {
 return <span className={styles.toggle}><input {...props} type="checkbox" checked={checked} onChange={event=>change(event.target.checked)}/><span className={styles.track} aria-hidden="true"><span className={styles.thumb}/></span></span>;
}
