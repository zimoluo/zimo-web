"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import { syncUpUserSettings } from "@/lib/dataLayer/client/accountStateCommunicator";

export const parseStoredSettings = (
  rawSettingsString: string
): SettingsState => {
  if (!rawSettingsString) {
    return defaultSettings;
  }

  const parsedSavedSettings = JSON.parse(
    rawSettingsString
  ) as Partial<SettingsState>;

  const filteredSavedSettings = purgeInvalidEntries(parsedSavedSettings);

  return { ...defaultSettings, ...filteredSavedSettings };
};

const purgeInvalidEntries = (
  rawSettings: Partial<SettingsState>
): Partial<SettingsState> => {
  return Object.keys(rawSettings)
    .filter((key): key is keyof SettingsState => key in defaultSettings)
    .reduce((obj, key) => {
      obj[key] = rawSettings[key] as any;
      return obj;
    }, {} as Partial<SettingsState>);
};

const SettingsContext = createContext<
  | {
      settings: SettingsState;
      updateSettings: (
        newSettings: Partial<SettingsState>,
        doSync?: boolean
      ) => void;
      updatePageTheme: (
        themeKey: ThemeKey,
        page: NavigationKey,
        doSync?: boolean
      ) => void;
      updateAccentColor: (
        entry: Exclude<AccentColors, "site">,
        content: ColorTriplet,
        doSync?: boolean
      ) => void;
      updateGradientData: (
        entry: GradientCategory,
        content: ColorGradient[],
        doSync?: boolean
      ) => void;
      updateSiteThemeColor: (color: HexColor, doSync?: boolean) => void;
      updateThemeMisc: (
        data: Partial<ThemeMiscOptions>,
        doSync?: boolean
      ) => void;
      updateFaviconConfig: (
        data: Partial<FaviconConfig>,
        doSync?: boolean
      ) => void;
      currentCustomThemeConfig: ThemeDataConfig;
    }
  | undefined
>(undefined);

export const SettingsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { user, setUser } = useUser();

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    const doSyncSettings = settings.syncSettings;

    if (user !== null) {
      const preparedSettings = doSyncSettings ? settings : null;

      if (user.websiteSettings === null && preparedSettings === null) {
        return; // Exit if both are null
      }

      const newUser = { ...user, websiteSettings: preparedSettings };

      setUser(newUser);
    }
  }, [settings]);

  const updateAndPersistSettings = (newSettings: Partial<SettingsState>) => {
    const updatedSettings = {
      ...defaultSettings,
      ...settings,
      ...newSettings,
    };

    const filteredSettings = purgeInvalidEntries(
      updatedSettings
    ) as SettingsState;

    setSettings(filteredSettings);
    localStorage.setItem("websiteSettings", JSON.stringify(filteredSettings));

    return updatedSettings;
  };

  const updateSettings = (
    newSettings: Partial<SettingsState>,
    doSync: boolean = true
  ) => {
    const updatedSettings = updateAndPersistSettings(newSettings);

    if (doSync && user !== null && updatedSettings.syncSettings) {
      syncUpUserSettings(user.sub, updatedSettings);
    }
  };

  const updatePageTheme = (
    themeKey: ThemeKey,
    page: NavigationKey,
    doSync: boolean = true
  ) => {
    if (themeKey === settings.pageTheme[page]) {
      return;
    }

    const newSettings: Partial<SettingsState> = {
      pageTheme: { ...settings.pageTheme, [page]: themeKey },
    };

    if (themeKey !== "custom") {
      newSettings.regularThemeMakerTheme = themeKey;
    }

    updateSettings(newSettings, doSync);
  };

  const updateAccentColor = (
    entry: Exclude<AccentColors, "site">,
    content: ColorTriplet,
    doSync: boolean = true
  ) => {
    const themeData = [...settings.customThemeData];
    themeData[settings.customThemeIndex].palette[entry] = content;

    updateSettings({ customThemeData: themeData }, doSync);
  };

  const updateGradientData = (
    entry: GradientCategory,
    content: ColorGradient[],
    doSync: boolean = true
  ) => {
    const themeData = [...settings.customThemeData];
    themeData[settings.customThemeIndex].palette[entry] = content;

    updateSettings({ customThemeData: themeData }, doSync);
  };

  const updateSiteThemeColor = (color: HexColor, doSync: boolean = true) => {
    const themeData = [...settings.customThemeData];
    themeData[settings.customThemeIndex].siteThemeColor = color;

    updateSettings({ customThemeData: themeData }, doSync);
  };

  const updateThemeMisc = (
    data: Partial<ThemeMiscOptions>,
    doSync: boolean = true
  ) => {
    const themeData = [...settings.customThemeData];
    const originalMisc: Partial<ThemeMiscOptions> =
      themeData[settings.customThemeIndex].misc ?? {};

    themeData[settings.customThemeIndex].misc = { ...originalMisc, ...data };

    updateSettings({ customThemeData: themeData }, doSync);
  };

  const updateFaviconConfig = (
    data: Partial<FaviconConfig>,
    doSync: boolean = true
  ) => {
    const themeData = [...settings.customThemeData];
    const faviconData = structuredClone(
      themeData[settings.customThemeIndex].favicon
    );
    const newFaviconData: FaviconConfig = { ...faviconData, ...data };
    themeData[settings.customThemeIndex].favicon = newFaviconData;

    updateSettings({ customThemeData: themeData }, doSync);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updatePageTheme,
        updateAccentColor,
        updateGradientData,
        updateSiteThemeColor,
        updateThemeMisc,
        updateFaviconConfig,
        currentCustomThemeConfig:
          settings.customThemeData[settings.customThemeIndex],
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
