"use client";

import type { SceneComponentProps } from "../../contract";

import PaletteImage from "../../host/PaletteImage";
import crimsonStyle from "./crimson.module.css";
const towerSprite = { src: "/theme/animated-background/crimson/tower.svg", width: 138, height: 230 };
const fanSprite = { src: "/theme/animated-background/crimson/fan.svg", width: 800, height: 500 };

export default function CrimsonAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      <PaletteImage
        src={fanSprite}
        aria-hidden="true"
        alt="Fan"
        className={`fixed select-none pointer-events-none left-1/2 -translate-x-1/2  w-auto opacity-80 ${crimsonStyle.fan}`}
      />
      <PaletteImage
        src={towerSprite}
        aria-hidden="true"
        alt="Tower"
        className={`fixed select-none pointer-events-none left-1/2 bottom-0 -translate-x-1/2  w-auto ${crimsonStyle.tower}`}
      />
      <div
        className={`fixed select-none pointer-events-none left-1/2 -translate-x-1/2  ${
          crimsonStyle.cloud
        }  ${
          quality === "rich"
            ? crimsonStyle.cloudAnimated
            : ""
        }`}
      />
    </>
  );
}
