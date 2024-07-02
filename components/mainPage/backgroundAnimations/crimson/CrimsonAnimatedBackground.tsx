"use client";

import Image from "next/image";
import crimsonStyle from "./crimson.module.css";
import towerSprite from "@/public/theme/animated-background/crimson/tower.svg";
import fanSprite from "@/public/theme/animated-background/crimson/fan.svg";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function CrimsonAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <Image
        src={fanSprite}
        aria-hidden="true"
        alt="Fan"
        className={`fixed select-none pointer-events-none left-1/2 -translate-x-1/2 -z-30 w-auto opacity-80 ${crimsonStyle.fan}`}
      />
      <Image
        src={towerSprite}
        aria-hidden="true"
        alt="Tower"
        className={`fixed select-none pointer-events-none left-1/2 bottom-0 -translate-x-1/2 -z-20 w-auto ${crimsonStyle.tower}`}
      />
      <div
        className={`fixed select-none pointer-events-none left-1/2 -translate-x-1/2 -z-20 ${
          crimsonStyle.cloud
        } ${
          settings.backgroundRichness === "rich"
            ? crimsonStyle.cloudAnimated
            : ""
        }`}
      />
    </>
  );
}
