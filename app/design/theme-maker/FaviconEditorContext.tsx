"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";
import { rgb } from "color-convert";
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
      faviconGradient: FaviconGradientConfig;
      faviconGradientStopsIndex: number;
      setFaviconGradientStopIndex: React.Dispatch<React.SetStateAction<number>>;
      selectedGradientStops: FaviconGradientStop[];
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
      const generatedStops: [FaviconGradientStop[]] = [
        [
          {
            color: `#${rgb.hex(currentCustomThemeConfig.palette.light)}`,
            offset: 0,
          },
          {
            color: `#${rgb.hex(currentCustomThemeConfig.palette.middle)}`,
            offset: 1,
          },
        ],
      ];

      updateFaviconConfig({
        gradient: {
          stops: generatedStops,
        },
        ...faviconConfig,
      });

      return {
        stops: generatedStops,
      };
    }

    return faviconConfig.gradient;
  }, [faviconConfig, currentCustomThemeConfig]);

  const isUnifiedFaviconGradient =
    faviconConfig.gradient?.stops.length === 1 ?? false;

  const faviconGradientStopsIdentifierIndex = isUnifiedFaviconGradient
    ? 0
    : selectedFaviconPartIndex;

  const selectedGradientStops =
    faviconGradient.stops[faviconGradientStopsIdentifierIndex];

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
    modifiedFaviconGradient.stops[faviconGradientStopsIdentifierIndex].push(
      newStop
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
    modifiedFaviconGradient.stops[faviconGradientStopsIdentifierIndex][index] =
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
    modifiedFaviconGradient.stops[faviconGradientStopsIdentifierIndex].splice(
      index,
      1
    );

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
    modifiedFaviconGradient.stops[faviconGradientStopsIdentifierIndex] =
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
        faviconGradient,
        faviconConfig,
        currentFaviconGradientStop,
        selectedGradientStops,
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