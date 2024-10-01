"use client";

import { useTheme } from "../contexts/ThemeContext";
import ConfigFavicon from "./displayFavicon/ConfigFavicon";

interface Props {
  className?: string;
}

export default function HolographicFavicon({ className = "" }: Props) {
  const { themeConfig } = useTheme();

  const outlineConfig = {
    ...themeConfig,
    favicon: {
      mode: "backdrop",
      backdropGradient: [
        {
          type: "linear-gradient",
          stops: [
            { color: themeConfig.palette.pastel, at: 0, opacity: 0.2 },
            { color: themeConfig.palette.light, at: 45, opacity: 0.6 },
            { color: themeConfig.palette.light, at: 55, opacity: 0.65 },
            { color: themeConfig.palette.pastel, at: 100, opacity: 0.2 },
          ],
          angle: 120,
        },
      ],
    },
  } as ThemeDataConfig;

  return (
    <ConfigFavicon className={className} customThemeConfig={outlineConfig} />
  );
}
