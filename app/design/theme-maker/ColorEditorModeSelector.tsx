"use client";

import ColorCodeIcon from "@/components/assets/entries/colorPickerMode/ColorCodeIcon";
import ColorPickerIcon from "@/components/assets/entries/colorPickerMode/ColorPickerIcon";
import ColorShadeIcon from "@/components/assets/entries/colorPickerMode/ColorShadeIcon";
import MagicWandIcon from "@/components/assets/entries/colorPickerMode/MagicWandIcon";

export default function ColorEditorModeSelector() {
  return (
    <div className="ml-4 w-8 py-3 px-5 shrink-0 rounded-xl bg-light bg-opacity-80 shadow-lg flex flex-col items-center gap-3">
      <button className="transition-transform duration-150 ease-out hover:scale-110">
        <MagicWandIcon className="w-6 h-auto aspect-square" />
      </button>
      <button className="transition-transform duration-150 ease-out hover:scale-110">
        <ColorPickerIcon className="w-6 h-auto aspect-square" />
      </button>
      <button className="transition-transform duration-150 ease-out hover:scale-110">
        <ColorShadeIcon className="w-6 h-auto aspect-square" />
      </button>
      <button className="transition-transform duration-150 ease-out hover:scale-110">
        <ColorCodeIcon className="w-6 h-auto aspect-square" />
      </button>
    </div>
  );
}
