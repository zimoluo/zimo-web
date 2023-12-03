"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";

export default function BubblesAnimatedBackground() {
  const { settings } = useSettings();
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-20 w-screen h-screen flex items-center justify-center opacity-40"
    >
      {settings.backgroundRichness === "rich" ? (
        <Image
          width={800}
          height={800}
          src="/theme/animated-background/bubbles/moving.svg"
          alt="Moving bubbles"
          className="min-w-full min-h-full aspect-square object-cover"
        />
      ) : (
        <Image
          width={800}
          height={800}
          src="/theme/animated-background/bubbles/static.svg"
          alt="Static bubbles"
          className="min-w-full min-h-full aspect-square object-cover"
        />
      )}
    </div>
  );
}
