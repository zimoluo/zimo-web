"use client";

import type { SceneComponentProps } from "../../contract";

import PaletteImage from "../../host/PaletteImage";
const movingBlocksImage = { src: "/theme/animated-background/perpetuity/moving-blocks.svg", width: 1024, height: 1024 };
const movingBlocksStaticImage = { src: "/theme/animated-background/perpetuity/moving-blocks-static.svg", width: 1024, height: 1024 };
import CelebrationAnimatedBackground from "../celebration/CelebrationAnimatedBackground";

export default function PerpetuityAnimatedBackground({ quality, params }: SceneComponentProps) {
  const isZimoWebDayClient = false;

  return (
    <>
      {quality === "rich" &&
        ((!!Boolean(params.seasonal) && isZimoWebDayClient) ||
          Boolean(params.fireworks)) && (
          <>
            <div className="bg-black/35 fixed inset-0 w-screen h-screen  pointer-events-none select-none touch-none" />
            <CelebrationAnimatedBackground quality={quality} params={params} palette={ {} } />
          </>
        )}
      <div
        className="fixed inset-0 w-screen h-screen  flex items-center pointer-events-none select-none touch-none blur-xl"
        aria-hidden="true"
      >
        <PaletteImage
          src={
            quality === "rich"
              ? movingBlocksImage
              : movingBlocksStaticImage
          }
          alt="Moving blocks"
          className="min-w-full min-h-full object-cover aspect-square opacity-25"
        />
      </div>
    </>
  );
}
