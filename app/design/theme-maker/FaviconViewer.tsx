"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import editorStyle from "./favicon-editor.module.css";
import DisplayFavicon from "@/components/assets/DisplayFavicon";

export default function FaviconViewer() {
  const { currentCustomThemeConfig } = useSettings();

  return (
    <div
      className={`bg-light bg-opacity-80 rounded-xl shadow-lg flex items-center justify-center ${editorStyle.viewer}`}
    >
      <DisplayFavicon
        className="h-full w-auto aspect-square"
        customThemeConfig={currentCustomThemeConfig}
      />
    </div>
  );
}
