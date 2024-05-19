"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker, RgbColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";
import { useDragAndTouch } from "@/lib/helperHooks";

export default function AccentPalettePicker() {
  const {
    currentCustomThemeConfig,
    updateAccentColor,
    updateSiteThemeColor,
    updateSettings,
    settings,
  } = useSettings();
  const { selectedAccent } = useAccentColor();
  const { handleStartTouching, handleStartDragging } = useDragAndTouch({
    onFinish: () =>
      updateSettings({ customThemeData: settings.customThemeData }),
  });

  return selectedAccent === "site" ? (
    <HexColorPicker
      color={currentCustomThemeConfig.siteThemeColor}
      onChange={(newColor) => {
        updateSiteThemeColor(newColor as `#${string}`, false);
      }}
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
      onChange={(newColor) => {
        updateAccentColor(
          selectedAccent,
          [newColor.r, newColor.g, newColor.b],
          false
        );
      }}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
