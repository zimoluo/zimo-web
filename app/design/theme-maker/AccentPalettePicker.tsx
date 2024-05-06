"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker, RgbColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";

export default function AccentPalettePicker() {
  const { currentCustomThemeConfig, updateAccentColor, updateSiteThemeColor } =
    useSettings();
  const { selectedAccent } = useAccentColor();

  return selectedAccent === "site" ? (
    <HexColorPicker
      color={currentCustomThemeConfig.siteThemeColor}
      onChange={(newColor) => {
        updateSiteThemeColor(newColor as `#${string}`);
      }}
    />
  ) : (
    <RgbColorPicker
      color={{
        r: currentCustomThemeConfig.palette[selectedAccent][0],
        g: currentCustomThemeConfig.palette[selectedAccent][1],
        b: currentCustomThemeConfig.palette[selectedAccent][2],
      }}
      onChange={(newColor) => {
        updateAccentColor(selectedAccent, [newColor.r, newColor.g, newColor.b]);
      }}
    />
  );
}
