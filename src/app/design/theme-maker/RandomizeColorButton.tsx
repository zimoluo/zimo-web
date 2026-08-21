"use client";

import RandomDiceIcon from "@/components/assets/entries/colorPickerMode/RandomDiceIcon";
import { useColorPanel } from "./ColorPanelContext";

export default function RandomizeColorButton() {
  const { randomFunction } = useColorPanel();

  return (
    <button
      className="transition-transform duration-300 ease-out hover:scale-110"
      onClick={randomFunction}
    >
      <RandomDiceIcon className="w-6 h-auto aspect-square" />
    </button>
  );
}
