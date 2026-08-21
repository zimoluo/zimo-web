"use client";

import CommandKeyIcon from "@/components/assets/entries/CommandKeyIcon";
import { usePopUp } from "@/components/contexts/PopUpContext";
import PresetConfigPopUp from "./PresetConfigPopUp";
import { useWindow } from "@/components/contexts/WindowContext";
import PresetConfigWindow from "./PresetConfigWindow";
import { useEffect, useRef } from "react";

const contextKey = "theme-maker-preset-config";

export default function PresetConfigButton() {
  const { appendPopUp, removePopUpByContextKey } = usePopUp();
  const { appendWindow, removeWindowByContextKey } = useWindow();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const openMenu = () => {
    if (window.innerWidth < 768) {
      appendPopUp({
        content: <PresetConfigPopUp />,
        contextKey,
      });
    } else {
      appendWindow({
        content: <PresetConfigWindow />,
        contextKey,
        defaultHeight: 450,
        defaultWidth: 420,
        minHeight: 380,
        minWidth: 360,
        maxHeight: 560,
        maxWidth: 640,
        defaultCenterX:
          (buttonRef.current?.getBoundingClientRect().left ?? 0) +
          (buttonRef.current?.getBoundingClientRect().width ?? 0) / 2,
        defaultCenterY:
          (buttonRef.current?.getBoundingClientRect().top ?? 0) +
          (buttonRef.current?.getBoundingClientRect().height ?? 0) / 2,
        layer: 10,
      });
    }
  };

  useEffect(() => {
    return () => {
      removePopUpByContextKey(contextKey);
      removeWindowByContextKey(contextKey);
    };
  }, []);

  return (
    <button
      className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
      onClick={openMenu}
      ref={buttonRef}
    >
      <CommandKeyIcon
        className="w-full h-auto aspect-square"
        strokeWidth={72}
      />
    </button>
  );
}
