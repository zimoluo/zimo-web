"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";
import { hex, rgb } from "color-convert";

export default function AccentPalettePicker() {
  const {
    currentCustomThemeConfig,
    updateSiteThemeColor,
    updateAccentColor,
    updateSettings,
    settings,
  } = useSettings();
  const { selectedAccent } = useAccentColor();
  const { handleStartTouching, handleStartDragging } = useDragAndTouch({
    onFinish: () =>
      updateSettings({ customThemeData: settings.customThemeData }),
  });

  const handleSiteColorChange = useCallback(
    (newColor: string) => {
      updateSiteThemeColor(newColor as HexColor, false);
    },
    [updateSiteThemeColor]
  );

  const handleAccentColorChange = useCallback(
    (newColor: string) => {
      updateAccentColor(
        selectedAccent as Exclude<AccentColors, "site">,
        hex.rgb(newColor),
        false
      );
    },
    [selectedAccent, updateAccentColor]
  );

  return selectedAccent === "site" ? (
    <HexColorPicker
      color={currentCustomThemeConfig.siteThemeColor}
      onChange={handleSiteColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  ) : (
    <HexColorPicker
      color={`#${rgb.hex(currentCustomThemeConfig.palette[selectedAccent])}`}
      onChange={handleAccentColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
