"use client";

import ColorCodeIcon from "@/components/assets/entries/colorPickerMode/ColorCodeIcon";
import ColorPickerIcon from "@/components/assets/entries/colorPickerMode/ColorPickerIcon";
import ColorShadeIcon from "@/components/assets/entries/colorPickerMode/ColorShadeIcon";
import selectorStyle from "./editor-mode-selector.module.css";
import { useColorPanel } from "./ColorPanelContext";

export default function ColorPickerSelectorButtons() {
  const { setColorPickerMode, colorPickerMode } = useColorPanel();

  return (
    <>
      <button
        className={`relative transition-opacity duration-300 ease-out ${
          colorPickerMode === "palette" ? "opacity-100" : "opacity-60"
        }`}
        onClick={() => {
          setColorPickerMode("palette");
        }}
      >
        <div
          className={`w-0 h-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out rounded-full ${
            selectorStyle.glow
          } ${colorPickerMode === "palette" ? "opacity-100" : "opacity-0"}`}
        />
        <ColorPickerIcon className="w-6 h-auto aspect-square relative transition-transform duration-150 ease-out hover:scale-110" />
      </button>
      <button
        className={`relative transition-opacity duration-300 ease-out ${
          colorPickerMode === "shade" ? "opacity-100" : "opacity-60"
        }`}
        onClick={() => {
          setColorPickerMode("shade");
        }}
      >
        <div
          className={`w-0 h-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out rounded-full ${
            selectorStyle.glow
          } ${colorPickerMode === "shade" ? "opacity-100" : "opacity-0"}`}
        />
        <ColorShadeIcon className="w-6 h-auto aspect-square relative transition-transform duration-150 ease-out hover:scale-110" />
      </button>
      <button
        className={`relative transition-opacity duration-300 ease-out ${
          colorPickerMode === "code" ? "opacity-100" : "opacity-60"
        }`}
        onClick={() => {
          setColorPickerMode("code");
        }}
      >
        <div
          className={`w-0 h-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out rounded-full ${
            selectorStyle.glow
          } ${colorPickerMode === "code" ? "opacity-100" : "opacity-0"}`}
        />
        <ColorCodeIcon className="w-6 h-auto aspect-square relative transition-transform duration-150 ease-out hover:scale-110" />
      </button>
    </>
  );
}
