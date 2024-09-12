"use client";

import { Fragment } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { backgroundAnimationMap } from "@/components/theme/util/backgroundAnimationMap";

export default function BackgroundAnimation() {
  const { settings } = useSettings();
  const { themeConfig } = useTheme();

  const rawKey = themeConfig.animatedBackgroundKey ?? [];

  const animatedBackground = Array.isArray(rawKey) ? rawKey : [rawKey];

  return (
    settings.backgroundRichness !== "minimal" &&
    animatedBackground &&
    animatedBackground.map((backgroundKey, index) => (
      <Fragment key={`background-${index}`}>
        {backgroundAnimationMap[backgroundKey]}
      </Fragment>
    ))
  );
}
