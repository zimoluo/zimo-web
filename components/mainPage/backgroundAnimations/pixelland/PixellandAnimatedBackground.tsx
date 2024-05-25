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
            ? spritesStyle.sunOuterAnimated
            : ""
        } fixed pointer-events-none select-none -z-20`}
      />
      {settings.backgroundRichness === "rich" && (
        <div
          className={`${spritesStyle.sun} ${spritesStyle.sunCore} fixed pointer-events-none select-none -z-20`}
        />
      )}
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.clouds} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.animatedClouds
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none -z-20`}
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.treesFar} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.animatedTreesFar
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none -z-10`}
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.trees} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.animatedTrees
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none -z-10`}
      />
    </>
  );
}
