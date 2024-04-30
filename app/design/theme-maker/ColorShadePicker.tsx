"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import editorStyle from "./color-editor.module.css";
import { useAccentColor } from "./AccentColorContext";
import {
  generateShadeMap,
  isShadeMapRoughlyTheSame,
} from "@/lib/themeMaker/colorHelper";
import { rgb, hex } from "color-convert";
import { useEffect, useState } from "react";

export default function ColorShadePicker() {
  const { settings, updateAccentColor, updateSiteThemeColor } = useSettings();
  const { selectedAccent } = useAccentColor();

  const { index: closestIndex, shadeMap } = generateShadeMap(
    selectedAccent === "site"
      ? settings.customThemeData[settings.customThemeIndex].siteThemeColor
      : (rgb.hex(
          settings.customThemeData[settings.customThemeIndex].palette[
            selectedAccent
          ]
        ) as HexColor),
    10
  );

  const [storedShadeMap, setStoredShadeMap] = useState<HexColor[]>(shadeMap);

  useEffect(() => {
    const { shadeMap: newShadeMap } = generateShadeMap(
      selectedAccent === "site"
        ? settings.customThemeData[settings.customThemeIndex].siteThemeColor
        : (rgb.hex(
            settings.customThemeData[settings.customThemeIndex].palette[
              selectedAccent
            ]
          ) as HexColor),
      10
    );

    if (!isShadeMapRoughlyTheSame(storedShadeMap, newShadeMap)) {
      setStoredShadeMap(newShadeMap);
    }
  }, [
    selectedAccent,
    settings.customThemeData,
    settings.customThemeIndex,
    storedShadeMap,
  ]);

  return (
    <div
      className={`${editorStyle.shadePickerGrid} w-full h-full rounded-xl overflow-hidden`}
    >
      {storedShadeMap.map((hexColor, index) => {
        return (
          <button
            key={index}
            style={{ backgroundColor: hexColor }}
            className="relative"
            onClick={() => {
              if (index === closestIndex) {
                return;
              }

              if (selectedAccent === "site") {
                updateSiteThemeColor(hexColor);
              } else {
                updateAccentColor(selectedAccent, hex.rgb(hexColor));
              }
            }}
          >
            <div
              className={`absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-1/3 w-auto aspect-square rounded-full transition-opacity duration-150 ease-out ${
                index === closestIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundColor:
                  index < storedShadeMap.length / 2
                    ? storedShadeMap[storedShadeMap.length - 3]
                    : storedShadeMap[0],
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
