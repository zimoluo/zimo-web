"use client";
import {useMemo,useSyncExternalStore} from "react";
import {useShallow} from "zustand/react/shallow";
import {useSettings} from "../../settings";
import {useStripContribution,shouldRouteToStrip} from "../../navigation";
import {selectActive,useNotifications} from "../store";
import type {Notification} from "../model/queue";
import {NotificationCard} from "./NotificationCard";
import {useAutoDismiss} from "./useAutoDismiss";
import styles from "./notifications.module.css";
const subscribe=(changed:()=>void)=>{const media=window.matchMedia("(width >= 900px)");media.addEventListener("change",changed);return()=>media.removeEventListener("change",changed);};
function StripNotification({notification,onDismiss}:{readonly notification:Notification;readonly onDismiss:(id:Notification["id"])=>void}){
 const timer=useAutoDismiss(notification.duration,()=>onDismiss(notification.id));
 const contribution=useMemo(()=>notification.exiting===true?null:{id:`notification:${notification.id}`,priority:100,label:notification.title,detail:<span onPointerEnter={timer.pause} onPointerLeave={timer.resume} onFocus={timer.pause} onBlur={timer.resume}>{notification.body}</span>},[notification.id,notification.title,notification.body,notification.exiting,timer.pause,timer.resume]);
 useStripContribution(contribution);return <span className="sr-only">{notification.title}{notification.body===undefined?"":` · ${notification.body}`}</span>;
}
export function NotificationLayer(){
 const active=useNotifications(useShallow(selectActive)),dismiss=useNotifications(state=>state.dismiss),style=useSettings(state=>state.notifications.style),stripEnabled=useSettings(state=>state.navigation.contextStrip);
 const wide=useSyncExternalStore(subscribe,()=>window.matchMedia("(width >= 900px)").matches,()=>false);
 const urgent=active.some(notification=>notification.tone==="danger");
 return <section className={styles.layer} data-style={style} role="region" aria-label="Notifications" aria-live={urgent?"assertive":"polite"} aria-relevant="additions">{style!=="off"&&active.map(notification=>wide&&stripEnabled&&shouldRouteToStrip(notification)?<StripNotification key={notification.id} notification={notification} onDismiss={dismiss}/>:<NotificationCard key={notification.id} notification={notification} onDismiss={dismiss}/>)}</section>;
}
