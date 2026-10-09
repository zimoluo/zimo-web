import type {NotificationInput} from "../notifications";
export function shouldRouteToStrip(notification:NotificationInput):boolean{
  return (notification.tone??"neutral")==="neutral"&&notification.action===undefined&&notification.duration!==null&&notification.duration!==undefined&&notification.duration<=3000;
}
