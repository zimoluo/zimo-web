"use client";

import Image from "next/image";
import treeStyle from "./tree.module.css";
import spriteStyle from "./sprite.module.css";
import { useEffect } from "react";
import { useChristmasTreeSelector } from "./ChristmasTreeSelectorContext";

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
      {treeData.map(({ position, sprite, date }, index) => (
        <Image
          key={`${date}-${sprite}-${index}`}
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
          alt={sprite}
          className={`-translate-x-1/2 -translate-y-1/2 ${spriteStyle.sizing} absolute`}
          style={{
            left: `${position[0] / 10}%`,
            top: `${position[1] / 10}%`,
          }}
          height={100}
          width={100}
        />
      ))}
    </div>
  );
}
