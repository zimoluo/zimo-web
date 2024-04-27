import { useSettings } from "@/components/contexts/SettingsContext";
import { HexColorPicker, RgbColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";

export default function AccentColorPicker() {
  const { settings, updateAccentColor, updateSiteThemeColor } = useSettings();
  const { selectedAccent } = useAccentColor();

  return selectedAccent === "site" ? (
    <HexColorPicker
      color={settings.customThemeData[settings.customThemeIndex].siteThemeColor}
      onChange={(newColor) => {
        updateSiteThemeColor(newColor as `#${string}`);
      }}
    />
  ) : (
    <RgbColorPicker
      color={{
        r: settings.customThemeData[settings.customThemeIndex].palette[
          selectedAccent
        ][0],
        g: settings.customThemeData[settings.customThemeIndex].palette[
          selectedAccent
        ][1],
        b: settings.customThemeData[settings.customThemeIndex].palette[
          selectedAccent
        ][2],
      }}
      onChange={(newColor) => {
        updateAccentColor(selectedAccent, [newColor.r, newColor.g, newColor.b]);
      }}
    />
  );
}
