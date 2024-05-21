"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { modInRange, stringWithUnitSuffixToNumber } from "@/lib/generalHelper";
import {
  emptyGradientStops,
  emptyLayer,
  emptyStop,
  generateFormattedGradientStop,
  getStopAtString,
  getStopColorString,
  initializeGradientDataProperties,
} from "@/lib/themeMaker/layerHelper";
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
      setGradientStopIndex: React.Dispatch<React.SetStateAction<number>>;
      currentGradientStop: GradientStop;
      formattedCurrentGradientStopData: FormattedGradientStopData;
      modifyGradientStop: (
        index: number,
        data: FormattedGradientStopData,
        doSync?: boolean
      ) => void;
      deleteGradientStop: (index: number, doSync?: boolean) => void;
      appendGradientStop: (
        data: FormattedGradientStopData,
        doSync?: boolean
      ) => void;
      updateGradientStopsList: (
        newGradientStops: GradientStop[],
        doSync?: boolean
      ) => void;
      copyCurrentLayer: () => void;
      layerClipboard: null | ColorGradient;
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
  const [layerClipboard, setLayerClipboard] = useState<ColorGradient | null>(
    null
  );

  const memoizedCurrentLayerIndex = useMemo(() => {
    if (selectedLayer.length <= 0) {
      return 0;
    }

    let safeIndex = currentLayerIndex;
    if (currentLayerIndex >= selectedLayer.length) {
      safeIndex = selectedLayer.length - 1;
    }

    if (currentLayerIndex < 0) {
      safeIndex = 0;
    }

    setCurrentLayerIndex(safeIndex);

    return safeIndex;
  }, [selectedLayer, currentLayerIndex]);

  const memoizedThisLayerGradient = useMemo(() => {
    if (selectedLayer.length <= 0) {
      // Empty placeholder that should be avoided in actual use case
      return emptyLayer;
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
    }

    if (gradientStopIndex < 0) {
      safeIndex = 0;
    }

    setGradientStopIndex(safeIndex);

    return safeIndex;
  }, [gradientStops, gradientStopIndex]);

  const memoizedCurrentGradientStop: GradientStop = useMemo(() => {
    if (gradientStops.length <= 0) {
      // Empty placeholder that should be avoided in actual use case
      return emptyStop;
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

  const formattedCurrentGradientStopData: FormattedGradientStopData =
    useMemo(() => {
      if (
        !memoizedThisLayerGradient.stops ||
        memoizedThisLayerGradient.stops.length <= 0 ||
        memoizedGradientStopIndex < 0 ||
        memoizedGradientStopIndex >= memoizedThisLayerGradient.stops.length
      ) {
        return { color: [255, 255, 255, 0], isWidgetOpacity: false, at: 0 };
      }

      return generateFormattedGradientStop(
        memoizedThisLayerGradient.stops[memoizedGradientStopIndex]
      );
    }, [
      memoizedThisLayerGradient,
      memoizedGradientStopIndex,
      generateFormattedGradientStop,
    ]);

  const updateGradientStopsList = (
    newGradientStops: GradientStop[],
    doSync: boolean = true
  ) => {
    const newGradientData = structuredClone(memoizedThisLayerGradient);
    newGradientData.stops = newGradientStops;

    if (newGradientData.stops.length < 2) {
      newGradientData.stops = emptyGradientStops;
    }

    const newLayer = structuredClone(selectedLayer);
    newLayer[currentLayerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayer, doSync);
  };

  const modifyGradientStop = (
    index: number,
    data: FormattedGradientStopData,
    doSync: boolean = true
  ) => {
    const newGradientData = structuredClone(memoizedThisLayerGradient);
    if (!newGradientData.stops || newGradientData.stops.length <= 0) {
      newGradientData.stops = [emptyStop];
    }

    if (index >= 0 && index < newGradientData.stops.length) {
      newGradientData.stops[index].color = getStopColorString(
        data.color,
        data.isWidgetOpacity
      );
      newGradientData.stops[index].at = getStopAtString(data.at);
    }

    const newLayer = structuredClone(selectedLayer);
    newLayer[currentLayerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayer, doSync);
  };

  const deleteGradientStop = (index: number, doSync: boolean = true) => {
    const newGradientData = structuredClone(memoizedThisLayerGradient);
    if (!newGradientData.stops || newGradientData.stops.length <= 2) {
      return;
    }

    if (index < 0 && index >= newGradientData.stops.length) {
      return;
    }

    newGradientData.stops.splice(index, 1);

    const newLayer = structuredClone(selectedLayer);
    newLayer[currentLayerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayer, doSync);
  };

  const appendGradientStop = (
    data: FormattedGradientStopData,
    doSync: boolean = true
  ) => {
    const newGradientData = structuredClone(memoizedThisLayerGradient);
    const newStop: GradientStop = {
      color: getStopColorString(data.color, data.isWidgetOpacity),
      at: getStopAtString(data.at),
    };

    if (!newGradientData.stops || newGradientData.stops.length <= 0) {
      newGradientData.stops = [emptyStop, newStop];
    } else {
      newGradientData.stops.push(newStop);
    }

    const newLayer = structuredClone(selectedLayer);
    newLayer[currentLayerIndex] = newGradientData;

    setGradientStopIndex(newGradientData.stops.length - 1 || 0);
    updateGradientData(selectedGradientCategory, newLayer, doSync);
  };

  const copyCurrentLayer = () => {
    setLayerClipboard(structuredClone(memoizedThisLayerGradient));
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
        setGradientStopIndex,
        currentGradientStop: memoizedCurrentGradientStop,
        formattedCurrentGradientStopData,
        modifyGradientStop,
        deleteGradientStop,
        appendGradientStop,
        updateGradientStopsList,
        copyCurrentLayer,
        layerClipboard,
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
