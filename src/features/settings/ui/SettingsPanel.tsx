"use client";
import Image from "next/image";
import {useState,type CSSProperties,type KeyboardEvent} from "react";
import {useShallow} from "zustand/react/shallow";
import {useSettings} from "../store";
import {getTheme,listedThemeIds,useTheme,activeThemeSource,schemesOf,resolve,effectiveScheme,formatOklch,type ThemeSource,type Scheme} from "../../theme";
import {openWindowDefinition} from "../../windows";
import {notify} from "../../notifications";
import DesignIcon from "../../../ui/icons/navigation/DesignIcon";
import BlogIcon from "../../../ui/icons/navigation/BlogIcon";
import WindowIcon from "../../../ui/icons/entries/WindowIcon";
import FallingStarsIcon from "../../../ui/icons/entries/FallingStarsIcon";
import CogIcon from "../../../ui/icons/toast/CogIcon";
import CommentRingIcon from "../../../ui/icons/toast/CommentRingIcon";
import NoSignIcon from "../../../ui/icons/entries/NoSignIcon";
import {SettingsPlate,SettingsSwitch,SettingsRange,SettingsSteps,SettingsSegments} from "./SettingsControls";
import styles from "./settings.module.css";
const artworkAliases:Readonly<Record<string,string>>={"birthday-generic":"birthdayGeneric","gallery3-d":"gallery3D","plain-black":"plainBlack","plain-dark":"plainDark","plain-gray":"plainGray","plain-light":"plainLight"};
const withoutArtwork:readonly string[]=["cubistic","default-editor","lollipop","oasis","spring-field"];
function themeArtwork(source:ThemeSource,scheme:Scheme):CSSProperties{
 const theme=resolve(source,effectiveScheme(source,scheme));
 return {background:`radial-gradient(ellipse at 22% 10%,${formatOklch(theme.tone(.15))},transparent 65%),linear-gradient(135deg,${formatOklch(theme.tone(.3))},${formatOklch(theme.tone(.75))})`};
}
function radioKeys(event:KeyboardEvent<HTMLElement>){
 const buttons=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')),current=buttons.findIndex(button=>button===document.activeElement),direction=event.key==="ArrowRight"||event.key==="ArrowDown"?1:event.key==="ArrowLeft"||event.key==="ArrowUp"?-1:0;
 if(direction===0)return;event.preventDefault();const next=buttons[(Math.max(0,current)+direction+buttons.length)%buttons.length];next?.click();next?.focus();
}
function ThemePicker(){
 const preferences=useTheme(useShallow(state=>({active:state.active,preference:state.schemePreference,scheme:state.scheme,seasonal:state.seasonal,shuffle:state.shuffle,profiles:state.profiles})));
 const [everywhere,setEverywhere]=useState(false);
 const source=activeThemeSource(),availableSchemes=schemesOf(source),currentName=source.name,listedSelection=listedThemeIds.some(id=>preferences.active.kind==="builtIn"&&preferences.active.id===id);
 const choose=(active:typeof preferences.active)=>{const state=useTheme.getState();if(everywhere)state.selectEverywhere(active);else if(active.kind==="profile")state.selectProfile(active.index);else state.selectBuiltIn(active.id);};
 return <SettingsPlate title="Theme" icon={DesignIcon}>
  <div className={styles.themeWell}><div className={styles.themeGrid} role="radiogroup" aria-label="Website theme" onKeyDown={radioKeys}>{listedThemeIds.map((id,index)=>{const source=getTheme(id),selected=preferences.active.kind==="builtIn"&&preferences.active.id===id;return <button type="button" className={styles.themeButton} key={id} role="radio" aria-label={`Use ${source.name} theme`} aria-checked={selected} tabIndex={selected||!listedSelection&&index===0?0:-1} title={source.name} onClick={()=>choose({kind:"builtIn",id})}>{withoutArtwork.includes(id)?<span className={styles.themeArtwork} style={themeArtwork(source,preferences.scheme)}/>:<Image src={`/theme/picker/${artworkAliases[id]??id}.svg`} alt="" width={48} height={48} loading="lazy" draggable={false}/>}</button>;})}</div></div>
  <div className={styles.themeCaption}><span>Current theme</span><strong>{currentName}</strong></div>
  <div className={styles.setting}><div className={styles.settingHeading}>Your profiles</div>{preferences.profiles.length===0?<p className={styles.emptyProfiles}>Save your own palette in Theme Studio.</p>:<div className={styles.profiles}>{preferences.profiles.map((profile,index)=><button type="button" key={`${profile.id}-${index}`} className={styles.profile} aria-label={`Use profile ${profile.name}`} aria-pressed={preferences.active.kind==="profile"&&preferences.active.index===index} onClick={()=>choose({kind:"profile",index})}><span className={styles.profileArtwork} style={themeArtwork(profile,preferences.scheme)}/><span className={styles.profileName}>{profile.name}</span></button>)}</div>}</div>
  <SettingsSegments label="Color scheme" value={preferences.preference} choices={[{value:"system",label:"System"},{value:"light",label:"Light"},{value:"dark",label:"Dark"}]} change={value=>useTheme.getState().setSchemePreference(value)}/>
  {availableSchemes.length===1?<p className={styles.emptyProfiles}>{currentName} keeps its authored appearance. Your preference applies to themes with both schemes.</p>:null}
  <SettingsSwitch label="Use selection on every page" checked={everywhere} change={setEverywhere}/>
  <SettingsSwitch label="Seasonal themes" checked={preferences.seasonal} change={value=>useTheme.getState().setSeasonal(value)}/>
  <SettingsSwitch label="Shuffle on each visit" checked={preferences.shuffle} change={value=>useTheme.getState().setShuffle(value)}/>
  <button type="button" className={styles.primaryButton} onClick={()=>{openWindowDefinition("studio");notify({title:"Theme Studio",icon:"studio"});}}><DesignIcon/>Open Theme Studio</button>
 </SettingsPlate>;
}
function NotificationStyle(){
 const value=useSettings(state=>state.notifications.style);
 return <div className={styles.setting}><div className={styles.settingHeading}>Notification style</div><div className={styles.notificationChoices} role="radiogroup" aria-label="Notification style" onKeyDown={radioKeys}>{(["off","banner","inline"] as const).map(style=><button type="button" key={style} className={styles.notificationChoice} role="radio" aria-checked={value===style} tabIndex={value===style?0:-1} onClick={()=>useSettings.getState().setNotifications({style})}><span className={styles.notificationPreview} aria-hidden="true">{style==="off"?<NoSignIcon className="size-7 opacity-50"/>:style==="banner"?<><span className={styles.miniBanner}/><span className={styles.miniBanner}/></>:<><span className={styles.miniLine}/><span className={styles.miniLine}/><span className={styles.miniBanner}/></>}</span><span>{style==="off"?"Off":style==="banner"?"Banner":"Inline"}</span></button>)}</div></div>;
}
function InterfaceSettings(){
 const settings=useSettings(useShallow(state=>({navigation:state.navigation,windows:state.windows,notifications:state.notifications})));
 const set=useSettings.getState();
 return <SettingsPlate title="Interface" icon={WindowIcon}>
  <SettingsSteps label="Navigation bar" value={settings.navigation.bar} choices={[{value:"hidden",label:"Hidden"},{value:"pinned",label:"Pinned"},{value:"auto",label:"Flexible"}]} change={bar=>set.setNavigation({bar})}/>
  <SettingsSwitch label="Context strip" checked={settings.navigation.contextStrip} change={contextStrip=>set.setNavigation({contextStrip})}/>
  <SettingsRange label="Window limit" value={settings.windows.limit} min={1} max={32} change={limit=>set.setWindows({limit})}/>
  <SettingsSwitch label="Restore windows on load" checked={settings.windows.restoreOnLoad} change={restoreOnLoad=>set.setWindows({restoreOnLoad})}/>
  <SettingsSwitch label="Window snapping" checked={settings.windows.snapping} change={snapping=>set.setWindows({snapping})}/>
  <SettingsSwitch label="Snap to viewport" checked={settings.windows.snapToViewport} change={snapToViewport=>set.setWindows({snapToViewport})}/>
  <SettingsSteps label="Resize from" value={settings.windows.resizeBehavior} choices={[{value:"corner",label:"Corner"},{value:"center",label:"Center"},{value:"adaptive",label:"Adaptive"}]} change={resizeBehavior=>set.setWindows({resizeBehavior})}/>
  <NotificationStyle/>
  <SettingsRange label="Visible notification limit" value={settings.notifications.limit} min={1} max={10} change={limit=>set.setNotifications({limit})}/>
 </SettingsPlate>;
}
function ReadingSettings(){
 const settings=useSettings(state=>state.reading),set=useSettings.getState().setReading;
 return <SettingsPlate title="Reading" icon={BlogIcon}><SettingsRange label="Reading blur" value={settings.blur} min={0} max={200} unit="px" change={blur=>set({blur})}/><SettingsSwitch label="Serif reading font" checked={settings.serif} change={serif=>set({serif})}/><SettingsSwitch label="Table of contents" checked={settings.tableOfContents} change={tableOfContents=>set({tableOfContents})}/></SettingsPlate>;
}
function MotionSettings(){
 const settings=useSettings(state=>state.motion),set=useSettings.getState().setMotion;
 return <SettingsPlate title="Motion" icon={FallingStarsIcon}><SettingsSteps label="Backdrop motion" value={settings.backdrop} choices={[{value:"off",label:"Off"},{value:"reduced",label:"Reduced"},{value:"full",label:"Full"}]} change={backdrop=>set({backdrop})}/><SettingsSwitch label="Pointer gestures" checked={settings.gestures} change={gestures=>set({gestures})}/><SettingsSteps label="Transitions" value={settings.transitions} choices={[{value:"auto",label:"Automatic"},{value:"reduced",label:"Reduced"}]} change={transitions=>set({transitions})}/></SettingsPlate>;
}
function StudioSettings(){
 const settings=useSettings(state=>state.studio),set=useSettings.getState().setStudio;
 return <SettingsPlate title="Theme Studio" icon={CogIcon}><SettingsSwitch label="Expand Studio window" checked={settings.expandWindow} change={expandWindow=>set({expandWindow})}/><SettingsSwitch label="Extended gradient stop range" checked={settings.extendedStopRange} change={extendedStopRange=>set({extendedStopRange})}/><SettingsSwitch label="Color interpolation controls" checked={settings.showInterpolation} change={showInterpolation=>set({showInterpolation})}/><SettingsSwitch label="Color lookup panel" checked={settings.showLookupPanel} change={showLookupPanel=>set({showLookupPanel})}/></SettingsPlate>;
}
function AccountSettings(){
 const settings=useSettings(useShallow(state=>({comments:state.comments.enabled,sound:state.sound.enabled,sync:state.sync.enabled}))),set=useSettings.getState();
 return <SettingsPlate title="Account & community" icon={CommentRingIcon}><SettingsSwitch label="Account sync" checked={settings.sync} change={enabled=>set.setSync({enabled})}/><SettingsSwitch label="Comments" checked={settings.comments} change={enabled=>set.setComments({enabled})}/><SettingsSwitch label="Sound effects" checked={settings.sound} change={enabled=>set.setSound({enabled})}/></SettingsPlate>;
}
export function SettingsPanel(){return <div className={styles.panel}><ThemePicker/><InterfaceSettings/><ReadingSettings/><MotionSettings/><StudioSettings/><AccountSettings/></div>;}
