"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import ProfileSelectorButton from "./ProfileSelectorButton";
import selectorStyle from "./profile-selector.module.css";
import AddProfileButton from "./AddProfileButton";

export default function ThemeProfileSelector() {
  const { settings } = useSettings();

  return (
    <div className={`${selectorStyle.container} pb-3 pt-3 -mt-3 px-4 -mx-4`}>
      <AddProfileButton />
      {settings.customThemeData.map((customTheme, index) => (
        <div key={index} style={generateInlineStyleObject(customTheme.palette)}>
          <ProfileSelectorButton index={index} />
        </div>
      ))}
    </div>
  );
}
