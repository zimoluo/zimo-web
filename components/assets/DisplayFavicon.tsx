"use client";

import { useTheme } from "../contexts/ThemeContext";
import { customFaviconKeyMap } from "@/components/theme/util/customFaviconMap";
import ConfigFavicon from "./displayFavicon/ConfigFavicon";

interface Props {
  className?: string;
  customThemeConfig?: ThemeDataConfig;
  innerClassName?: string;
}

export default function DisplayFavicon({
  className = "",
  customThemeConfig,
  innerClassName,
}: Props) {
  const { themeConfig } = useTheme();
  const adaptedThemeConfig = customThemeConfig ?? themeConfig;
  const config = adaptedThemeConfig.favicon;

  if (config.mode === "custom") {
    const CustomFavicon = customFaviconKeyMap[config.customKey ?? "gallery"];
    return <CustomFavicon className={className} />;
  }

  return (
    <ConfigFavicon
      className={className}
      customThemeConfig={customThemeConfig}
      innerClassName={innerClassName}
    />
  );
}
