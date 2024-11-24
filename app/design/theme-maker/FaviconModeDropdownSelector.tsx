"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import EditorDropdownMenu from "./EditorDropdownMenu";
import { useFaviconEditor } from "./FaviconEditorContext";
import { rgb } from "color-convert";

const faviconModesList: FaviconMode[] = [
  "backdrop",
  "separate",
  "overall",
  "outline",
];

const faviconNamesList: string[] = [
  "Backdrop",
  "Separate gradient",
  "Overall gradient",
  "Outline",
];

export default function FaviconModeDropdownSelector() {
  const { currentCustomThemeConfig, updateFaviconConfig } = useSettings();
  const { faviconConfig, setSelectedFaviconPartIndex } = useFaviconEditor();
  const faviconMode = currentCustomThemeConfig.favicon.mode;
  const setNewMode = (newMode: FaviconMode) => {
    let newConfig: Partial<FaviconConfig> = {};

    if (!faviconConfig.gradient) {
      const generatedGradientConfig: FaviconGradientConfig = [
        {
          stops: [
            {
              color: `#${rgb.hex(currentCustomThemeConfig.palette.light)}`,
              offset: 0,
            },
            {
              color: `#${rgb.hex(currentCustomThemeConfig.palette.saturated)}`,
              offset: 1,
            },
          ],
        },
      ];

      newConfig = {
        ...newConfig,
        gradient: generatedGradientConfig,
        ...faviconConfig,
      };
    }

    if (newMode === "overall") {
      setSelectedFaviconPartIndex(0);
    }

    updateFaviconConfig({
      ...newConfig,
      mode: newMode,
    });
  };

  return (
    <EditorDropdownMenu
      setValue={setNewMode}
      currentValue={faviconMode}
      namesList={faviconNamesList}
      optionsList={faviconModesList}
      fallbackName="Custom"
    />
  );
}
