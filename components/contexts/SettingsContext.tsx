"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import { syncUpUserSettings } from "@/lib/dataLayer/client/accountStateCommunicator";

export const parseStoredSettings = (rawSettings: string): SettingsState => {
  if (!rawSettings) {
    return defaultSettings;
  }

  const parsedSavedSettings = JSON.parse(rawSettings) as Partial<SettingsState>;

  const filteredSavedSettings = Object.keys(parsedSavedSettings)
    .filter((key): key is keyof SettingsState => key in defaultSettings)
    .reduce((obj, key) => {
      obj[key] = parsedSavedSettings[key] as any;
      return obj;
    }, {} as Partial<SettingsState>);

  return { ...defaultSettings, ...filteredSavedSettings };
};

const SettingsContext = createContext<
  | {
      settings: SettingsState;
      updateSettings: (
        newSettings: Partial<SettingsState>,
        doSync?: boolean
      ) => void;
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
    const savedSettings = localStorage.getItem("websiteSettings");
    if (savedSettings) {
      updateSettings(parseStoredSettings(savedSettings), false);
    }
  }, []);

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

    setSettings(updatedSettings);
    localStorage.setItem("websiteSettings", JSON.stringify(updatedSettings));

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

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
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
