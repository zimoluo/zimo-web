"use client";

import { RefObject, useMemo, useState } from "react";
import stopsStyle from "./stops.module.css";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import colorConvert from "color-convert";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useGradientStopsPosition } from "./GradientStopsPositionContext";

const { rgb } = colorConvert;

interface Props {
  barRef: RefObject<HTMLDivElement | null> | null;
  stopIndex: number;
}

const deleteThreshold: number = 140;

export default function StopsEditorPin({ barRef, stopIndex }: Props) {
  const {
    gradientStops,
    setGradientStopIndex,
    modifyGradientStop,
    deleteGradientStop,
    gradientStopIndex,
    computedMaximum,
    computedMinimum,
    setTemporaryMaximum,
    setTemporaryMinimum,
    setUpdateDisabled,
  } = useGradientStopsPosition();
  const { settings, updateSettings } = useSettings();
  const thisStop = gradientStops[stopIndex];
  const isSelected = stopIndex === gradientStopIndex;
  const [isShaking, setIsShaking] = useState(false);
  const [touchIdentifier, setTouchIdentifier] = useState<number | null>(null);

  const selectThisPin = (event?: React.MouseEvent | React.TouchEvent) => {
    if (event && !("touches" in event) && event.button === 2) {
      return;
    }
    setGradientStopIndex(stopIndex);
    setUpdateDisabled(false);
  };

  const startMoving = (event?: React.MouseEvent | React.TouchEvent) => {
    selectThisPin(event);
    setTemporaryMaximum(computedMaximum);
    setTemporaryMinimum(computedMinimum);
    setUpdateDisabled(true);
    if (event && "touches" in event) {
      setTouchIdentifier(event.changedTouches[0].identifier);
    }
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!barRef || !barRef.current) {
      return;
    }

    const { clientX, clientY } =
      "clientX" in e
        ? e
        : Array.from(e.touches).find(
            (touch) => touch.identifier === touchIdentifier
          ) ?? e.touches[0];

    const rect = barRef.current.getBoundingClientRect();
    const newOffset =
      (Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)) /
        100) *
        (computedMaximum - computedMinimum) +
      computedMinimum;

    modifyGradientStop(
      {
        ...gradientStops[stopIndex],
        at: parseFloat(newOffset.toFixed(1)),
      },
      stopIndex,
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
    if (gradientStops.length > 2) {
      deleteGradientStop(stopIndex);
      setUpdateDisabled(false);
    }
  };

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    setIsShaking(false);
    updateSettings({ customThemeData: settings.customThemeData });
    setUpdateDisabled(false);

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
    if (thisStop.opacity < 0.45) {
      return "rgb(var(--color-saturated))";
    }

    const rgbColor = thisStop.color;
    const { index, shadeMap } = generateShadeMap(`#${rgb.hex(rgbColor)}`);

    if (index > 1) {
      return shadeMap[0];
    }

    return shadeMap[5];
  }, [thisStop]);

  const { handleStartDragging, handleStartTouching } = useDragAndTouch({
    onMove: handleMove,
    dependencies: [barRef, stopIndex, gradientStops],
    onStart: startMoving,
    onFinish: handleEnd,
  });

  return (
    <div
      className={`w-4 h-6 absolute -translate-x-1/2 rotate-0 touch-none ${
        stopsStyle.pin
      } ${isShaking ? stopsStyle.shakeSpin : ""}`}
      style={
        {
          left: `${
            ((thisStop.at - computedMinimum) /
              (computedMaximum - computedMinimum)) *
            100
          }%`,
          "--pin-color": `rgb(${thisStop.color.join(" ")} / ${
            thisStop.opacity
          })`,
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
          stopsStyle.pinDot
        } ${isSelected ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundColor: pinDotColor }}
      />
      <button
        className="w-4 h-4 left-0 bottom-0 absolute border-0 border-none p-0 m-0 bg-none bg-transparent"
        onClick={selectThisPin}
      />
    </div>
  );
}
