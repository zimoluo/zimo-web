"use client";

import { useApplyColorMagic } from "@/lib/themeMaker/applyMagicHook";
import { useAccentColor } from "./AccentColorContext";
import MagicWandIcon from "@/components/assets/entries/colorPickerMode/MagicWandIcon";

export default function MagicWandButton() {
  const { selectedAccent } = useAccentColor();
  const applyColorMagic = useApplyColorMagic();

  return (
    <button
      className="transition-transform duration-150 ease-out hover:scale-110"
      onClick={() => applyColorMagic(selectedAccent)}
    >
      <MagicWandIcon className="w-6 h-auto aspect-square" />
    </button>
  );
}
