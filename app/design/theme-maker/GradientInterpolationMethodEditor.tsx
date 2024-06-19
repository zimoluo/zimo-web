"use client";

import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import editorStyle from "./mode-data-editor.module.css";
import { useGradientData } from "./GradientDataContext";
import { ChangeEvent } from "react";
import { polarColorSpaces } from "@/lib/colorPaletteParser";

export default function GradientInterpolationMethodEditor() {
  const { selectedLayer, updateColorInterpolationData } = useGradientData();

  const changeColorSpace = (event: ChangeEvent<HTMLSelectElement>) => {
    const newKeyword = event.target.value as GradientColorSpace;
    if (newKeyword === selectedLayer.colorInterpolation?.colorSpace) {
      return;
    }

    updateColorInterpolationData("colorSpace", newKeyword);
  };

  const changeHueInterpolation = (event: ChangeEvent<HTMLSelectElement>) => {
    const newKeyword = event.target.value as HueInterpolationMethod;
    if (
      newKeyword === selectedLayer.colorInterpolation?.hueInterpolationMethod
    ) {
      return;
    }

    updateColorInterpolationData("hueInterpolationMethod", newKeyword);
  };

  const colorSpace: GradientColorSpace | "default" =
    selectedLayer.colorInterpolation?.colorSpace ?? "default";

  const isPolarSpace = polarColorSpaces.includes(colorSpace as any);

  return (
    <div className="rounded-xl bg-light bg-opacity-80 shadow-lg p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p>Color space</p>
        <div className="h-7 flex-grow relative">
          <select
            value={colorSpace}
            onChange={changeColorSpace}
            className={`bg-none border-none appearance-none border-0 bg-pastel bg-opacity-80 shadow-sm flex-grow w-full h-full rounded-md pl-1 pr-4 py-0.5 text-start ${editorStyle.input} relative`}
          >
            <option value="default">Default</option>
            <option value="srgb">SRGB</option>
            <option value="display-p3">Display P3</option>
            <option value="oklab">OKLAB</option>
            <option value="lch">LCH</option>
          </select>
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-auto aspect-square pointer-events-none select-none"
            aria-hidden="true"
          >
            <UpDownSwitchIcon className="rotate-180" />
          </div>
        </div>
      </div>
      <div
        className={`flex items-center gap-2 transition-opacity duration-300 ease-out ${
          isPolarSpace
            ? "opacity-100"
            : "opacity-50 pointer-events-none select-none"
        }`}
      >
        <p>Hue interpolation method</p>
        <div className="h-7 flex-grow relative">
          <select
            value={
              selectedLayer.colorInterpolation?.hueInterpolationMethod ??
              "shorter"
            }
            disabled={!isPolarSpace}
            onChange={changeHueInterpolation}
            className={`bg-none border-none appearance-none border-0 bg-pastel bg-opacity-80 shadow-sm flex-grow w-full h-full rounded-md pl-1 pr-4 py-0.5 text-start ${editorStyle.input} relative`}
          >
            <option value="shorter">Shorter hue</option>
            <option value="longer">Longer hue</option>
            <option value="increasing">Increasing hue</option>
            <option value="decreasing">Decreasing hue</option>
          </select>
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-auto aspect-square pointer-events-none select-none"
            aria-hidden="true"
          >
            <UpDownSwitchIcon className="rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );
}
