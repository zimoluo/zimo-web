"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import celebrationStyle from "./celebration.module.scss";

export default function CelebrationAnimatedBackground() {
  const { settings } = useSettings();
  const num = settings.backgroundRichness === "rich" ? 20 : 10;
  const patterns = Array.from({ length: num }, (_, i) => i);

  return (
    <div
      className={`w-screen h-screen inset-0 flex -z-20 items-center justify-center fixed pointer-events-none select-none touch-none`}
      aria-hidden="true"
    >
      <div
        className={`${celebrationStyle.sizing} -z-20 pointer-events-none select-none touch-none fixed`}
        aria-hidden="true"
      >
        {patterns.map((i) => (
          <div
            key={i}
            className={`${celebrationStyle[`pattern${i}`]} ${
              celebrationStyle.fireworks
            } ${celebrationStyle[`fire${i}`]}`}
          >
            <div className={`${celebrationStyle.ring_1}`}></div>
            <div className={`${celebrationStyle.ring_2}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
