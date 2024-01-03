"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useClientSideFlag } from "@/lib/clientLogicHooks";
import _ from "lodash";
import {
  isBirthday,
  isChristmas,
  isHalloweenDay,
  isHalloweenSeason,
} from "@/lib/seasonUtil";
import { parseStoredSettings, useSettings } from "../contexts/SettingsContext";
import { restoreClientUser } from "@/lib/dataLayer/client/accountStateCommunicator";
import HalloweenPulse from "./special/HalloweenPulse";
import ToastDisplay from "./ToastDisplay";
import { defaultSettings } from "@/lib/constants/defaultSettings";

interface Props {
  children?: ReactNode;
}

export default function MainPageEffect({ children }: Props) {
  const isHalloweenSeasonClient = useClientSideFlag(isHalloweenSeason);

  const { user, setUser } = useUser();
  const { updateSettings, settings } = useSettings();

  useEffect(() => {
    async function downloadUserInfo() {
      if (user !== null) return;

      try {
        const savedRawSettings = localStorage.getItem("websiteSettings");
        const loadedSettings = parseStoredSettings(savedRawSettings || "");

        const restoredUserInfo = await restoreClientUser(loadedSettings);

        if (!restoredUserInfo) {
          console.log(
            "Encountered an unexpected error while trying to restore user session."
          );
          return;
        }

        if (!restoredUserInfo.exists) {
          console.log("No user session found.");
          return;
        }

        const { integratedUser, downloadedSettings } = restoredUserInfo;

        setUser(integratedUser);
        if (downloadedSettings !== null) {
          updateSettings(downloadedSettings, false);
        }
      } catch (error) {
        console.error("Error in restoring user session:", error);
      }
    }

    async function restoreUserInfo() {
      await downloadUserInfo();
      if (
        !settings.ignoreDeviceTheme &&
        _.isEqual(settings.pageTheme, defaultSettings.pageTheme) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        updateSettings(
          {
            pageTheme: {
              home: "midnight",
              blog: "midnight",
              photos: "midnight",
              projects: "midnight",
              about: "midnight",
              management: "midnight",
            },
          },
          false
        );
      }
      if (isHalloweenDay()) {
        updateSettings({ enableHalloweenEffect: true }, false);
      }
      if (isBirthday()) {
        updateSettings(
          {
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
    }

    restoreUserInfo();
  }, []);

  return (
    <>
      {settings.enableHalloweenEffect && isHalloweenSeasonClient && (
        <HalloweenPulse />
      )}
      {!settings.disableToast && <ToastDisplay />}
      {children}
    </>
  );
}
