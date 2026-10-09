"use client";

import type { SceneComponentProps } from "../../contract";

import PaletteImage from "../../host/PaletteImage";
import homeStyle from "./home.module.css";
const moving1Src = { src: "/theme/animated-background/home/moving-1.svg", width: 1920, height: 1920 };
const moving2Src = { src: "/theme/animated-background/home/moving-2.svg", width: 1920, height: 1920 };
const moving3Src = { src: "/theme/animated-background/home/moving-3.svg", width: 1920, height: 1920 };

export default function HomeAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <>
      {quality !== "reduced" && (
        <>
          <div
            className={`fixed inset-0 w-[100lvw] h-[100lvh]  flex items-center justify-center pointer-events-none select-none ${homeStyle.moveOne}`}
          >
            <PaletteImage
              src={moving1Src}
              className="object-cover w-full h-full"
              alt="Background moving image 1"
              placeholder="empty"
              aria-hidden="true"
              priority={true}
            />
          </div>

          <div
            className={`fixed inset-0 w-[100lvw] h-[100lvh]  flex items-center justify-center pointer-events-none select-none ${homeStyle.moveThree}`}
          >
            <PaletteImage
              src={moving3Src}
              className="object-cover w-full h-full"
              alt="Background moving image 3"
              placeholder="empty"
              aria-hidden="true"
              priority={true}
            />
          </div>
        </>
      )}

      {quality !== "reduced" && (
        <div
          className={`fixed inset-0 w-[100lvw] h-[100lvh]  flex items-center justify-center pointer-events-none select-none ${homeStyle.moveTwo}`}
        >
          <PaletteImage
            src={moving2Src}
            className="object-cover w-full h-full"
            alt="Background moving image 2"
            placeholder="empty"
            aria-hidden="true"
            priority={true}
          />
        </div>
      )}
    </>
  );
}
