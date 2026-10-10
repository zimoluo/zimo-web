"use client";
import {useNavigationUi} from "./store";
export function setPaletteOpen(open:boolean):void { useNavigationUi.getState().setPaletteOpen(open); }
