"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useSettings } from "../contexts/SettingsContext";
import { useNavigation } from "@/lib/helperHooks";

interface Props {
  children?: ReactNode;
}

export default function ThemeApplier({ children }: Props) {
  const { theme, setThemeKey, colorMap } = useTheme();
  const { settings } = useSettings();

  const navigationKey = useNavigation();
  const themeColor = theme.palette;

  useEffect(() => {
    const currentTheme = settings.pageTheme[navigationKey];

    setThemeKey(currentTheme);
  }, [navigationKey, setThemeKey, settings.pageTheme]);

  useEffect(() => {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");

    if (theme.siteThemeColor) {
      if (!metaThemeColor) {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.setAttribute("name", "theme-color");
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute("content", theme.siteThemeColor);
    } else {
      if (metaThemeColor) {
        document.head.removeChild(metaThemeColor);
      }
    }
  }, [theme.siteThemeColor]);

  return <div style={colorMap[themeColor]}>{children}</div>;
}
