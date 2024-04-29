"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";
import { ReactNode } from "react";
import { rgb, hex } from "color-convert";
import { useColorPickerMode } from "./ColorPickerModeContext";

export default function AccentColorPicker() {
  const { settings, updateAccentColor, updateSiteThemeColor } = useSettings();
  const { selectedAccent } = useAccentColor();
  const { colorPickerMode } = useColorPickerMode();

  const colorPickerModeMap: Record<ColorPickerMode, ReactNode> = {
    palette: (
      <HexColorPicker
        color={
          selectedAccent === "site"
            ? settings.customThemeData[settings.customThemeIndex].siteThemeColor
            : rgb.hex(
                settings.customThemeData[settings.customThemeIndex].palette[
                  selectedAccent
                ]
              )
        }
        onChange={(newColor) => {
          if (selectedAccent === "site") {
            updateSiteThemeColor(newColor as `#${string}`);
          } else {
            updateAccentColor(selectedAccent, hex.rgb(newColor));
          }
        }}
      />
    ),
    code: null,
    shade: null,
  };

  return colorPickerModeMap[colorPickerMode];
}
