"use client";

import AddPlusIcon from "@/components/assets/entries/AddPlusIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useToast } from "@/components/contexts/ToastContext";
import defaultEditorConfig from "@/components/theme/config/defaultEditor";
import { maxProfileCount } from "@/lib/constants/themeProfiles";

export default function AddProfileButton() {
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();

  const addedConfig = structuredClone(defaultEditorConfig);

  const appendNewProfile = () => {
    if (settings.customThemeData.length >= maxProfileCount) {
      appendToast({
        title: "Theme Maker",
        icon: "themeMaker",
        description: `Up to ${maxProfileCount} profile${
          maxProfileCount === 1 ? "" : "s"
        } are allowed.`,
      });
      return;
    }

    const customThemeProfiles: ThemeDataConfig[] = [
      ...settings.customThemeData,
      addedConfig,
    ];

    updateSettings({
      customThemeData: customThemeProfiles,
      customThemeIndex: customThemeProfiles.length - 1,
    });
  };

  return (
    <button
      onClick={appendNewProfile}
      className="group rounded-2xl border-reflect-pastel bg-pastel/65 backdrop-blur-sm w-16 h-auto aspect-square flex items-center justify-center shadow-md"
    >
      <AddPlusIcon className="w-2/5 h-auto aspect-square transition-transform duration-300 ease-out group-hover:scale-110" />
    </button>
  );
}
