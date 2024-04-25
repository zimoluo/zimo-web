"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import previewStyle from "./color-preview.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import SidebarToggleIcon from "@/components/assets/entries/SidebarToggleIcon";

interface Props {
  children?: ReactNode;
}

export default function ColorPreviewWrapper({ children }: Props) {
  const { settings } = useSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [maxWidth, setMaxWidth] = useState("100rem");
  const [expandedWidth, setExpandedWidth] = useState("100rem");
  const maxWidthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidths = () => {
      if (!maxWidthRef.current) {
        return;
      }

      if (!isCollapsed) {
        setMaxWidth(`${maxWidthRef.current.offsetWidth}px`);
      }
      setExpandedWidth(`${maxWidthRef.current.offsetWidth}px`);
    };

    updateWidths();
    window.addEventListener("resize", updateWidths);

    return () => window.removeEventListener("resize", updateWidths);
  }, []);

  const toggleCollapse = () => {
    setMaxWidth(isCollapsed ? expandedWidth : "4rem");
    setIsCollapsed(!isCollapsed);
  };

  const colorPreviewThemeStyle = generateInlineStyleObject(
    settings.customThemeData[settings.customThemeIndex].palette
  );

  return (
    <div
      ref={maxWidthRef}
      style={
        {
          "--preview-max-width": maxWidth,
          transition: "max-width 200ms ease-out",
        } as Record<string, string>
      }
      className={`md:h-full ${previewStyle.wrapper} ${previewStyle.width}`}
    >
      <div style={colorPreviewThemeStyle} className="md:h-full relative">
        <div
          className={`md:h-full ${
            isCollapsed ? "md:pointer-events-none md:select-none" : ""
          }`}
        >
          {children}
        </div>
        <div
          className={`absolute w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out bg-primary pointer-events-none select-none opacity-0 ${
            isCollapsed ? "md:opacity-100" : ""
          }`}
        />
        <div className="absolute top-2.5 left-3.5 hidden md:block">
          <button
            className="transition-transform hover:scale-110 duratoin-300 ease-in-out"
            onClick={toggleCollapse}
            aria-expanded={!isCollapsed}
          >
            <SidebarToggleIcon
              className="w-8 h-auto aspect-square"
              isLight={true}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
