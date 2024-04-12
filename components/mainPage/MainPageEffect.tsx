"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { isBirthday, isChristmas, isHalloween } from "@/lib/seasonUtil";
import { parseStoredSettings, useSettings } from "../contexts/SettingsContext";
import { restoreClientUser } from "@/lib/dataLayer/client/accountStateCommunicator";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import _ from "lodash";
import ToastBannerReceiver from "../widgets/ToastBannerReceiver";
import ToastDisplayLegacy from "../widgets/ToastDisplayLegacy";
import { useSearchParams } from "next/navigation";
import { allListedThemes } from "./menu/settings/SettingsThemePicker";

interface Props {
  children?: ReactNode;
}

const toastComponentMap: Record<string, ReactNode> = {
  disabled: null,
  toast: <ToastDisplayLegacy />,
  banner: <ToastBannerReceiver />,
};

const pageKeys: NavigationKey[] = [
  "home",
  "blog",
  "photos",
  "projects",
  "about",
  "management",
  "design",
];

const getUniformPageTheme = (
  theme: ThemeAvailable
): Record<NavigationKey, ThemeAvailable> => {
  const pageTheme = pageKeys.reduce((themeObject, key) => {
    (themeObject as Record<NavigationKey, ThemeAvailable>)[key] =
      theme as ThemeAvailable;
    return themeObject;
  }, {});
  return pageTheme as Record<NavigationKey, ThemeAvailable>;
};

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
            pageTheme: getUniformPageTheme("plainDark"),
          },
          false
        );
      }

      if (isHalloween()) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: getUniformPageTheme("halloween"),
          },
          false
        );
      }

      if (isBirthday()) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: getUniformPageTheme("birthday"),
          },
          false
        );
      }

      if (isChristmas()) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: getUniformPageTheme("christmas"),
          },
          false
        );
      }

      const forcedTheme = useSearchParams().get("useTheme")?.trim();
      if (
        forcedTheme &&
        allListedThemes.includes(forcedTheme as ThemeAvailable)
      ) {
        updateSettings(
          {
            ...preparedSettings,
            pageTheme: getUniformPageTheme(forcedTheme as ThemeAvailable),
          },
          false
        );
      }
    });
  }, []);

  return (
    <>
      {toastComponentMap[settings.notificationStyle]}
      {children}
    </>
  );
}
