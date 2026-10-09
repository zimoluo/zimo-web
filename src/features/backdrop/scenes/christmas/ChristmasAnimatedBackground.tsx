"use client";

import type { SceneComponentProps } from "../../contract";

import PaletteImage from "../../host/PaletteImage";
import polkaStyle from "./polka.module.css";
const lightsImage = { src: "/theme/animated-background/christmas/lights.svg", width: 1024, height: 135.138 };

export default function ChristmasAnimatedBackground({ quality }: SceneComponentProps) {


  return (
    <>
      <div
        aria-hidden="true"
        className={`inset-0 fixed  w-screen h-screen ${polkaStyle.polka} pointer-events-none select-none`}
      />
      {quality === "rich" && (
          <PaletteImage
            src={lightsImage}
            alt="Christmas lights"
            aria-hidden="true"
            className="top-0 left-0 w-screen h-auto absolute  pointer-events-none select-none"
          />
        )}
    </>
  );
}
