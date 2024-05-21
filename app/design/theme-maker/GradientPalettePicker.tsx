"use client";

import { RgbaColorPicker } from "react-colorful";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";
import { useGradientData } from "./GradientDataContext";

const arrayToRgba = (
  colorArray: ColorQuartet
): { r: number; g: number; b: number; a: number } => {
  const [r, g, b, a] = colorArray;
  return { r, g, b, a };
};

export default function GradientPalettePicker() {
  const {
    formattedCurrentGradientStopData,
    modifyGradientStop,
    gradientStopIndex,
  } = useGradientData();

  const { handleStartTouching, handleStartDragging } = useDragAndTouch({
    onFinish: () =>
      modifyGradientStop(gradientStopIndex, formattedCurrentGradientStopData),
  });

  const handleColorChange = useCallback(
    (newColor: { r: number; g: number; b: number; a: number }) => {
      const { r, g, b, a } = newColor;

      const newStopData: FormattedGradientStopData = {
        ...formattedCurrentGradientStopData,
        color: [r, g, b, a],
      };

      if (formattedCurrentGradientStopData.color[3] !== a) {
        newStopData.isWidgetOpacity = false;
      }

      modifyGradientStop(gradientStopIndex, newStopData);
    },
    [gradientStopIndex, formattedCurrentGradientStopData, modifyGradientStop]
  );

  return (
    <RgbaColorPicker
      color={arrayToRgba(formattedCurrentGradientStopData.color)}
      onChange={handleColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
