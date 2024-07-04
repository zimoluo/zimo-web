"use client";

import { HexColorPicker } from "react-colorful";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useCallback } from "react";
import { useFaviconEditor } from "./FaviconEditorContext";
import { useSettings } from "@/components/contexts/SettingsContext";

export default function OutlineColorPicker() {
  const { faviconConfig } = useFaviconEditor();
  const { updateFaviconConfig } = useSettings();

  const { handleStartTouching, handleStartDragging } = useDragAndTouch({
    onFinish: () => updateFaviconConfig({ outline: faviconConfig.outline }),
  });

  const formatHexString = (hex: string): HexColor => {
    return `${hex.startsWith("#") ? "" : "#"}${hex.toLowerCase()}` as HexColor;
  };

  const handleColorChange = useCallback(
    (newColor: string) => {
      updateFaviconConfig({ outline: formatHexString(newColor) });
    },
    [updateFaviconConfig]
  );

  return (
    <HexColorPicker
      color={formatHexString(faviconConfig.outline ?? "#ffffff")}
      onChange={handleColorChange}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
    />
  );
}
