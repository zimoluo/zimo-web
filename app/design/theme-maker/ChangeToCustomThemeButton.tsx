"use client";

import CogIcon from "@/components/assets/toast/CogIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useTheme } from "@/components/contexts/ThemeContext";
import { useNavigation } from "@/lib/helperHooks";
import { useEffect, useState } from "react";
import buttonStyle from "./spinning-button.module.css";

export default function ChangeToCustomThemeButton() {
  const { updatePageTheme, updateSettings, settings } = useSettings();
  const navigationKey = useNavigation();
  const { themeKey } = useTheme();

  const [isSpinning, setIsSpinning] = useState(false);

  const switchTheme = () => {
    if (isSpinning) {
      return;
    }

    setIsSpinning(true);

    setTimeout(() => {
      if (themeKey !== "custom") {
        updateSettings({ regularThemeMakerTheme: themeKey });
        updatePageTheme("custom", navigationKey);
        return;
      }

      updatePageTheme(settings.regularThemeMakerTheme, navigationKey);
    }, 300);

    setTimeout(() => {
      setIsSpinning(false);
    }, 600);
  };

  useEffect(() => {
    if (themeKey !== "custom") {
      updateSettings({ regularThemeMakerTheme: themeKey });
    }
  }, [themeKey]);

  return (
    <button
      className={`transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square rotate-0 ${
        isSpinning ? buttonStyle.spin : ""
      }`}
      onClick={switchTheme}
      disabled={isSpinning}
    >
      <CogIcon strokeWidth={76} className="w-full h-auto aspect-square" />
    </button>
  );
}
