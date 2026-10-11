"use client";
import {useId,type ComponentType,type ReactNode} from "react";
import type {IconProps} from "../../../ui/icons";
import {Toggle} from "../../../ui/Toggle";
import controls from "../../../ui/controls.module.css";
import styles from "./settings.module.css";
export function SettingsPlate({title,icon:Icon,children}:{readonly title:string;readonly icon:ComponentType<IconProps>;readonly children:ReactNode}){
 const id=useId();
 return <section className={`${styles.plate} surface-widget surface-edge`} aria-labelledby={id}><h2 id={id} className={styles.heading}><Icon className={styles.headingIcon??""}/>{title}</h2>{children}</section>;
}
export function SettingsSwitch({label,checked,change}:{readonly label:string;readonly checked:boolean;readonly change:(value:boolean)=>void}){
 return <label className={styles.switchRow}><span>{label}</span><Toggle checked={checked} change={change}/></label>;
}
export type SettingChoice<T extends string>={readonly value:T;readonly label:string};
export function SettingsSteps<T extends string>({label,value,choices,change}:{readonly label:string;readonly value:T;readonly choices:readonly SettingChoice<T>[];readonly change:(value:T)=>void}){
 const index=Math.max(0,choices.findIndex(choice=>choice.value===value));
 return <div className={styles.setting}><div className={styles.settingHeading}>{label}<span className={styles.currentValue}>{choices[index]?.label}</span></div><div className={styles.stepTrack}><div className={styles.notches} aria-hidden="true">{choices.map(choice=><span key={choice.value}/>)}</div><span className={styles.stepThumb} style={{left:`${index/(choices.length-1)*100}%`}} aria-hidden="true"/><input className={styles.stepInput} type="range" min={0} max={choices.length-1} step={1} value={index} aria-label={label} aria-valuetext={choices[index]?.label} onChange={event=>{const choice=choices[Number(event.target.value)];if(choice)change(choice.value);}}/></div><div className={styles.stepCaptions}>{choices.map(choice=><button type="button" key={choice.value} aria-pressed={choice.value===value} onClick={()=>change(choice.value)}>{choice.label}</button>)}</div></div>;
}
export function SettingsRange({label,value,min,max,unit="",change}:{readonly label:string;readonly value:number;readonly min:number;readonly max:number;readonly unit?:string;readonly change:(value:number)=>void}){
 return <div className={styles.setting}><label className={styles.settingHeading}>{label}<span className={styles.valueField}><input aria-label={`${label} value`} type="number" min={min} max={max} step={1} value={value} onChange={event=>{const next=Number(event.target.value);if(Number.isFinite(next))change(Math.max(min,Math.min(max,Math.round(next))));}}/>{unit&&<span aria-hidden="true">{unit}</span>}</span></label><input className={controls.range} type="range" min={min} max={max} step={1} value={value} aria-label={label} aria-valuetext={`${value}${unit?` ${unit}`:""}`} onChange={event=>change(Number(event.target.value))}/><div className={styles.rangeBounds} aria-hidden="true"><span>{min}{unit}</span><span>{max}{unit}</span></div></div>;
}
export function SettingsSegments<T extends string>({label,value,choices,change}:{readonly label:string;readonly value:T;readonly choices:readonly SettingChoice<T>[];readonly change:(value:T)=>void}){
 return <div className={styles.setting}><div className={styles.settingHeading}>{label}</div><div className={styles.segments} role="radiogroup" aria-label={label} onKeyDown={event=>{const direction=event.key==="ArrowRight"||event.key==="ArrowDown"?1:event.key==="ArrowLeft"||event.key==="ArrowUp"?-1:0;if(direction===0)return;event.preventDefault();const index=Math.max(0,choices.findIndex(choice=>choice.value===value)),next=choices[(index+direction+choices.length)%choices.length];if(next){change(next.value);event.currentTarget.querySelector<HTMLButtonElement>(`[data-choice="${next.value}"]`)?.focus();}}}>{choices.map(choice=><button type="button" role="radio" aria-checked={choice.value===value} tabIndex={choice.value===value?0:-1} data-choice={choice.value} key={choice.value} onClick={()=>change(choice.value)}>{choice.label}</button>)}</div></div>;
}
