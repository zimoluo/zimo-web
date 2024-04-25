"use client";

import AddPlusIcon from "@/components/assets/entries/AddPlusIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import blankConfig from "@/components/themeUtil/customPalettePreset/blank";
import _ from "lodash";

export default function AddProfileButton() {
  const { settings, updateSettings } = useSettings();

  const appendNewProfile = () => {
    if (
      _.isEqual(
        settings.customThemeData[settings.customThemeData.length - 1],
        blankConfig
      )
    ) {
      return;
    }

    const customThemeProfiles: CustomThemeDataConfig[] = [
      ...settings.customThemeData,
      blankConfig,
    ];

    updateSettings({
      customThemeData: customThemeProfiles,
      customThemeIndex: customThemeProfiles.length - 1,
    });
  };

  return (
    <button
      onClick={appendNewProfile}
      className="rounded-xl bg-pastel bg-opacity-30 backdrop-blur w-16 h-auto aspect-square flex items-center justify-center shadow-md"
    >
      <AddPlusIcon className="w-2/5 h-auto aspect-square" />
    </button>
  );
}
