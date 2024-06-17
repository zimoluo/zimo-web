"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { modInRange } from "@/lib/generalHelper";
import {
  emptyLayer,
  emptyStop,
  emptyStops,
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
      layerIndex: number;
      setLayerIndex: React.Dispatch<React.SetStateAction<number>>;
      currentLayers: ColorGradient[];
      selectedLayer: ColorGradient;
      updateGradientProperty: (
        property: keyof (RadialGradientData &
          LinearGradientData &
          CircleRadialGradientAdditionalData),
        newValue: number | boolean | RadialGradientSizeKeyword,
        doSync?: boolean
      ) => void;
      gradientStops: GradientStop[];
      gradientStopIndex: number;
      setGradientStopIndex: React.Dispatch<React.SetStateAction<number>>;
      currentGradientStop: GradientStop;
      modifyGradientStop: (
        data: Partial<GradientStop>,
        index?: number,
        doSync?: boolean
      ) => void;
      deleteGradientStop: (index?: number, doSync?: boolean) => void;
      appendGradientStop: (data: GradientStop, doSync?: boolean) => void;
      updateGradientStopsDirectly: (
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
  const [layerIndex, setLayerIndex] = useState<number>(0);
  const [gradientStopIndex, setGradientStopIndex] = useState<number>(0);
  const { currentCustomThemeConfig, updateGradientData } = useSettings();
  const currentLayers =
    currentCustomThemeConfig.palette[selectedGradientCategory] ?? [];
  const [layerClipboard, setLayerClipboard] = useState<ColorGradient | null>(
    null
  );

  const memoizedLayerIndex = useMemo(() => {
    if (currentLayers.length <= 0) {
      return 0;
    }

    let safeIndex = layerIndex;
    if (layerIndex >= currentLayers.length) {
      safeIndex = currentLayers.length - 1;
    }

    if (layerIndex < 0) {
      safeIndex = 0;
    }

    setLayerIndex(safeIndex);

    return safeIndex;
  }, [currentLayers, layerIndex]);

  const memoizedSelectedLayer: ColorGradient = useMemo(() => {
    if (currentLayers.length <= 0) {
      // Empty placeholder that should be avoided in actual use case
      return emptyLayer;
    }

    return currentLayers[memoizedLayerIndex];
  }, [currentLayers, memoizedLayerIndex]);

  const updateGradientProperty = (
    property: keyof (RadialGradientData &
      LinearGradientData &
      CircleRadialGradientAdditionalData),
    newValue: number | RadialGradientSizeKeyword | boolean,
    doSync: boolean = true
  ) => {
    const newGradientData = structuredClone(memoizedSelectedLayer);
    initializeGradientDataProperties(newGradientData);

    let safeNewValue: any = newValue;

    if (property.startsWith("size") && property !== "sizeKeyword") {
      safeNewValue = Math.abs(safeNewValue);
    }

    if (property === "angle") {
      safeNewValue = modInRange(safeNewValue || 0, 360);
    }

    newGradientData[property] = safeNewValue;

    const newLayer = structuredClone(currentLayers);
    newLayer[memoizedLayerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayer, doSync);
  };

  const gradientStops: GradientStop[] = useMemo(() => {
    const { stops } = memoizedSelectedLayer;

    if (!stops || stops.length <= 0) {
      return emptyStops;
    }

    if (stops.length === 1) {
      return [...stops, emptyStop];
    }

    return stops;
  }, [memoizedSelectedLayer, emptyStops, emptyStop]);

  const memoizedGradientStopIndex: number = useMemo(() => {
    if (gradientStops.length <= 0) {
      return 0;
    }

    let safeIndex = gradientStopIndex;
    if (gradientStopIndex >= gradientStops.length) {
      safeIndex = gradientStops.length - 1;
    }

    if (safeIndex < 0) {
      safeIndex = 0;
    }

    setGradientStopIndex(safeIndex);

    return safeIndex;
  }, [gradientStops, gradientStopIndex]);

  const currentGradientStop: GradientStop =
    gradientStops[memoizedGradientStopIndex];

  const updateGradientStopsDirectly = (
    newGradientStops: GradientStop[],
    doSync: boolean = true
  ) => {
    const newGradientData = structuredClone(memoizedSelectedLayer);
    newGradientData.stops = newGradientStops;

    if (newGradientData.stops.length < 2) {
      newGradientData.stops = emptyStops;
    }

    const newLayers = structuredClone(currentLayers);
    newLayers[memoizedLayerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayers, doSync);
  };

  const modifyGradientStop = (
    data: Partial<GradientStop>,
    index: number = memoizedGradientStopIndex,
    doSync: boolean = true
  ) => {
    const stopsData = structuredClone(gradientStops);

    if (index >= 0 && index < stopsData.length) {
      stopsData[index] = { ...stopsData[index], ...data };
    }

    const layer = structuredClone(memoizedSelectedLayer);
    layer.stops = stopsData;

    const newLayers = structuredClone(currentLayers);
    newLayers[memoizedLayerIndex] = layer;

    updateGradientData(selectedGradientCategory, newLayers, doSync);
  };

  const deleteGradientStop = (
    index: number = memoizedGradientStopIndex,
    doSync: boolean = true
  ) => {
    const stops = structuredClone(gradientStops);

    if (stops.length <= 2) {
      return;
    }

    if (index < 0 && index >= stops.length) {
      return;
    }

    stops.splice(index, 1);

    const layer = structuredClone(memoizedSelectedLayer);
    layer.stops = stops;

    const newLayers = structuredClone(currentLayers);
    newLayers[memoizedLayerIndex] = layer;

    if (index < memoizedGradientStopIndex) {
      setGradientStopIndex(
        Math.max(Math.min(memoizedGradientStopIndex - 1, stops.length - 1), 0)
      );
    }

    updateGradientData(selectedGradientCategory, newLayers, doSync);
  };

  const appendGradientStop = (data: GradientStop, doSync: boolean = true) => {
    const stops = structuredClone(gradientStops);

    stops.push(data);

    const layer = structuredClone(memoizedSelectedLayer);
    layer.stops = stops;

    const newLayers = structuredClone(currentLayers);
    newLayers[memoizedLayerIndex] = layer;

    setGradientStopIndex(stops.length - 1 || 0);
    updateGradientData(selectedGradientCategory, newLayers, doSync);
  };

  const copyCurrentLayer = () => {
    setLayerClipboard(structuredClone(memoizedSelectedLayer));
  };

  return (
    <GradientDataContext.Provider
      value={{
        selectedGradientCategory,
        setSelectedGradientCategory,
        layerIndex: memoizedLayerIndex,
        setLayerIndex,
        currentLayers,
        selectedLayer: memoizedSelectedLayer,
        updateGradientProperty,
        gradientStops,
        gradientStopIndex: memoizedGradientStopIndex,
        setGradientStopIndex,
        currentGradientStop,
        modifyGradientStop,
        deleteGradientStop,
        appendGradientStop,
        updateGradientStopsDirectly,
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
