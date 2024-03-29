"use client";

import themePickerStyle from "./settings-theme-picker.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import { useNavigation } from "@/lib/helperHooks";

interface Props {
  isExternal?: boolean;
}

export const allListedThemes: ThemeAvailable[] = [
  "home",
  "photos",
  "blog",
  "projects",
  "about",
  "bubbles",
  "gold",
  "plainLight",
  "plainDark",
  "midnight",
  "glitter",
  "stars",
  "halloween",
  "christmas",
  "birthday",
  "rainbow",
  "grass",
];

export default function SettingsThemePicker({ isExternal = false }: Props) {
  const currentPage = useNavigation();

  const { settings, updateSettings } = useSettings();

  const pickTheme = (themeKey: ThemeAvailable) => {
    if (themeKey === settings.pageTheme[currentPage]) {
      return;
    }

    updateSettings({
      pageTheme: { ...settings.pageTheme, [currentPage]: themeKey },
    });
  };

  return (
    <section
      className={`${themePickerStyle["picker-grid"]} ${
        isExternal ? "" : "md:justify-end"
      }`}
    >
      {allListedThemes.map((theme) => (
        <button
          key={theme}
          className={`${themePickerStyle["ring"]} border-pastel border-opacity-50 relative rounded-full`}
          onClick={() => {
            pickTheme(theme);
          }}
        >
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              themePickerStyle["selected"]
            } transition-opacity duration-300 ease-in-out rounded-full w-0 h-0 select-none pointer-events-none ${
              settings.pageTheme[currentPage] === theme
                ? "opacity-100"
                : "opacity-0"
            }`}
            aria-hidden="true"
          />
          <Image
            src={`/theme/picker/${theme}.svg`}
            alt={`Use ${theme} theme`}
            height={40}
            width={40}
            className="h-auto aspect-square w-12 md:w-14 rounded-full relative"
            draggable="false"
            priority={true}
          />
        </button>
      ))}
    </section>
  );
}
