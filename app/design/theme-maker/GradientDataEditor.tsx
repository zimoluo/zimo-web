"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import GradientModePicker from "./GradientModePicker";
import { useGradientCategory } from "./GradientCategoryContext";
import { useGradientLayer } from "./GradientLayerContext";

export default function GradientDataEditor() {
  const { settings } = useSettings();
  const { selectedGradientCategory } = useGradientCategory();
  const { currentLayerIndex } = useGradientLayer();

  return <div>{<GradientModePicker />}</div>;
}
