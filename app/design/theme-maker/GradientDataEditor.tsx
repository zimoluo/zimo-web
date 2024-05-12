"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import GradientModePicker from "./GradientModePicker";
import { useGradientData } from "./GradientCategoryContext";
import GradientModeAllocator from "./GradientModeAllocator";

export default function GradientDataEditor() {
  const { currentCustomThemeConfig } = useSettings();
  const { selectedGradientCategory } = useGradientData();

  const layersArray =
    currentCustomThemeConfig.palette[selectedGradientCategory];

  return (
    <div className="flex flex-col gap-4">
      {layersArray && layersArray.length > 0 && (
        <>
          <GradientModePicker />
          <GradientModeAllocator />
        </>
      )}
    </div>
  );
}
