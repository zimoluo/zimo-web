"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import AccentColorBubbleIcon from "./AccentColorBubbleIcon";
import { useAccentColor } from "./AccentColorContext";

interface Props {
  accentType: AccentColors;
  className?: string;
}

const accentNameMap: Record<AccentColors, string> = {
  primary: "Primary",
  saturated: "Secondary",
  pastel: "Neutral",
  light: "Contrast",
  site: "Browser",
};

export default function AccentColorSelectorPill({
  accentType,
  className = "",
}: Props) {
  const { currentCustomThemeConfig } = useSettings();
  const { selectedAccent, setSelectedAccent } = useAccentColor();

  const isSelected = selectedAccent === accentType;

  return (
    <button
      className={`bg-light bg-opacity-80 shadow-md rounded-full h-8 relative ${className}`}
      onClick={() => {
        setSelectedAccent(accentType);
      }}
    >
      <div className="absolute left-0 top-0 w-full h-full overflow-hidden rounded-full">
        <div
          style={{
            transition: "width 400ms ease-out",
            width: isSelected ? "100%" : "0%",
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-full bg-saturated bg-opacity-90 rounded-r-full"
        />
      </div>
      <div
        style={{
          transition: "left 1000ms ease-out, transform 1000ms ease-out",
        }}
        className={`absolute ${
          isSelected
            ? "left-full -translate-x-full rotate-[360deg]"
            : "left-0 rotate-0 translate-x-0"
        } top-1/2 -translate-y-1/2 h-full w-auto aspect-square`}
      >
        <div
          style={generateInlineStyleObject(currentCustomThemeConfig.palette)}
          className="h-full w-auto aspect-square"
        >
          <AccentColorBubbleIcon
            accentType={accentType}
            className="h-full w-auto aspect-square"
            color={
              accentType === "site"
                ? currentCustomThemeConfig.siteThemeColor
                : undefined
            }
          />
        </div>
      </div>
      <div
        className={`w-full h-full flex items-center justify-center relative transition-colors duration-300 ease-out text-sm ${
          isSelected ? "text-light" : "text-primary"
        }`}
      >
        <p>{accentNameMap[accentType]}</p>
      </div>
    </button>
  );
}
