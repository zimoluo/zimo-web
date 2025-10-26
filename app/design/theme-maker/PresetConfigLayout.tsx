"use client";

import configStyle from "./preset-config-button.module.css";
import SettingsThemePicker from "@/components/mainPage/menu/settings/SettingsThemePicker";

interface Props {
  close: () => void;
  className?: string;
}

export default function PresetConfigLayout({ close, className = "" }: Props) {
  return (
    <div className={`px-3 pb-5 pt-6 ${configStyle.grid} ${className}`}>
      <div className="flex flex-col items-center mb-2">
        <p className="text-xl text-center font-bold">Import Presets</p>
      </div>
      <div className="w-full h-full p-4 overflow-y-auto">
        <SettingsThemePicker insertProfile={true} />
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={close}
          className={`h-9 ${configStyle.button} rounded-full shadow-lg bg-light bg-opacity-80 text-center transition-colors duration-150 ease-out border-reflect-light hover:text-light hover:bg-saturated`}
        >
          Done
        </button>
      </div>
    </div>
  );
}
