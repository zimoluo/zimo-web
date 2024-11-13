"use client";

import { useCallback } from "react";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";
import Image from "next/image";

interface Props {
  sprite: string;
}

export default function ChristmasTreeSelectButton({ sprite }: Props) {
  const { selectSprite, selectedData, setTouchIdentifier } =
    useChristmasTreeSelector();

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      selectSprite(sprite);
    },
    [sprite, selectSprite]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setTouchIdentifier(e.changedTouches[0].identifier);
      const timeout = setTimeout(() => {
        selectSprite(sprite);
      }, 100);

      return () => clearTimeout(timeout);
    },
    [sprite, selectSprite]
  );

  return (
    <button
      onDragStart={handleDragStart}
      onTouchMove={(e) => {
        if (!selectedData.hasSelected) {
          handleTouchStart(e);
        }
      }}
      className="rounded-xl group p-4 touch-none w-full h-full aspect-square bg-widget-60 backdrop-blur-lg shadow-md"
    >
      <Image
        src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
        className="w-full h-full object-contain aspect-square transition-transform duration-300 group-hover:scale-110 ease-in-out"
        alt={`Pick this sprite: ${sprite}`}
        width={100}
        height={100}
      />
    </button>
  );
}
