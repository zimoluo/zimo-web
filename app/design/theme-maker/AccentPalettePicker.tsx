"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker, RgbColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";

const arrayToRgb = (
  colorArray: ColorTriplet
): { r: number; g: number; b: number } => {
  const [r, g, b] = colorArray;
  return { r, g, b };
};

const rgbToArray = ({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): ColorTriplet => [r, g, b];

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
        rgbToArray(newColor),
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
      color={arrayToRgb(currentCustomThemeConfig.palette[selectedAccent])}
      onChange={handleAccentColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
