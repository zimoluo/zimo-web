"use client";

import { useCallback, useEffect, useState } from "react";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";
import Image from "next/image";
import spriteStyle from "./sprite.module.css";
import windowStyle from "./confirm-window.module.css";
import ChristmasTreeConfirmWindow from "./ChristmasTreeConfirmWindow";
import {
  isTreeContentPositionValid,
  isTreeContentWithinTreeBox,
} from "@/lib/special/christmasTreeHelper";
import { usePopUp } from "@/components/contexts/PopUpContext";

export default function ChristmasTreePlacer() {
  const {
    selectedData,
    deselectData,
    isPlacerProperlyMounted,
    setIsPlacerProperlyMounted,
    treeContainerRef,
    fetchAndSetTreeData,
    touchIdentifier,
    treeData,
  } = useChristmasTreeSelector();

  const { appendPopUp } = usePopUp();

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
    appendPopUp({
      content: (
        <div className={`${windowStyle.sizing}`}>
          <ChristmasTreeConfirmWindow
            position={coordinate}
            selectedData={selectedData}
            fetchAndSetTreeData={fetchAndSetTreeData}
          />
        </div>
      ),
      contextKey: "christmas-tree-confirm-pop-up",
      onClose: abortPlacement,
    });
  };

  const updatePosition = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (hasConfirmWindow) return;

      let clientX: number, clientY: number;

      if ("touches" in e) {
        e.preventDefault();
        clientX =
          Array.from(e.touches).find(
            (touch) => touch.identifier === touchIdentifier
          )?.clientX ?? e.touches[0].clientX;
        clientY =
          Array.from(e.touches).find(
            (touch) => touch.identifier === touchIdentifier
          )?.clientY ?? e.touches[0].clientY;
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
          !isTreeContentPositionValid([normalizedX, normalizedY], treeData)
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
    if (!isTreeContentPositionValid(coordinate, treeData)) {
      deselectData();
      return;
    }
    openConfirmWindow();
  }, [coordinate, treeData]);

  useEffect(() => {
    if (selectedData.hasSelected && !hasConfirmWindow) {
      window.addEventListener("mousemove", updatePosition);
      window.addEventListener("touchmove", updatePosition);
      window.addEventListener("mouseup", onRelease);
      window.addEventListener("touchend", onRelease);

      return () => {
        window.removeEventListener("mousemove", updatePosition);
        window.removeEventListener("touchmove", updatePosition);
        window.removeEventListener("mouseup", onRelease);
        window.removeEventListener("touchend", onRelease);
      };
    }
  }, [selectedData.hasSelected, updatePosition, onRelease]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${(treeContainerRef.current?.clientWidth ?? 0) * 0.15}px`,
          height: `${(treeContainerRef.current?.clientWidth ?? 0) * 0.15}px`,
        }}
        className={`cursor-grabbing -translate-x-1/2 -translate-y-1/2 touch-none z-40 ${
          selectedData.hasSelected && isPlacerProperlyMounted
            ? "opacity-100"
            : "opacity-0 pointer-events-none select-none"
        } transition-opacity`}
      >
        <Image
          key={selectedData.sprite}
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${selectedData.sprite}.svg`}
          className={`w-full h-full object-contain drop-shadow-md rotate-0 ${
            !hasConfirmWindow ? spriteStyle.shakeSpin : ""
          } transition-opacity duration-300 ease-in-out ${
            isTranslucent ? "opacity-40" : "opacity-100"
          }`}
          height={100}
          width={100}
          alt="Selected sprite"
        />
      </div>
    </>
  );
}
