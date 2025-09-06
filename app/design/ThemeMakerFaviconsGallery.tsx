"use client";

import { useMemo } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import GalleryClickableFavicon from "./GalleryClickableFavicon";
import defaultEditorConfig from "@/components/theme/config/defaultEditor";
import { doesHaveSameFavicon } from "@/lib/themeMaker/faviconHelper";

interface Props {
  className?: string;
}

export default function ThemeMakerFaviconsGallery({ className = "" }: Props) {
  const { settings } = useSettings();

  const favicons = useMemo(() => {
    const themeData = structuredClone(settings.customThemeData);
    const lastTheme = settings.customThemeData.at(-1);
    if (lastTheme && !doesHaveSameFavicon(defaultEditorConfig, lastTheme)) {
      themeData.push(structuredClone(defaultEditorConfig));
    }
    return themeData;
  }, [settings.customThemeData]);

  return (
    <GalleryClickableFavicon className={className} faviconList={favicons} />
  );
}
