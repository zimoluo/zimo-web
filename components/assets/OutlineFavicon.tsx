"use client";

import type { ThemeDataConfig } from "@/src/features/theme/model/v10-types";
import { useTheme } from "../contexts/ThemeContext";
import ConfigFavicon from "./displayFavicon/ConfigFavicon";

interface Props {
  className?: string;
}

export default function OutlineFavicon({ className = "" }: Props) {
  const { themeConfig } = useTheme();

  const outlineConfig = {
    ...themeConfig,
    favicon: { mode: "outline" },
  } as ThemeDataConfig;

  return (
    <ConfigFavicon className={className} customThemeConfig={outlineConfig} />
  );
}
