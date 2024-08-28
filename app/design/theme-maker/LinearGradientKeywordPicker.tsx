"use client";

import { ChangeEvent, useMemo } from "react";
import { useGradientData } from "./GradientDataContext";
import { useSettings } from "@/components/contexts/SettingsContext";
import { initializeGradientDataProperties } from "@/lib/themeMaker/layerHelper";
import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import editorStyle from "./mode-data-editor.module.css";

export default function LinearGradientKeywordPicker() {
  const { selectedLayer, currentLayers, layerIndex, selectedGradientCategory } =
    useGradientData();
  const { updateGradientData } = useSettings();
  const linearHorizontalOrientation =
    selectedLayer.linearHorizontalOrientation ?? "left";
  const linearVerticalOrientation =
    selectedLayer.linearVerticalOrientation ?? "top";

  const rotateAngle: number = useMemo(() => {
    const angleMap = {
      left: { top: -135, bottom: 135 },
      right: { top: -45, bottom: 45 },
    };
    return angleMap[linearHorizontalOrientation][linearVerticalOrientation];
  }, [linearHorizontalOrientation, linearVerticalOrientation]);

  const modifyOrientation = (
    linearHorizontalOrientation?: LinearGradientHorizontal,
    linearVerticalOrientation?: LinearGradientVertical
  ) => {
    if (
      (linearHorizontalOrientation &&
        linearHorizontalOrientation ===
          selectedLayer.linearHorizontalOrientation &&
        (!linearVerticalOrientation ||
          (linearVerticalOrientation &&
            linearVerticalOrientation ===
              selectedLayer.linearVerticalOrientation))) ||
      (linearVerticalOrientation &&
        linearVerticalOrientation === selectedLayer.linearVerticalOrientation &&
        !linearHorizontalOrientation) ||
      (!linearHorizontalOrientation && !linearVerticalOrientation)
    ) {
      return;
    }

    const newGradientData = structuredClone(selectedLayer);
    initializeGradientDataProperties(newGradientData);

    if (linearHorizontalOrientation) {
      newGradientData.linearHorizontalOrientation = linearHorizontalOrientation;
    }
    if (linearVerticalOrientation) {
      newGradientData.linearVerticalOrientation = linearVerticalOrientation;
    }

    const newLayer = structuredClone(currentLayers);
    newLayer[layerIndex] = newGradientData;

    updateGradientData(selectedGradientCategory, newLayer);
  };

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newOrientation = event.target.value as RadialGradientSizeKeyword;

    modifyOrientation(
      ["left", "right"].includes(newOrientation)
        ? (newOrientation as LinearGradientHorizontal)
        : undefined,
      ["top", "bottom"].includes(newOrientation)
        ? (newOrientation as LinearGradientVertical)
        : undefined
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full h-full flex flex-col items-center justify-end gap-4">
        <p className="text-center">Orientation</p>
        <div className="w-auto h-1/2 aspect-square bg-pastel bg-opacity-80 shadow-sm rounded-lg relative flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
            <div
              className="w-2/3 h-auto flex transition-transform duration-300"
              style={{
                transitionTimingFunction:
                  "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                transform: `rotate(${rotateAngle}deg)`,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 1031 561"
                className="w-full h-auto"
                style={{ transform: "translateX(6%)" }}
              >
                <path
                  className="fill-primary"
                  fillOpacity={0.95}
                  fillRule="evenodd"
                  d="m802.445 0 228.325 280.492L802.443 561H593.857l228.298-280.507L593.857 0z"
                  clipRule="evenodd"
                />
                <path
                  className="fill-primary"
                  fillOpacity={0.8}
                  d="M503.255 0H393.949l228.31 280.493L393.949 561h109.306l228.297-280.507z"
                />
                <path
                  className="fill-primary"
                  fillOpacity={0.6}
                  d="M305.646 0H196.353l228.311 280.493L196.353 561h109.293l228.311-280.507z"
                />
                <path
                  className="fill-primary"
                  fillOpacity={0.4}
                  d="M109.293 0H0l228.297 280.493L0 561h109.293L337.59 280.493z"
                />
              </svg>
            </div>
          </div>
          <div className="relative w-full h-full grid grid-rows-2 grid-cols-2">
            {[
              { side: "left", position: "top" },
              { side: "right", position: "top" },
              { side: "left", position: "bottom" },
              { side: "right", position: "bottom" },
            ].map(({ side, position }) => (
              <button
                key={`${side}-${position}`}
                className="opacity-0 w-full h-full bg-transparent bg-none border-none"
                onClick={() =>
                  modifyOrientation(
                    side as LinearGradientHorizontal,
                    position as LinearGradientVertical
                  )
                }
              />
            ))}
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          <div className="w-full relative">
            <select
              value={linearHorizontalOrientation}
              onChange={handleDropdownChange}
              className={`bg-none border-none appearance-none border-0 bg-pastel bg-opacity-80 shadow-sm flex-grow w-full h-full rounded-md pl-1 pr-4 py-0.5 text-start ${editorStyle.input} relative`}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
            <div
              className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-auto aspect-square pointer-events-none select-none"
              aria-hidden="true"
            >
              <UpDownSwitchIcon className="rotate-180" />
            </div>
          </div>
          <div className="w-full relative">
            <select
              value={linearVerticalOrientation}
              onChange={handleDropdownChange}
              className={`bg-none border-none appearance-none border-0 bg-pastel bg-opacity-80 shadow-sm flex-grow w-full h-full rounded-md pl-1 pr-4 py-0.5 text-start ${editorStyle.input} relative`}
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
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
    </div>
  );
}
