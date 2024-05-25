"use client";

import { createContext, useContext, ReactNode } from "react";

type Props = {
  children: ReactNode;
} & GradientStopsManagerData;

const GradientStopsPositionContext = createContext<
  GradientStopsManagerData | undefined
>(undefined);

export function GradientStopsPositionProvider({
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
    <GradientStopsPositionContext.Provider
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
    </GradientStopsPositionContext.Provider>
  );
}

export const useGradientStopsPosition = () => {
  const context = useContext(GradientStopsPositionContext);
  if (context === undefined) {
    throw new Error(
      "useGradientStopsPosition (converted) must be used within a GradientStopsPositionProvider"
    );
  }
  return context;
};
