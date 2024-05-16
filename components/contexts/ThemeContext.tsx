"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { useSettings } from "./SettingsContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import { themeKeyMap } from "../themeUtil/themeKeyMap";

interface Props {
  children?: ReactNode;
  defaultThemeKey?: ThemeKey;
}

interface ThemeContextType {
  themeConfig: ThemeDataConfig;
  themeKey: ThemeKey;
  setThemeKey:
    | React.Dispatch<React.SetStateAction<ThemeKey>>
    | ((themeKey: ThemeKey) => void);
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultThemeKey = "home" }: Props) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(defaultThemeKey);
  const { updateSettings } = useSettings();

  const safelyLoadTheme = (): ThemeDataConfig => {
    updateSettings({ pageTheme: defaultSettings.pageTheme });
    return themeKeyMap[defaultThemeKey];
  };

  const themeConfig = themeKeyMap[themeKey] || safelyLoadTheme();
  return (
    <ThemeContext.Provider value={{ themeConfig, themeKey, setThemeKey }}>
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
