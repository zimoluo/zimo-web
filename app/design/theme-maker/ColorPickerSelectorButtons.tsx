"use client";

import ColorCodeIcon from "@/components/assets/entries/colorPickerMode/ColorCodeIcon";
import ColorPickerIcon from "@/components/assets/entries/colorPickerMode/ColorPickerIcon";
import ColorShadeIcon from "@/components/assets/entries/colorPickerMode/ColorShadeIcon";
import { useColorPickerMode } from "./ColorPickerModeContext";
import editorStyle from "./color-editor.module.css";

export default function ColorPickerSelectorButtons() {
  const { setColorPickerMode, colorPickerMode } = useColorPickerMode();

  return (
    <>
      <button
        className="relative"
        onClick={() => {
          setColorPickerMode("palette");
        }}
      >
        <div
          className={`w-0 h-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out rounded-full ${
            editorStyle.selectorButtonGlow
          } ${colorPickerMode === "palette" ? "opacity-100" : "opacity-0"}`}
        />
        <ColorPickerIcon className="w-6 h-auto aspect-square relative transition-transform duration-150 ease-out hover:scale-110" />
      </button>
      <button
        className="relative"
        onClick={() => {
          if (colorPickerMode === "shade") {
            return;
          }
          setColorPickerMode("shade");
        }}
      >
        <div
          className={`w-0 h-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out rounded-full ${
            editorStyle.selectorButtonGlow
          } ${colorPickerMode === "shade" ? "opacity-100" : "opacity-0"}`}
        />
        <ColorShadeIcon className="w-6 h-auto aspect-square relative transition-transform duration-150 ease-out hover:scale-110" />
      </button>
      <button
        className="relative"
        onClick={() => {
          setColorPickerMode("code");
        }}
      >
        <div
          className={`w-0 h-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out rounded-full ${
            editorStyle.selectorButtonGlow
          } ${colorPickerMode === "code" ? "opacity-100" : "opacity-0"}`}
        />
        <ColorCodeIcon className="w-6 h-auto aspect-square relative transition-transform duration-150 ease-out hover:scale-110" />
      </button>
    </>
  );
}
