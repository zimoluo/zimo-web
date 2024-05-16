"use client";

import { useTheme } from "../contexts/ThemeContext";
import { customFaviconKeyMap } from "../themeUtil/faviconMap";
import ConfigFavicon from "./displayFavicon/ConfigFavicon";

interface Props {
  className?: string;
}

export default function DisplayFavicon({ className = "" }: Props) {
  const { theme } = useTheme();
  const config = theme.config.favicon;

  if (config.mode === "custom") {
    const CustomFavicon = customFaviconKeyMap[config.customKey || "glitter"];
    return <CustomFavicon className={className} />;
  }

  return <ConfigFavicon className={className} />;
}
