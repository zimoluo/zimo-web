"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import selectorStyle from "./layer-selector.module.css";
import GradientLayerRow from "./GradientLayerRow";
import AddPlusIcon from "@/components/assets/entries/AddPlusIcon";
import { getRandomNewLayer } from "@/lib/themeMaker/layerHelper";
import { useGradientData } from "./GradientDataContext";

export default function GradientLayerSelector() {
  const { updateGradientData } = useSettings();
  const { selectedGradientCategory, currentLayerIndex, selectedLayer } =
    useGradientData();

  const addNewLayer = () => {
    const newData: ColorGradient[] = [
      ...selectedLayer.slice(0, currentLayerIndex),
      getRandomNewLayer(),
      ...selectedLayer.slice(currentLayerIndex, selectedLayer.length),
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
          {selectedLayer.map((gradientData, index) => {
            return (
              <GradientLayerRow key={index} {...{ gradientData, index }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
