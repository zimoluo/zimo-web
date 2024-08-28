"use client";

import { ReactNode } from "react";
import { useGradientData } from "./GradientDataContext";
import editorStyle from "./mode-data-editor.module.css";
import GradientSizePosDataInput from "./GradientSizePosDataInput";
import ConicDataEditor from "./ConicDataEditor";
import LinearGradientDataEditor from "./LinearGradientDataEditor";

const gradientModeMap: Record<EditorGradientMode, ReactNode> = {
  "linear-gradient": <LinearGradientDataEditor />,
  "repeating-linear-gradient": <LinearGradientDataEditor />,
  "radial-gradient": <GradientSizePosDataInput />,
  "repeating-radial-gradient": <GradientSizePosDataInput />,
  "conic-gradient": <ConicDataEditor />,
  "repeating-conic-gradient": <ConicDataEditor />,
};

export default function GradientModeAllocator() {
  const { selectedLayer } = useGradientData();
  const gradientMode = selectedLayer.type;

  return (
    <div
      className={`w-full flex items-center justify-center rounded-xl bg-light bg-opacity-80 shadow-lg ${editorStyle.allocator}`}
    >
      {gradientModeMap[gradientMode as EditorGradientMode] ?? null}
    </div>
  );
}
