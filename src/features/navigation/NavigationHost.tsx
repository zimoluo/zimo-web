"use client";
import {useEffect} from "react";
import {useSettings} from "../settings";
import {CommandPalette} from "./CommandPalette";
import {LiveAnnouncements} from "./LiveAnnouncements";
import {WindowStripContribution} from "./ContextStrip";
export function NavigationHost(){
 useEffect(()=>{const update=()=>{document.documentElement.dataset.nav=useSettings.getState().navigation.bar;};update();const unsubscribe=useSettings.subscribe(state=>state.navigation.bar,update);return unsubscribe;},[]);
 return <><CommandPalette/><WindowStripContribution/><LiveAnnouncements/></>;
}
