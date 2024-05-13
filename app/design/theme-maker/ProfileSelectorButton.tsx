"use client";

import CrossIcon from "@/components/assets/CrossIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import selectorStyle from "./profile-selector.module.css";
import blankConfig from "@/components/theme/config/defaultEditor";

interface Props {
  index: number;
}

export default function ProfileSelectorButton({ index }: Props) {
  const { settings, updateSettings } = useSettings();

  const safelyChangeIndex = () => {
    if (index < 0 || index > settings.customThemeData.length - 1) {
      return;
    }
    updateSettings({ customThemeIndex: index });
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

  const isSelected = index === settings.customThemeIndex;

  return (
    <div className="relative group">
      <div
        className={`absolute rounded-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          selectorStyle.selected
        } transition-opacity duration-300 ease-out ${
          isSelected ? "opacity-100" : "opacity-0"
        }`}
      />
      <button
        className="rounded-xl bg-light flex w-16 h-auto aspect-square shadow-md transition-colors duration-300 ease-out relative"
        onClick={safelyChangeIndex}
      >
        <div
          className={`absolute left-0 top-0 rounded-xl bg-page w-full h-full border-2 transition-colors duration-300 ease-out border-saturated ${
            isSelected ? "border-opacity-90" : "border-opacity-40"
          }`}
        />
      </button>
      <div
        className={`absolute top-0 left-0 transition-opacity duration-150 ease-out opacity-0 hover:opacity-100 ${selectorStyle.crossDetect} h-auto aspect-square flex items-center justify-center`}
      >
        <button
          className="absolute top-0 left-0 w-full h-full"
          onClick={safelyChangeIndex}
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
    </div>
  );
}
