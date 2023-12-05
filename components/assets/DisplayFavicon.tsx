"use client";

import { useTheme } from "../contexts/ThemeContext";
import { displayFaviconMap } from "../themeUtil/faviconMap";

interface Props {
  className?: string;
}

export default function DisplayFavicon({ className = "" }: Props) {
  const { theme } = useTheme();
  const FaviconForDisplay =
    displayFaviconMap[theme.displayFavicon || "generic"];

  return <FaviconForDisplay className={className} />;
}
