"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker, RgbColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";

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
    (newColor: { r: number; g: number; b: number }) => {
      updateAccentColor(
        selectedAccent as Exclude<AccentColors, "site">,
        [newColor.r, newColor.g, newColor.b],
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
    <RgbColorPicker
      color={{
        r: currentCustomThemeConfig.palette[selectedAccent][0],
        g: currentCustomThemeConfig.palette[selectedAccent][1],
        b: currentCustomThemeConfig.palette[selectedAccent][2],
      }}
      onChange={handleAccentColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
