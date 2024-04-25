"use client";

import CrossIcon from "@/components/assets/CrossIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useEffect, useState } from "react";
import selectorStyle from "./profile-selector.module.css";
import blankConfig from "@/components/themeUtil/customPalettePreset/blank";

interface Props {
  index: number;
  startingDimension?: number;
}

export default function ProfileSelectorButton({
  index,
  startingDimension = 4,
}: Props) {
  const [dimension, setDimension] = useState(startingDimension);

  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    setDimension(4);
  }, []);

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
    if (settings.customThemeIndex >= index) {
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
        style={{
          width: `${dimension}rem`,
          transition: "width 300ms ease-out, border-color 300ms ease-out",
        }}
        className={`rounded-xl bg-page h-16 shadow-md border-2 border-saturated ${
          isSelected ? "border-opacity-90" : "border-opacity-40"
        } relative`}
        onClick={safelyChangeIndex}
      />
      <button
        onClick={removeThisProfile}
        className={`absolute top-2 left-2 transition-opacity duration-150 ease-out opacity-0 group-hover:opacity-100 ${selectorStyle.cross} h-auto aspect-square`}
      >
        <CrossIcon
          isSaturated={true}
          className="opacity-90 w-full h-auto aspect-square"
        />
      </button>
    </div>
  );
}
