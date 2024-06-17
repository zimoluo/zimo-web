"use client";

import { useGradientData } from "./GradientDataContext";
import selectorStyle from "./ellipse-circle-mode-selector.module.css";

export default function EllipseCircleModeSelector() {
  const { selectedLayer, updateGradientProperty } = useGradientData();
  const isCircle = !!selectedLayer.isCircle;

  return (
    <div className="h-full w-8 p-2 shrink-0 rounded-lg bg-pastel bg-opacity-80 shadow-sm flex flex-col gap-2">
      <button
        className={`w-full h-auto aspect-square transition-opacity duration-300 ease-out ${
          isCircle ? "opacity-60" : "opacity-100"
        } relative`}
        onClick={() => isCircle && updateGradientProperty("isCircle", false)}
      >
        <div
          className={`transition-opacity duration-300 ease-in-out rounded-full pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
            selectorStyle.glow
          } ${isCircle ? "opacity-0" : "opacity-100"}`}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1024 1024"
          className="w-full h-full relative"
        >
          <ellipse
            cx={512}
            cy={512}
            className="fill-primary"
            rx={512}
            ry={350}
          />
        </svg>
      </button>
      <button
        className={`w-full h-auto aspect-square transition-opacity duration-300 ease-out ${
          !isCircle ? "opacity-60" : "opacity-100"
        } relative`}
        onClick={() => !isCircle && updateGradientProperty("isCircle", true)}
      >
        <div
          className={`transition-opacity duration-300 ease-in-out rounded-full pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
            selectorStyle.glow
          } ${!isCircle ? "opacity-0" : "opacity-100"}`}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1024 1024"
          className="w-full h-full relative"
        >
          <circle cx={512} cy={512} className="fill-primary" r={512} />
        </svg>
      </button>
    </div>
  );
}
