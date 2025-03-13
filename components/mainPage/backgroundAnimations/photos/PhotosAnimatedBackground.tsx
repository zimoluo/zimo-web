"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import photosAnimation from "./photos.module.css";
import { isWebkit } from "@/lib/browserUtil";

import zimoWallSrc from "@/public/theme/animated-background/photos/zimo-wall.svg";
import circleSrc from "@/public/theme/animated-background/photos/circle.svg";
import squircleSrc from "@/public/theme/animated-background/photos/squircle.svg";
import filledSrc from "@/public/theme/animated-background/photos/filled.svg";

export default function PhotosAnimatedBackground() {
  const [enableAnimation, setEnableAnimation] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setEnableAnimation(true);
      },
      isWebkit() ? 30000 : 0
    );

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 -z-30 flex items-center justify-center h-screen pointer-events-none opacity-20 select-none"
        aria-hidden="true"
      >
        <Image
          src={zimoWallSrc}
          alt="Zimo Text"
          className="object-cover w-full h-full"
          placeholder="empty"
          priority={true}
        />
      </div>

      {settings.backgroundRichness === "rich" && (
        <>
          <div
            className={`fixed inset-0 flex justify-center items-center pointer-events-none -z-10 ${photosAnimation["move-group-1"]} select-none`}
            aria-hidden="true"
          >
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-3"] : ""
              }`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-2"] : ""
              }`}
            />
            <div
              className={`-z-20 absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-1"] : ""
              } ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-4"] : ""
              }`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/3 -translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-5"] : ""
              }`}
            />
            <Image
              src={circleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-3"] : ""
              }`}
            />
            <Image
              src={circleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-1"]
              } -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-2"] : ""
              }`}
            />
            <Image
              src={circleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-2"]
              } translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-1"] : ""
              }`}
            />
            <Image
              src={circleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-3"]
              } translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-4"] : ""
              }`}
            />
            <Image
              src={circleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-4"]
              } translate-x-1/3 -translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-5"] : ""
              }`}
            />
          </div>

          <div
            aria-hidden="true"
            className={`fixed inset-0 flex justify-center items-center pointer-events-none -z-10 right-1/2 bottom-1/3 ${photosAnimation["move-group-2"]} select-none`}
          >
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-8"] : ""
              } hidden md:block`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-7"] : ""
              } hidden md:block`}
            />
            <div
              className={`-z-20 absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-6"] : ""
              } ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg hidden md:block`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-9"] : ""
              } hidden md:block`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/3 -translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-10"] : ""
              } hidden md:block`}
            />
            <Image
              src={filledSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-8"] : ""
              } hidden md:block`}
            />
            <Image
              src={filledSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-1"]
              } -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-7"] : ""
              } hidden md:block`}
            />
            <Image
              src={filledSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-2"]
              } translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-6"] : ""
              } hidden md:block`}
            />
            <Image
              src={filledSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-3"]
              } translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-9"] : ""
              } hidden md:block`}
            />
            <Image
              src={filledSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-4"]
              } translate-x-1/3 -translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-10"] : ""
              } hidden md:block`}
            />
          </div>

          <div
            aria-hidden="true"
            className={`fixed inset-0 flex justify-center items-center pointer-events-none -z-10 left-1/2 top-1/3 ${photosAnimation["move-group-3"]} select-none`}
          >
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-3"] : ""
              } hidden md:block`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-2"] : ""
              } hidden md:block`}
            />
            <div
              className={`-z-20 absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-1"] : ""
              } ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg hidden md:block`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-4"] : ""
              } hidden md:block`}
            />
            <div
              className={`-z-20 ${photosAnimation.carve} ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-1/3 -translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-5"] : ""
              } hidden md:block`}
            />
            <Image
              src={squircleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-3"] : ""
              } hidden md:block`}
            />
            <Image
              src={squircleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-1"]
              } -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-2"] : ""
              } hidden md:block`}
            />
            <Image
              src={squircleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-2"]
              } translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-1"] : ""
              } hidden md:block`}
            />
            <Image
              src={squircleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-3"]
              } translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-4"] : ""
              } hidden md:block`}
            />
            <Image
              src={squircleSrc}
              alt="Stained Glass Pane"
              placeholder="empty"
              priority={true}
              className={`absolute pointer-events-none h-44 w-auto opacity-20 ${
                photosAnimation["photos-glass-4"]
              } translate-x-1/3 -translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-5"] : ""
              } hidden md:block`}
            />
          </div>
        </>
      )}
    </>
  );
}
