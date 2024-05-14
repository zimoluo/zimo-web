"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useGradientData } from "./GradientDataContext";
import GradientSizePosPreview from "./GradientSizePosPreview";
import SizePosInputBox from "./SizePosInputBox";
import { isStringNumber } from "@/lib/generalHelper";
import { initializeGradientDataProperties } from "@/lib/themeMaker/layerHelper";

function percentageToNumber(percentageString: string): number {
  const regex = /^(-?\d*\.?\d+)%?$/;
  const match = percentageString.match(regex);

  if (match) {
    return parseFloat(match[1]);
  } else {
    return 0;
  }
}

export default function GradientSizePosDataInput() {
  const {
    thisLayerGradient,
    selectedLayer,
    currentLayerIndex,
    selectedGradientCategory,
  } = useGradientData();
  const { updateGradientData } = useSettings();
  const isRepeating = thisLayerGradient.type.startsWith("repeating-");

  const setSizePosData = (
    category: keyof RadialGradientData,
    newValue: number
  ) => {
    const newGradientData = structuredClone(thisLayerGradient);
    initializeGradientDataProperties(newGradientData);

    newGradientData[category] = `${newValue}%`;

    const newLayer = structuredClone(selectedLayer);
    newLayer[currentLayerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayer);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-4">
      <p className="text-center">{`Radial circle${isRepeating ? "s" : ""}`}</p>
      <div className="w-full h-auto flex-grow flex justify-center items-center">
        <div className="w-auto h-full shrink-0 aspect-square rounded-lg overflow-hidden bg-pastel bg-opacity-80 shadow-md">
          <GradientSizePosPreview
            sizeX={thisLayerGradient.sizeX ?? "20%"}
            posX={thisLayerGradient.posX ?? "50%"}
            sizeY={thisLayerGradient.sizeY ?? "20%"}
            posY={thisLayerGradient.posY ?? "50%"}
            isRepeating={isRepeating}
          />
        </div>
      </div>
      <div className="w-full h-auto">
        <div className="grid grid-cols-2 text-sm w-full px-4 gap-2">
          <p>Position</p>
          <p>Size</p>
        </div>
        <div className="w-full flex px-4 gap-2 text-sm">
          {(
            ["posX", "posY", "sizeX", "sizeY"] as (keyof RadialGradientData)[]
          ).map((propName, index) => (
            <SizePosInputBox
              key={index}
              value={percentageToNumber(
                thisLayerGradient[propName] ??
                  (propName.startsWith("pos") ? "50%" : "20%")
              )}
              setValue={(newValue: number) => {
                setSizePosData(propName, newValue);
              }}
              isValid={isStringNumber}
              formatValue={(rawInput: string) =>
                propName.startsWith("pos")
                  ? parseFloat(rawInput)
                  : Math.abs(parseFloat(rawInput))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
