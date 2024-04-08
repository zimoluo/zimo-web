"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import stormCloudsStyle from "./storm-clouds.module.css";
import EyeOfTheStorm from "./EyeOfTheStorm";

export default function StormAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      {settings.backgroundRichness === "rich" && <EyeOfTheStorm />}
      <div
        className={`${stormCloudsStyle.scroll} ${
          settings.backgroundRichness === "rich"
            ? stormCloudsStyle.animated
            : ""
        } fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none -z-20`}
      />
      <div
        className={`${stormCloudsStyle.scroll} ${stormCloudsStyle.ceiling} ${
          settings.backgroundRichness === "rich"
            ? stormCloudsStyle["ceiling-animated"]
            : ""
        } fixed top-0 rotate-180 left-1/2 -translate-x-1/2 pointer-events-none select-none -z-20`}
      />
    </>
  );
}
