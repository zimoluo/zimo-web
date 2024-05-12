"use client";

import { ReactNode } from "react";
import { useGradientData } from "./GradientCategoryContext";

const gradientModeMap: Record<string, ReactNode> = {
  "linear-gradient": "awa",
};

export default function GradientModeAllocator() {
  const { selectedLayer, currentLayerIndex } = useGradientData();
  const gradientMode = selectedLayer[currentLayerIndex].type;

  return (
    <div className="w-full flex-grow flex items-center justify-center rounded-xl bg-light bg-opacity-80 shadow-lg">
      {gradientModeMap[gradientMode] ?? null}
    </div>
  );
}
