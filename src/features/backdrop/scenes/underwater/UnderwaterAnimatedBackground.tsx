"use client";

import type { SceneComponentProps } from "../../contract";

import underwaterStyle from "./underwater.module.css";

export default function UnderwaterAnimatedBackground({ quality }: SceneComponentProps) {
  return (
    <>
      <div
        className={`${underwaterStyle.spot}  ${underwaterStyle.place1}  ${
          quality === "rich"
            ? underwaterStyle.place1Animate
            : ""
        }  ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
      <div
        className={`${underwaterStyle.spot}  ${underwaterStyle.place2}  ${
          quality === "rich"
            ? underwaterStyle.place2Animate
            : ""
        }  ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
      <div
        className={`${underwaterStyle.spot}  ${underwaterStyle.place3}  ${
          quality === "rich"
            ? underwaterStyle.place3Animate
            : ""
        }  ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
      <div
        className={`${underwaterStyle.spot}  ${underwaterStyle.place4}  ${
          quality === "rich"
            ? underwaterStyle.place4Animate
            : ""
        }  ${underwaterStyle.darkWater}`}
        aria-hidden="true"
      />
    </>
  );
}
