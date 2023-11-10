"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useClientSideFlag } from "@/lib/clientLogicHooks";
import { isHalloweenDay, isHalloweenSeason } from "@/lib/seasonUtil";
import { useSettings } from "../contexts/SettingsContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import { restoreClientUser } from "@/lib/dataLayer/client/accountStateCommunicator";
import HalloweenPulse from "./special/HalloweenPulse";

interface Props {
  children?: ReactNode;
}

export default function MainPageFrame({ children }: Props) {
  const isHalloweenSeasonClient = useClientSideFlag(isHalloweenSeason);

  const { user, setUser } = useUser();
  const { updateSettings, settings } = useSettings();

  useEffect(() => {
    async function downloadUserInfo() {
      if (user !== null) return;

      try {
        const savedRawSettings = localStorage.getItem("websiteSettings");
        const loadedSettings = savedRawSettings
          ? { ...defaultSettings, ...JSON.parse(savedRawSettings) }
          : defaultSettings;

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
      if (isHalloweenDay()) {
        updateSettings({ enableHalloweenEffect: true }, false);
      }
    }

    restoreUserInfo();
  }, []);

  return (
    <>
      {settings.enableHalloweenEffect && isHalloweenSeasonClient && (
        <HalloweenPulse />
      )}
      {children}
    </>
  );
}
