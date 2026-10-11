"use client";
import styles from "./controls.module.css";
export function Toggle({checked,change}:{readonly checked:boolean;readonly change:(value:boolean)=>void}) {
 return <span className={styles.toggle}><input type="checkbox" checked={checked} onChange={event=>change(event.target.checked)}/><span className={styles.track} aria-hidden="true"><span className={styles.thumb}/></span></span>;
}
