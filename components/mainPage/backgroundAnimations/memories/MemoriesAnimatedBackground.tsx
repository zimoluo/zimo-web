"use client";

import memoriesStyle from "./memories.module.css";
import nodesSrc from "@/public/theme/animated-background/memories/nodes.svg";
import Image from "next/image";

export default function MemoriesAnimatedBackground() {
  return (
    <div
      className={`fixed inset-0 w-screen h-screen -z-20 pointer-events-none select-none ${memoriesStyle.bigMask}`}
    >
      <div
        className={`absolute right-1/2 md:-right-[5vmax] translate-x-1/2 md:translate-x-0 top-0 ${memoriesStyle.mask}`}
        aria-hidden="true"
      >
        <div
          className={`${memoriesStyle.verticalMask} ${memoriesStyle.aspect} h-[66vmax] md:h-[60vmax] w-auto`}
        >
          <Image
            src={nodesSrc}
            alt="Nodes"
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
