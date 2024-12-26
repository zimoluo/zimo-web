"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useWindow } from "@/components/contexts/WindowContext";
import specificSettingsStyle from "./theme-maker-specific-settings.module.css";
import { useEffect, useRef } from "react";
import CogIcon from "@/components/assets/toast/CogIcon";
import MenuEntriesSettings from "@/components/mainPage/menu/MenuEntriesSettings";

const contextKey = "theme-maker-specific-settings";

const themeMakerSpecificSettingsPanel = (
  <MenuEntriesSettings
    config={[
      {
        entries: [
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
          },
          {
            entry: "allowExtendedGradientStopsRange",
            type: "flip",
          },
          {
            entry: "enableColorInterpolationMethod",
            type: "flip",
          },
        ],
      },
    ]}
  />
);

export default function ThemeMakerSettingsButton() {
  const { appendPopUp, removePopUpByContextKey } = usePopUp();
  const { appendWindow, removeWindowByContextKey } = useWindow();
  const { settings } = useSettings();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    if (window.innerWidth < 768 || settings.disableWindows) {
      appendPopUp({
        content: (
          <div
            className={`${specificSettingsStyle.window} bg-widget-60 backdrop-blur-2xl shadow-xl rounded-3xl overflow-y-auto`}
          >
            <div className="px-8 pb-6 pt-6 text-xl grid grid-cols-1 gap-4">
              {themeMakerSpecificSettingsPanel}
            </div>
          </div>
        ),
        contextKey,
        darkOpacity: 0.25,
      });
    } else {
      appendWindow({
        content: (
          <div className="w-full h-full bg-light bg-opacity-80 overflow-y-auto">
            <div className="px-8 pb-6 pt-6 text-xl grid grid-cols-1 gap-4">
              {themeMakerSpecificSettingsPanel}
            </div>
          </div>
        ),
        contextKey,
        defaultHeight: 320,
        defaultWidth: 440,
        minHeight: 234,
        minWidth: 410,
        maxHeight: 440,
        maxWidth: 580,
        defaultCenterX:
          (buttonRef.current?.getBoundingClientRect().left ?? 0) +
          (buttonRef.current?.getBoundingClientRect().width ?? 0) / 2,
        defaultCenterY:
          (buttonRef.current?.getBoundingClientRect().top ?? 0) +
          (buttonRef.current?.getBoundingClientRect().height ?? 0) / 2,
        layer: 10,
      });
    }
  };

  useEffect(() => {
    return () => {
      removePopUpByContextKey(contextKey);
      removeWindowByContextKey(contextKey);
    };
  }, []);

  return (
    <button
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
      onClick={openMenu}
      ref={buttonRef}
    >
      <CogIcon className="w-full h-auto aspect-square" strokeWidth={75} />
    </button>
  );
}
