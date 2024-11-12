"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import ProfileSelectorButton from "./ProfileSelectorButton";
import selectorStyle from "./profile-selector.module.css";
import AddProfileButton from "./AddProfileButton";

interface Props {
  hasAddProfileButton?: boolean;
  applyThemeDataConfig?: boolean;
  allowRemoveProfile?: boolean;
  className?: string;
}

export default function ThemeProfileSelector({
  hasAddProfileButton = false,
  applyThemeDataConfig,
  allowRemoveProfile = false,
  className = "",
}: Props) {
  const { settings } = useSettings();

  return (
    <div
      className={`${selectorStyle.container} pb-3 pt-3 -mt-3 px-4 -mx-4 ${className}`}
    >
      {hasAddProfileButton && <AddProfileButton />}
      {settings.customThemeData.map((customTheme, index) => (
        <div
          key={index}
          style={generateInlineStyleObject(
            Object.fromEntries(
              Object.entries(customTheme.palette).filter(
                ([key]) => key !== "pageMinimal" && key !== "widget"
              )
            )
          )}
        >
          <ProfileSelectorButton
            index={index}
            applyThemeDataConfig={applyThemeDataConfig}
            allowRemoveProfile={allowRemoveProfile}
          />
        </div>
      ))}
    </div>
  );
}
