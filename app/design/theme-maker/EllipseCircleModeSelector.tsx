"use client";

import { useGradientData } from "./GradientDataContext";
import selectorStyle from "./ellipse-circle-mode-selector.module.css";

export default function EllipseCircleModeSelector() {
  const { selectedLayer, updateGradientProperty } = useGradientData();
  const isCircle = !!selectedLayer.isCircle;

  return (
    <div className="h-full w-8 p-1.5 shrink-0 rounded-lg bg-pastel bg-opacity-80 shadow-sm flex flex-col gap-2">
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
          <path
            className="fill-primary"
            fillRule="evenodd"
            d="M1024 494.498c-.04-229.737-1.83-346.374-74.984-419.518C874.041 0 753.361 0 512 0S149.959 0 74.98 74.98C0 149.959 0 270.639 0 512c0 241.356 0 362.041 74.98 437.016C149.959 1024 270.644 1024 512 1024s362.041 0 437.016-74.984c73.154-73.141 74.944-189.777 74.984-419.514zM789 512.5C789 617.71 665.207 703 512.5 703S236 617.71 236 512.5 359.793 322 512.5 322 789 407.29 789 512.5"
            clipRule="evenodd"
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
          <path
            className="fill-primary"
            fillRule="evenodd"
            d="M1024 494.498c-.04-229.737-1.83-346.374-74.984-419.518C874.041 0 753.361 0 512 0S149.959 0 74.98 74.98C0 149.959 0 270.639 0 512c0 241.356 0 362.041 74.98 437.016C149.959 1024 270.644 1024 512 1024s362.041 0 437.016-74.984c73.154-73.141 74.944-189.777 74.984-419.514zm-235.137 17.708c0 152.795-123.865 276.659-276.66 276.659-152.794 0-276.659-123.864-276.659-276.659s123.865-276.66 276.659-276.66c152.795 0 276.66 123.865 276.66 276.66"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
