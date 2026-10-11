"use client";

import type { SceneComponentProps } from "../../contract";

import Image from "../../host/PaletteImage";
import photosAnimation from "./photos.module.css";

const zimoWallSrc = { src: "/theme/animated-background/photos/zimo-wall.svg", width: 1024, height: 1024 };
const circleSrc = { src: "/theme/animated-background/photos/circle.svg", width: 1024, height: 1024 };
const squircleSrc = { src: "/theme/animated-background/photos/squircle.svg", width: 1024, height: 1024 };
const filledSrc = { src: "/theme/animated-background/photos/filled.svg", width: 1024, height: 1024 };

export default function PhotosAnimatedBackground({ quality }: SceneComponentProps) {
  const enableAnimation = quality === "rich";

  return (
    <>
      <div
        className="fixed inset-0  flex items-center justify-center h-screen pointer-events-none opacity-20 select-none"
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

      {(
        <>
          <div
            className={`fixed inset-0 flex justify-center items-center pointer-events-none  ${photosAnimation["move-group-1"]} select-none`}
            aria-hidden="true"
          >
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-3"] : ""
              }`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-2"] : ""
              }`}
            />
            <div
              className={` absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-1"] : ""
              }  ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-4"] : ""
              }`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
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
            className={`fixed inset-0 flex justify-center items-center pointer-events-none  right-1/2 bottom-1/3 ${photosAnimation["move-group-2"]} select-none`}
          >
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-8"] : ""
              } hidden md:block`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-7"] : ""
              } hidden md:block`}
            />
            <div
              className={` absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-6"] : ""
              }  ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg hidden md:block`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-9"] : ""
              } hidden md:block`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
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
            className={`fixed inset-0 flex justify-center items-center pointer-events-none  left-1/2 top-1/3 ${photosAnimation["move-group-3"]} select-none`}
          >
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-1/3 translate-y-1/3 ${
                enableAnimation ? photosAnimation["move-individual-3"] : ""
              } hidden md:block`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 -translate-x-[16.666667%] translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-2"] : ""
              } hidden md:block`}
            />
            <div
              className={` absolute pointer-events-none h-44 w-44 translate-x-0 translate-y-0 ${
                enableAnimation ? photosAnimation["move-individual-1"] : ""
              }  ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg hidden md:block`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
                photosAnimation["base-color"]
              } shadow-lg absolute pointer-events-none h-44 w-44 translate-x-[16.666667%] -translate-y-[16.666667%] ${
                enableAnimation ? photosAnimation["move-individual-4"] : ""
              } hidden md:block`}
            />
            <div
              className={` ${photosAnimation.carve}  ${
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
