"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { gradientTypeNameMap } from "@/lib/themeMaker/layerHelper";
import CircledEllipsisIcon from "@/components/assets/entries/CircledEllipsisIcon";
import { Fragment, useEffect, useRef, useState } from "react";
import { anglePositionedGradientMode } from "@/lib/colorPaletteParser";
import GradientModeDropdownWrapper from "./GradientModeDropdownWrapper";
import { useGradientData } from "./GradientDataContext";

const availableModes: EditorGradientMode[] = [
  "linear-gradient",
  "radial-gradient",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
];

export default function GradientModePicker() {
  const { updateGradientData } = useSettings();
  const { selectedGradientCategory, currentLayerIndex, selectedLayer } =
    useGradientData();
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedMode = selectedLayer[currentLayerIndex].type;

  const expandMenu = () => {
    if (isExpanded) {
      return;
    }

    setIsExpanded(true);
  };

  const setGradientMode = (newMode: EditorGradientMode) => {
    const gradientData = structuredClone(selectedLayer[currentLayerIndex]);

    if (anglePositionedGradientMode.includes(newMode)) {
      gradientData.angle = gradientData.angle ?? "0deg";
    } else {
      gradientData.posX = gradientData.posX ?? "50%";
      gradientData.posY = gradientData.posY ?? "50%";
      gradientData.sizeX = gradientData.sizeX ?? "20%";
      gradientData.sizeY = gradientData.sizeY ?? "20%";
    }

    gradientData.type = newMode;

    const newGradientLayers = structuredClone(selectedLayer);

    newGradientLayers[currentLayerIndex] = gradientData;

    updateGradientData(selectedGradientCategory, newGradientLayers);

    setIsExpanded(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div
      className="rounded-xl bg-light bg-opacity-80 shadow-lg px-3 py-2 h-10 flex items-center relative cursor-pointer"
      ref={dropdownRef}
      onClick={expandMenu}
    >
      <p className="flex-grow shrink-0">
        {gradientTypeNameMap[selectedMode] ?? "Gradient"}
      </p>
      <button
        className={`${
          isExpanded ? "pointer-events-none" : ""
        } transition-transform duration-300 ease-out hover:scale-110 shrink-0`}
        onClick={expandMenu}
      >
        <CircledEllipsisIcon className="h-5 w-auto aspect-square" />
      </button>
      {isExpanded && (
        <GradientModeDropdownWrapper>
          <div
            className={`absolute z-5 w-full left-0 overflow-hidden rounded-xl cursor-auto shadow-lg top-0 ${
              isExpanded ? "" : "pointer-events-none select-none"
            }`}
            style={{
              maxHeight: isExpanded ? "max-content" : "2.5rem",
              transform: `translate(0%, calc(${
                availableModes.indexOf(selectedMode as EditorGradientMode) * -1
              } * (2.5rem + 1px)))`,
            }}
          >
            <div className="w-full flex-col flex gap-2 px-3 py-2 justify-center items-start bg-light">
              {availableModes.map((mode, index) => {
                return (
                  <Fragment key={index}>
                    {index !== 0 && (
                      <hr className="border-t w-full border-soft border-opacity-90" />
                    )}
                    <button
                      onClick={() => {
                        setGradientMode(mode);
                      }}
                      className="w-full text-left"
                    >
                      {gradientTypeNameMap[mode]}
                    </button>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </GradientModeDropdownWrapper>
      )}
    </div>
  );
}
