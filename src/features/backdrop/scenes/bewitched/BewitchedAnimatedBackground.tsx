"use client";

import type { SceneComponentProps } from "../../contract";

import TheTwoMoons from "./TheTwoMoons";
import SpinningMoons from "./SpinningMoons";

export default function BewitchedAnimatedBackground({ quality }: SceneComponentProps) {

  return quality === "rich" ? (
    <SpinningMoons />
  ) : (
    <TheTwoMoons />
  );
}
