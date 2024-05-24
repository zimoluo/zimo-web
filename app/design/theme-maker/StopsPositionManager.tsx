"use client";

import { GradientStopsAreaProvider } from "./GradientStopsAreaContext";
import StopsEditorBar from "./StopsEditorBar";
import StopsEditorUtil from "./StopsEditorUtil";

export default function StopsPositionManager(data: GradientStopsManagerData) {
  return (
    <GradientStopsAreaProvider {...data}>
      <div className="rounded-xl bg-light bg-opacity-80 shadow-lg h-auto p-4">
        <StopsEditorUtil />
        <StopsEditorBar />
      </div>
    </GradientStopsAreaProvider>
  );
}
