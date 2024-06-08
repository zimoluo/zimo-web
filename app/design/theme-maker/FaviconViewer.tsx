"use client";

import ConfigFavicon from "@/components/assets/displayFavicon/ConfigFavicon";
import { useSettings } from "@/components/contexts/SettingsContext";
import editorStyle from "./favicon-editor.module.css";

export default function FaviconViewer() {
  const { currentCustomThemeConfig } = useSettings();

  return (
    <div
      className={`bg-light bg-opacity-80 rounded-xl shadow-lg flex items-center justify-center ${editorStyle.viewer}`}
    >
      <ConfigFavicon
        className="h-full w-auto aspect-square"
        customThemeConfig={currentCustomThemeConfig}
      />
    </div>
  );
}
