"use client";

import type { SceneComponentProps } from "../../contract";

import stormCloudsStyle from "./storm-clouds.module.css";
import EyeOfTheStorm from "./EyeOfTheStorm";

export default function StormAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      {quality === "rich" && <EyeOfTheStorm />}
      <div
        className={`${stormCloudsStyle.scroll}  ${
          quality === "rich"
            ? stormCloudsStyle.animated
            : ""
        } fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none `}
      />
      <div
        className={`${stormCloudsStyle.scroll}  ${stormCloudsStyle.ceiling}  ${
          quality === "rich"
            ? stormCloudsStyle.ceilingAnimated
            : ""
        } fixed top-0 rotate-180 left-1/2 -translate-x-1/2 pointer-events-none select-none `}
      />
    </>
  );
}
