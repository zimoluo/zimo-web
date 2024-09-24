"use client";

import { useWindowAction } from "@/components/contexts/WindowActionContext";
import PresetConfigLayout from "./PresetConfigLayout";
import { useEffect } from "react";

export default function PresetConfigWindow() {
  const { closeWindow, isActiveWindow } = useWindowAction();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (!isActiveWindow) {
        return;
      }

      if (e.key === "Escape") {
        closeWindow();
      }
    };

    window.addEventListener("keydown", handleEscape, {
      passive: true,
    });

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isActiveWindow, closeWindow]);

  return (
    <PresetConfigLayout
      close={closeWindow}
      className="w-full h-full bg-light bg-opacity-80"
    />
  );
}
