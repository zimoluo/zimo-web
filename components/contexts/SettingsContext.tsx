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
