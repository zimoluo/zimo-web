"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useClientSideFlag } from "@/lib/clientLogicHooks";
import { isHalloweenSeason } from "@/lib/seasonUtil";
import { parseStoredSettings, useSettings } from "../contexts/SettingsContext";
import { restoreClientUser } from "@/lib/dataLayer/client/accountStateCommunicator";
import HalloweenPulse from "./special/HalloweenPulse";
import ToastDisplay from "./ToastDisplay";

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

    downloadUserInfo();
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
