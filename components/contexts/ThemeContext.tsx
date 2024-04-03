"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import * as allThemes from "@/components/themes";
import { useSettings } from "./SettingsContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";

interface Props {
  children?: ReactNode;
  defaultThemeKey?: ThemeAvailable;
}

interface ThemeContextType {
  theme: ThemeInterface;
  themeKey: ThemeAvailable;
  setThemeKey:
    | React.Dispatch<React.SetStateAction<ThemeAvailable>>
    | ((themeKey: ThemeAvailable) => void);
}

const themesMap: Record<ThemeAvailable, ThemeInterface> = {
  photos: allThemes.photosTheme,
  projects: allThemes.projectsTheme,
  home: allThemes.homeTheme,
  about: allThemes.aboutTheme,
  blog: allThemes.blogTheme,
  midnight: allThemes.midnightTheme,
  glitter: allThemes.glitterTheme,
  birthday: allThemes.birthdayTheme,
  plainLight: allThemes.plainLightTheme,
  plainDark: allThemes.plainDarkTheme,
  rainbow: allThemes.rainbowTheme,
  bubbles: allThemes.bubblesTheme,
  stars: allThemes.starsTheme,
  christmas: allThemes.christmasTheme,
  grass: allThemes.grassTheme,
  halloween: allThemes.halloweenTheme,
  gold: allThemes.goldTheme,
  autumnal: allThemes.autumnalTheme,
  cherry: allThemes.cherryTheme,
  marina: allThemes.marinaTheme,
  mori: allThemes.moriTheme,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themesMap.home,
  themeKey: "photos",
  setThemeKey: (themeKey: ThemeAvailable) => {},
});

export function ThemeProvider({ children, defaultThemeKey = "home" }: Props) {
  const [themeKey, setThemeKey] = useState<ThemeAvailable>(defaultThemeKey);
  const { updateSettings } = useSettings();

  const safelyLoadTheme = (): ThemeInterface => {
    updateSettings({ pageTheme: defaultSettings.pageTheme });
    return themesMap[defaultThemeKey];
  };

  const theme = themesMap[themeKey] || safelyLoadTheme();
  return (
    <ThemeContext.Provider value={{ theme, themeKey, setThemeKey }}>
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
