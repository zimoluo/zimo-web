"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import spritesStyle from "./sprites.module.css";

export default function MurkAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.background} fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.back} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.backAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.middle} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.middleAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.forward} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.forwardAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.moreForward} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.moreForwardAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite} ${spritesStyle.foreground} ${
          settings.backgroundRichness === "rich"
            ? spritesStyle.foregroundAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none -z-20`}
        aria-hidden="true"
      />
    </>
  );
}
