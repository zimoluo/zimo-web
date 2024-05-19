"use client";

import { ReactNode, useState } from "react";
import sidebarStyle from "./sidebar.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import SidebarToggleIcon from "@/components/assets/entries/SidebarToggleIcon";
import SidebarButtons from "./SidebarButtons";

interface Props {
  children?: ReactNode;
}

export default function ThemeMakerSidebar({ children }: Props) {
  const { currentCustomThemeConfig } = useSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const colorPreviewThemeStyle = generateInlineStyleObject(
    currentCustomThemeConfig.palette
  );

  return (
    <div className={`shrink-0 md:h-full flex flex-col md:flex-row`}>
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
      <div className="bg-light w-full md:w-12 h-12 md:h-full flex md:flex-col items-center px-4 md:px-0 md:py-4 gap-4">
        <button
          className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square hidden md:block"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
        >
          <SidebarToggleIcon className="w-full h-auto aspect-square" />
        </button>
        <SidebarButtons />
      </div>
    </div>
  );
}
