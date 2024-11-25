"use client";

import CrossIcon from "@/components/assets/CrossIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import selectorStyle from "./profile-selector.module.css";
import blankConfig from "@/components/theme/config/defaultEditor";
import { useNavigation } from "@/lib/helperHooks";
import { cloneDeep } from "lodash";

interface Props {
  index: number;
  applyThemeDataConfig?: boolean;
  allowRemoveProfile?: boolean;
}

export default function ProfileSelectorButton({
  index,
  applyThemeDataConfig = false,
  allowRemoveProfile = false,
}: Props) {
  const { settings, updateSettings } = useSettings();
  const navigationKey = useNavigation();

  const safelyChangeIndex = () => {
    if (index < 0 || index > settings.customThemeData.length - 1) {
      return;
    }

    let newSettings: Partial<SettingsState>;
    if (applyThemeDataConfig) {
      newSettings = {
        pageTheme: {
          ...settings.pageTheme,
          [navigationKey]: cloneDeep(settings.customThemeData[index]),
        },
      };
    } else {
      newSettings = { customThemeIndex: index };
    }

    updateSettings(newSettings);
  };

  const removeThisProfile = () => {
    if (settings.customThemeData.length <= 1) {
      updateSettings({ customThemeData: [blankConfig], customThemeIndex: 0 });
      return;
    }

    let newIndex = settings.customThemeIndex;
    if (
      settings.customThemeIndex > index ||
      (settings.customThemeIndex === index &&
        index === settings.customThemeData.length - 1)
    ) {
      newIndex = Math.min(
        settings.customThemeData.length - 2,
        Math.max(0, newIndex - 1)
      );
    }

    updateSettings({
      customThemeData: [
        ...settings.customThemeData.slice(0, index),
        ...settings.customThemeData.slice(index + 1),
      ],
      customThemeIndex: newIndex,
    });
  };

  const isSelected =
    !applyThemeDataConfig && index === settings.customThemeIndex;

  return (
    <div className="relative group">
      <div
        className={`absolute rounded-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          selectorStyle.selected
        } transition-opacity duration-300 ease-out ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />
      <button
        className="rounded-xl bg-light flex w-16 h-auto aspect-square shadow-md transition-colors duration-300 ease-out relative"
        onClick={safelyChangeIndex}
      >
        <div
          className={`absolute left-0 top-0 rounded-xl w-full h-full ${
            selectorStyle.border
          } transition-colors duration-300 ease-out border-saturated ${
            isSelected ? "border-opacity-90" : "border-opacity-40"
          } ${
            applyThemeDataConfig ? "group-hover:border-opacity-90" : ""
          } overflow-hidden`}
        >
          <div className="w-full h-full absolute left-0 top-0 bg-page" />
        </div>
      </button>
      {allowRemoveProfile && settings.customThemeData.length > 1 && (
        <div
          className={`absolute top-0 left-0 transition-opacity duration-150 ease-out opacity-0 hover:opacity-100 ${selectorStyle.crossDetect} h-auto aspect-square flex items-center justify-center`}
        >
          <button
            className="absolute top-0 left-0 w-full h-full"
            onClick={safelyChangeIndex}
            tabIndex={-1}
          />
          <button
            className={`${selectorStyle.crossClick} h-auto aspect-square pointer-events-auto relative`}
            onClick={removeThisProfile}
          >
            <CrossIcon
              isSaturated={true}
              className="opacity-90 w-full h-auto aspect-square"
            />
          </button>
        </div>
      )}
    </div>
  );
}
