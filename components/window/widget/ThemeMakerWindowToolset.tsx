"use client";

import ColorPreviewGrid from "@/app/design/theme-maker/ColorPreviewGrid";
import ThemeEditorFrame from "@/app/design/theme-maker/ThemeEditorFrame";
import ThemeMakerSidebarButtons from "@/app/design/theme-maker/ThemeMakerSidebarButtons";
import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import toolsetStyle from "./theme-maker-window-toolset.module.css";
import { useNavigation } from "@/lib/helperHooks";
import ErrorScreen from "@/components/widgets/ErrorScreen";

export default function ThemeMakerWindowToolset() {
  const { currentCustomThemeConfig } = useSettings();
  const navigationKey = useNavigation();

  const colorPreviewThemeStyle = generateInlineStyleObject(
    currentCustomThemeConfig.palette
  );

  return (
    <div className={`bg-widget-80 w-full h-full ${toolsetStyle.grid}`}>
      <div className="overflow-y-auto flex-grow">
        {navigationKey === "themeMaker" ? (
          <ErrorScreen text="Only one Theme Maker may be present at a time." />
        ) : (
          <ThemeEditorFrame />
        )}
      </div>
      <div>
        <ThemeMakerSidebarButtons
          noBackground={true}
          sidebarOptions={[
            "customTheme",
            "settings",
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
      <div className="w-full h-full p-2 pl-0">
        <div
          className="w-full h-full rounded-3xl overflow-hidden shadow-lg"
          style={colorPreviewThemeStyle}
        >
          <ColorPreviewGrid />
        </div>
      </div>
    </div>
  );
}
