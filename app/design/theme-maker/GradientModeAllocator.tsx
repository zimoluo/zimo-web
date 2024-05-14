"use client";

import { ReactNode } from "react";
import { useGradientData } from "./GradientDataContext";
import AngleDataInput from "./AngleDataInput";
import editorStyle from "./mode-data-editor.module.css";
import GradientSizePosDataInput from "./GradientSizePosDataInput";

const gradientModeMap: Record<string, ReactNode> = {
  "linear-gradient": <AngleDataInput />,
  "repeating-linear-gradient": <AngleDataInput />,
  "radial-gradient": <GradientSizePosDataInput />,
  "repeating-radial-gradient": <GradientSizePosDataInput />,
};

export default function GradientModeAllocator() {
  const { thisLayerGradient } = useGradientData();
  const gradientMode = thisLayerGradient.type;

  return (
    <div
      className={`w-full flex items-center justify-center rounded-xl bg-light bg-opacity-80 shadow-lg ${editorStyle.allocator}`}
    >
      {gradientModeMap[gradientMode] ?? null}
    </div>
  );
}
