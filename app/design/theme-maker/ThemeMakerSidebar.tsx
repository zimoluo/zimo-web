"use client";

import { ReactNode } from "react";
import sidebarStyle from "./sidebar.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import ThemeMakerSidebarButtons from "./ThemeMakerSidebarButtons";

interface Props {
  children?: ReactNode;
}

export default function ThemeMakerSidebar({ children }: Props) {
  const { currentCustomThemeConfig, settings } = useSettings();

  const isCollapsed = settings.hideColorLookupPanel;

  const colorPreviewThemeStyle = generateInlineStyleObject(
    currentCustomThemeConfig.palette
  );

  return (
    <div className="shrink-0 md:h-full flex flex-col md:flex-row">
      <div
        className={`md:h-full shrink-0 flex-grow ${sidebarStyle.colorWrapper} ${
          isCollapsed ? sidebarStyle.collapsed : sidebarStyle.expanded
        }`}
      >
        <div
          style={colorPreviewThemeStyle}
          className="md:h-full relative overflow-hidden"
        >
          <div
            className={`md:h-full ${
              isCollapsed ? "md:pointer-events-none md:select-none" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
      <ThemeMakerSidebarButtons />
    </div>
  );
}
