"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import starsStyle from "./shooting-stars.module.css";

export default function ShootingStars() {
  const { settings } = useSettings();
  const stars = new Array(settings.backgroundRichness === "rich" ? 50 : 20)
    .fill(null)
    .map((_, index) => <div key={index} className={starsStyle.star} />);

  return (
    <div
      aria-hidden="true"
      className="flex justify-center items-center -z-20 fixed inset-0 h-large-screen w-large-screen overflow-hidden pointer-events-none select-none"
    >
      <div className={starsStyle.stars}>{stars}</div>
    </div>
  );
}
