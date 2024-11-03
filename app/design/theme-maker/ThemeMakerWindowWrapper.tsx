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
      className={`${isInterpolating ? windowStyle.transition : ""} mt-16 ${
        fullScreenBuffer ? "md:mb-6" : "md:my-18 md:rounded-3xl md:shadow-xl"
      } ${
        fullScreenBuffer ? windowStyle.fullscreen : windowStyle.sizing
      } bg-widget-80 md:bg-widget-60 md:backdrop-blur-2xl md:overflow-hidden`}
    >
      {children}
    </div>
  );
}
