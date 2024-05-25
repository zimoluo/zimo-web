"use client";

import shadeStyle from "./editor-shade.module.css";
import {
  generateShadeMap,
  isShadeMapRoughlyTheSame,
} from "@/lib/themeMaker/colorHelper";
import { useEffect, useState } from "react";
import { useColorPanel } from "./ColorPanelContext";

export default function ColorShadePicker() {
  const { colorValue, updateColor } = useColorPanel().shadePickerConfig;

  const { index: closestIndex, shadeMap } = generateShadeMap(colorValue, 10);

  const [storedShadeMap, setStoredShadeMap] = useState<HexColor[]>(shadeMap);

  useEffect(() => {
    const { shadeMap: newShadeMap } = generateShadeMap(colorValue, 10);

    if (!isShadeMapRoughlyTheSame(storedShadeMap, newShadeMap)) {
      setStoredShadeMap(newShadeMap);
    }
  }, [colorValue, storedShadeMap]);

  return (
    <div
      className={`${shadeStyle.grid} w-full h-full rounded-xl overflow-hidden`}
    >
      {storedShadeMap.map((hexColor, index) => {
        return (
          <button
            key={index}
            style={{ backgroundColor: hexColor }}
            className="relative"
            onClick={() => {
              if (index === closestIndex) {
                return;
              }

              updateColor(hexColor);
            }}
          >
            <div
              className={`absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-1/3 w-auto aspect-square rounded-full ${
                index === closestIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundColor:
                  index < storedShadeMap.length / 2
                    ? storedShadeMap[storedShadeMap.length - 3]
                    : storedShadeMap[0],
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
