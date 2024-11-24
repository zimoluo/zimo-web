"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import {
  generateShadeMap,
  isShadeMapRoughlyTheSame,
} from "@/lib/themeMaker/colorHelper";
import { useAccentColor } from "./AccentColorContext";
import { rgb, hex } from "color-convert";
import {
  invertedIndexMap,
  regularIndexMap,
} from "@/lib/themeMaker/colorHelper";
import MagicWandIcon from "@/components/assets/entries/colorPickerMode/MagicWandIcon";

export default function MagicWandButton() {
  const { currentCustomThemeConfig } = useSettings();
  const { selectedAccent } = useAccentColor();
  const { updateAccentColor, updateSiteThemeColor } = useSettings();

  const applyColorMagic = () => {
    const baseColor =
      selectedAccent === "site"
        ? currentCustomThemeConfig.siteThemeColor
        : `#${rgb.hex(...currentCustomThemeConfig.palette[selectedAccent])}`;

    const { index, shadeMap } = generateShadeMap(baseColor as HexColor, 17);

    const mainAccentTypes: Exclude<AccentColors, "site">[] = [
      "primary",
      "saturated",
      "pastel",
      "light",
    ];

    const defaultMap = index > 7 ? invertedIndexMap : regularIndexMap;
    const indexMap = ["primary", "saturated"].includes(selectedAccent)
      ? index > 7
        ? regularIndexMap
        : invertedIndexMap
      : defaultMap;

    const currentAccentColors: HexColor[] = [];
    const upcomingAccentColors: HexColor[] = [];

    mainAccentTypes.forEach((accentType) => {
      currentAccentColors.push(
        `#${rgb.hex(...currentCustomThemeConfig.palette[accentType])}`
      );
      upcomingAccentColors.push(shadeMap[indexMap[accentType]]);
    });

    currentAccentColors.push(currentCustomThemeConfig.siteThemeColor);
    upcomingAccentColors.push(shadeMap[indexMap["site"]]);

    if (isShadeMapRoughlyTheSame(currentAccentColors, upcomingAccentColors)) {
      return;
    }

    mainAccentTypes.forEach((accentType) => {
      updateAccentColor(accentType, hex.rgb(shadeMap[indexMap[accentType]]));
    });
    updateSiteThemeColor(shadeMap[indexMap["site"]]);
  };

  return (
    <button
      className="transition-transform duration-300 ease-out hover:scale-110"
      onClick={applyColorMagic}
    >
      <MagicWandIcon className="w-6 h-auto aspect-square" />
    </button>
  );
}
