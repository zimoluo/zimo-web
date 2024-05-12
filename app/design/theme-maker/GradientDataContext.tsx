"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { createContext, useState, useContext, ReactNode } from "react";

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
    }
  | undefined
>(undefined);

export function GradientDataProvider({ children }: Props) {
  const [selectedGradientCategory, setSelectedGradientCategory] =
    useState<GradientCategory>("widget");
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);
  const { currentCustomThemeConfig } = useSettings();

  return (
    <GradientDataContext.Provider
      value={{
        selectedGradientCategory,
        setSelectedGradientCategory,
        currentLayerIndex,
        setCurrentLayerIndex,
        selectedLayer:
          currentCustomThemeConfig.palette[selectedGradientCategory] ?? [],
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
