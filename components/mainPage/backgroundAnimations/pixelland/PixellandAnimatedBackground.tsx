"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import spritesStyle from "./sprites.module.css";
import sunImage from "@/public/theme/animated-background/pixelland/pixel-sun.png";
import Image from "next/image";

export default function PixellandAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <Image
        className={`fixed pointer-events-none select-none -z-20 ${spritesStyle.sun}`}
        src={sunImage}
        alt="Pixel sun"
        unoptimized={true}
      />
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
