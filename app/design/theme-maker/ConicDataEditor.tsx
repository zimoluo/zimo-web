"use client";

import AngleDataInput from "./AngleDataInput";
import SizePosInputBox from "./SizePosInputBox";
import { useGradientData } from "./GradientDataContext";
import { isStringNumber } from "@/lib/generalHelper";

export default function ConicDataEditor() {
  const { updateGradientProperty, getGradientPropertyValueInNumber } =
    useGradientData();

  const setSizePosData = (
    category: keyof RadialGradientData,
    newValue: number
  ) => updateGradientProperty(category, newValue);

  return (
    <div className="flex flex-col gap-4 justify-center items-center py-4">
      <AngleDataInput widthConfig="40%" />
      <div className="px-4">
        <p className="mb-1">Position</p>
        <div className="flex gap-2">
          {(["posX", "posY"] as (keyof RadialGradientData)[]).map(
            (propName, index) => (
              <SizePosInputBox
                key={index}
                value={getGradientPropertyValueInNumber(propName)}
                setValue={(newValue: number) => {
                  setSizePosData(propName, newValue);
                }}
                isValid={isStringNumber}
                formatValue={(rawInput: string) => parseFloat(rawInput) || 0}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
