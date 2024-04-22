"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { useSettings } from "./SettingsContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import { themeKeyMap } from "../themeUtil/themeKeyMap";

interface Props {
  children?: ReactNode;
  defaultThemeKey?: ThemeAvailable;
  fetchedColorMap: ColorMap;
}

interface ThemeContextType {
  theme: ThemeInterface;
  themeKey: ThemeAvailable;
  setThemeKey:
    | React.Dispatch<React.SetStateAction<ThemeAvailable>>
    | ((themeKey: ThemeAvailable) => void);
  colorMap: ColorMap;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultThemeKey = "home",
  fetchedColorMap,
}: Props) {
  const [themeKey, setThemeKey] = useState<ThemeAvailable>(defaultThemeKey);
  const { updateSettings } = useSettings();

  const safelyLoadTheme = (): ThemeInterface => {
    updateSettings({ pageTheme: defaultSettings.pageTheme });
    return themeKeyMap[defaultThemeKey];
  };

  const theme = themeKeyMap[themeKey] || safelyLoadTheme();
  const colorMap = fetchedColorMap;
  return (
    <ThemeContext.Provider value={{ theme, themeKey, setThemeKey, colorMap }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
