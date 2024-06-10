"use client";

import CogIcon from "@/components/assets/toast/CogIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useTheme } from "@/components/contexts/ThemeContext";
import ClickToSpinButton from "@/components/widgets/ClickToSpinButton";
import { useNavigation } from "@/lib/helperHooks";

export default function ChangeToCustomThemeButton() {
  const { updatePageTheme, updateSettings, settings } = useSettings();
  const navigationKey = useNavigation();
  const { themeKey } = useTheme();

  const switchTheme = () => {
    if (themeKey !== "custom") {
      updateSettings({ regularThemeMakerTheme: themeKey });
      updatePageTheme("custom", navigationKey);
      return;
    }

    updatePageTheme(settings.regularThemeMakerTheme, navigationKey);
  };

  return (
    <ClickToSpinButton
      onClick={switchTheme}
      className="w-7 h-auto aspect-square shrink-0 hover:scale-110"
    >
      <CogIcon strokeWidth={76} className="w-full h-auto aspect-square" />
    </ClickToSpinButton>
  );
}
