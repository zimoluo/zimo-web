"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import EditorDropdownMenu from "./EditorDropdownMenu";

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
  const faviconMode = currentCustomThemeConfig.favicon.mode;
  const setNewMode = (newMode: FaviconMode) => {
    updateFaviconConfig({ mode: newMode });
  };

  return (
    <EditorDropdownMenu
      setValue={setNewMode}
      currentValue={faviconMode}
      namesList={faviconNamesList}
      optionsList={faviconModesList}
    />
  );
}
