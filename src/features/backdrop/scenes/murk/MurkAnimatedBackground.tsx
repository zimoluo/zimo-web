"use client";

import type { SceneComponentProps } from "../../contract";

import spritesStyle from "./sprites.module.css";

export default function MurkAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.background} fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.back}  ${
          quality === "rich"
            ? spritesStyle.backAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.middle}  ${
          quality === "rich"
            ? spritesStyle.middleAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.forward}  ${
          quality === "rich"
            ? spritesStyle.forwardAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.moreForward}  ${
          quality === "rich"
            ? spritesStyle.moreForwardAnimated
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
