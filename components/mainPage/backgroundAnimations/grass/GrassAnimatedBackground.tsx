"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import bgSrc from "@/public/theme/animated-background/grass/bg.svg";
import reducedSrc from "@/public/theme/animated-background/grass/reduced.png";

export default function GrassAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <div
      className="fixed inset-0 -z-20 flex items-center justify-center h-screen pointer-events-none select-none"
      aria-hidden="true"
    >
      {settings.backgroundRichness === "rich" ? (
        <Image
          src={bgSrc}
          alt="Grass background"
          className="object-cover w-full h-full"
          priority={true}
          aria-hidden="true"
        />
      ) : (
        <Image
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
