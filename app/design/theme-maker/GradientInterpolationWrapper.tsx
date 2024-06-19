"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { ReactNode } from "react";
import { useGradientData } from "./GradientDataContext";

interface Props {
  children?: ReactNode;
}

export default function GradientInterpolationWrapper({ children }: Props) {
  const { settings } = useSettings();
  const { selectedLayer } = useGradientData();

  return (
    (settings.enableColorInterpolationMethod ||
      (selectedLayer.colorInterpolation &&
        (selectedLayer.colorInterpolation.colorSpace !== "default" ||
          (selectedLayer.colorInterpolation.hueInterpolationMethod &&
            selectedLayer.colorInterpolation.hueInterpolationMethod !==
              "shorter")))) && <>{children}</>
  );
}
