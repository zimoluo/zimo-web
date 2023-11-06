"use client";

import { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { colorMap } from "./colorMap";

interface Props {
  children?: ReactNode;
}

export default function ThemeColorApplier({ children }: Props) {
  const { theme } = useTheme();
  const themeColor = theme.palette;

  return <div className={colorMap[themeColor].colorPalette}>{children}</div>;
}
