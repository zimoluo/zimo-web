"use client";

import AngleDataInput from "./AngleDataInput";
import SizePosInputBox from "./SizePosInputBox";
import { useGradientData } from "./GradientDataContext";
import { isStringNumber } from "@/lib/generalHelper";
import editorStyle from "./mode-data-editor.module.css";

export default function ConicDataEditor() {
  const { updateGradientProperty, selectedLayer } = useGradientData();

  const setSizePosData = (
    category: keyof RadialGradientData,
    newValue: number
  ) => updateGradientProperty(category, newValue);

  return (
    <div
      className={`flex flex-col gap-2 justify-center items-center py-3 w-full ${editorStyle.wrapper}`}
    >
      <AngleDataInput dimensionConfig="38%" title="Angle of start" />
      <div className="px-4">
        <p className={`${editorStyle.positionText}`}>Position</p>
        <div className="flex gap-2">
          {(["posX", "posY"] as (keyof RadialGradientData)[]).map(
            (propName, index) => (
              <SizePosInputBox
                key={index}
                value={(selectedLayer[propName] as number) ?? 50}
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
