"use client";

import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { backgroundAnimationMap } from "../themeUtil/backgroundAnimationMap";

export default function BackgroundAnimation() {
  const { settings } = useSettings();
  const { theme } = useTheme();

  const animatedBackground = theme.animatedBackground;

  return (
    settings.backgroundRichness !== "minimal" &&
    animatedBackground &&
    backgroundAnimationMap[animatedBackground]
  );
}
