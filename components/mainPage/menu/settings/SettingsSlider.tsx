"use client";

import { useState, useRef, useEffect } from "react";
import sliderStyle from "./settings-slider.module.css";

interface Props<T> {
  values: T[];
  text: string[];
  entry: T;
  setValue: (newValue: T) => void;
}

export default function SettingsSlider({
  values,
  setValue,
  entry,
  text,
}: Props<string | number>) {
  const [sliderPos, setSliderPos] = useState(
    (100 / (values.length - 1)) * values.indexOf(entry)
  );
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pendingPosition, setPendingPosition] = useState<number | null>(null);
  const [touchIdentifier, setTouchIdentifier] = useState<number | null>(null);

  useEffect(() => {
    if (pendingPosition !== null) {
      const closestNotch = getClosestNotch(pendingPosition);
      if (closestNotch.value !== entry) {
        setValue(closestNotch.value);
      }
      setPendingPosition(null); // Reset the pending position
    }
  }, [pendingPosition, entry, setValue]);

  const handleSetPosition = (positionPercent: number) => {
    // Just set the pending position, actual setting will be done in useEffect
    setPendingPosition(positionPercent);
  };

  const getClosestNotch = (positionPercent: number) => {
    let closestDistance = Infinity;
    let closestNotch = { key: 0, value: values[0], position: 0 };

    values.forEach((value, key) => {
      const notchPositionPercent = (100 / (values.length - 1)) * key;
      const distance = Math.abs(notchPositionPercent - positionPercent);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNotch = { key, value, position: notchPositionPercent };
      }
    });

    return closestNotch;
  };

  useEffect(() => {
    const key = values.indexOf(entry);
    const position = (100 / (values.length - 1)) * key;
    setSliderPos(position);
  }, [entry]);

  const mouseMoveHandler = (e: MouseEvent) => {
    const positionPercent =
      ((e.clientX - containerRef.current!.getBoundingClientRect().left) /
        containerRef.current!.clientWidth) *
      100;
    handleSetPosition(positionPercent);
  };

  const touchMoveHandler = (e: TouchEvent) => {
    e.preventDefault();
    const touch =
      Array.from(e.touches).find(
        (touch) => touch.identifier === touchIdentifier
      ) ?? e.touches[0];
    const positionPercent =
      ((touch.clientX - containerRef.current!.getBoundingClientRect().left) /
        containerRef.current!.clientWidth) *
      100;
    handleSetPosition(positionPercent);
  };

  const mouseUpHandler = () => {
    window.removeEventListener("mousemove", mouseMoveHandler);
    window.removeEventListener("mouseup", mouseUpHandler);
    setIsDragging(false);
  };

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
  };

  const touchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });
    window.addEventListener("touchend", touchEndHandler);
    setTouchIdentifier(e.changedTouches[0].identifier);
  };

  const touchEndHandler = () => {
    window.removeEventListener("touchmove", touchMoveHandler);
    window.removeEventListener("touchend", touchEndHandler);
    setIsDragging(false);
  };

  useEffect(() => {
    // Cleanup in case component unmounts
    return () => {
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, []);

  return (
    <div
      className={`relative w-full h-16 select-none ${
        isDragging ? "cursor-grabbing" : "cursor-pointer"
      }`}
      ref={containerRef}
      onMouseUp={(e) => {
        const positionPercent =
          ((e.clientX - e.currentTarget.getBoundingClientRect().left) /
            e.currentTarget.clientWidth) *
          100;
        handleSetPosition(positionPercent);
      }}
    >
      <div
        className={`absolute w-9/10 h-2 ${sliderStyle.borderColor} bg-pastel border-0.8 bg-opacity-30 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
      >
        {values.map((value, key) => {
          const positionPercent = (100 / (values.length - 1)) * key;
          return (
            <div
              key={key}
              className="absolute scale-110 rounded-full h-3 w-0.5 -translate-y-0.75 bg-saturated -translate-x-1/2"
              style={{ left: `${positionPercent}%` }}
              onClick={() => handleSetPosition(positionPercent)}
            />
          );
        })}
        {text.map((eachText, key) => {
          const positionPercent = (100 / (values.length - 1)) * key;
          let translateXClass = "-translate-x-1/2";
          if (key === 0) {
            translateXClass = "-translate-x-1/4";
          } else if (key === text.length - 1) {
            translateXClass = "-translate-x-3/4";
          }
          return (
            <button
              key={key}
              className={`absolute translate-y-5 ${translateXClass} ${
                sliderPos === positionPercent ? "font-bold" : "font-normal"
              } text-xs select-auto`}
              style={{ left: `${positionPercent}%` }}
              onClick={() => handleSetPosition(positionPercent)}
            >
              {eachText}
            </button>
          );
        })}
        <div
          className={`absolute w-0 h-0 ${sliderStyle.sliderTransition}`}
          style={{ left: `${sliderPos}%` }}
        >
          <div
            className={`${
              sliderStyle.borderColor
            } border-0.6 shadow-md w-2.5 h-6 rounded-full transition-all ease-in-out -translate-x-1 -translate-y-2.25 touch-none ${
              isDragging
                ? "cursor-grabbing scale-150 bg-highlight"
                : `cursor-grab scale-135 ${sliderStyle.sliderBg}`
            }`}
            draggable={true}
            onDragStart={dragStartHandler}
            onDragEnd={mouseUpHandler}
            onTouchStart={touchStartHandler}
            onTouchEnd={touchEndHandler}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          />
        </div>
      </div>
    </div>
  );
}
