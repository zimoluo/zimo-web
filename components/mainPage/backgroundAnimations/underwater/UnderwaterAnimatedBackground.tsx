"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import underwaterStyle from "./underwater.module.css";

export default function UnderwaterAnimatedBackground() {
  const { settings } = useSettings();
  return (
    <>
      <div
        className={`${underwaterStyle.spot} ${underwaterStyle.place1} ${
          settings.backgroundRichness === "rich"
            ? underwaterStyle.place1Animate
            : ""
        } ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
      <div
        className={`${underwaterStyle.spot} ${underwaterStyle.place2} ${
          settings.backgroundRichness === "rich"
            ? underwaterStyle.place2Animate
            : ""
        } ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
      <div
        className={`${underwaterStyle.spot} ${underwaterStyle.place3} ${
          settings.backgroundRichness === "rich"
            ? underwaterStyle.place3Animate
            : ""
        } ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
      <div
        className={`${underwaterStyle.spot} ${underwaterStyle.place4} ${
          settings.backgroundRichness === "rich"
            ? underwaterStyle.place4Animate
            : ""
        } ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
    </>
  );
}
