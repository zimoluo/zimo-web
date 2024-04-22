"use client";

import { ReactNode, useMemo } from "react";
import { ThemeProvider } from "@/components/contexts/ThemeContext";
import { useSettings } from "../contexts/SettingsContext";
import { useNavigation } from "@/lib/helperHooks";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";

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

  const customThemeStyle = generateInlineStyleObject(
    settings.customThemeData[settings.customThemeIndex].palette
  );

  const colorMap: ColorMap = { ...fetchedColorMap, custom: customThemeStyle };

  return (
    <ThemeProvider defaultThemeKey={theme} initializedColorMap={colorMap}>
      {children}
    </ThemeProvider>
  );
}
