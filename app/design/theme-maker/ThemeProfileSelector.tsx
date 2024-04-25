"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import ProfileSelectorButton from "./ProfileSelectorButton";
import selectorStyle from "./profile-selector.module.css";
import AddProfileButton from "./AddProfileButton";

export default function ThemeProfileSelector() {
  const { settings, updateSettings } = useSettings();

  const safelyChangeIndex = (index: number) => {
    if (index < 0 || index > settings.customThemeData.length - 1) {
      return;
    }
    updateSettings({ customThemeIndex: index });
  };

  return (
    <div className={`${selectorStyle.container} pb-3`}>
      <AddProfileButton />
      {settings.customThemeData.map((customTheme, index) => (
        <div key={index} style={generateInlineStyleObject(customTheme.palette)}>
          <ProfileSelectorButton
            onClick={() => {
              safelyChangeIndex(index);
            }}
            startingDimension={0.5}
          />
        </div>
      ))}
    </div>
  );
}
