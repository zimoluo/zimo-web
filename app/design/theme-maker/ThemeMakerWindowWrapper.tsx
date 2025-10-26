"use client";

import { ReactNode, useEffect, useState } from "react";
import windowStyle from "./window.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";

interface Props {
  children?: ReactNode;
}

export default function ThemeMakerWindowWrapper({ children }: Props) {
  const { settings } = useSettings();
  const [isInterpolating, setIsInterpolating] = useState(false);
  const [fullScreenBuffer, setFullScreenBuffer] = useState(false);

  const isFullscreen = settings.expandThemeMakerWindow;

  useEffect(() => {
    setIsInterpolating(true);
    setFullScreenBuffer(isFullscreen);
    setTimeout(() => {
      setIsInterpolating(false);
    }, 300);
  }, [isFullscreen]);

  return (
    <div
      className={`${
        isInterpolating ? windowStyle.transition : ""
      } mt-[74px] sm:mt-[78px] mb-4 rounded-b-[2.75rem] ${
        fullScreenBuffer
          ? "md:mb-4 md:rounded-none"
          : "md:mt-[78px] md:mb-[78px] md:rounded-[2rem] md:shadow-xl md:outline md:outline-1 md:outline-highlight-light/15"
      } ${
        fullScreenBuffer ? windowStyle.fullscreen : windowStyle.sizing
      } bg-widget-80 md:bg-widget-60 md:backdrop-blur-reading md:overflow-hidden`}
    >
      {children}
    </div>
  );
}
