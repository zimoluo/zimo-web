"use client";

import Image from "next/image";
import treeStyle from "./tree.module.css";
import { useEffect, useState } from "react";
import { fetchGetTreeContent } from "@/lib/dataLayer/client/specialServiceClient";

interface Props {
  initialTree?: TreeContent[];
}

export default function ChristmasTreeDisplay({ initialTree = [] }: Props) {
  const [treeData, setTreeData] = useState<TreeContent[]>(initialTree);

  const fetchAndSetTreeData = async () => {
    const fetchedTreeContent = await fetchGetTreeContent();
    if (fetchedTreeContent && fetchedTreeContent.length > 0) {
      setTreeData(fetchedTreeContent);
    } else {
      setTreeData([]);
    }
  };

  useEffect(() => {
    fetchAndSetTreeData();

    const intervalId = setInterval(fetchAndSetTreeData, 8000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`${treeStyle.aspect} w-full h-auto relative`}
      id="christmas-tree-container"
    >
      <Image
        src="/special/christmas/tree.svg"
        className="w-full h-full"
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
          className="-translate-x-1/2 -translate-y-1/2 h-auto aspect-square absolute"
          style={{
            left: `${position[0] / 10}%`,
            top: `${position[1] / 10}%`,
            width: "18%",
          }}
          height="100"
          width="100"
        />
      ))}
    </div>
  );
}
