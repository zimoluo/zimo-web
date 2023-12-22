"use client";

import Image from "next/image";
import polkaStyle from "./polka.module.css";
import lightsImage from "@/public/theme/animated-background/christmas/lights.svg";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function ChristmasAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <div
        aria-hidden="true"
        className={`inset-0 fixed -z-20 w-screen h-screen ${polkaStyle.polka}`}
      />
      {settings.backgroundRichness === "rich" && (
        <Image
          src={lightsImage}
          alt="Christmas lights"
          aria-hidden="true"
          className="top-0 left-0 w-screen h-auto absolute -z-20"
        />
      )}
    </>
  );
}
