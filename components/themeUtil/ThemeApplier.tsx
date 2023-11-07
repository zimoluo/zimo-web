"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { colorMap } from "./colorMap";
import { usePathname } from "next/navigation";
import { useSettings } from "../contexts/SettingsContext";
import { getNavigation } from "@/lib/constants/navigationFinder";

interface Props {
  children?: ReactNode;
}

export default function ThemeApplier({ children }: Props) {
  const { theme, setThemeKey } = useTheme();
  const { settings } = useSettings();

  const pathname = usePathname();
  const themeColor = theme.palette;

  useEffect(() => {
    const navigationKey = getNavigation(pathname);
    const currentTheme = settings.pageTheme[navigationKey];

    setThemeKey(currentTheme);
  }, [pathname, setThemeKey, settings.pageTheme]);

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

  return <div className={colorMap[themeColor].colorPalette}>{children}</div>;
}
