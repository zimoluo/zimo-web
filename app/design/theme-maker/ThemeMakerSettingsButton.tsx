"use client";

import { usePopUp } from "@/components/contexts/PopUpContext";
import { useWindow } from "@/components/contexts/WindowContext";
import specificSettingsStyle from "./theme-maker-specific-settings.module.css";
import { useEffect, useRef } from "react";
import CogIcon from "@/components/assets/toast/CogIcon";
import MenuEntriesSettings from "@/components/mainPage/menu/MenuEntriesSettings";

const contextKey = "theme-maker-specific-settings";

const themeMakerSpecificSettingsPanel = (
  <MenuEntriesSettings
    headless={true}
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

  const buttonRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    if (window.innerWidth < 768) {
      appendPopUp({
        content: (
          <div
            className={`${specificSettingsStyle.window} bg-widget-80 shadow-xl rounded-[2rem] overflow-y-auto outline outline-1 outline-highlight-light/15`}
          >
            <div className="px-8 pb-6 pt-6 text-xl grid grid-cols-1 gap-4">
              {themeMakerSpecificSettingsPanel}
            </div>
          </div>
        ),
        contextKey,
      });
    } else {
      appendWindow({
        content: (
          <div className="w-full h-full bg-light bg-opacity-80 overflow-y-auto">
            <div className="p-4 grid grid-cols-1 gap-4">
              {themeMakerSpecificSettingsPanel}
            </div>
          </div>
        ),
        contextKey,
        defaultHeight: 194,
        defaultWidth: 420,
        minWidth: 350,
        minHeight: 194,
        maxWidth: 440,
        maxHeight: 324,
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
