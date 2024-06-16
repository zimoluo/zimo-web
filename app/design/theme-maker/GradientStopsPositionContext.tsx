"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";

type Props = {
  children: ReactNode;
} & GradientStopsManagerData;

const GradientStopsPositionContext = createContext<
  | (GradientStopsManagerData & {
      computedMinimum: number;
      computedMaximum: number;
    })
  | undefined
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
  isExtendedRange = false,
}: Props) {
  const { computedMinimum, computedMaximum } = useMemo(() => {
    let min = 0;
    let max = 100;

    if (isExtendedRange) {
      const atValues = gradientStops.map((stop) => stop.at);
      const minAt = Math.min(...atValues);
      const maxAt = Math.max(...atValues);

      if (minAt < 0) min = -50;
      if (maxAt > 100) {
        if (maxAt <= 150) max = 150;
        else if (maxAt <= 200) max = 200;
        else max = 250;
      }
    }

    return { computedMinimum: min, computedMaximum: max };
  }, [gradientStops, isExtendedRange]);

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
        isExtendedRange,
        computedMaximum,
        computedMinimum,
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
