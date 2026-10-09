"use client";

import type { SceneComponentProps } from "../../contract";

import PaletteImage from "../../host/PaletteImage";
const movingBubbleSrc = { src: "/theme/animated-background/bubbles/moving.svg", width: 1024, height: 1024 };
const staticBubbleSrc = { src: "/theme/animated-background/bubbles/static.svg", width: 1024, height: 1024 };

export default function BubblesAnimatedBackground({ quality }: SceneComponentProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0  w-screen h-screen flex items-center justify-center opacity-40"
    >
      {quality === "rich" ? (
        <PaletteImage
          src={movingBubbleSrc}
          alt="Moving bubbles"
          className="min-w-full min-h-full aspect-square object-cover"
        />
      ) : (
        <PaletteImage
          src={staticBubbleSrc}
          alt="Static bubbles"
          className="min-w-full min-h-full aspect-square object-cover"
        />
      )}
    </div>
  );
}
