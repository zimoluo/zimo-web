"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import ColorEditorTypingArea from "./ColorEditorTypingArea";
import ThemeImageFormUploader from "./ThemeImageFormUploader";

export default function ColorEditor() {
  const { settings, updateSettings } = useSettings();

  const updateColorScheme = (
    entry: "primary" | "saturated" | "middle" | "soft" | "pastel" | "light",
    index: number,
    content: ColorSchemeData
  ) => {
    let themeData = [...settings.customThemeData];
    themeData[index].palette[entry] = content;

    updateSettings({ customThemeData: themeData });
  };

  const updateSiteThemeColor = (index: number, color: `#${string}`) => {
    let themeData = [...settings.customThemeData];
    themeData[index].siteThemeColor = color;

    updateSettings({ customThemeData: themeData });
  };

  const entries = ["primary", "saturated", "middle", "soft", "pastel", "light"];

  return (
    <div className="grid grid-cols-3 gap-4">
      {entries.map((entry) => (
        <ColorEditorTypingArea
          key={entry}
          setEntry={(colorData) =>
            updateColorScheme(
              entry as
                | "primary"
                | "saturated"
                | "middle"
                | "soft"
                | "pastel"
                | "light",
              0,
              colorData.split(",").map((num) => parseInt(num.trim())) as [
                number,
                number,
                number
              ]
            )
          }
          entry={JSON.stringify(
            settings.customThemeData[0].palette[
              entry as
                | "primary"
                | "saturated"
                | "middle"
                | "soft"
                | "pastel"
                | "light"
            ]
          ).replace(/^\[|\]$/g, "")}
        />
      ))}
      <ColorEditorTypingArea
        entry={settings.customThemeData[0].siteThemeColor}
        setEntry={(themeColor) =>
          updateSiteThemeColor(0, themeColor as `#${string}`)
        }
      />
      <ThemeImageFormUploader />
    </div>
  );
}
