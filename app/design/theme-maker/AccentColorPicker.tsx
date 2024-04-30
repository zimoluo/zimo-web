"use client";

import { ReactNode } from "react";
import { useColorPickerMode } from "./ColorPickerModeContext";
import ColorShadePicker from "./ColorShadePicker";
import ColorCodePicker from "./ColorCodePicker";
import AccentPalettePicker from "./AccentPalettePicker";

export default function AccentColorPicker() {
  const { colorPickerMode } = useColorPickerMode();

  const colorPickerModeMap: Record<ColorPickerMode, ReactNode> = {
    palette: <AccentPalettePicker />,
    shade: <ColorShadePicker />,
    code: <ColorCodePicker />,
  };

  return colorPickerModeMap[colorPickerMode];
}
