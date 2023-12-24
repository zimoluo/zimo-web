"use client";

import Image from "next/image";
import treeStyle from "./tree.module.css";
import { useEffect } from "react";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";
import ChristmasTreeItem from "./ChristmasTreeItem";

export default function ChristmasTreeDisplay() {
  const { treeData, fetchAndSetTreeData } = useChristmasTreeSelector();

  useEffect(() => {
    fetchAndSetTreeData();

    const intervalId = setInterval(fetchAndSetTreeData, 8000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`${treeStyle.aspect} w-full h-auto relative rounded-xl`}
      id="christmas-tree-container"
    >
      <Image
        src="/special/christmas/tree.svg"
        className="w-full h-full object-contain"
        alt="Christmas tree"
        height={500}
        width={330}
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
