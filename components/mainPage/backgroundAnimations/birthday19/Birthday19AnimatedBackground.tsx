"use client";

import Image from "next/image";
import nineteenSource from "@/public/theme/animated-background/birthday19/nineteen.svg";
import colorsSource from "@/public/theme/animated-background/birthday19/colors.svg";
import birthday19Style from "./birthday19.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import CelebrationAnimatedBackground from "../celebration/CelebrationAnimatedBackground";

export default function Birthday19AnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      {settings.backgroundRichness === "rich" && (
        <CelebrationAnimatedBackground />
      )}
      <div className="fixed -z-20 inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none touch-none">
        <Image
          src={colorsSource}
          alt="Colors"
          aria-hidden="true"
          className={`-z-20 ${birthday19Style.colors} ${
            settings.backgroundRichness === "rich"
              ? birthday19Style.spin
              : "rotate-45"
          } pointer-events-none select-none absolute`}
          priority={true}
        />
      </div>
      <div className="object-contain object-center fixed -z-20 inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none touch-none">
        <Image
          src={nineteenSource}
          alt="Nineteen"
          aria-hidden="true"
          className={`object-contain object-center -z-20 ${birthday19Style.nineteen} pointer-events-none select-none`}
          priority={true}
        />
      </div>
    </>
  );
}
