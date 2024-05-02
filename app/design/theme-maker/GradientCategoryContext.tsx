"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GradientCategoryContext = createContext<
  | {
      selectedGradientCategory: GradientCategory;
      setSelectedGradientCategory: React.Dispatch<
        React.SetStateAction<GradientCategory>
      >;
    }
  | undefined
>(undefined);

export function GradientCategoryProvider({ children }: Props) {
  const [selectedGradientCategory, setSelectedGradientCategory] =
    useState<GradientCategory>("widget");

  return (
    <GradientCategoryContext.Provider
      value={{
        selectedGradientCategory,
        setSelectedGradientCategory,
      }}
    >
      {children}
    </GradientCategoryContext.Provider>
  );
}

export const useGradientCategory = () => {
  const context = useContext(GradientCategoryContext);
  if (context === undefined) {
    throw new Error(
      "useGradientCategory must be used within a GradientCategoryProvider"
    );
  }
  return context;
};
