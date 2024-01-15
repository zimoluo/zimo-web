"use client";

import React, { useMemo } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import SettingsFlip from "./settings/SettingsFlip";
import SettingsSlider from "./settings/SettingsSlider";
import menuStyle from "./menu.module.css";
import { useTheme } from "@/components/contexts/ThemeContext";
import SettingsThemePicker from "./settings/SettingsThemePicker";
import { useNavigation } from "@/lib/helperHooks";
import { useToast } from "@/components/contexts/ToastContext";

const securityCommentShutDown =
  process.env.NEXT_PUBLIC_ZIMO_WEB_COMMENT_SHUTDOWN === "true";

const settingsNameMap: { [key in keyof Partial<SettingsState>]: string } = {
  syncSettings: "Sync Settings",
  backgroundRichness: "Background Richness",
  navigationBar: "Navigation Bar",
  disableCenterPainting: "Disable Center Art",
  disableComments: "Disable Comments",
  disableGestures: "Disable Gestures",
  disableSerifFont: "Disable Serif Font",
  disableEntryPopUp: "Disable Entry Pop-Up",
  enableGallery: "Gallery Mode",
  disableSoundEffect: "Disable Sound Effect",
  instantSearchResult: "Show Search Result Instantly",
  disableTableOfContents: "Disable Table of Contents",
};

