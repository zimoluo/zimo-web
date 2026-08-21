"use client";

import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";

export default function BackgroundImage() {
  const { settings } = useSettings();
  const { themeConfig } = useTheme();

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          backgroundColor: themeConfig.siteThemeColor,
        }}
        className={`fixed -z-50 pointer-events-none inset-0 w-[100svw] h-[100svh] bg-cover bg-center select-none ${
          settings.backgroundRichness === "minimal"
            ? "surface-page-reduced"
            : "surface-page"
        }`}
      />
      <div
        aria-hidden="true"
        style={{
          backgroundColor: themeConfig.siteThemeColor,
        }}
        className={`fixed -z-50 pointer-events-none inset-0 w-[100svw] h-[100svh] bg-cover bg-center select-none -scale-y-100 translate-y-[-100svh] ${
          settings.backgroundRichness === "minimal"
            ? "surface-page-reduced"
            : "surface-page"
        }`}
      />
      <div
        aria-hidden="true"
        style={{
          backgroundColor: themeConfig.siteThemeColor,
        }}
        className={`fixed -z-50 pointer-events-none inset-0 w-[100svw] h-[100svh] bg-cover bg-center select-none -scale-y-100 translate-y-[100svh] ${
          settings.backgroundRichness === "minimal"
            ? "surface-page-reduced"
            : "surface-page"
        }`}
      />
    </>
  );
}
