"use client";

import { ReactNode, useMemo } from "react";
import { ThemeProvider } from "@/components/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { useSettings } from "../contexts/SettingsContext";
import { getNavigation } from "@/lib/constants/navigationFinder";

interface Props {
  children?: ReactNode;
}

export default function ThemeInitializer({ children }: Props) {
  const pathname = usePathname();
  const { settings } = useSettings();

  const theme = useMemo(() => {
    const navigationKey = getNavigation(pathname);
    return settings.pageTheme[navigationKey];
  }, [pathname]);

  return <ThemeProvider defaultThemeKey={theme}>{children}</ThemeProvider>;
}
