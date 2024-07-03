"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import RainbowFilter from "./RainbowFilter";
import SaturationFilter from "./SaturationFilter";

export default function EepAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <>
      <RainbowFilter />
      {settings.backgroundRichness === "rich" && <SaturationFilter />}
    </>
  );
}
