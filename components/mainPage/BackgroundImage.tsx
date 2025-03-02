"use client";

import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";

export default function BackgroundImage() {
  const { settings } = useSettings();
  const { themeConfig } = useTheme();

  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor: themeConfig.siteThemeColor,
      }}
      className={`fixed -z-50 pointer-events-none inset-0 w-large-screen h-large-screen bg-cover bg-center select-none ${
        settings.backgroundRichness === "minimal"
          ? "bg-page-minimal"
          : "bg-page"
      }`}
    />
  );
}
