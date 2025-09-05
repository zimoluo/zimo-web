"use client";

import { useMemo } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import GalleryClickableFavicon from "./GalleryClickableFavicon";
import _ from "lodash";
import defaultEditorConfig from "@/components/theme/config/defaultEditor";

interface Props {
  className?: string;
}

export default function ThemeMakerFaviconsGallery({ className = "" }: Props) {
  const { settings } = useSettings();

  const favicons = useMemo(() => {
    const themeData = structuredClone(settings.customThemeData);
    if (!_.isEqual(defaultEditorConfig, settings.customThemeData.at(-1))) {
      themeData.push(structuredClone(defaultEditorConfig));
    }
    return themeData;
  }, [settings.customThemeData]);

  return (
    <GalleryClickableFavicon className={className} faviconList={favicons} />
  );
}
