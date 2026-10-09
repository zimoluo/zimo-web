"use client";
import {withViewTransition} from "../../lib/motion";
import {flushSync} from "react-dom";
import {useSettings} from "../settings";
import {useNavigationUi} from "./store";
export function setPaletteOpen(open:boolean):void{
  const update=()=>flushSync(()=>useNavigationUi.getState().setPaletteOpen(open));
  withViewTransition(update,useSettings.getState().motion.transitions==="reduced");
}
