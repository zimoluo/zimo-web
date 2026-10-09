"use client";

import type { SceneComponentProps } from "../../contract";

import PaletteImage from "../../host/PaletteImage";
import HalloweenPulse from "./HalloweenPulse";
const graveyardImage = { src: "/theme/animated-background/halloween/graveyard.svg", width: 1024, height: 120.495 };
const castleImage = { src: "/theme/animated-background/halloween/castle.svg", width: 512, height: 512 };
const woodImage = { src: "/theme/animated-background/halloween/wood.svg", width: 512, height: 512 };
const moonImage = { src: "/theme/animated-background/halloween/moon.svg", width: 512, height: 512 };
const pumpkinsImage = { src: "/theme/animated-background/halloween/pumpkins.svg", width: 512, height: 179.206 };
const batsImage = { src: "/theme/animated-background/halloween/bats.svg", width: 512, height: 512 };

export default function HalloweenAnimatedBackground({ quality, params }: SceneComponentProps) {

  return (
    <>
      <div className="fixed inset-0  h-screen pointer-events-none select-none">
        <div className="relative w-full h-full">
          <PaletteImage
            src={moonImage}
            alt="Moon Image"
            className="absolute object-cover object-center aspect-square w-auto"
            style={{
              height: "max(23vh, 23vw)",
              right: "max(5vh, 5vw)",
              top: "max(5vh, 5vw)",
            }}
            priority={true}
            aria-hidden="true"
          />
          <PaletteImage
            src={batsImage}
            alt="Bats Image"
            className="absolute object-cover object-center aspect-square w-auto"
            style={{
              height: "max(18vh, 18vw)",
              left: "max(14vh, 14vw)",
              top: "max(4vh, 4vw)",
            }}
            priority={true}
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="fixed left-0 bottom-0  w-screen h-screen pointer-events-none select-none">
        <div className="relative w-full h-full">
          <PaletteImage
            src={castleImage}
            alt="Castle Image"
            className="absolute object-cover object-center aspect-square w-auto"
            style={{
              height: "max(40vh, 40vw)",
              right: "max(5vh, 5vw)",
              bottom: "-3vh",
            }}
            priority={true}
            aria-hidden="true"
          />
          <PaletteImage
            src={woodImage}
            alt="Wood Image"
            className="absolute object-cover object-center aspect-square w-auto"
            style={{
              height: "max(30vh, 30vw)",
              left: "max(1vh, 1vw)",
              bottom: "-4vh",
            }}
            priority={true}
            aria-hidden="true"
          />
          <PaletteImage
            src={pumpkinsImage}
            alt="Pumpkins Image"
            className="absolute object-cover object-center h-auto"
            style={{
              width: "max(26vh, 26vw)",
              left: "max(24vh, 24vw)",
              bottom: "max(1vh, 1vw)",
            }}
            priority={true}
            aria-hidden="true"
          />
          <PaletteImage
            src={graveyardImage}
            alt="Graveyard Image"
            className="bottom-0 left-1/2 -translate-x-1/2 absolute min-w-full object-cover object-center"
            style={{ minHeight: "15vh" }}
            priority={true}
            aria-hidden="true"
          />
        </div>
      </div>
      {quality === "rich" && (
        <HalloweenPulse params={params} quality={quality} palette={{}} />
      )}
    </>
  );
}
