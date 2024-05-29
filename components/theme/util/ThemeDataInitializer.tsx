"use client";

import { ReactNode, useMemo } from "react";
import { ThemeProvider } from "@/components/contexts/ThemeContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useNavigation } from "@/lib/helperHooks";

interface Props {
  children?: ReactNode;
}

export default function ThemeDataInitializer({ children }: Props) {
  const navigationKey = useNavigation();
  const { settings } = useSettings();

  const theme = useMemo(() => {
    return settings.pageTheme[navigationKey];
  }, [navigationKey]);

  return <ThemeProvider defaultThemeKey={theme}>{children}</ThemeProvider>;
}
