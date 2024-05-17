"use client";

import { RefObject, useCallback, useMemo } from "react";
import { useGradientData } from "./GradientDataContext";
import stopsStyles from "./stops.module.css";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import { rgb } from "color-convert";
import { getStopColorString } from "@/lib/themeMaker/layerHelper";
import { useDragAndTouch } from "@/lib/helperHooks";

interface Props {
  barRef: RefObject<HTMLDivElement> | null;
  stopIndex: number;
}

export default function StopsEditorPin({ barRef, stopIndex }: Props) {
  const {
    gradientStops,
    setGradientStopIndex,
    modifyGradientStop,
    generateFormattedGradientStop,
    deleteGradientStop,
    gradientStopIndex,
  } = useGradientData();
  const thisStop = gradientStops[stopIndex];
  const isSelected = stopIndex === gradientStopIndex;

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!barRef || !barRef.current) {
      return;
    }

    const { clientX } = "clientX" in e ? e : e.touches[0];

    const rect = barRef.current.getBoundingClientRect();
    const newOffset = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );

    modifyGradientStop(stopIndex, {
      ...generateFormattedGradientStop(gradientStops[stopIndex]),
      at: newOffset,
    });
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    deleteGradientStop(stopIndex);
  };

  const pinDotColor: string = useMemo(() => {
    const formattedThisStop = generateFormattedGradientStop(thisStop);
    if (formattedThisStop.color[3] < 0.01) {
      return "rgb(var(--color-saturated))";
    }

    const rgbColor = formattedThisStop.color.slice(0, 3) as ColorTriplet;
    const { index, shadeMap } = generateShadeMap(`#${rgb.hex(rgbColor)}`);

    if (index > 1) {
      return shadeMap[0];
    }

    return shadeMap[5];
  }, [thisStop]);

  const unbiasedColor: string = useMemo(() => {
    const { color, isWidgetOpacity } = generateFormattedGradientStop(thisStop);
    color[3] = isWidgetOpacity ? 1 : color[3];

    return getStopColorString(color, false);
  }, [thisStop]);

  const { handleStartDragging, handleStartTouching } = useDragAndTouch({
    onMove: handleMove,
    dependencies: [barRef, stopIndex, gradientStops],
    onStart: () => setGradientStopIndex(stopIndex),
  });

  return (
    <div
      className={`w-4 h-4 border-saturated absolute -translate-x-1/2 shadow-md touch-none rounded-b-sm ${stopsStyles.pin}`}
      style={
        {
          left: thisStop.at,
          "--pin-color": unbiasedColor,
          backgroundColor: "var(--pin-color)",
          borderColor: "var(--pin-color)",
        } as Record<string, string>
      }
      draggable={false}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
      onContextMenu={handleRightClick}
    >
      <div
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-auto aspect-square ${
          stopsStyles.pinDot
        } ${isSelected ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundColor: pinDotColor }}
      />
    </div>
  );
}
