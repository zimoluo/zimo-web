"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { useSettings } from "./SettingsContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import { themeKeyMap } from "../theme/util/themeKeyMap";
import { maxProfileCount } from "@/lib/constants/themeProfiles";
import { useToast } from "./ToastContext";

interface Props {
  children?: ReactNode;
  defaultThemeKey?: ThemeKey | ThemeDataConfig;
}

interface ThemeContextType {
  themeConfig: ThemeDataConfig;
  themeKey: ThemeKey | ThemeDataConfig;
  setThemeKey: React.Dispatch<React.SetStateAction<ThemeKey | ThemeDataConfig>>;
  insertThemeProfile: (profile: ThemeDataConfig | ThemeDataConfig[]) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultThemeKey = "home" }: Props) {
  const [themeKey, setThemeKey] = useState<ThemeKey | ThemeDataConfig>(
    defaultThemeKey
  );
  const { updateSettings, currentCustomThemeConfig, settings } = useSettings();
  const { appendToast } = useToast();

  const safelyLoadTheme = (): ThemeDataConfig => {
    updateSettings({ pageTheme: defaultSettings.pageTheme });

    if (typeof defaultThemeKey === "object") {
      return defaultThemeKey;
    }

    return themeKeyMap[defaultThemeKey];
  };

  const themeConfig =
    (themeKey === "custom"
      ? currentCustomThemeConfig
      : typeof themeKey === "object"
      ? themeKey
      : themeKeyMap[themeKey]) || safelyLoadTheme();

  const insertThemeProfile = (
    profile: ThemeDataConfig | ThemeDataConfig[]
  ): boolean => {
    const themeProfilesArray = structuredClone(settings.customThemeData);
    const profilesToInsert = structuredClone(
      Array.isArray(profile) ? profile : [profile]
    );

    if (
      settings.customThemeData.length + profilesToInsert.length >
      maxProfileCount
    ) {
      appendToast({
        title: "Theme Maker",
        icon: "themeMaker",
        description: `Up to ${maxProfileCount} profile${
          maxProfileCount === 1 ? "" : "s"
        } are allowed.`,
      });
      return false;
    }

    if (themeProfilesArray.length <= 0) {
      updateSettings({
        customThemeData: profilesToInsert,
        customThemeIndex: profilesToInsert.length - 1,
      });
      return true;
    }

    const updatedProfileArray: ThemeDataConfig[] = [
      ...themeProfilesArray.slice(0, settings.customThemeIndex + 1),
      ...profilesToInsert,
      ...themeProfilesArray.slice(
        settings.customThemeIndex + 1,
        themeProfilesArray.length
      ),
    ];

    updateSettings({
      customThemeData: updatedProfileArray,
      customThemeIndex: settings.customThemeIndex + profilesToInsert.length,
    });

    return true;
  };

  return (
    <ThemeContext.Provider
      value={{ themeConfig, themeKey, setThemeKey, insertThemeProfile }}
    >
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
