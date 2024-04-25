"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";

interface Props {
  accentType: AccentColors;
}

export default function AccentColorSelectorPill({ accentType }: Props) {
  const { settings } = useSettings();

  return (
    <div className="bg-light shadow-md rounded-full h-8 relative">
      <div
        style={generateInlineStyleObject(
          settings.customThemeData[settings.customThemeIndex].palette
        )}
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-full w-auto aspect-square bg-${accentType} rounded-full`}
      />
      <div className="w-full h-full flex items-center justify-center">
        <p>{accentType}</p>
      </div>
    </div>
  );
}
