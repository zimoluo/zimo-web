"use client";

import GradientModePicker from "./GradientModePicker";
import { useGradientData } from "./GradientDataContext";
import GradientModeAllocator from "./GradientModeAllocator";
import EmptyLayerPlaceholder from "./EmptyLayerPlaceholder";

export default function GradientDataEditor() {
  const { selectedLayer } = useGradientData();

  return (
    <div className="flex flex-col gap-4">
      {selectedLayer.length > 0 ? (
        <>
          <GradientModePicker />
          <GradientModeAllocator />
        </>
      ) : (
        <EmptyLayerPlaceholder />
      )}
    </div>
  );
}
