"use client";

import type { SceneComponentProps } from "../../contract";

import glitterStyle from "./glitter.module.css";
import animatedStyle from "./glitter-animated.module.css";

export default function GlitterAnimatedBackground({ quality }: SceneComponentProps) {
  return (
    <>
      <div
        className={` w-screen h-screen inset-0 blur-2xl fixed pointer-events-none select-none ${
          glitterStyle.glitter
        }  ${
          quality === "rich" ? animatedStyle.glitter : ""
        }`}
      />
    </>
  );
}
