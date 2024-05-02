"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GradientLayerContext = createContext<
  | {
      currentLayerIndex: number;
      setCurrentLayerIndex: React.Dispatch<React.SetStateAction<number>>;
    }
  | undefined
>(undefined);

export function GradientLayerProvider({ children }: Props) {
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);

  return (
    <GradientLayerContext.Provider
      value={{
        currentLayerIndex,
        setCurrentLayerIndex,
      }}
    >
      {children}
    </GradientLayerContext.Provider>
  );
}

export const useGradientLayer = () => {
  const context = useContext(GradientLayerContext);
  if (context === undefined) {
    throw new Error(
      "useGradientLayer must be used within a GradientLayerProvider"
    );
  }
  return context;
};
