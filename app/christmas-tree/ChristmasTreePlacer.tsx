"use client";

import { useCallback, useEffect, useState } from "react";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";
import Image from "next/image";
import spriteStyle from "./sprite.module.css";
import windowStyle from "./confirm-window.module.css";
import DarkOverlay from "@/components/widgets/DarkOverlay";
import PopUpDisplay from "@/components/widgets/PopUpDisplay";
import ChristmasTreeConfirmWindow from "./ChristmasTreeConfirmWindow";
import {
  isTreeContentPositionValid,
  isTreeContentWithinTreeBox,
} from "@/lib/special/christmasTreeHelper";

export default function ChristmasTreePlacer() {
  const {
    selectedData,
    deselectData,
    isPlacerProperlyMounted,
    setIsPlacerProperlyMounted,
    treeContainerRef,
  } = useChristmasTreeSelector();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [coordinate, setCoordinate] = useState<[number, number]>([0, 0]);
  const [hasConfirmWindow, setHasConfirmWindow] = useState(false);
  const [isTranslucent, setIsTranslucent] = useState(false);

  const abortPlacement = () => {
    deselectData();
    setHasConfirmWindow(false);
  };

  const openConfirmWindow = () => {
    setHasConfirmWindow(true);
  };

  const updatePosition = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (hasConfirmWindow) return;

      let clientX: number, clientY: number;

      if ("touches" in e) {
        e.preventDefault();
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      setPosition({ x: clientX, y: clientY });

      if (treeContainerRef.current) {
        const { left, top, width, height } =
          treeContainerRef.current.getBoundingClientRect();

        const normalizedX = ((clientX - left) / width) * 1000;
        const normalizedY = ((clientY - top) / height) * 1000;

        setCoordinate([normalizedX, normalizedY]);

        if (
          isTreeContentWithinTreeBox([normalizedX, normalizedY]) &&
          !isTreeContentPositionValid([normalizedX, normalizedY])
        ) {
          setIsTranslucent(true);
        } else {
          setIsTranslucent(false);
        }
      }

      if (!isPlacerProperlyMounted) {
        setTimeout(() => {
          setIsPlacerProperlyMounted(true);
        }, 0);
      }
    },
    [hasConfirmWindow, treeContainerRef]
  );

  const onRelease = useCallback(() => {
    if (!isTreeContentPositionValid(coordinate)) {
      deselectData();
      return;
    }
    openConfirmWindow();
  }, [coordinate]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e);
      checkScrollBoundary(e.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      updatePosition(e);
      checkScrollBoundary(e.touches[0].clientY);
    };

    const checkScrollBoundary = (clientY: number) => {
      const screenHeight = window.innerHeight;
      const topBoundary = screenHeight * 0.2;
      const bottomBoundary = screenHeight * 0.8;

      if (clientY < topBoundary) {
        window.scrollBy({ top: -15, behavior: "auto" });
      } else if (clientY > bottomBoundary) {
        window.scrollBy({ top: 15, behavior: "auto" });
      }
    };

    const startScrollingInterval = () => {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (hasConfirmWindow) return;
        if (!isPlacerProperlyMounted) return;

        checkScrollBoundary(position.y);
      }, 10);
    };

    const stopScrollingInterval = () => {
      clearInterval(intervalId);
    };

    if (selectedData.hasSelected && !hasConfirmWindow) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", onRelease);
      window.addEventListener("touchend", onRelease);

      startScrollingInterval();

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("mouseup", onRelease);
        window.removeEventListener("touchend", onRelease);

        stopScrollingInterval();
      };
    } else {
      stopScrollingInterval();
    }
  }, [selectedData, updatePosition, onRelease, position]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={`cursor-grabbing -translate-x-1/2 -translate-y-1/2 touch-none z-40 ${
          spriteStyle.sizing
        } ${
          selectedData.hasSelected && isPlacerProperlyMounted
            ? "opacity-100"
            : "opacity-0 pointer-events-none select-none"
        } transition-opacity`}
      >
        <Image
          key={selectedData.sprite}
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${selectedData.sprite}.svg`}
          className={`w-full h-full object-contain rotate-0 ${
            !hasConfirmWindow ? spriteStyle.shakeSpin : ""
          } transition-opacity duration-300 ease-in-out ${
            isTranslucent ? "opacity-40" : "opacity-100"
          }`}
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
