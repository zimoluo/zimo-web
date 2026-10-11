"use client";

import type { SceneComponentProps } from "../../contract";

import type { CSSProperties } from "react";
import { artworkCss } from "../../host/artwork";
import { authoredPaint } from "../../host/authored-shading";
import PaletteImage from "../../host/PaletteImage";
import polkaStyle from "./polka.module.css";
const lightsImage = { src: "/theme/animated-background/christmas/lights.svg", width: 1024, height: 135.138 };

export default function ChristmasAnimatedBackground({ quality }: SceneComponentProps) {


  return (
    <>
      <div
        aria-hidden="true"
        style={{"--zw-scene-gradient1-color":artworkCss({...authoredPaint("christmas","highlight",[1,58/255,64/255]),alpha:.4}),"--zw-scene-gradient2-color":artworkCss({...authoredPaint("christmas","accent",[93/255,184/255,78/255]),alpha:.25})} as CSSProperties}
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
