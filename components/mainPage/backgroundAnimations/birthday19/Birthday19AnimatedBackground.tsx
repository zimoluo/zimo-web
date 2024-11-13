"use client";

import Image from "next/image";
import nineteenSource from "@/public/theme/animated-background/birthday19/nineteen.svg";
import birthday19Style from "./birthday19.module.css";

export default function Birthday19AnimatedBackground() {
  return (
    <div className="object-contain object-center fixed -z-20 inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none touch-none">
      <Image
        src={nineteenSource}
        alt="Nineteen"
        aria-hidden="true"
        className={`object-contain object-center -z-20 ${birthday19Style.nineteen} pointer-events-none select-none`}
      />
    </div>
  );
}
