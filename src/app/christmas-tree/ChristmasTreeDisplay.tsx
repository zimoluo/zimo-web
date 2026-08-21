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
      className={`${spriteStyle.treeAspect} w-auto h-full relative ${spriteStyle.container} select-none`}
      ref={treeContainerRef}
    >
      <Image
        src={christmasTreeSrc}
        className="w-full h-full object-contain relative drop-shadow-lg"
        alt="Christmas tree"
        draggable={false}
        priority={true}
      />
      {treeData.map((data, index) => (
        <ChristmasTreeItem {...data} key={`${data.uniqueId}-${index}`} />
      ))}
    </div>
  );
}
