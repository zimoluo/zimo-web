"use client";

import type { SceneComponentProps } from "../../contract";

import Image from "next/image";
const nineteenSource = { src: "/theme/animated-background/birthday19/nineteen.svg", width: 2288, height: 2207 };
const colorsSource = { src: "/theme/animated-background/birthday19/colors.svg", width: 1024, height: 1024 };
import birthday19Style from "./birthday19.module.css";
import CelebrationAnimatedBackground from "../celebration/CelebrationAnimatedBackground";

export default function Birthday19AnimatedBackground({ quality, params }: SceneComponentProps) {

  return (
    <>
      {quality === "rich" && (
        <CelebrationAnimatedBackground quality={quality} params={params} palette={ {} } />
      )}
      <div className="fixed  inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none touch-none">
        <Image
          src={colorsSource}
          alt="Colors"
          aria-hidden="true"
          className={` ${birthday19Style.colors}  ${
            quality === "rich"
              ? birthday19Style.spin
              : "rotate-45"
          } pointer-events-none select-none absolute`}
          priority={true}
        />
      </div>
      <div className="object-contain object-center fixed  inset-0 flex items-center justify-center w-screen h-screen pointer-events-none select-none touch-none">
        <Image
          src={nineteenSource}
          alt="Nineteen"
          aria-hidden="true"
          className={`object-contain object-center  ${birthday19Style.nineteen} pointer-events-none select-none`}
          priority={true}
        />
      </div>
    </>
  );
}
