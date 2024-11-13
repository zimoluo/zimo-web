"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useDragAndTouch } from "@/lib/helperHooks";
import { useEffect, useRef, useState } from "react";

interface Props {
  dimension: string;
  startPosition?: number;
  value?: number | null;
  onChange?: (newValue: number) => void;
  heightBased?: boolean;
}

export default function CircularSlider({
  dimension,
  startPosition = 0,
  value = null,
  onChange = (newValue: number) => {},
  heightBased = false,
}: Props) {
  const { settings, updateSettings } = useSettings();
  const [angle, setAngle] = useState(value || 0);
  const [touchIdentifier, setTouchIdentifier] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!("touches" in event)) {
      return;
    }

    setTouchIdentifier(event.changedTouches[0].identifier);
  };

  const handleMove = (event: MouseEvent | TouchEvent | React.MouseEvent) => {
    if (!svgRef || !svgRef.current) {
      return;
    }

    let eventX: number, eventY: number;

    if ("clientX" in event) {
      eventX = event.clientX;
      eventY = event.clientY;
    } else {
      eventX =
        Array.from(event.touches).find(
          (touch) => touch.identifier === touchIdentifier
        )?.clientX ?? event.touches[0].clientX;
      eventY =
        Array.from(event.touches).find(
          (touch) => touch.identifier === touchIdentifier
        )?.clientY ?? event.touches[0].clientY;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = eventX - rect.left - cx;
    const y = eventY - rect.top - cy;
    let newAngle = Math.atan2(y, x) * (180 / Math.PI) - startPosition;
    newAngle = newAngle || 0;
    newAngle = newAngle < 0 ? newAngle + 360 : newAngle;
    setAngle(newAngle);
    onChange(newAngle);
  };

  useEffect(() => {
    if (value === null || value === angle) {
      return;
    }

    setAngle(value);
  }, [value, setAngle, angle]);

  const { handleStartDragging, handleStartTouching } = useDragAndTouch({
    onFinish: () =>
      updateSettings({ customThemeData: settings.customThemeData }),
    onMove: handleMove,
    dependencies: [svgRef, startPosition, setAngle, onChange],
    onStart: handleStart,
  });

  const cx = 50;
  const cy = 50;
  const radius = 42;
  const sliderX = cx + radius * Math.cos((angle * Math.PI) / 180);
  const sliderY = cy + radius * Math.sin((angle * Math.PI) / 180);

  const circumference = Math.PI * 2 * radius;

  const progressLength = angle * (circumference / 360);

  return (
    <div
      className="touch-none cursor-pointer aspect-square"
      style={{
        width: heightBased ? "auto" : dimension,
        height: heightBased ? dimension : "auto",
        transform: `rotate(${startPosition}deg)`,
      }}
    >
      <svg
        ref={svgRef}
        className="w-full h-auto aspect-square"
        viewBox="0 0 100 100"
        onMouseDown={handleStartDragging}
        onTouchStart={handleStartTouching}
        onClick={handleMove}
      >
        <circle
          cx={`${cx}%`}
          cy={`${cy}%`}
          r={`${radius}%`}
          fill="none"
          className="stroke-pastel"
          strokeWidth="3.2%"
        />
        <circle
          cx={`${cx}%`}
          cy={`${cy}%`}
          r={`${radius}%`}
          fill="none"
          className="stroke-saturated"
          strokeWidth="5%"
          strokeDasharray={`${progressLength}, ${circumference}`}
        />
        <circle
          cx={`${sliderX.toFixed(3)}%`}
          cy={`${sliderY.toFixed(3)}%`}
          r="7%"
          className="fill-saturated"
        />
      </svg>
    </div>
  );
}
