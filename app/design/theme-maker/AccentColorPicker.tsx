"use client";

import { ReactNode } from "react";
import { useColorPanel } from "./ColorPanelContext";

interface Props {
  palette: ReactNode;
  shade: ReactNode;
  code: ReactNode;
}

export default function AccentColorPicker({ palette, shade, code }: Props) {
  const { colorPickerMode } = useColorPanel();

  const colorPickerModeMap: Record<ColorPickerMode, ReactNode> = {
    palette,
    shade,
    code,
  };

  return colorPickerModeMap[colorPickerMode];
}
