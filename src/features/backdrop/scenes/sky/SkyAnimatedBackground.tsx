"use client";

import type { SceneComponentProps } from "../../contract";

import cloudsStyle from "./clouds.module.css";

export default function SkyAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <div
      className={`${cloudsStyle.scroll}  ${
        quality === "rich" ? cloudsStyle.animated : ""
      } fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none `}
    />
  );
}
