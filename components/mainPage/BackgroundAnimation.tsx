"use client";

import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { backgroundAnimationMap } from "../themeUtil/backgroundAnimationMap";

export default function BackgroundAnimation() {
  const { settings } = useSettings();
  const { themeConfig } = useTheme();

  const animatedBackground = themeConfig.animatedBackgroundKey;

  return (
    settings.backgroundRichness !== "minimal" &&
    animatedBackground &&
    backgroundAnimationMap[animatedBackground]
  );
}
