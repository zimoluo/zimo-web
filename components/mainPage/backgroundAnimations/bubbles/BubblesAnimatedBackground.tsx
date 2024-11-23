"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import movingBubbleSrc from "@/public/theme/animated-background/bubbles/moving.svg";
import staticBubbleSrc from "@/public/theme/animated-background/bubbles/static.svg";

export default function BubblesAnimatedBackground() {
  const { settings } = useSettings();
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-20 w-screen h-screen flex items-center justify-center opacity-40"
    >
      {settings.backgroundRichness === "rich" ? (
        <Image
          src={movingBubbleSrc}
          alt="Moving bubbles"
          className="min-w-full min-h-full aspect-square object-cover"
        />
      ) : (
        <Image
          src={staticBubbleSrc}
          alt="Static bubbles"
          className="min-w-full min-h-full aspect-square object-cover"
        />
      )}
    </div>
  );
}
