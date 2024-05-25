"use client";

import { HexColorPicker } from "react-colorful";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";
import { useFaviconEditor } from "./FaviconEditorContext";

export default function FaviconGradientColorPicker() {
  const { currentFaviconGradientStop, modifyFaviconGradientStop } =
    useFaviconEditor();

  const { handleStartTouching, handleStartDragging } = useDragAndTouch({
    onFinish: () => modifyFaviconGradientStop(currentFaviconGradientStop),
  });

  const formatHexString = (hex: string): HexColor => {
    return `${hex.startsWith("#") ? "" : "#"}${hex.toLowerCase()}` as HexColor;
  };

  const handleColorChange = useCallback(
    (newColor: string) => {
      modifyFaviconGradientStop({ color: formatHexString(newColor) });
    },
    [modifyFaviconGradientStop]
  );

  return (
    <HexColorPicker
      color={formatHexString(currentFaviconGradientStop.color)}
      onChange={handleColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
