"use client";

import type { SceneComponentProps } from "../../contract";

import spritesStyle from "./sprites.module.css";

export default function MeadowlandAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.sky} fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.cloud}  ${
          quality === "rich"
            ? spritesStyle.cloudAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.grassland}  ${
          quality === "rich"
            ? spritesStyle.grasslandAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.shrub}  ${
          quality === "rich"
            ? spritesStyle.shrubAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
    </>
  );
}
