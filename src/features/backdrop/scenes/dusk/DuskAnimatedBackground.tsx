"use client";

import type { SceneComponentProps } from "../../contract";

import spritesStyle from "./sprites.module.css";

export default function DuskAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.clouds}  ${
          quality === "rich"
            ? spritesStyle.cloudsAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.salmon}  ${
          quality === "rich"
            ? spritesStyle.salmonAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.pink}  ${
          quality === "rich"
            ? spritesStyle.pinkAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.plum}  ${
          quality === "rich"
            ? spritesStyle.plumAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.purple}  ${
          quality === "rich"
            ? spritesStyle.purpleAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.black}  ${
          quality === "rich"
            ? spritesStyle.blackAnimated
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none touch-none `}
        aria-hidden="true"
      />
    </>
  );
}
