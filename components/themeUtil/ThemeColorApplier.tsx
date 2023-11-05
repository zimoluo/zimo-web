"use client";

import { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";

import orangeColor from "@/styles/themes/orange.module.css";
import tealColor from "@/styles/themes/teal.module.css";

interface Props {
  children?: ReactNode;
}

const colorMap: Record<
  ThemeColor,
  {
    readonly [key: string]: string;
  }
> = { orange: orangeColor, teal: tealColor };

export default function ThemeColorApplier({ children }: Props) {
  const { theme } = useTheme();
  const themeColor = theme.color;

  return <div className={colorMap[themeColor].colorPalette}>{children}</div>;
}
