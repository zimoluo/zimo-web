"use client";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { useColorPicker } from "./store";
const Picker = dynamic(() => import("./ColorPicker").then((module) => module.ColorPicker), { ssr: false });
export function StudioPickerHost() {
  const target = useColorPicker((state) => state.target);
  if (target === null) return null;
  const modal = target.anchor.closest("dialog:modal");
  return modal === null ? <Picker /> : createPortal(<Picker />, modal);
}
