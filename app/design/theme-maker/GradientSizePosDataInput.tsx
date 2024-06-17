"use client";

import EllipseCircleModeSelector from "./EllipseCircleModeSelector";
import { useGradientData } from "./GradientDataContext";
import GradientSizePosPreview from "./GradientSizePosPreview";
import SizePosInputBox from "./SizePosInputBox";
import { isStringNumber } from "@/lib/generalHelper";

export default function GradientSizePosDataInput() {
  const { selectedLayer, updateGradientProperty } = useGradientData();
  const isRepeating = selectedLayer.type.startsWith("repeating-");
  const isCircle = !!selectedLayer.isCircle;

  const setSizePosData = (
    category: keyof RadialGradientData,
    newValue: number
  ) => updateGradientProperty(category, newValue);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-4">
      <p className="text-center">{`Radial ${isCircle ? "circle" : "ellipse"}${
        isRepeating ? "s" : ""
      }`}</p>
      <div className="w-full h-auto flex-grow flex justify-center items-center px-4 gap-2">
        <div className="w-auto h-full shrink-0 flex-grow rounded-lg overflow-hidden bg-pastel bg-opacity-80 shadow-sm">
          <GradientSizePosPreview
            {...{
              sizeX: 20,
              sizeY: 20,
              posX: 50,
              posY: 50,
              ...selectedLayer,
            }}
            isRepeating={isRepeating}
          />
        </div>
        <EllipseCircleModeSelector />
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
              value={selectedLayer[propName] || 0}
              setValue={(newValue: number) => {
                setSizePosData(propName, newValue);
              }}
              isValid={isStringNumber}
              formatValue={(rawInput: string) =>
                propName.startsWith("pos")
                  ? parseFloat(rawInput) || 0
                  : Math.abs(parseFloat(rawInput) || 0)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
