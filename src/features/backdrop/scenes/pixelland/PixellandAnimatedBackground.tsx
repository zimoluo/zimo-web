"use client";

import type { SceneComponentProps } from "../../contract";

import spritesStyle from "./sprites.module.css";

export default function PixellandAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      <div
        className={`${spritesStyle.sun}  ${
          quality === "rich"
            ? spritesStyle.sunOuterAnimated
            : ""
        } fixed pointer-events-none select-none `}
      />
      {quality === "rich" && (
        <div
          className={`${spritesStyle.sun}  ${spritesStyle.sunCore} fixed pointer-events-none select-none `}
        />
      )}
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.clouds}  ${
          quality === "rich"
            ? spritesStyle.animatedClouds
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none `}
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.treesFar}  ${
          quality === "rich"
            ? spritesStyle.animatedTreesFar
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none `}
      />
      <div
        className={`${spritesStyle.sprite}  ${spritesStyle.trees}  ${
          quality === "rich"
            ? spritesStyle.animatedTrees
            : ""
        } fixed left-1/2 -translate-x-1/2 pointer-events-none select-none `}
      />
    </>
  );
}
