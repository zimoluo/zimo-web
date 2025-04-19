"use client";

import { Fragment, useEffect, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useTheme } from "../contexts/ThemeContext";
import { backgroundAnimationMap } from "@/components/theme/util/backgroundAnimationMap";

export default function BackgroundAnimation() {
  const { settings } = useSettings();
  const { themeConfig } = useTheme();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rawKey = themeConfig.animatedBackgroundKey ?? [];

  const animatedBackground = Array.isArray(rawKey) ? rawKey : [rawKey];

  return (
    isMounted &&
    settings.backgroundRichness !== "minimal" &&
    animatedBackground &&
    animatedBackground.map((backgroundKey, index) => (
      <Fragment key={`background-${index}`}>
        {backgroundAnimationMap[backgroundKey]}
      </Fragment>
    ))
  );
}
