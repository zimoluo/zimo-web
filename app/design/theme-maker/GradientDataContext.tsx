"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { modInRange, stringWithUnitSuffixToNumber } from "@/lib/generalHelper";
import { initializeGradientDataProperties } from "@/lib/themeMaker/layerHelper";
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
      updateGradientProperty: (
        property: keyof (RadialGradientData & LinearGradientData),
        newValue: number,
        doSync?: boolean
      ) => void;
      getGradientPropertyValueInNumber: (
        property: keyof (RadialGradientData & LinearGradientData)
      ) => number;
      gradientStops: GradientStop[];
      gradientStopIndex: number;
      currentGradientStop: GradientStop;
    }
  | undefined
>(undefined);

export function GradientDataProvider({ children }: Props) {
  const [selectedGradientCategory, setSelectedGradientCategory] =
    useState<GradientCategory>("widget");
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);
  const [gradientStopIndex, setGradientStopIndex] = useState<number>(0);
  const { currentCustomThemeConfig, updateGradientData } = useSettings();
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

    return selectedLayer[memoizedCurrentLayerIndex];
  }, [selectedLayer, memoizedCurrentLayerIndex]);

  const gradientStops: GradientStop[] = memoizedThisLayerGradient.stops ?? [];

  const memoizedGradientStopIndex = useMemo(() => {
    if (gradientStops.length <= 0) {
      return 0;
    }

    let safeIndex = gradientStopIndex;
    if (gradientStopIndex >= gradientStops.length) {
      safeIndex = gradientStops.length - 1;
      setGradientStopIndex(safeIndex);
    }

    return safeIndex;
  }, [gradientStops, gradientStopIndex]);

  const memoizedCurrentGradientStop: GradientStop = useMemo(() => {
    if (gradientStops.length <= 0) {
      // Empty placeholder that should be avoided in actual use case
      return {
        color: "ffffff00",
        at: "0%",
      };
    }

    return gradientStops[memoizedGradientStopIndex];
  }, [gradientStops, memoizedGradientStopIndex]);

  const getGradientPropertyValueInNumber = (
    property: keyof (RadialGradientData & LinearGradientData)
  ): number => {
    const rawValue = memoizedThisLayerGradient[property];

    if (property === "angle") {
      return stringWithUnitSuffixToNumber(rawValue ?? "0deg", "deg");
    }

    return stringWithUnitSuffixToNumber(
      rawValue ?? (property.startsWith("pos") ? "50%" : "20%"),
      "%"
    );
  };

  const updateGradientProperty = (
    property: keyof (RadialGradientData & LinearGradientData),
    newValue: number,
    doSync: boolean = true
  ) => {
    const newGradientData = structuredClone(memoizedThisLayerGradient);
    initializeGradientDataProperties(newGradientData);

    let safeNewValue = newValue;

    if (property.startsWith("size")) {
      safeNewValue = Math.abs(safeNewValue);
    }

    if (property === "angle") {
      safeNewValue = modInRange(safeNewValue || 0, 360);
    }

    newGradientData[property] = `${safeNewValue}${
      property === "angle" ? "deg" : "%"
    }`;

    const newLayer = structuredClone(selectedLayer);
    newLayer[currentLayerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayer, doSync);
  };

  return (
    <GradientDataContext.Provider
      value={{
        selectedGradientCategory,
        setSelectedGradientCategory,
        currentLayerIndex: memoizedCurrentLayerIndex,
        setCurrentLayerIndex,
        selectedLayer,
        thisLayerGradient: memoizedThisLayerGradient,
        updateGradientProperty,
        getGradientPropertyValueInNumber,
        gradientStops,
        gradientStopIndex: memoizedGradientStopIndex,
        currentGradientStop: memoizedCurrentGradientStop,
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
