"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";

interface Props {
  children: ReactNode;
}

const GradientDataContext = createContext<
  | {
      selectedGradientCategory: GradientCategory;
      setSelectedGradientCategory: React.Dispatch<
        React.SetStateAction<GradientCategory>
      >;
      currentLayerIndex: number;
      setCurrentLayerIndex: React.Dispatch<React.SetStateAction<number>>;
      selectedLayer: ColorGradient[];
      thisLayerGradient: ColorGradient;
    }
  | undefined
>(undefined);

export function GradientDataProvider({ children }: Props) {
  const [selectedGradientCategory, setSelectedGradientCategory] =
    useState<GradientCategory>("widget");
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);
  const { currentCustomThemeConfig } = useSettings();
  const selectedLayer =
    currentCustomThemeConfig.palette[selectedGradientCategory] ?? [];

  const memoizedCurrentLayerIndex = useMemo(() => {
    if (selectedLayer.length <= 0) {
      return 0;
    }

    let safeIndex = currentLayerIndex;
    if (currentLayerIndex >= selectedLayer.length) {
      safeIndex = selectedLayer.length - 1;
      setCurrentLayerIndex(safeIndex);
    }

    return safeIndex;
  }, [selectedLayer, currentLayerIndex]);

  const memoizedThisLayerGradient = useMemo(() => {
    if (selectedLayer.length <= 0) {
      // Empty placeholder that should be avoided in actual use case
      return {
        type: "custom",
        content: "",
      };
    }

    return selectedLayer[currentLayerIndex];
  }, [selectedLayer, currentLayerIndex]);

  return (
    <GradientDataContext.Provider
      value={{
        selectedGradientCategory,
        setSelectedGradientCategory,
        currentLayerIndex: memoizedCurrentLayerIndex,
        setCurrentLayerIndex,
        selectedLayer,
        thisLayerGradient: memoizedThisLayerGradient,
      }}
    >
      {children}
    </GradientDataContext.Provider>
  );
}

export const useGradientData = () => {
  const context = useContext(GradientDataContext);
  if (context === undefined) {
    throw new Error(
      "useGradientData must be used within a GradientDataProvider"
    );
  }
  return context;
};
