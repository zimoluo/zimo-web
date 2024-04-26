"use client";

import { RgbColorPicker } from "react-colorful";
import AccentColorSelectorPill from "./AccentColorSelectorPill";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function AccentColorEditor() {
  const { settings, updateAccentColor } = useSettings();

  return (
    <div className="bg-widget-40 backdrop-blur rounded-xl shadow-lg p-4 flex">
      <div className="space-y-8 w-60">
        <AccentColorSelectorPill accentType="primary" />
        <AccentColorSelectorPill accentType="saturated" />
        <AccentColorSelectorPill accentType="middle" />
        <AccentColorSelectorPill accentType="soft" />
      </div>
      <div className="ml-20">
        NOT FINAL
        <RgbColorPicker
          color={{
            r: settings.customThemeData[settings.customThemeIndex].palette
              .primary[0],
            g: settings.customThemeData[settings.customThemeIndex].palette
              .primary[1],
            b: settings.customThemeData[settings.customThemeIndex].palette
              .primary[2],
          }}
          onChange={(newColor) => {
            updateAccentColor("primary", settings.customThemeIndex, [
              newColor.r,
              newColor.g,
              newColor.b,
            ]);
          }}
        />
      </div>
    </div>
  );
}
