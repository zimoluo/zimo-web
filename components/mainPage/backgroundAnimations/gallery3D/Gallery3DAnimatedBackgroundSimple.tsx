"use client";

import Gallery3DFavicon from "@/components/assets/displayFavicon/custom/Gallery3DFavicon";
import colorConvert from "color-convert";
import { randomUniform } from "@/lib/generalHelper";
import { useState } from "react";

const { hsl } = colorConvert;

export default function Gallery3DAnimatedBackgroundSimple() {
  const [hue] = useState(randomUniform(0, 360));
  const multipliers = [-2, -1, 0, 1, 2];
  const spacing = 19.2;

  return (
    <div
      className="w-large-screen h-large-screen -z-20 inset-0 fixed pointer-events-none select-none flex justify-center items-center"
      aria-hidden="true"
    >
      {multipliers.flatMap((multiplierX) =>
        multipliers.map((multiplierY) => {
          const posX = multiplierX * spacing;
          const posY = multiplierY * spacing;
          const distance = Math.sqrt(posX ** 2 + posY ** 2) / (spacing * 2.83);
          const innerL = 82 - distance * 16.5;
          const outerL = innerL - 4;
          const s = 12;
          const innerColorPreset = `#${hsl.hex([
            hue,
            s,
            innerL,
          ])}`.toLowerCase() as HexColor;
          const outerColorPreset = `#${hsl.hex([
            hue,
            s,
            outerL,
          ])}`.toLowerCase() as HexColor;

          return (
            <div
              key={`${multiplierX}-${multiplierY}`}
              className="absolute w-[11.2lvmax] h-[11.2lvmax] aspect-square"
              style={{
                transform: `translate(${posX}lvmax, ${posY}lvmax)`,
              }}
              aria-hidden="true"
            >
              <Gallery3DFavicon
                className="w-full h-full"
                innerColorPreset={innerColorPreset}
                outerColorPreset={outerColorPreset}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
