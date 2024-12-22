"use client";

import { Fragment, ReactNode, useCallback } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import SettingsFlip from "./settings/SettingsFlip";
import SettingsSlider from "./settings/SettingsSlider";
import menuStyle from "./menu.module.css";
import { useTheme } from "@/components/contexts/ThemeContext";
import SettingsThemePicker from "./settings/SettingsThemePicker";
import { useNavigation } from "@/lib/helperHooks";
import NotificationStylePicker from "./settings/NotificationStylePicker";
import ThemeProfileSelector from "@/app/design/theme-maker/ThemeProfileSelector";
import { useWindow } from "@/components/contexts/WindowContext";

const securityCommentShutDown =
  process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true";

const settingsNameMap: { [key in keyof Partial<SettingsState>]: string } = {
  syncSettings: "Sync data",
  backgroundRichness: "Background richness",
  navigationBar: "Navigation bar",
  disableCenterPainting: "Disable center art",
  disableComments: "Disable comments",
  disableGestures: "Disable gestures",
  disableSerifFont: "Disable serif font",
  disableEntryPopUp: "Disable entry pop-up",
  enableGallery: "Gallery mode",
  disableSoundEffect: "Disable sound effect",
  instantSearchResult: "Show search results instantly",
  disableTableOfContents: "Disable table of contents",
  pageTheme: "Theme preset",
  notificationStyle: "Notification style",
  floatingCodeSpeed: "Floating code rate",
  flyingBalloonRate: "Birthday balloon rate",
  goldSphereAnimationIntensity: "Spinning intensity",
  customThemeData: "Theme profile",
  expandThemeMakerWindow: "Expand Theme Maker to fullscreen",
  optimizeProfileExport: "Optimize profile export",
  allowExtendedGradientStopsRange: "Allow extended gradient",
  enableColorInterpolationMethod: "Enable color interpolation method",
  hideColorLookupPanel: "Hide color lookup panel",
  randomizeThemeOnEveryVisit: "Randomize themes on every visit",
  windowLimit: "Number of windows",
  calculatorAppearance: "Calculator appearance",
  disableWindows: "Disable windows",
  disableWindowSnapping: "Disable window snapping",
  disableSpecialTheme: "Disable special theme",
  disableWindowSaving: "Disable window saving",
  toastBannerLimit: "Number of banners for wide screen",
  alwaysEnableFireworks: "Always enable fireworks effect",
  windowResizeBehavior: "Window resizing behavior",
  disableWindowSnapToViewportBorder: "Disable snap to screen border",
};

interface SettingsPanelEntry {
  entry: keyof SettingsState;
  type: "flip" | "slider" | "special";
  condition?: { value: string; match: string | string[] | boolean | number }[];
  component?: ReactNode;
  values?: string[] | number[];
  captions?: string[];
  flipAppearance?: SettingsFlipAppearance;
}

