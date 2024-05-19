"use client";

import { RefObject, useMemo, useState } from "react";
import { useGradientData } from "./GradientDataContext";
import stopsStyles from "./stops.module.css";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import { rgb } from "color-convert";
import {
  generateFormattedGradientStop,
  getStopColorString,
} from "@/lib/themeMaker/layerHelper";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useSettings } from "@/components/contexts/SettingsContext";

interface Props {
  barRef: RefObject<HTMLDivElement> | null;
  stopIndex: number;
}

const deleteThreshold: number = 160;

export default function StopsEditorPin({ barRef, stopIndex }: Props) {
  const {
    gradientStops,
    setGradientStopIndex,
    modifyGradientStop,
    deleteGradientStop,
    gradientStopIndex,
  } = useGradientData();
  const { settings, updateSettings } = useSettings();
  const thisStop = gradientStops[stopIndex];
  const isSelected = stopIndex === gradientStopIndex;
  const [isShaking, setIsShaking] = useState(false);

  const selectThisPin = () => setGradientStopIndex(stopIndex);

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!barRef || !barRef.current) {
      return;
    }

    const { clientX, clientY } = "clientX" in e ? e : e.touches[0];

    const rect = barRef.current.getBoundingClientRect();
    const newOffset = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );

    modifyGradientStop(
      stopIndex,
      {
        ...generateFormattedGradientStop(gradientStops[stopIndex]),
        at: parseFloat(newOffset.toFixed(1)),
      },
      false
    );

    if (clientY - rect.bottom > deleteThreshold && gradientStops.length > 2) {
      setIsShaking(true);
    } else {
      setIsShaking(false);
    }
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    deleteGradientStop(stopIndex);
  };

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    setIsShaking(false);
    updateSettings({ customThemeData: settings.customThemeData });

    if (!barRef || !barRef.current) {
      return;
    }

    const { clientY } = "clientY" in e ? e : e.changedTouches[0];
    const rect = barRef.current.getBoundingClientRect();

    if (clientY - rect.bottom > deleteThreshold && gradientStops.length > 2) {
      deleteGradientStop(stopIndex);
    }
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
    onStart: selectThisPin,
    onFinish: handleEnd,
  });

  return (
    <div
      className={`w-4 h-6 absolute -translate-x-1/2 rotate-0 touch-none ${
        stopsStyles.pin
      } ${isShaking ? stopsStyles.shakeSpin : ""}`}
      style={
        {
          left: thisStop.at,
          "--pin-color": unbiasedColor,
          borderColor: "var(--pin-color)",
        } as Record<string, string>
      }
      draggable={false}
      onMouseDown={handleStartDragging}
      onTouchStart={handleStartTouching}
      onContextMenu={handleRightClick}
      onClick={selectThisPin}
    >
      <div
        className="w-4 h-4 left-0 bottom-0 shadow-md absolute rounded-b-sm"
        style={{ backgroundColor: "var(--pin-color)" }}
      />
      <div
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-auto aspect-square ${
          stopsStyles.pinDot
        } ${isSelected ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundColor: pinDotColor }}
      />
    </div>
  );
}
