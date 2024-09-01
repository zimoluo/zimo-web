"use client";

import CommandKeyIcon from "@/components/assets/entries/CommandKeyIcon";
import { usePopUp } from "@/components/contexts/PopUpContext";
import configStyle from "./preset-config-button.module.css";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";

const uniqueKey = "theme-maker-preset-config";

export default function PresetConfigButton() {
  const { appendPopUp, removePopUpByUniqueKey } = usePopUp();

  const openMenu = () => {
    appendPopUp({
      content: (
        <div
          className={`${configStyle.window} rounded-3xl shadow-xl bg-widget-60 bakcdrop-blur-lg px-3 pb-5 pt-6 ${configStyle.grid}`}
        >
          <div className="flex flex-col items-center mb-2">
            <p className="text-xl text-center font-bold">Import Presets</p>
          </div>
          <div className="w-full h-full p-4 overflow-y-auto">
            <SettingsThemePicker hasRandom={false} insertProfile={true} />
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                removePopUpByUniqueKey(uniqueKey);
              }}
              className={`h-9 ${configStyle.button} rounded-full shadow-lg bg-light bg-opacity-80 text-center`}
            >
              Done
            </button>
          </div>
        </div>
      ),
      uniqueKey,
      darkOpacity: 0.25,
    });
  };

  return (
    <button
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
      onClick={openMenu}
    >
      <CommandKeyIcon className="w-full h-auto aspect-square" />
    </button>
  );
}
