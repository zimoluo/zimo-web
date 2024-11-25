"use client";

import { useNavigation } from "@/lib/helperHooks";
import themePickerStyle from "./settings-theme-picker.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import { useTheme } from "@/components/contexts/ThemeContext";
import { themeKeyMap } from "@/components/theme/util/themeKeyMap";

interface Props {
  theme: ThemeKey;
  insertProfile?: boolean;
}

export default function ThemePickerButton({
  theme,
  insertProfile = false,
}: Props) {
  const currentPage = useNavigation();

  const { settings, updatePageTheme } = useSettings();
  const { insertThemeProfile } = useTheme();

  const handleThemeChange = () => {
    const themeToApply = theme;

    if (insertProfile) {
      insertThemeProfile(themeKeyMap[themeToApply]);
      return;
    }

    updatePageTheme(themeToApply, currentPage);
  };

  return (
    <button
      key={theme}
      className={`${themePickerStyle.ring} transition-colors duration-300 ease-in-out relative rounded-full group w-12 md:w-14 aspect-square h-12 md:h-14`}
      onClick={handleThemeChange}
    >
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          themePickerStyle.selected
        } transition-all duration-300 ease-in-out rounded-full w-0 h-0 select-none pointer-events-none ${
          !insertProfile && settings.pageTheme[currentPage] === theme
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
        aria-hidden="true"
      />
      <Image
        src={`/theme/picker/${theme}.svg`}
        alt={`Use ${theme} theme`}
        height={40}
        width={40}
        className="w-full h-full rounded-full relative"
        draggable="false"
        priority={true}
      />
    </button>
  );
}
