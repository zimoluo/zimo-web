"use client";

import { RgbaColorPicker } from "react-colorful";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";
import { useGradientData } from "./GradientDataContext";

const arrayToRgb = (
  colorArray: ColorTriplet
): { r: number; g: number; b: number } => {
  const [r, g, b] = colorArray;
  return { r, g, b };
};

export default function GradientPalettePicker() {
  const { currentGradientStop, modifyGradientStop } = useGradientData();

  const { handleStartTouching, handleStartDragging } = useDragAndTouch({
    onFinish: () => modifyGradientStop(currentGradientStop),
  });

  const handleColorChange = useCallback(
    (newColor: { r: number; g: number; b: number; a: number }) => {
      const { r, g, b, a } = newColor;

      const newStopData: Partial<GradientStop> = {
        color: [r, g, b],
        opacity: a,
      };

      modifyGradientStop(newStopData, undefined, false);
    },
    [modifyGradientStop]
  );

  return (
    <RgbaColorPicker
      color={{
        ...arrayToRgb(currentGradientStop.color),
        a: currentGradientStop.opacity,
      }}
      onChange={handleColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