export default function MenuEntriesSettings() {
  const { settings, updateSettings } = useSettings();
  const { themeKey } = useTheme();
  const { appendToast } = useToast();

  const currentPage = useNavigation();

  const settingsArray: (keyof Partial<SettingsState>)[] = useMemo(() => {
    let initialSettings: (keyof Partial<SettingsState>)[] = [
      "disableComments",
      "disableGestures",
      "disableSoundEffect",
    ];

    if (currentPage === "blog" || currentPage === "management") {
      initialSettings = [
        "disableTableOfContents",
        "instantSearchResult",
        ...initialSettings,
      ];
    }

    if (currentPage === "blog") {
      initialSettings = ["disableSerifFont", ...initialSettings];
    }

    if (themeKey === "blog") {
      initialSettings = ["disableCenterPainting", ...initialSettings];
    }

    if (currentPage === "photos" || currentPage === "projects") {
      initialSettings = ["disableEntryPopUp", ...initialSettings];
    }

    if (currentPage === "photos") {
      initialSettings = ["enableGallery", ...initialSettings];
    }

    return initialSettings;
  }, [currentPage, themeKey]);

  return (
    <>
      <div className="flex items-center my-4 ">
        <div className="flex-grow text-lg md:text-xl ml-1">
          {settingsNameMap["syncSettings"]}
        </div>
        <SettingsFlip
          onClick={(status: boolean) => {
            updateSettings({
              syncSettings: status,
            });
          }}
          state={settings.syncSettings}
        />
      </div>
      <div className="border-primary border-0.4 border-opacity-20" />
      <div className="md:flex md:items-center my-4 ">
        <div className={`text-lg md:text-xl ${menuStyle["entry-min-width"]}`}>
          Theme Palette
        </div>
        <div className="md:flex-grow my-5 md:my-2">
          <SettingsThemePicker />
        </div>
      </div>
      <div className="border-primary border-0.4 border-opacity-20" />
      <div className="md:flex md:items-center my-4 ">
        <div
          className={`md:flex-grow text-lg md:text-xl ${menuStyle["entry-min-width"]}`}
        >
          Background Richness
        </div>
        <SettingsSlider
          setValue={(newValue: string | number) => {
            updateSettings({
              backgroundRichness: newValue as "minimal" | "reduced" | "rich",
            });
          }}
          values={["minimal", "reduced", "rich"]}
          text={["Minimal", "Reduced", "Rich"]}
          entry={settings.backgroundRichness}
        />
      </div>
      <div className="border-primary border-0.4 border-opacity-20" />
      <div className="md:flex md:items-center my-4 ">
        <div
          className={`md:flex-grow text-lg md:text-xl ${menuStyle["entry-min-width"]}`}
        >
          Navigation Bar
        </div>
        <SettingsSlider
          setValue={(newValue: string | number) => {
            updateSettings({
              navigationBar: newValue as "disabled" | "always" | "flexible",
            });
          }}
          values={["disabled", "always", "flexible"]}
          text={["Disabled", "Always-On", "Flexible"]}
          entry={settings.navigationBar}
        />
      </div>
      <div className="md:flex md:items-center my-4 ">
        <div
          className={`md:flex-grow text-lg md:text-xl ${menuStyle["entry-min-width"]}`}
        >
          Notification Style
        </div>
        <SettingsSlider
          setValue={(newValue: string | number) => {
            if (newValue !== "disabled") {
              appendToast({
                title: "Zimo Web",
                description: `Notification set to ${newValue}.`,
              });
            }
            updateSettings({
              notificationStyle: newValue as "disabled" | "toast" | "banner",
            });
          }}
          values={["disabled", "toast", "banner"]}
          text={["Disabled", "Toast", "Banner"]}
          entry={settings.notificationStyle}
        />
      </div>
      <div className="border-primary border-0.4 border-opacity-20" />
      {themeKey === "projects" && (
        <>
          <div className="md:flex md:items-center my-4 ">
            <div
              className={`md:flex-grow text-lg md:text-xl ${
                menuStyle["entry-min-width"]
              } ${
                settings.floatingCodeSpeed < 1000
                  ? "flex md:block items-center"
                  : ""
              }`}
            >
              Floating Code Rate
              {settings.floatingCodeSpeed < 1000 && (
                <div className="text-xs ml-1 md:ml-0">
                  (Performance warning)
                </div>
              )}
            </div>
            <SettingsSlider
              setValue={(newValue: number | string) => {
                updateSettings({
                  floatingCodeSpeed: newValue as number,
                });
              }}
              values={[6000, 2800, 1800, 800, 40]}
              text={["*yawn*", "Slack", "Normal", "Hustle", "*yeet*"]}
              entry={settings.floatingCodeSpeed}
            />
          </div>
          <div className="border-primary border-0.4 border-opacity-20" />
        </>
      )}
      {themeKey === "birthday" && (
        <>
          <div className="md:flex md:items-center my-4 ">
            <div
              className={`md:flex-grow text-lg md:text-xl ${
                menuStyle["entry-min-width"]
              } ${
                settings.flyingBalloonRate < 1000
                  ? "flex md:block items-center"
                  : ""
              }`}
            >
              Birthday Balloon Rate
              {settings.flyingBalloonRate < 1000 && (
                <div className="text-xs ml-1 md:ml-0">
                  (Performance warning)
                </div>
              )}
            </div>
            <SettingsSlider
              setValue={(newValue: number | string) => {
                updateSettings({
                  flyingBalloonRate: newValue as number,
                });
              }}
              values={[3000, 1600, 500, 50]}
              text={["Steady", "Normal", "Rave", "*yeet*"]}
              entry={settings.flyingBalloonRate}
            />
          </div>
          <div className="border-primary border-0.4 border-opacity-20" />
        </>
      )}
      {settingsArray.map((item, index, array) => (
        <React.Fragment key={item}>
          <div className="flex items-center my-4 ">
            <div className="flex-grow text-lg md:text-xl ml-1">
              {settingsNameMap[item as keyof SettingsState]}
            </div>
            <SettingsFlip
              key={item}
              onClick={
                item === "disableComments" && securityCommentShutDown
                  ? (status: boolean) => {}
                  : (status: boolean) => {
                      updateSettings({
                        [item]: status,
                      } as Partial<SettingsState>);
                    }
              }
              state={
                item === "disableComments" && securityCommentShutDown
                  ? true
                  : ((settings as unknown as Record<string, unknown>)[
                      item
                    ] as boolean)
              }
            />
          </div>
          {index !== array.length - 1 && (
            <div className="border-primary border-0.4 border-opacity-20" />
          )}
        </React.Fragment>
      ))}
    </>
  );
}
