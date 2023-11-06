"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { colorMap } from "./colorMap";
import { usePathname } from "next/navigation";

interface Props {
  children?: ReactNode;
}

export default function ThemeApplier({ children }: Props) {
  const { theme, setThemeKey } = useTheme();
  const pathname = usePathname();
  const themeColor = theme.palette;
  useEffect(() => {
    if (pathname.startsWith("/projects")) {
      setThemeKey("projects");
    } else {
      setThemeKey("photos");
    }
  }, [pathname, setThemeKey]);

  return <div className={colorMap[themeColor].colorPalette}>{children}</div>;
}
