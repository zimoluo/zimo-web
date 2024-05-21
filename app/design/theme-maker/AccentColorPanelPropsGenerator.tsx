"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useAccentColor } from "./AccentColorContext";
import ColorEditorPanel from "./ColorEditorPanel";
import { generateRandomColor } from "@/lib/themeMaker/colorHelper";
import { rgb, hex } from "color-convert";
import AccentPalettePicker from "./AccentPalettePicker";

export default function AccentColorPanelPropsGenerator() {
  const { selectedAccent } = useAccentColor();
  const { updateSiteThemeColor, updateAccentColor, currentCustomThemeConfig } =
    useSettings();
  return (
    <ColorEditorPanel
      sidebarConfig={["magic", "random", "rule", "selectorButtons"]}
      randomFunction={() => {
        if (selectedAccent === "site") {
          updateSiteThemeColor(`#${rgb.hex(generateRandomColor())}`);
        } else {
          updateAccentColor(selectedAccent, generateRandomColor());
        }
      }}
      palettePicker={<AccentPalettePicker />}
      shadePickerConfig={{
        colorValue:
          selectedAccent === "site"
            ? currentCustomThemeConfig.siteThemeColor
            : (rgb.hex(
                currentCustomThemeConfig.palette[selectedAccent]
              ) as HexColor),
        updateColor: (hexColor: HexColor) => {
          if (selectedAccent === "site") {
            updateSiteThemeColor(hexColor);
          } else {
            updateAccentColor(selectedAccent, hex.rgb(hexColor));
          }
        },
      }}
    />
  );
}
