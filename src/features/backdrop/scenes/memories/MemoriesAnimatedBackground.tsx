"use client";

import type { SceneComponentProps } from "../../contract";

import memoriesStyle from "./memories.module.css";
const nodesSrc = { src: "/theme/animated-background/memories/nodes.svg", width: 1069, height: 668 };
import PaletteImage from "../../host/PaletteImage";

export default function MemoriesAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <div
      className={`fixed inset-0 w-screen h-screen  pointer-events-none select-none ${memoriesStyle.bigMask}`}
    >
      <div
        className={`absolute right-1/2 md:-right-[5vmax] translate-x-1/2 md:translate-x-0 top-0 ${memoriesStyle.mask}`}
        aria-hidden="true"
      >
        <div
          className={`${memoriesStyle.verticalMask}  ${
            memoriesStyle.aspect
          } h-[66vmax] md:h-[60vmax] w-auto ${
            quality === "rich" ? memoriesStyle.animate : ""
          }`}
        >
          <PaletteImage
            src={nodesSrc}
            alt="Nodes"
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
