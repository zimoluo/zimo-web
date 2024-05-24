"use client";

import { createContext, useContext, ReactNode } from "react";

type Props = {
  children: ReactNode;
} & GradientStopsManagerData;

const GradientStopsAreaContext = createContext<
  GradientStopsManagerData | undefined
>(undefined);

export function GradientStopsAreaProvider({
  children,
  gradientStops,
  currentGradientStop,
  gradientStopIndex,
  setGradientStopIndex,
  modifyGradientStop,
  appendGradientStop,
  deleteGradientStop,
  updateGradientStopsDirectly,
}: Props) {
  return (
    <GradientStopsAreaContext.Provider
      value={{
        gradientStops,
        currentGradientStop,
        gradientStopIndex,
        setGradientStopIndex,
        modifyGradientStop,
        appendGradientStop,
        deleteGradientStop,
        updateGradientStopsDirectly,
      }}
    >
      {children}
    </GradientStopsAreaContext.Provider>
  );
}

export const useGradientStopsArea = () => {
  const context = useContext(GradientStopsAreaContext);
  if (context === undefined) {
    throw new Error(
      "useGradientStopsArea (converted) must be used within a GradientStopsAreaProvider"
    );
  }
  return context;
};
