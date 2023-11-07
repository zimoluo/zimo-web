"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { colorMap } from "./colorMap";
import { usePathname } from "next/navigation";
import { useSettings } from "../contexts/SettingsContext";
import Head from "next/head";
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

  return (
    <div className={colorMap[themeColor].colorPalette}>
      <Head>
        <meta name="theme-color" content={theme.siteThemeColor} />
      </Head>
      {children}
    </div>
  );
}
