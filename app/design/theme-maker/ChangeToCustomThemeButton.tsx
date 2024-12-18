"use client";

import ContrastPreviewIcon from "@/components/assets/entries/ContrastPreviewIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useTheme } from "@/components/contexts/ThemeContext";
import { useNavigation } from "@/lib/helperHooks";

export default function ChangeToCustomThemeButton() {
  const { updatePageTheme, updateSettings, settings } = useSettings();
  const navigationKey = useNavigation();
  const { themeKey } = useTheme();

  const isCustomTheme = themeKey === "custom";

  const switchTheme = () => {
    if (!isCustomTheme) {
      updateSettings({ regularThemeMakerTheme: themeKey });
      updatePageTheme("custom", navigationKey);
      return;
    }

    updatePageTheme(settings.regularThemeMakerTheme, navigationKey);
  };

  return (
    <button
      onClick={switchTheme}
      className="w-7 h-auto aspect-square shrink-0 transition-transform duration-300 ease-in-out hover:scale-110"
    >
      <ContrastPreviewIcon
        className={`w-full h-auto aspect-square transition-transform duration-300 ease-out ${
          isCustomTheme ? "-rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
}
