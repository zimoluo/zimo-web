"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import { syncUpUserSettings } from "@/lib/dataLayer/client/accountStateCommunicator";

const SettingsContext = createContext<
  | {
      settings: SettingsState;
      updateSettings: (newSettings: Partial<SettingsState>) => void;
      updateSettingsLocally: (newSettings: Partial<SettingsState>) => void;
    }
  | undefined
>(undefined);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, setUser } = useUser();

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem("websiteSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
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

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
      };

      localStorage.setItem("websiteSettings", JSON.stringify(updatedSettings));

      const doSyncSettings = updatedSettings.syncSettings;

      if (user !== null) {
        const preparedSettings = doSyncSettings ? updatedSettings : null;
        if (user.websiteSettings === null && preparedSettings === null) {
          return updatedSettings;
        }

        if (doSyncSettings) {
          syncUpUserSettings(user.sub, preparedSettings);
        }
      }

      return updatedSettings;
    });
  };

  const updateSettingsLocally = (newSettings: Partial<SettingsState>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
      };

      localStorage.setItem("websiteSettings", JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, updateSettingsLocally }}
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
