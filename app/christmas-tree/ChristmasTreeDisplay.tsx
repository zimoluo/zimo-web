"use client";

import Image from "next/image";
import christmasTreeSrc from "@/public/special/christmas/tree.svg";
import spriteStyle from "./sprite.module.css";
import { useEffect } from "react";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";
import ChristmasTreeItem from "./ChristmasTreeItem";

export default function ChristmasTreeDisplay() {
  const { treeData, fetchAndSetTreeData, treeContainerRef } =
    useChristmasTreeSelector();

  useEffect(() => {
    fetchAndSetTreeData();

    const intervalId = setInterval(fetchAndSetTreeData, 8000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`${spriteStyle.treeAspect} w-auto md:w-full h-full relative ${spriteStyle.container} select-none`}
      ref={treeContainerRef}
    >
      <Image
        src={christmasTreeSrc}
        className="w-full h-full object-contain relative"
        alt="Christmas tree"
        draggable={false}
        priority={true}
      />
      {treeData.map(({ position, sprite, from }, index) => (
        <ChristmasTreeItem
          {...{ position, sprite, from }}
          key={`${sprite}-${index}`}
        />
      ))}
    </div>
  );
}
