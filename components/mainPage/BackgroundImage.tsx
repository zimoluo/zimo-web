"use client";

import { useSettings } from "../contexts/SettingsContext";

export default function BackgroundImage() {
  const { settings } = useSettings();

  return (
    <div
      aria-hidden="true"
      className={`fixed -z-50 pointer-events-none inset-0 bg-cover bg-center select-none ${
        settings.backgroundRichness === "minimal"
          ? "bg-page-minimal"
          : "bg-page"
      }`}
    />
  );
}
