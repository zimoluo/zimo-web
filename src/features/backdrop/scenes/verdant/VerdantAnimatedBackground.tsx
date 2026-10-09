"use client";

import type { SceneComponentProps } from "../../contract";

import kaleidoStyle from "./kaleido.module.css";

export default function VerdantAnimatedBackground({ quality }: SceneComponentProps) {

  return (
    <div className="w-screen h-screen fixed  select-none pointer-events-none flex items-center justify-center">
      <div className={`${kaleidoStyle.wrapper}`}>
        <div className={`${kaleidoStyle.kaleidoscope}`}>
          {new Array(23).fill(null).map((_, outerIndex) => (
            <div key={outerIndex} className={kaleidoStyle.container}>
              {new Array(6).fill(null).map((_, innerIndex) => (
                <div key={innerIndex} className={kaleidoStyle.tile}>
                  <div
                    className={`${kaleidoStyle.texture}  ${
                      quality === "rich"
                        ? kaleidoStyle.animated
                        : ""
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
