"use client";

import CommandKeyIcon from "@/components/assets/entries/CommandKeyIcon";
import { usePopUp } from "@/components/contexts/PopUpContext";
import PresetConfigPopUp from "./PresetConfigPopUp";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useWindow } from "@/components/contexts/WindowContext";
import PresetConfigWindow from "./PresetConfigWindow";
import { useEffect, useRef } from "react";

const contextKey = "theme-maker-preset-config";

export default function PresetConfigButton() {
  const { appendPopUp } = usePopUp();
  const { appendWindow } = useWindow();
  const { settings } = useSettings();

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const openMenu = () => {
    if (window.innerWidth < 768 || settings.disableWindows) {
      appendPopUp({
        content: <PresetConfigPopUp />,
        contextKey,
        darkOpacity: 0.25,
      });
    } else {
      appendWindow({
        content: <PresetConfigWindow />,
        contextKey,
        defaultHeight: 450,
        defaultWidth: 420,
        minHeight: 360,
        minWidth: 360,
        maxHeight: 500,
        maxWidth: 500,
      });
    }
  };

  return (
    <button
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
      onClick={openMenu}
      ref={buttonRef}
    >
      <CommandKeyIcon className="w-full h-auto aspect-square" />
    </button>
  );
}
