"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { isBirthday, isChristmas, isHalloween } from "@/lib/seasonUtil";
import { parseStoredSettings, useSettings } from "../contexts/SettingsContext";
import { restoreClientUser } from "@/lib/dataLayer/client/accountStateCommunicator";
import ToastDisplay from "../widgets/ToastDisplay";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import _ from "lodash";

interface Props {
  children?: ReactNode;
}

export default function MainPageEffect({ children }: Props) {
  const { user, setUser } = useUser();
  const { updateSettings, settings } = useSettings();

  useEffect(() => {
    async function downloadUserInfo(): Promise<SettingsState> {
      const savedRawSettings = localStorage.getItem("websiteSettings");
      const loadedSettings = parseStoredSettings(savedRawSettings || "") || {};

      updateSettings(loadedSettings, false);

      if (user !== null) {
        return loadedSettings;
      }

      try {
        const restoredUserInfo = await restoreClientUser(loadedSettings);

        if (!restoredUserInfo) {
          throw new Error(
            "Encountered an unexpected error while trying to restore user session."
          );
        }

        if (!restoredUserInfo.exists) {
          console.log("No user session found.");
          return loadedSettings;
        }

        const { integratedUser, downloadedSettings } = restoredUserInfo;
        setUser(integratedUser);
        if (downloadedSettings !== null) {
          updateSettings(downloadedSettings, false);
        }
        return downloadedSettings || loadedSettings;
      } catch (error) {
        console.error("Error in restoring user session:", error);
      } finally {
        return loadedSettings;
      }
    }

    downloadUserInfo().then((preparedSettings) => {
      if (
        _.isEqual(preparedSettings.pageTheme, defaultSettings.pageTheme) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: {
              home: "plainDark",
              blog: "plainDark",
              photos: "plainDark",
              projects: "plainDark",
              about: "plainDark",
              management: "plainDark",
            },
          },
          false
        );
      }

      if (isHalloween()) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: {
              home: "halloween",
              blog: "halloween",
              photos: "halloween",
              projects: "halloween",
              about: "halloween",
              management: "halloween",
            },
          },
          false
        );
      }

      if (isBirthday()) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: {
              home: "birthday",
              blog: "birthday",
              photos: "birthday",
              projects: "birthday",
              about: "birthday",
              management: "birthday",
            },
          },
          false
        );
      }

      if (isChristmas()) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: {
              home: "christmas",
              blog: "christmas",
              photos: "christmas",
              projects: "christmas",
              about: "christmas",
              management: "christmas",
            },
          },
          false
        );
      }
    });
  }, []);

  return (
    <>
      {!settings.disableToast && <ToastDisplay />}
      {children}
    </>
  );
}
