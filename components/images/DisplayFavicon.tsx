"use client";

import { useTheme } from "../contexts/ThemeContext";
import { displayFaviconMap } from "../themeUtil/displayFaviconMap";

interface Props {
  className?: string;
}

export default function DisplayFavicon({ className = "" }: Props) {
  const { theme } = useTheme();
  const FaviconForDisplay = displayFaviconMap[theme.favicon.display];

  return <FaviconForDisplay className={className} />;
}
