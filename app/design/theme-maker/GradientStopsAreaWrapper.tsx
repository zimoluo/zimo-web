"use client";

import { ReactNode } from "react";
import { useGradientData } from "./GradientDataContext";
import EmptyLayerPlaceholder from "./EmptyLayerPlaceholder";

interface Props {
  children?: ReactNode;
}

export default function GradientStopsAreaWrapper({ children }: Props) {
  const { selectedLayer } = useGradientData();

  return selectedLayer.length > 0 ? children : <EmptyLayerPlaceholder />;
}
