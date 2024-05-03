"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import selectorStyle from "./layer-selector.module.css";
import { useGradientCategory } from "./GradientCategoryContext";
import GradientLayerRow from "./GradientLayerRow";
import AddPlusIcon from "@/components/assets/entries/AddPlusIcon";
import { useGradientLayer } from "./GradientLayerContext";
import { defaultLayer } from "@/lib/themeMaker/layerHelper";

export default function GradientLayerSelector() {
  const { settings, updateGradientData } = useSettings();
  const { selectedGradientCategory } = useGradientCategory();
  const { currentLayerIndex } = useGradientLayer();

  const currentGradientData: ColorGradient[] =
    settings.customThemeData[settings.customThemeIndex].palette[
      selectedGradientCategory
    ] ?? [];

  const addNewLayer = () => {
    const gradientData: ColorGradient[] =
      settings.customThemeData[settings.customThemeIndex].palette[
        selectedGradientCategory
      ] ?? [];

    const newData: ColorGradient[] = [
      ...gradientData.slice(0, currentLayerIndex),
      structuredClone(defaultLayer),
      ...gradientData.slice(currentLayerIndex, gradientData.length),
    ];

    updateGradientData(selectedGradientCategory, newData);
  };

  return (
    <div
      className={`rounded-xl bg-light bg-opacity-80 shadow-lg p-4 ${selectorStyle.container}`}
    >
      <div className="flex justify-end">
        <button
          className="w-auto h-5 aspect-square transition-transform duration-300 ease-out hover:scale-110"
          onClick={addNewLayer}
        >
          <AddPlusIcon className="h-full w-auto aspect-square" />
        </button>
      </div>
      <div className={`overflow-y-auto relative ${selectorStyle.gridWrapper}`}>
        <div className={`${selectorStyle.grid}`}>
          {currentGradientData.map((gradientData, index) => {
            return (
              <GradientLayerRow key={index} {...{ gradientData, index }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
