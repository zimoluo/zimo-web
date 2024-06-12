"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";
import { emptyFaviconStops } from "@/lib/themeMaker/faviconHelper";

interface Props {
  children: ReactNode;
}

const FaviconEditorContext = createContext<
  | {
      faviconConfig: FaviconConfig;
      selectedFaviconPartIndex: number;
      setSelectedFaviconPartIndex: React.Dispatch<React.SetStateAction<number>>;
      isUnifiedFaviconGradient: boolean;
      faviconGradientStopsIdentifierIndex: number;
      faviconGradient: FaviconGradientConfig;
      faviconGradientStopsIndex: number;
      setFaviconGradientStopIndex: React.Dispatch<React.SetStateAction<number>>;
      selectedGradientStops: FaviconGradientStop[];
      selectedAngle: number;
      currentFaviconGradientStop: FaviconGradientStop;
      modifyFaviconGradientStop: (
        data: Partial<FaviconGradientStop>,
        index?: number,
        doSync?: boolean
      ) => void;
      deleteFaviconGradientStop: (index?: number, doSync?: boolean) => void;
      appendFaviconGradientStop: (
        data: FaviconGradientStop,
        doSync?: boolean
      ) => void;
      updateFaviconGradientStopsDirectly: (
        newGradientStops: FaviconGradientStop[],
        doSync?: boolean
      ) => void;
    }
  | undefined
>(undefined);

export function FaviconEditorProvider({ children }: Props) {
  const { currentCustomThemeConfig, updateFaviconConfig } = useSettings();
  const faviconConfig = currentCustomThemeConfig.favicon;

  const [selectedFaviconPartIndex, setSelectedFaviconPartIndex] =
    useState<number>(0);
  const [faviconGradientStopIndex, setFaviconGradientStopIndex] =
    useState<number>(0);

  const faviconGradient: FaviconGradientConfig = useMemo(() => {
    if (!faviconConfig.gradient) {
      return [{ stops: emptyFaviconStops }];
    }

    return faviconConfig.gradient;
  }, [faviconConfig, currentCustomThemeConfig]);

  const isUnifiedFaviconGradient =
    faviconConfig.gradient?.length === 1 ?? false;

  const faviconGradientStopsIdentifierIndex = isUnifiedFaviconGradient
    ? 0
    : selectedFaviconPartIndex;

  const selectedAngle =
    faviconGradient[faviconGradientStopsIdentifierIndex]?.angle || 0;

  const selectedGradientStops =
    faviconGradient[faviconGradientStopsIdentifierIndex]?.stops ||
    emptyFaviconStops;

  const memoizedFaviconGradientStopIndex: number = useMemo(() => {
    if (selectedGradientStops.length <= 0) {
      return 0;
    }

    let safeIndex = faviconGradientStopIndex;
    if (faviconGradientStopIndex >= selectedGradientStops.length) {
      safeIndex = selectedGradientStops.length - 1;
    }

    if (safeIndex < 0) {
      safeIndex = 0;
    }

    setFaviconGradientStopIndex(safeIndex);

    return safeIndex;
  }, [selectedGradientStops, faviconGradientStopIndex]);

  const currentFaviconGradientStop =
    selectedGradientStops[memoizedFaviconGradientStopIndex];

  const appendFaviconGradientStop = (
    newStop: FaviconGradientStop,
    doSync: boolean = true
  ) => {
    const modifiedFaviconGradient = structuredClone(faviconGradient);
    modifiedFaviconGradient[faviconGradientStopsIdentifierIndex].stops.push(
      newStop
    );

    setFaviconGradientStopIndex(
      modifiedFaviconGradient[faviconGradientStopsIdentifierIndex].stops
        .length - 1
    );

    updateFaviconConfig(
      {
        gradient: modifiedFaviconGradient,
      },
      doSync
    );
  };

  const modifyFaviconGradientStop = (
    data: Partial<FaviconGradientStop>,
    index: number = memoizedFaviconGradientStopIndex,
    doSync: boolean = true
  ) => {
    if (index < 0 || index >= selectedGradientStops.length) {
      return;
    }

    const modifiedFaviconGradient = structuredClone(faviconGradient);
    modifiedFaviconGradient[faviconGradientStopsIdentifierIndex].stops[index] =
      { ...currentFaviconGradientStop, ...data };

    updateFaviconConfig(
      {
        gradient: modifiedFaviconGradient,
      },
      doSync
    );
  };

  const deleteFaviconGradientStop = (
    index: number = memoizedFaviconGradientStopIndex,
    doSync: boolean = true
  ) => {
    if (index < 0 || index >= selectedGradientStops.length) {
      return;
    }

    const modifiedFaviconGradient = structuredClone(faviconGradient);
    modifiedFaviconGradient[faviconGradientStopsIdentifierIndex].stops.splice(
      index,
      1
    );

    if (index < memoizedFaviconGradientStopIndex) {
      setFaviconGradientStopIndex(
        Math.max(
          Math.min(
            memoizedFaviconGradientStopIndex - 1,
            modifiedFaviconGradient[faviconGradientStopsIdentifierIndex].stops
              .length - 1
          ),
          0
        )
      );
    }

    updateFaviconConfig(
      {
        gradient: modifiedFaviconGradient,
      },
      doSync
    );
  };

  const updateFaviconGradientStopsDirectly = (
    newStops: FaviconGradientStop[],
    doSync: boolean = true
  ) => {
    let stopsToApply: FaviconGradientStop[] = newStops;
    if (newStops.length < 2) {
      stopsToApply = emptyFaviconStops;
    }

    const modifiedFaviconGradient = structuredClone(faviconGradient);
    modifiedFaviconGradient[faviconGradientStopsIdentifierIndex].stops =
      stopsToApply;

    updateFaviconConfig(
      {
        gradient: modifiedFaviconGradient,
      },
      doSync
    );
  };

  return (
    <FaviconEditorContext.Provider
      value={{
        selectedFaviconPartIndex,
        setSelectedFaviconPartIndex,
        isUnifiedFaviconGradient,
        faviconGradientStopsIdentifierIndex,
        faviconGradient,
        faviconConfig,
        currentFaviconGradientStop,
        selectedGradientStops,
        selectedAngle,
        faviconGradientStopsIndex: memoizedFaviconGradientStopIndex,
        setFaviconGradientStopIndex,
        updateFaviconGradientStopsDirectly,
        appendFaviconGradientStop,
        modifyFaviconGradientStop,
        deleteFaviconGradientStop,
      }}
    >
      {children}
    </FaviconEditorContext.Provider>
  );
}

export const useFaviconEditor = () => {
  const context = useContext(FaviconEditorContext);
  if (context === undefined) {
    throw new Error(
      "useFaviconEditor must be used within a FaviconEditorProvider"
    );
  }
  return context;
};
