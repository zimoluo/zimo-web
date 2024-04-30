"use client";

import { ReactNode } from "react";
import { useColorPickerMode } from "./ColorPickerModeContext";

interface Props {
  palette: ReactNode;
  shade: ReactNode;
  code: ReactNode;
}

export default function AccentColorPicker({ palette, shade, code }: Props) {
  const { colorPickerMode } = useColorPickerMode();

  const colorPickerModeMap: Record<ColorPickerMode, ReactNode> = {
    palette,
    shade,
    code,
  };

  return colorPickerModeMap[colorPickerMode];
}