const settingsConfig: {
  title?: string;
  entries: SettingsPanelEntry[];
}[] = [
  {
    title: "Account",
    entries: [{ entry: "syncSettings", type: "flip" }],
  },
  {
    title: "Theme",
    entries: [
      {
        entry: "pageTheme",
        type: "special",
        component: (
          <div className="md:flex-grow my-5 md:my-2">
            <div className="relative bg-light rounded-xl bg-opacity-40 border-0.8 border-opacity-40 border-primary">
              <div className="relative overflow-y-auto py-4 px-4 md:px-2.5 rounded-xl">
                <div
                  className={`${menuStyle.pickerScrollContainer} rounded-xl`}
                >
                  <SettingsThemePicker />
                  <div
                    className="h-4 select-none pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        entry: "customThemeData",
        type: "special",
        component: (
          <div className={`${menuStyle.themeProfileWidth}`}>
            <div className="mt-4 mb-7 md:my-2 px-4">
              <ThemeProfileSelector
                className="-mb-3"
                applyThemeDataConfig={true}
              />
            </div>
          </div>
        ),
      },
      {
        entry: "backgroundRichness",
        type: "slider",
        values: ["minimal", "reduced", "rich"],
        captions: ["Minimal", "Reduced", "Rich"],
      },
      {
        entry: "disableSpecialTheme",
        type: "flip",
      },
      {
        entry: "randomizeThemeOnEveryVisit",
        type: "flip",
      },
      {
        entry: "disableCenterPainting",
        type: "flip",
        condition: [{ value: "animationKey", match: "blog" }],
      },
      {
        entry: "disableSoundEffect",
        type: "flip",
        condition: [{ value: "animationKey", match: "halloween" }],
        flipAppearance: "halloween",
      },
      {
        entry: "alwaysEnableFireworks",
        type: "flip",
        condition: [{ value: "animationKey", match: "perpetuity" }],
      },
      {
        entry: "floatingCodeSpeed",
        type: "slider",
        values: [6000, 2800, 1800, 800, 40],
        captions: ["*yawn*", "Slack", "Normal", "Hustle", "*yeet*"],
        condition: [{ value: "animationKey", match: "projects" }],
      },
      {
        entry: "flyingBalloonRate",
        type: "slider",
        values: [3000, 1600, 500, 50],
        captions: ["Steady", "Normal", "Rave", "*yeet*"],
        condition: [{ value: "animationKey", match: "birthday" }],
      },
      {
        entry: "goldSphereAnimationIntensity",
        type: "slider",
        values: [20, 60, 100, 150, 800],
        captions: ["Gentle", "Steady", "Dynamic", "Vibrant", "Blazing"],
        condition: [{ value: "animationKey", match: "gold" }],
      },
    ],
  },
  {
    title: "Interface",
    entries: [
      {
        entry: "navigationBar",
        type: "slider",
        values: ["disabled", "always", "flexible"],
        captions: ["Disabled", "Always-on", "Flexible"],
      },
      {
        entry: "windowLimit",
        type: "slider",
        values: [1, 3, 6, 12, 30],
        captions: ["One", "Three", "Six", "Twelve", "Thirty"],
      },
      { entry: "disableWindows", type: "flip" },
      { entry: "disableWindowSaving", type: "flip" },
      { entry: "disableWindowSnapping", type: "flip" },
      {
        entry: "disableWindowSnapToViewportBorder",
        type: "flip",
        condition: [{ value: "settings-disableWindowSnapping", match: false }],
      },
      {
        entry: "windowResizeBehavior",
        type: "slider",
        values: ["corner", "center", "adaptive"],
        captions: ["Corner", "Center", "Adaptive"],
      },
      {
        entry: "notificationStyle",
        type: "special",
        component: <NotificationStylePicker className="mt-4 md:mt-0" />,
      },
      {
        entry: "toastBannerLimit",
        type: "slider",
        values: [1, 3, 5, 7],
        captions: ["One", "Three", "Five", "Seven"],
        condition: [
          {
            value: "settings-notificationStyle",
            match: "banner",
          },
        ],
      },
      {
        entry: "hideColorLookupPanel",
        type: "flip",
        condition: [
          {
            value: "currentPage",
            match: "themeMaker",
          },
        ],
      },
      {
        entry: "expandThemeMakerWindow",
        type: "flip",
        condition: [
          {
            value: "currentPage",
            match: "themeMaker",
          },
        ],
      },
      {
        entry: "optimizeProfileExport",
        type: "flip",
        condition: [
          { value: "windowTag", match: "requireThemeMakerSettings" },
          {
            value: "currentPage",
            match: "themeMaker",
          },
        ],
      },
      {
        entry: "allowExtendedGradientStopsRange",
        type: "flip",
        condition: [
          { value: "windowTag", match: "requireThemeMakerSettings" },
          {
            value: "currentPage",
            match: "themeMaker",
          },
        ],
      },
      {
        entry: "enableColorInterpolationMethod",
        type: "flip",
        condition: [
          { value: "windowTag", match: "requireThemeMakerSettings" },
          {
            value: "currentPage",
            match: "themeMaker",
          },
        ],
      },
    ],
  },
  {
    title: "Miscellaneous",
    entries: [
      {
        entry: "enableGallery",
        type: "flip",
        condition: [{ value: "currentPage", match: "photos" }],
      },
      {
        entry: "disableEntryPopUp",
        type: "flip",
        condition: [{ value: "currentPage", match: ["photos", "projects"] }],
      },
      { entry: "disableComments", type: "flip" },
      {
        entry: "disableTableOfContents",
        type: "flip",
        condition: [
          { value: "currentPage", match: ["blog", "management"] },
          {
            value: "windowTag",
            match: "requireTableOfContentsSettings",
          },
        ],
      },
      {
        entry: "disableSerifFont",
        type: "flip",
        condition: [
          { value: "currentPage", match: "blog" },
          {
            value: "windowTag",
            match: "requireBlogSettings",
          },
        ],
      },
      { entry: "disableGestures", type: "flip" },
      {
        entry: "instantSearchResult",
        type: "flip",
        condition: [
          { value: "currentPage", match: "blog" },
          {
            value: "windowTag",
            match: "requireEntrySettings",
          },
        ],
      },
      {
        entry: "calculatorAppearance",
        type: "slider",
        values: ["normal", "border", "contrast"],
        captions: ["Standard", "Bordered", "Contrast"],
        condition: [
          {
            value: "windowTag",
            match: "requireCalculatorSettings",
          },
        ],
      },
    ],
  },
];

const entryDivider = (
  <hr className="border-primary border-0.4 border-opacity-20 h-0" />
);

interface Props {
  config?: typeof settingsConfig;
  ignoreConditions?: boolean;
}

export default function MenuEntriesSettings({
  config = settingsConfig,
  ignoreConditions = false,
}: Props) {
  const { settings, updateSettings } = useSettings();
  const { windows } = useWindow();
  const { themeConfig } = useTheme();
  const animationKey = themeConfig.animatedBackgroundKey;

  const currentPage = useNavigation();

  const getWindowTagMatch = useCallback(
    (tag: string) =>
      windows.some((window) => (window.tags ?? []).includes(tag)),
    [windows]
  );

  const checkCondition = (condition: SettingsPanelEntry["condition"]) => {
    if (ignoreConditions) {
      return true;
    }

    if (!condition) {
      return true;
    }

    return condition.some((cond) => {
      const { value, match } = cond;
      if (value === "animationKey") {
        if (!animationKey) {
          return false;
        }
        if (Array.isArray(match)) {
          if (Array.isArray(animationKey)) {
            return animationKey.some((key) => match.includes(key));
          } else if (typeof animationKey === "string") {
            return match.includes(animationKey);
          }
        } else if (typeof match === "string") {
          if (Array.isArray(animationKey)) {
            return animationKey.includes(match as ThemeAnimatedBackgroundKey);
          } else if (typeof animationKey === "string") {
            return animationKey === match || animationKey.includes(match);
          }
        }
      } else if (value === "currentPage") {
        if (Array.isArray(match)) {
          return match.includes(currentPage);
        }
        return currentPage === match;
      } else if (value === "windowTag") {
        if (Array.isArray(match)) {
          return match.some((tag) => getWindowTagMatch(tag));
        }
        return getWindowTagMatch(`${match}`);
      } else if (value.startsWith("settings-")) {
        const settingsKey = value.slice("settings-".length);

        if (settingsKey in settings) {
          if (Array.isArray(match)) {
            return match.includes(
              settings[settingsKey as keyof SettingsState] as any
            );
          }
          return (
            (settings[settingsKey as keyof SettingsState] as any) === match
          );
        }
      }

      return false;
    });
  };

  return (
    <>
      {config.map((section, sectionIndex) => {
        const filteredEntries = section.entries.filter((entry) =>
          checkCondition(entry.condition)
        );
        return (
          <Fragment
            key={`${section.title || "settings-section"}-${sectionIndex}`}
          >
            {section.title && (
              <p className="text-lg md:text-xl font-bold mb-2 mt-2">
                {section.title}
              </p>
            )}
            {filteredEntries.map((entry, entryIndex) => {
              const isLastEntry = entryIndex === filteredEntries.length - 1;
              const showDivider =
                !isLastEntry || sectionIndex !== config.length - 1;

              switch (entry.type) {
                case "flip":
                  return (
                    <Fragment key={`${entry.entry}-${entryIndex}`}>
                      <div className="flex items-center gap-2">
                        <div className="flex-grow text-lg md:text-xl">
                          {settingsNameMap[entry.entry]}
                        </div>
                        <SettingsFlip
                          onClick={
                            entry.entry === "disableComments" &&
                            securityCommentShutDown
                              ? () => {}
                              : (status: boolean) => {
                                  updateSettings({
                                    [entry.entry]: status,
                                  } as Partial<SettingsState>);
                                }
                          }
                          state={
                            !!(entry.entry === "disableComments" &&
                            securityCommentShutDown
                              ? true
                              : settings[entry.entry])
                          }
                          appearance={entry?.flipAppearance ?? undefined}
                        />
                      </div>
                      {showDivider && entryDivider}
                    </Fragment>
                  );
                case "slider":
                  const entryValue = settings[entry.entry] as number;
                  const performanceWarning =
                    (entry.entry === "floatingCodeSpeed" &&
                      entryValue < 1000) ||
                    (entry.entry === "flyingBalloonRate" &&
                      entryValue < 1000) ||
                    (entry.entry === "windowLimit" && entryValue > 4);

                  return (
                    <Fragment key={`${entry.entry}-${entryIndex}`}>
                      <div className="md:flex md:items-center md:gap-2">
                        <div
                          className={`md:flex-grow text-lg md:text-xl ${
                            menuStyle.entryMinWidth
                          } ${
                            performanceWarning
                              ? "flex md:block items-center"
                              : ""
                          }`}
                        >
                          {settingsNameMap[entry.entry]}
                          {performanceWarning && (
                            <div className="text-xs ml-1 md:ml-0">
                              (Performance warning)
                            </div>
                          )}
                        </div>
                        <SettingsSlider
                          setValue={(newValue: string | number) => {
                            updateSettings({
                              [entry.entry]: newValue,
                            } as Partial<SettingsState>);
                          }}
                          values={entry.values as (string | number)[]}
                          text={entry.captions ?? []}
                          entry={entryValue}
                        />
                      </div>
                      {showDivider && entryDivider}
                    </Fragment>
                  );
                case "special":
                  return (
                    <Fragment key={`${entry.entry}-${entryIndex}`}>
                      <div className="md:flex md:items-center">
                        <div
                          className={`text-lg md:text-xl ${menuStyle.entryMinWidth}`}
                        >
                          {settingsNameMap[entry.entry]}
                        </div>
                        {entry.component}
                      </div>
                      {showDivider && entryDivider}
                    </Fragment>
                  );
                default:
                  return null;
              }
            })}
          </Fragment>
        );
      })}
    </>
  );
}
