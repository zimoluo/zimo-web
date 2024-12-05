"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import spritesStyle from "./sprites.module.css";

export default function MeadowlandAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.sky} fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.cloud} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.cloudAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.grassland} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.grasslandAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.shrub} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.shrubAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
    </>
  );
}
