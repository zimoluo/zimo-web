"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import cloudsStyle from "./clouds.module.css";

export default function SkyAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <div
      className={`${cloudsStyle.scroll} ${
        settings.backgroundRichness === "rich" ? cloudsStyle.animated : ""
      } fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none -z-20`}
    />
  );
}
