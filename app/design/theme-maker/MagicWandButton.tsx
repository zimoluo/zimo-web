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
  const { settings } = useSettings();
  const { selectedAccent } = useAccentColor();
  const { updateAccentColor, updateSiteThemeColor } = useSettings();

  const applyColorMagic = () => {
    const themeData = settings.customThemeData[settings.customThemeIndex];
    const baseColor =
      selectedAccent === "site"
        ? themeData.siteThemeColor
        : `#${rgb.hex(...themeData.palette[selectedAccent])}`;

    const { index, shadeMap } = generateShadeMap(baseColor as HexColor, 17);

    const mainAccentTypes: Exclude<AccentColors, "site">[] = [
      "primary",
      "saturated",
      "middle",
      "soft",
      "pastel",
      "light",
    ];

    const defaultMap = index > 7 ? invertedIndexMap : regularIndexMap;
    const indexMap = ["primary", "saturated", "middle"].includes(selectedAccent)
      ? index > 7
        ? regularIndexMap
        : invertedIndexMap
      : defaultMap;

    const currentAccentColors: HexColor[] = [];
    const upcomingAccentColors: HexColor[] = [];

    mainAccentTypes.forEach((accentType) => {
      currentAccentColors.push(`#${rgb.hex(...themeData.palette[accentType])}`);
      upcomingAccentColors.push(shadeMap[indexMap[accentType]]);
    });

    currentAccentColors.push(themeData.siteThemeColor);
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
      className="transition-transform duration-150 ease-out hover:scale-110"
      onClick={applyColorMagic}
    >
      <MagicWandIcon className="w-6 h-auto aspect-square" />
    </button>
  );
}
