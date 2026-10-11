"use client";

import type { SceneComponentProps } from "../../contract";

import Image from "../../host/PaletteImage";
import { PageTitle } from "../../host/PageTitle";
import homeStyle from "./home.module.css";
const moving1Src = { src: "/theme/animated-background/home/moving-1.svg", width: 1920, height: 1920 };
const moving2Src = { src: "/theme/animated-background/home/moving-2.svg", width: 1920, height: 1920 };
const moving3Src = { src: "/theme/animated-background/home/moving-3.svg", width: 1920, height: 1920 };

export default function HomeAnimatedBackground({ quality, homeTitle }: SceneComponentProps) {

  return (
    <>
      {quality !== "reduced" && (
        <>
          <div
            className={`${homeStyle.layer} ${homeStyle.moveOne}`}
          >
            <Image
              src={moving1Src}
              className="object-cover w-full h-full"
              alt="Background moving image 1"
              placeholder="empty"
              aria-hidden="true"
              priority={true}
            />
          </div>

          <div
            className={`${homeStyle.layer} ${homeStyle.moveThree}`}
          >
            <Image
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

      {homeTitle && <PageTitle variant="home" />}

      {quality !== "reduced" && (
        <div
          className={`${homeStyle.layer} ${homeStyle.moveTwo}`}
        >
          <Image
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
