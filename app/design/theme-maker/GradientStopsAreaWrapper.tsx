"use client";

import { ReactNode } from "react";
import { useGradientData } from "./GradientDataContext";
import EmptyLayerPlaceholder from "./EmptyLayerPlaceholder";

interface Props {
  children?: ReactNode;
}

export default function GradientStopsAreaWrapper({ children }: Props) {
  const { currentLayers } = useGradientData();

  return currentLayers.length > 0 ? children : <EmptyLayerPlaceholder />;
}
