"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import {
  isBirthday,
  isChristmas,
  isHalloween,
  isNewYear,
  isRightAroundHalloween,
  isZimoWebDay,
} from "@/lib/seasonUtil";
import { parseStoredSettings, useSettings } from "../contexts/SettingsContext";
import { restoreClientUser } from "@/lib/dataLayer/client/accountStateCommunicator";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import _ from "lodash";
import ToastBannerReceiver from "../widgets/ToastBannerReceiver";
import ToastDisplayLegacy from "../widgets/ToastDisplayLegacy";
import PopUpManager from "../widgets/PopUpManager";
import { allListedThemes } from "../theme/util/listedThemesMap";
import WindowManager from "../window/WindowManager";
import MobileDesktopEntryRenderer from "../widgets/MobileDesktopEntryRenderer";
import { useWindow } from "../contexts/WindowContext";
import { generatePenumbraConfig } from "../theme/config/penumbra";

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
  const { restoreWindowFromSave } = useWindow();

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
        return loadedSettings;
      }
    }

    downloadUserInfo().then((preparedSettings) => {
      if (
        window.innerWidth >= 768 &&
        !preparedSettings.disableWindowSaving &&
        (preparedSettings.windowSaveData?.windows?.length ?? 0) > 0
      ) {
        restoreWindowFromSave(
          preparedSettings.windowSaveData.windows,
          preparedSettings.windowSaveData.viewport
        );
      }

      if (!preparedSettings.disableSpecialTheme) {
        if (
          _.isEqual(preparedSettings.pageTheme, defaultSettings.pageTheme) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          updateSettings(
            {
              pageTheme: {
                ...getUniformPageTheme("plainDark"),
                home: generatePenumbraConfig(
                  {
                    saturation: 0.33,
                    brightness: 0.85,
                  },
                  true
                ),
                photos: generatePenumbraConfig(
                  { hue: 1.6, brightness: 0.87 },
                  true
                ),
                blog: generatePenumbraConfig(
                  { hue: 1.2, brightness: 0.85 },
                  true
                ),
                projects: generatePenumbraConfig(
                  {
                    hue: 0.75,
                    saturation: 0.85,
                    brightness: 0.85,
                  },
                  true
                ),
                about: generatePenumbraConfig(
                  {
                    hue: 0.96,
                    saturation: 1.28,
                    brightness: 0.88,
                  },
                  true
                ),
                design: generatePenumbraConfig(
                  {
                    hue: 1.1,
                    brightness: 0.85,
                  },
                  true
                ),
                themeMaker: generatePenumbraConfig(
                  {
                    brightness: 0.85,
                  },
                  true
                ),
                notebook: generatePenumbraConfig(
                  {
                    hue: 0.45,
                    brightness: 0.85,
                  },
                  true
                ),
                management: generatePenumbraConfig(
                  {
                    brightness: 0.85,
                    saturation: 0.15,
                  },
                  true
                ),
                christmasTree: generatePenumbraConfig(
                  {
                    hue: 1.38,
                    brightness: 0.9,
                  },
                  true
                ),
              },
            },
            false
          );
        }

        if (isHalloween()) {
          updateSettings(
            {
              pageTheme: getUniformPageTheme(
                isRightAroundHalloween() ? "halloween" : "spookfest"
              ),
            },
            false
          );
        }

        if (isZimoWebDay()) {
          updateSettings(
            {
              pageTheme: getUniformPageTheme("perpetuity"),
            },
            false
          );
        }

        if (isBirthday()) {
          const age = new Date().getFullYear() - 2005;
          let birthdayThemeKey = (
            age === 18 ? "birthday" : `birthday${age}`
          ) as ThemeKey;

          birthdayThemeKey = allListedThemes.includes(birthdayThemeKey)
            ? birthdayThemeKey
            : "birthdayGeneric";

          updateSettings(
            {
              pageTheme: getUniformPageTheme(birthdayThemeKey),
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

        if (isNewYear()) {
          updateSettings(
            {
              pageTheme: getUniformPageTheme("celebration"),
            },
            false
          );
        }
      }

      if (preparedSettings.randomizeThemeOnEveryVisit) {
        const themeList: (ThemeKey | ThemeDataConfig)[] = [
          ...allListedThemes,
          ...structuredClone(preparedSettings.customThemeData),
        ];

        const repetitions = Math.ceil(pageKeys.length / themeList.length);
        const extendedThemeList: (ThemeKey | ThemeDataConfig)[] = Array(
          repetitions
        )
          .fill(structuredClone(themeList))
          .flat();

        const shuffledThemeList = _.shuffle(extendedThemeList);

        const pickedThemes = shuffledThemeList.slice(0, pageKeys.length);

        const pageThemeMapping = pageKeys.reduce((acc, key, index) => {
          acc[key] = pickedThemes[index];
          return acc;
        }, {} as Record<string, ThemeKey | ThemeDataConfig>);

        updateSettings(
          {
            pageTheme: pageThemeMapping,
          },
          false
        );
      }
    });
  }, []);

  return (
    <>
      <MobileDesktopEntryRenderer desktop={<WindowManager />} />
      <PopUpManager />
      {toastComponentMap[settings.notificationStyle]}
      {children}
      {settings.veryBrightMode && (
        <div className="-inset-1/2 fixed backdrop-brightness-150 z-100 pointer-events-none select-none" />
      )}
    </>
  );
}
