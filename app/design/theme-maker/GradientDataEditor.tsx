"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import GradientModePicker from "./GradientModePicker";
import { useGradientData } from "./GradientCategoryContext";

export default function GradientDataEditor() {
  const { currentCustomThemeConfig } = useSettings();
  const { selectedGradientCategory } = useGradientData();

  const layersArray =
    currentCustomThemeConfig.palette[selectedGradientCategory];

  return (
    <div>{layersArray && layersArray.length > 0 && <GradientModePicker />}</div>
  );
}
