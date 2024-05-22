import { rgb, hex } from "color-convert";
import {
  invertedIndexMap,
  regularIndexMap,
} from "@/lib/themeMaker/colorHelper";
import {
  generateShadeMap,
  isShadeMapRoughlyTheSame,
} from "@/lib/themeMaker/colorHelper";
import { useSettings } from "@/components/contexts/SettingsContext";

export const useApplyColorMagic = () => {
  const { updateAccentColor, updateSiteThemeColor, currentCustomThemeConfig } =
    useSettings();

  return (selectedAccent: AccentColors, initialColor?: ColorTriplet) => {
    const baseColor = initialColor
      ? `#${rgb.hex(initialColor)}`
      : selectedAccent === "site"
      ? currentCustomThemeConfig.siteThemeColor
      : `#${rgb.hex(...currentCustomThemeConfig.palette[selectedAccent])}`;

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
};
