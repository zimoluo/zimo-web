"use client";

import type { SceneComponentProps } from "../../contract";

import celebrationStyle from "./celebration.module.css";

export default function CelebrationAnimatedBackground({ quality }: SceneComponentProps) {
  const num = quality === "rich" ? 36 : 18;
  const patterns = Array.from({ length: num }, (_, i) => i);

  return (
    <div
      className={`inset-0 w-[100lvw] h-[100lvh] flex  items-center justify-center fixed pointer-events-none select-none touch-none`}
      aria-hidden="true"
    >
      <div
        className={`${celebrationStyle.sizing}  pointer-events-none select-none touch-none fixed`}
        aria-hidden="true"
      >
        {patterns.map((i) => (
          <div
            key={i}
            data-static={quality === "still"}
            className={`${celebrationStyle[`pattern${i}`]} ${
              celebrationStyle.fireworks
            }  ${celebrationStyle[`fire${i}`]}`}
          >
            <div className={`${celebrationStyle.ring1}`}></div>
            <div className={`${celebrationStyle.ring2}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
