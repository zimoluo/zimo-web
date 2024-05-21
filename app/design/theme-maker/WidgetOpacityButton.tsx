"use client";

import WidgetOpacityIcon from "@/components/assets/entries/WidgetOpacityIcon";
import { useGradientData } from "./GradientDataContext";
import selectorStyle from "./editor-mode-selector.module.css";

export default function WidgetOpacityButton() {
  const { currentGradientStop, modifyGradientStop, gradientStopIndex } =
    useGradientData();

  const { isWidgetOpacity } = currentGradientStop;

  return (
    <button
      className={`relative transition-opacity duration-300 ease-in-out ${
        isWidgetOpacity ? "opacity-100" : "opacity-50"
      }`}
      onClick={() => {
        modifyGradientStop({
          isWidgetOpacity: !(isWidgetOpacity ?? false),
        });
      }}
    >
      <div
        className={`w-0 h-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ease-in-out ${
          isWidgetOpacity ? "opacity-100" : "opacity-0"
        } ${selectorStyle.glow}`}
      />
      <WidgetOpacityIcon className="w-6 h-auto aspect-square relative transition-transform duration-150 ease-out hover:scale-110" />
    </button>
  );
}
