"use client";

import ConfigFavicon from "@/components/assets/displayFavicon/ConfigFavicon";
import { useSettings } from "@/components/contexts/SettingsContext";
import SettingsFlip from "@/components/mainPage/menu/settings/SettingsFlip";
import { ReactNode } from "react";
import { rgb } from "color-convert";
import { useFaviconEditor } from "./FaviconEditorContext";
import RadioButton from "@/components/mainPage/menu/settings/RadioButton";
import { useTheme } from "@/components/contexts/ThemeContext";

const emptyEditor = (
  <div className="w-full flex items-center justify-center pointer-events-none select-none">
    <p className="max-w-full text-lg opacity-50">
      No further configuration needed
    </p>
  </div>
);

export default function FaviconPropertiesAllocator() {
  const { currentCustomThemeConfig, updateFaviconConfig } = useSettings();
  const { themeConfig } = useTheme();
  const {
    selectedFaviconPartIndex,
    setSelectedFaviconPartIndex,
    isUnifiedFaviconGradient,
    faviconConfig,
    faviconGradient,
  } = useFaviconEditor();

  const isBackdropDefault = !!faviconConfig.backdropGradient;

  const toggleOneAndThreeGradients = () => {
    const newGradientConfig =
      faviconGradient.length === 1
        ? (Array.from({ length: 3 }, () =>
            structuredClone(faviconGradient[0])
          ) as [
            FaviconGradientStopsConfig,
            FaviconGradientStopsConfig,
            FaviconGradientStopsConfig
          ])
        : ([structuredClone(faviconGradient[selectedFaviconPartIndex])] as [
            FaviconGradientStopsConfig
          ]);

    updateFaviconConfig({ gradient: newGradientConfig });
  };

  // these parts are unused for now.
  const toggleBackdropMode = () => {
    if (isBackdropDefault) {
      updateFaviconConfig({ backdropGradient: undefined });
    } else {
      updateFaviconConfig({
        backdropGradient: currentCustomThemeConfig.palette.page,
      });
    }
  };

  const backdropCustomToggle = (
    <div className="flex items-center justify-center w-full gap-4">
      <p>Customize backdrop gradient</p>
      <SettingsFlip
        state={isBackdropDefault}
        onClick={toggleBackdropMode}
        className="h-8"
        defaultDimension={false}
      />
    </div>
  );

  const propertiesEditorMap: Record<FaviconMode, ReactNode> = {
    backdrop: emptyEditor,
    custom: emptyEditor,
    outline: emptyEditor,
    overall: emptyEditor,
    separate: (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-2">
          <p>Apply for all</p>
          <SettingsFlip
            state={isUnifiedFaviconGradient}
            onClick={toggleOneAndThreeGradients}
            className="h-6"
            defaultDimension={false}
          />
        </div>
        <div
          className={`grid grid-cols-3 items-center justify-center w-full gap-2 transition-opacity duration-300 ease-out ${
            isUnifiedFaviconGradient
              ? "opacity-50 pointer-events-none"
              : "opacity-100"
          }`}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-3 cursor-pointer"
              onClick={() => setSelectedFaviconPartIndex(index)}
            >
              <ConfigFavicon
                customThemeConfig={{
                  ...themeConfig,
                  favicon: {
                    mode: "separate",
                    gradient: Array.from({ length: 3 }).map(
                      (_, innerIndex) => ({
                        stops: [
                          {
                            color: `#${rgb.hex(
                              themeConfig.palette[
                                innerIndex === index ? "middle" : "pastel"
                              ]
                            )}`,
                            offset: 0,
                          },
                          {
                            color: `#${rgb.hex(
                              themeConfig.palette[
                                innerIndex === index ? "middle" : "pastel"
                              ]
                            )}`,
                            offset: 1,
                          },
                        ],
                      })
                    ) as [
                      FaviconGradientStopsConfig,
                      FaviconGradientStopsConfig,
                      FaviconGradientStopsConfig
                    ],
                  },
                }}
                className="h-12 w-auto aspect-square"
              />
              <RadioButton
                state={selectedFaviconPartIndex === index}
                onClick={() => setSelectedFaviconPartIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return propertiesEditorMap[faviconConfig.mode];
}
