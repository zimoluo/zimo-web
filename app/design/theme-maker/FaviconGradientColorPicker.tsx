"use client";

import { RgbaColorPicker } from "react-colorful";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";
import { useFaviconEditor } from "./FaviconEditorContext";
import { hexToRgba, rgbaToHex } from "@/lib/themeMaker/colorHelper";

export default function FaviconGradientColorPicker() {
  const { currentFaviconGradientStop, modifyFaviconGradientStop } =
    useFaviconEditor();

  const { handleStartTouching, handleStartDragging } = useDragAndTouch({
    onFinish: () => modifyFaviconGradientStop(currentFaviconGradientStop),
  });

  const handleColorChange = useCallback(
    (newColor: { r: number; g: number; b: number; a: number }) => {
      modifyFaviconGradientStop({ color: rgbaToHex(newColor) });
    },
    [modifyFaviconGradientStop]
  );

  return (
    <RgbaColorPicker
      color={hexToRgba(currentFaviconGradientStop.color)}
      onChange={handleColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
