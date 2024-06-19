"use client";

import {
  extendedStopsMaximum,
  extendedStopsMinimum,
} from "@/lib/themeMaker/layerHelper";
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type Props = {
  children: ReactNode;
} & GradientStopsManagerData;

const GradientStopsPositionContext = createContext<
  | (GradientStopsManagerData & {
      computedMinimum: number;
      computedMaximum: number;
      setUpdateDisabled: Dispatch<SetStateAction<boolean>>;
      setTemporaryMinimum: Dispatch<SetStateAction<number>>;
      setTemporaryMaximum: Dispatch<SetStateAction<number>>;
      isExtendedRange: boolean;
    })
  | undefined
>(undefined);

function adjustDynamicValue(
  currentValue: number,
  boundaryValue: number,
  stepSize: number,
  isIncreasing: boolean
) {
  let step = isIncreasing ? 100 : 0;
  const condition = () =>
    isIncreasing ? step < currentValue : step > currentValue;
  const increment = isIncreasing ? stepSize : -stepSize;

  while (condition()) {
    step += increment;
  }

  if (
    (isIncreasing && step > boundaryValue) ||
    (!isIncreasing && step < boundaryValue)
  ) {
    step = boundaryValue;
  }
  return step;
}

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
  colorInterpolationData,
}: Props) {
  const [updateDisabled, setUpdateDisabled] = useState(false);
  const [temporaryMinimum, setTemporaryMinimum] = useState(0);
  const [temporaryMaximum, setTemporaryMaximum] = useState(100);

  const { computedMinimum, computedMaximum } = useMemo(() => {
    if (!isExtendedRange) {
      return { computedMinimum: 0, computedMaximum: 100 };
    }

    let min = 0;
    let max = 100;
    const stepSize = 50;

    if (!updateDisabled) {
      const atValues = gradientStops.map((stop) => stop.at);
      const minAt = Math.min(...atValues);
      const maxAt = Math.max(...atValues);

      const adjustedMin =
        minAt < 0
          ? adjustDynamicValue(minAt, extendedStopsMinimum, stepSize, false)
          : 0;
      const adjustedMax =
        maxAt > 100
          ? adjustDynamicValue(maxAt, extendedStopsMaximum, stepSize, true)
          : 100;

      min = adjustedMin;
      max = adjustedMax;
    } else {
      min = temporaryMinimum;
      max = temporaryMaximum;
    }

    return { computedMinimum: min, computedMaximum: max };
  }, [
    gradientStops,
    isExtendedRange,
    updateDisabled,
    temporaryMaximum,
    temporaryMinimum,
  ]);

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
        setUpdateDisabled,
        setTemporaryMaximum,
        setTemporaryMinimum,
        colorInterpolationData,
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
