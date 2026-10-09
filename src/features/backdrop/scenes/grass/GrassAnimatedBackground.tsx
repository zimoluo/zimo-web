"use client";

import type { SceneComponentProps } from "../../contract";

import PaletteImage from "../../host/PaletteImage";
const bgSrc = { src: "/theme/animated-background/grass/bg.svg", width: 512, height: 512 };
const reducedSrc = { src: "/theme/animated-background/grass/reduced.png", width: 2048, height: 2048 };

export default function GrassAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <div
      className="fixed inset-0  flex items-center justify-center h-screen pointer-events-none select-none"
      aria-hidden="true"
    >
      {quality === "rich" ? (
        <PaletteImage
          src={bgSrc}
          alt="Grass background"
          className="object-cover w-full h-full"
          priority={true}
          aria-hidden="true"
        />
      ) : (
        <PaletteImage
          src={reducedSrc}
          alt="Grass background"
          className="object-cover w-full h-full"
          priority={true}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
