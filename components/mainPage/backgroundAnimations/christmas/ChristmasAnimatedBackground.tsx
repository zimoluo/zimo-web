"use client";

import Image from "next/image";
import polkaStyle from "./polka.module.css";
import lightsImage from "@/public/theme/animated-background/christmas/lights.svg";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useNavigation } from "@/lib/helperHooks";

export default function ChristmasAnimatedBackground() {
  const { settings } = useSettings();
  const navigationKey = useNavigation();

  return (
    <>
      <div
        aria-hidden="true"
        className={`inset-0 fixed -z-20 w-screen h-screen ${polkaStyle.polka} pointer-events-none select-none`}
      />
      {settings.backgroundRichness === "rich" &&
        navigationKey !== "christmasTree" && (
          <Image
            src={lightsImage}
            alt="Christmas lights"
            aria-hidden="true"
            className="top-0 left-0 w-screen h-auto absolute -z-20 pointer-events-none select-none"
          />
        )}
    </>
  );
}
