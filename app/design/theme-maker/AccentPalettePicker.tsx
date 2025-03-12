"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback, useMemo } from "react";
import colorConvert from "color-convert";

const { hex, rgb } = colorConvert;

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

  const isSite = useMemo(() => selectedAccent === "site", [selectedAccent]);

  return (
    <HexColorPicker
      color={
        isSite
          ? currentCustomThemeConfig.siteThemeColor
          : `#${rgb.hex(
              currentCustomThemeConfig.palette[
                selectedAccent as Exclude<AccentColors, "site">
              ]
            )}`
      }
      onChange={isSite ? handleSiteColorChange : handleAccentColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
