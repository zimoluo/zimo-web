"use client";

import { useCallback, useEffect, useState } from "react";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";
import Image from "next/image";
import spriteStyle from "./sprite.module.css";
import windowStyle from "./confirm-window.module.css";
import DarkOverlay from "@/components/widgets/DarkOverlay";
import PopUpDisplay from "@/components/widgets/PopUpDisplay";
import ChristmasTreeConfirmWindow from "./ChristmasTreeConfirmWindow";

export default function ChristmasTreePlacer() {
  const { selectedData, deselectData } = useChristmasTreeSelector();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [coordinate, setCoordinate] = useState<[number, number]>([0, 0]);
  const [hasConfirmWindow, setHasConfirmWindow] = useState(false);

  const abortPlacement = () => {
    deselectData();
    setHasConfirmWindow(false);
  };

  const openConfirmWindow = () => {
    setHasConfirmWindow(true);
  };

  const updatePosition = useCallback((e: MouseEvent | TouchEvent) => {
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setPosition({ x: clientX, y: clientY });

    const container = document.getElementById("christmas-tree-container");
    if (container) {
      const { left, top, width, height } = container.getBoundingClientRect();

      const normalizedX = ((clientX - left) / width) * 1000;
      const normalizedY = ((clientY - top) / height) * 1000;

      console.log(normalizedX, normalizedY);

      setCoordinate([normalizedX, normalizedY]);
    }
  }, []);

  const onRelease = useCallback(() => {
    openConfirmWindow();
  }, [coordinate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => updatePosition(e);
    const handleTouchMove = (e: TouchEvent) => updatePosition(e);

    if (selectedData.hasSelected && !hasConfirmWindow) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", onRelease);
      window.addEventListener("touchend", onRelease);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("mouseup", onRelease);
        window.removeEventListener("touchend", onRelease);
      };
    }
  }, [selectedData, updatePosition, onRelease]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={`pointer-events-none select-none -translate-x-1/2 -translate-y-1/2 ${
          spriteStyle.sizing
        } opacity-0 ${
          selectedData.hasSelected ? "opacity-100" : ""
        } transition-opacity`}
      >
        <Image
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${selectedData.sprite}.svg`}
          className="w-full h-full object-contain"
          height={100}
          width={100}
          alt="Selected sprite"
        />
      </div>
      {hasConfirmWindow && (
        <>
          <DarkOverlay />
          <PopUpDisplay onClose={abortPlacement}>
            <div className={`${windowStyle.sizing}`}>
              <ChristmasTreeConfirmWindow
                position={coordinate}
                onClose={abortPlacement}
              />
            </div>
          </PopUpDisplay>
        </>
      )}
    </>
  );
}
