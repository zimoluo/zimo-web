"use client";

import type { SceneComponentProps } from "../../contract";

import BouncingCircle from "./BouncingCircle";
import ClickingCircle from "./ClickingCircle";

export default function MidnightAnimatedBackground({ quality }: SceneComponentProps) {
  if (quality === "still") return <div style={{ position:"fixed", left:"40%", top:"40%", width:"min(30vh,30vw)", height:"min(30vh,30vw)", borderRadius:"50%", backgroundColor:"var(--zw-scene-highlight)" }} />;
  return quality === "rich" ? (
    <BouncingCircle />
  ) : (
    <ClickingCircle />
  );
}
