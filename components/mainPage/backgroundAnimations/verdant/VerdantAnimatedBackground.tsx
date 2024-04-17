"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import kaleidoStyle from "./kaleido.module.css";

export default function VerdantAnimatedBackground() {
  const { settings } = useSettings();

  return (
    <div className="w-screen h-screen fixed -z-20 select-none pointer-events-none flex items-center justify-center">
      <div className={`${kaleidoStyle.wrapper}`}>
        <div className={`${kaleidoStyle.kaleidoscope}`}>
          {new Array(23).fill(null).map((_, outerIndex) => (
            <div key={outerIndex} className={kaleidoStyle.container}>
              {new Array(6).fill(null).map((_, innerIndex) => (
                <div key={innerIndex} className={kaleidoStyle.tile}>
                  <div
                    className={`${kaleidoStyle.texture} ${
                      settings.backgroundRichness === "rich"
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
