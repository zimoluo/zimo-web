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
import PopUpManager from "../widgets/PopUpManager";
import { allListedThemes } from "../theme/util/listedThemesMap";
import { randomIntFromRange } from "@/lib/generalHelper";

interface Props {
  children?: ReactNode;
}

const toastComponentMap: Record<NotificationStyle, ReactNode> = {
  disabled: null,
  toast: <ToastDisplayLegacy />,
  banner: <ToastBannerReceiver />,
};

const pageKeys: NavigationKey[] = [
  ...(Object.keys(defaultSettings.pageTheme) as NavigationKey[]),
];

const getUniformPageTheme = (
  theme: ThemeKey
): Record<NavigationKey, ThemeKey> => {
  const pageTheme = pageKeys.reduce((themeObject, key) => {
    (themeObject as Record<NavigationKey, ThemeKey>)[key] = theme as ThemeKey;
    return themeObject;
  }, {});
  return pageTheme as Record<NavigationKey, ThemeKey>;
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
            pageTheme: getUniformPageTheme("plainDark"),
          },
          false
        );
      }

      if (isHalloween()) {
        updateSettings(
          {
            pageTheme: getUniformPageTheme(
              Math.random() < 0.5 ? "halloween" : "spookfest"
            ),
          },
          false
        );
      }

      if (isBirthday()) {
        updateSettings(
          {
            pageTheme: getUniformPageTheme("birthday"),
          },
          false
        );
      }

      if (isChristmas()) {
        updateSettings(
          {
            pageTheme: getUniformPageTheme("christmas"),
          },
          false
        );
      }

      if (preparedSettings.randomizeThemeOnEveryVisit) {
        const themeList: ThemeKey[] = [...allListedThemes, "custom"];

        const repetitions = Math.ceil(pageKeys.length / themeList.length);
        const extendedThemeList: ThemeKey[] = Array(repetitions)
          .fill(structuredClone(themeList))
          .flat();

        const shuffledThemeList = _.shuffle(extendedThemeList);

        const pickedThemes = shuffledThemeList.slice(0, pageKeys.length);

        const pageThemeMapping = pageKeys.reduce((acc, key, index) => {
          acc[key] = pickedThemes[index];
          return acc;
        }, {} as Record<string, ThemeKey>);

        let customThemeIndex: number = preparedSettings.customThemeIndex;

        if (pickedThemes.includes("custom")) {
          customThemeIndex = randomIntFromRange(
            0,
            preparedSettings.customThemeData.length - 1
          );
        }

        updateSettings(
          {
            pageTheme: pageThemeMapping,
            customThemeIndex,
          },
          false
        );
      }
    });
  }, []);

  return (
    <>
      {toastComponentMap[settings.notificationStyle]}
      <PopUpManager />
      {children}
    </>
  );
}
