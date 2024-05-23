"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";
import { rgb } from "color-convert";

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
    }
  | undefined
>(undefined);

export function FaviconEditorProvider({ children }: Props) {
  const { currentCustomThemeConfig, updateFaviconConfig } = useSettings();
  const faviconConfig = currentCustomThemeConfig.favicon;

  const [selectedFaviconPartIndex, setSelectedFaviconPartIndex] =
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

  return (
    <FaviconEditorContext.Provider
      value={{
        selectedFaviconPartIndex,
        setSelectedFaviconPartIndex,
        isUnifiedFaviconGradient,
        faviconGradient,
        faviconConfig,
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
