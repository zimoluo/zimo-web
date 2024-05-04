"use client";

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
    }
  | undefined
>(undefined);

export function GradientDataProvider({ children }: Props) {
  const [selectedGradientCategory, setSelectedGradientCategory] =
    useState<GradientCategory>("widget");
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);

  return (
    <GradientDataContext.Provider
      value={{
        selectedGradientCategory,
        setSelectedGradientCategory,
        currentLayerIndex,
        setCurrentLayerIndex,
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
