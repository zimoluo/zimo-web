"use client";

import { useGradientData } from "./GradientDataContext";
import StopsPositionManager from "./StopsPositionManager";

export default function GradientEditorStopsPositionPropsGenerator() {
  const gradientData = useGradientData();
  return <StopsPositionManager {...gradientData} isExtendedRange={true} />;
}
