"use client";

import ColorCodeIcon from "@/components/assets/entries/colorPickerMode/ColorCodeIcon";
import ColorPickerIcon from "@/components/assets/entries/colorPickerMode/ColorPickerIcon";
import ColorShadeIcon from "@/components/assets/entries/colorPickerMode/ColorShadeIcon";
import MagicWandIcon from "@/components/assets/entries/colorPickerMode/MagicWandIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  generateRandomColor,
  generateShadeMap,
} from "@/lib/themeMaker/colorShadeCalculator";
import { useAccentColor } from "./AccentColorContext";
import { rgb, hex } from "color-convert";
import RandomDiceIcon from "@/components/assets/entries/colorPickerMode/RandomDiceIcon";
import {
  invertedIndexMap,
  regularIndexMap,
} from "@/lib/themeMaker/magicColorHelper";

export default function ColorEditorModeSelector() {
  const { settings, updateAccentColor, updateSiteThemeColor } = useSettings();
  const { selectedAccent } = useAccentColor();

  const applyColorMagic = () => {
    const { index, shadeMap } = generateShadeMap(
      (selectedAccent === "site"
        ? settings.customThemeData[settings.customThemeIndex].siteThemeColor
        : rgb.hex(
            ...settings.customThemeData[settings.customThemeIndex].palette[
              selectedAccent
            ]
          )) as HexColor
    );

    console.log(shadeMap)

    let indexMap = index > 4 ? invertedIndexMap : regularIndexMap;

    if (["primary", "saturated", "middle"].includes(selectedAccent)) {
      indexMap = index > 4 ? regularIndexMap : invertedIndexMap;
    }

    (
      ["primary", "saturated", "middle", "soft", "pastel", "light"] as Exclude<
        AccentColors,
        "site"
      >[]
    ).forEach((accentType) => {
      updateAccentColor(accentType, hex.rgb(shadeMap[indexMap[accentType]]));
    });

    updateSiteThemeColor(shadeMap[indexMap["site"]]);
  };

  const randomizeColor = () => {
    if (selectedAccent === "site") {
      updateSiteThemeColor(`#${rgb.hex(generateRandomColor())}`);
    } else {
      updateAccentColor(selectedAccent, generateRandomColor());
    }
  };

  return (
    <div className="ml-4 w-8 py-3 px-5 shrink-0 rounded-xl bg-light bg-opacity-80 shadow-lg flex flex-col items-center gap-3">
      <button
        className="transition-transform duration-150 ease-out hover:scale-110"
        onClick={applyColorMagic}
      >
        <MagicWandIcon className="w-6 h-auto aspect-square" />
      </button>
      <button
        className="transition-transform duration-150 ease-out hover:scale-110"
        onClick={randomizeColor}
      >
        <RandomDiceIcon className="w-6 h-auto aspect-square" />
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
