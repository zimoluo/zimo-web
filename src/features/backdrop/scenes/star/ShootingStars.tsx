"use client";

import type { SceneComponentProps } from "../../contract";

import starsStyle from "./shooting-stars.module.css";

export default function ShootingStars({ quality, params }: SceneComponentProps) {
  const stars = new Array(quality === "rich" ? Math.round(Number(params.count ?? 50)) : 20)
    .fill(null)
    .map((_, index) => <div key={index} className={starsStyle.star} style={quality === "still" ? { animation: "none", left: `${5 + index * 37 % 85}%`, top: `${5 + index * 19 % 85}%`, transform: "none" } : undefined} />);

  return (
    <div
      aria-hidden="true"
      className="flex justify-center items-center  fixed inset-0 h-[100lvh] w-[100lvw] overflow-hidden pointer-events-none select-none"
    >
      <div className={starsStyle.stars} data-static={quality === "still"}>{stars}</div>
    </div>
  );
}
