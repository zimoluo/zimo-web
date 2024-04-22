"use client";

import { ReactNode, useMemo } from "react";
import { ThemeProvider } from "@/components/contexts/ThemeContext";
import { useSettings } from "../contexts/SettingsContext";
import { useNavigation } from "@/lib/helperHooks";

interface Props {
  children?: ReactNode;
  fetchedColorMap: ColorMap;
}

export default function ThemeDataInitializer({
  children,
  fetchedColorMap,
}: Props) {
  const navigationKey = useNavigation();
  const { settings } = useSettings();

  const theme = useMemo(() => {
    return settings.pageTheme[navigationKey];
  }, [navigationKey]);

  return (
    <ThemeProvider
      defaultThemeKey={theme}
      initializedColorMap={fetchedColorMap}
    >
      {children}
    </ThemeProvider>
  );
}
