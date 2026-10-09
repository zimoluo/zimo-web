"use client";

import type { SceneComponentProps } from "../../contract";

import RainbowFilter from "./RainbowFilter";
import SaturationFilter from "./SaturationFilter";

export default function EepAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      <RainbowFilter />
      {quality === "rich" && <SaturationFilter />}
    </>
  );
}
