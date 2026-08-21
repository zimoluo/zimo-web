"use client";

import type { GradientStopsManagerData } from "../../../src/features/theme/studio/model/types";
import { GradientStopsPositionProvider } from "./GradientStopsPositionContext";
import StopsEditorBar from "./StopsEditorBar";
import StopsEditorUtil from "./StopsEditorUtil";

export default function StopsPositionManager(data: GradientStopsManagerData) {
  return (
    <GradientStopsPositionProvider {...data}>
      <div className="rounded-xl bg-panel/80 shadow-lg h-auto p-4">
        <StopsEditorUtil />
        <StopsEditorBar />
      </div>
    </GradientStopsPositionProvider>
  );
}
