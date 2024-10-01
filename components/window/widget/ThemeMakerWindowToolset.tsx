"use client";

import ColorPreviewGrid from "@/app/design/theme-maker/ColorPreviewGrid";
import ThemeEditorFrame from "@/app/design/theme-maker/ThemeEditorFrame";
import ThemeMakerSidebarButtons from "@/app/design/theme-maker/ThemeMakerSidebarButtons";
import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import toolsetStyle from "./theme-maker-window-toolset.module.css";

export default function ThemeMakerWindowToolset() {
  const { currentCustomThemeConfig } = useSettings();

  const colorPreviewThemeStyle = generateInlineStyleObject(
    currentCustomThemeConfig.palette
  );

  return (
    <div className={`bg-widget-80 w-full h-full ${toolsetStyle.grid}`}>
      <div className="overflow-y-auto flex-grow">
        <ThemeEditorFrame />
      </div>
      <div>
        <ThemeMakerSidebarButtons
          noBackground={true}
          sidebarOptions={[
            "customTheme",
            "duplicate",
            "stars",
            "preset",
            "image",
            "export",
            "import",
          ]}
          className="h-full"
        />
      </div>
      <div className="w-full h-full" style={colorPreviewThemeStyle}>
        <ColorPreviewGrid />
      </div>
    </div>
  );
}
