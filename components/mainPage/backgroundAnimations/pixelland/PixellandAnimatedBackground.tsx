"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import spritesStyle from "./sprites.module.css";

export default function PixellandAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <div
        className={`${spritesStyle.sun} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle["sun-outer-animated"]
            : ""
        } fixed pointer-events-none select-none -z-20`}
      />
      {settings.backgroundRichness === "rich" && (
        <div
          className={`${spritesStyle.sun} ${spritesStyle["sun-core"]} fixed pointer-events-none select-none -z-20`}
        />
      )}
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.clouds} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle["animated-clouds"]
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none -z-20`}
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle["trees-far"]} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle["animated-trees-far"]
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none -z-10`}
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.trees} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle["animated-trees"]
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none -z-10`}
      />
    </>
  );
}
