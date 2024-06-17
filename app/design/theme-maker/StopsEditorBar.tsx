"use client";

import { useRef } from "react";
import StopsEditorPin from "./StopsEditorPin";
import transparentLayerStyle from "./transparent-layer.module.css";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import { useGradientStopsPosition } from "./GradientStopsPositionContext";

export default function StopsEditorBar() {
  const {
    appendGradientStop,
    currentGradientStop,
    gradientStops,
    computedMaximum,
    computedMinimum,
  } = useGradientStopsPosition();
  const barRef = useRef<HTMLDivElement>(null);

  const handleBarClick = (e: React.MouseEvent) => {
    if (!barRef.current) {
      return;
    }

    const rect = barRef.current.getBoundingClientRect();
    const offset = Math.min(
      100,
      Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
    );

    appendGradientStop({
      ...currentGradientStop,
      at: parseFloat(
        (
          (offset / 100) * (computedMaximum - computedMinimum) +
          computedMinimum
        ).toFixed(1)
      ),
    });
  };

  return (
    <div className="w-full relative h-5 mb-8">
      <div
        className={`relative w-full h-full rounded-lg cursor-pointer ${transparentLayerStyle.transparentLayer}`}
        ref={barRef}
      >
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none select-none bg-page rounded-lg"
          style={generateInlineStyleObject({
            page: [
              {
                type: "linear-gradient",
                angle: 90,
                stops: gradientStops.map((stop) => ({
                  ...stop,
                  at:
                    ((stop.at - computedMinimum) /
                      (computedMaximum - computedMinimum)) *
                    100,
                })),
              },
            ],
          })}
        />
        <button
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          onClick={handleBarClick}
        />
        {gradientStops.map((_, index) => (
          <StopsEditorPin key={index} stopIndex={index} barRef={barRef} />
        ))}
      </div>
    </div>
  );
}
