"use client";

import configStyle from "./preset-config-button.module.css";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";
import { useWindowAction } from "@/components/contexts/WindowActionContext";

export default function PresetConfigWindow() {
  const { closeWindow } = useWindowAction();

  return (
    <div
      className={`w-full h-full bg-widget-60 px-3 pb-5 pt-6 ${configStyle.grid}`}
    >
      <div className="flex flex-col items-center mb-2">
        <p className="text-xl text-center font-bold">Import Presets</p>
      </div>
      <div className="w-full h-full p-4 overflow-y-auto">
        <SettingsThemePicker hasRandom={false} insertProfile={true} />
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={closeWindow}
          className={`h-9 ${configStyle.button} rounded-full shadow-lg bg-light bg-opacity-80 text-center transition-colors duration-150 ease-out hover:text-light hover:bg-saturated`}
        >
          Done
        </button>
      </div>
    </div>
  );
}
