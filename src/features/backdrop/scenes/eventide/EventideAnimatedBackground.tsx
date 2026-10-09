"use client";

import type { SceneComponentProps } from "../../contract";

import spritesStyle from "./sprites.module.css";

export default function EventideAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.background}  ${
          quality === "rich"
            ? spritesStyle.backgroundAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.moon} fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      {quality === "rich" && (
        <>
          <div
            className={`${spritesStyle.sprite}  ${spritesStyle.moon}  ${spritesStyle.darkMoon} fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
            aria-hidden="true"
          />
          <div
            className={`${spritesStyle.sprite}  ${spritesStyle.moon}  ${spritesStyle.brightMoon} fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
            aria-hidden="true"
          />
        </>
      )}
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.middle}  ${
          quality === "rich"
            ? spritesStyle.middleAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.foreground}  ${
          quality === "rich"
            ? spritesStyle.foregroundAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
    </>
  );
}
