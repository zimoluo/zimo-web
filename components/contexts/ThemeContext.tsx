"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import * as allThemes from "@/components/themes";

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
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themesMap.home,
  themeKey: "photos",
  setThemeKey: (themeKey: ThemeAvailable) => {},
});

export function ThemeProvider({ children, defaultThemeKey = "photos" }: Props) {
  const [themeKey, setThemeKey] = useState<ThemeAvailable>(defaultThemeKey);

  const theme = themesMap[themeKey] || themesMap.home;
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
