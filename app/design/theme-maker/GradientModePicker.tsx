"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import {
  gradientTypeNameMap,
  initializeGradientDataProperties,
} from "@/lib/themeMaker/layerHelper";
import { useGradientData } from "./GradientDataContext";
import EditorDropdownMenu from "./EditorDropdownMenu";

const availableModes: EditorGradientMode[] = [
  "linear-gradient",
  "radial-gradient",
  "conic-gradient",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "repeating-conic-gradient",
];

const modeNames: string[] = availableModes.map(
  (mode) => gradientTypeNameMap[mode]
);

export default function GradientModePicker() {
  const { updateGradientData } = useSettings();
  const { selectedGradientCategory, layerIndex, currentLayers, selectedLayer } =
    useGradientData();

  const selectedMode = selectedLayer.type as EditorGradientMode;

  const setGradientMode = (newMode: EditorGradientMode) => {
    const gradientData = structuredClone(selectedLayer);

    initializeGradientDataProperties(gradientData);

    gradientData.type = newMode;

    const newGradientLayers = structuredClone(currentLayers);

    newGradientLayers[layerIndex] = gradientData;

    updateGradientData(selectedGradientCategory, newGradientLayers);
  };

  return (
    <EditorDropdownMenu
      currentValue={selectedMode}
      namesList={modeNames}
      optionsList={availableModes}
      setValue={setGradientMode}
    />
  );
}
