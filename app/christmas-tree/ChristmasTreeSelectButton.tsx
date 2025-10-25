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
      className="rounded-2xl border-reflect-light group p-4 touch-none w-20 md:w-24 h-20 md:h-24 aspect-square bg-light/65 backdrop-blur-sm shadow-lg"
    >
      <Image
        src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
        className="w-full h-full object-contain aspect-square transition-transform duration-300 group-hover:scale-110 ease-in-out drop-shadow-md select-none"
        alt={`Pick this sprite: ${sprite}`}
        width={100}
        height={100}
      />
    </button>
  );
}
