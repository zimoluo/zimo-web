"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import HalloweenPulse from "./HalloweenPulse";
import graveyardImage from "@/public/theme/animated-background/halloween/graveyard.svg";
import castleImage from "@/public/theme/animated-background/halloween/castle.svg";
import woodImage from "@/public/theme/animated-background/halloween/wood.svg";
import moonImage from "@/public/theme/animated-background/halloween/moon.svg";
import pumpkinsImage from "@/public/theme/animated-background/halloween/pumpkins.svg";
import batsImage from "@/public/theme/animated-background/halloween/bats.svg";
import { useTheme } from "@/components/contexts/ThemeContext";

export default function HalloweenAnimatedBackground() {
  const { settings } = useSettings();
  const { themeKey } = useTheme();

  return (
    <>
      <div className="fixed inset-0 -z-20 h-screen pointer-events-none select-none">
        <div className="relative w-full h-full">
          <Image
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
          <Image
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
      <div className="fixed left-0 bottom-0 -z-20 w-screen h-screen pointer-events-none select-none">
        <div className="relative w-full h-full">
          <Image
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
          <Image
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
          <Image
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
          <Image
            src={graveyardImage}
            alt="Graveyard Image"
            className="bottom-0 left-1/2 -translate-x-1/2 absolute min-w-full object-cover object-center"
            style={{ minHeight: "15vh" }}
            priority={true}
            aria-hidden="true"
          />
        </div>
      </div>
      {settings.backgroundRichness === "rich" && themeKey === "halloween" && (
        <HalloweenPulse />
      )}
    </>
  );
}
