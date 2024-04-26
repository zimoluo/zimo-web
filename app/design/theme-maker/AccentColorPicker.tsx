import { useSettings } from "@/components/contexts/SettingsContext";
import { RgbColorPicker } from "react-colorful";
import { useAccentColor } from "./AccentColorContext";

export default function AccentColorPicker() {
  const { settings, updateAccentColor } = useSettings();
  const { selectedAccent } = useAccentColor();

  return (
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
        updateAccentColor(selectedAccent, settings.customThemeIndex, [
          newColor.r,
          newColor.g,
          newColor.b,
        ]);
      }}
    />
  );
}
