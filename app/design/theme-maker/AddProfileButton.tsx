"use client";

import AddPlusIcon from "@/components/assets/entries/AddPlusIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import defaultEditorConfig from "@/components/theme/config/defaultEditor";
import _ from "lodash";

export default function AddProfileButton() {
  const { settings, updateSettings } = useSettings();

  const appendNewProfile = () => {
    if (
      _.isEqual(
        settings.customThemeData[settings.customThemeData.length - 1],
        defaultEditorConfig
      )
    ) {
      return;
    }

    const customThemeProfiles: ThemeDataConfig[] = [
      ...settings.customThemeData,
      defaultEditorConfig,
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
