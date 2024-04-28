"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useAccentColor } from "./AccentColorContext";
import { rgb } from "color-convert";
import RandomDiceIcon from "@/components/assets/entries/colorPickerMode/RandomDiceIcon";
import { generateRandomColor } from "@/lib/themeMaker/colorHelper";

export default function RandomizeColorButton() {
  const { updateAccentColor, updateSiteThemeColor } = useSettings();
  const { selectedAccent } = useAccentColor();

  const randomizeColor = () => {
    if (selectedAccent === "site") {
      updateSiteThemeColor(`#${rgb.hex(generateRandomColor())}`);
    } else {
      updateAccentColor(selectedAccent, generateRandomColor());
    }
  };

  return (
    <button
      className="transition-transform duration-150 ease-out hover:scale-110"
      onClick={randomizeColor}
    >
      <RandomDiceIcon className="w-6 h-auto aspect-square" />
    </button>
  );
}
