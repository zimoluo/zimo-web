"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "@/components/contexts/ThemeContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import { generateThemeMiscInlineStyle } from "@/lib/themeMiscParser";

interface Props {
  children?: ReactNode;
}

export default function ThemeApplier({ children }: Props) {
  const { themeConfig } = useTheme();

  const rawThemePaletteData = themeConfig.palette;
  const rawThemeMiscData = themeConfig.misc ?? {};

  const themePaletteStyleObject =
    generateInlineStyleObject(rawThemePaletteData);
  const themeMiscStyleObject = generateThemeMiscInlineStyle(rawThemeMiscData);
  const themeInlineStyle: Record<string, string> = {
    ...themeMiscStyleObject,
    ...themePaletteStyleObject,
  };

  const siteThemeColor = themeConfig.siteThemeColor;

  useEffect(() => {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", siteThemeColor);
  }, [siteThemeColor]);

  return <div style={themeInlineStyle}>{children}</div>;
}
