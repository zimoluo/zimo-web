"use client";

import { useEffect, useState } from "react";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import colorConvert from "color-convert";
import { randomUniform } from "@/lib/generalHelper";
import ConfigFavicon from "../ConfigFavicon";

const { hsv } = colorConvert;

export default function GalleryFavicon({ className = "" }: ImageIconProps) {
  const [faviconConfig, setFaviconConfig] = useState<FaviconConfig>({
    mode: "separate",
    outline: "#414141",
    gradient: [
      {
        stops: [
          { color: "#b3b3b3", offset: 0.0 },
          { color: "#eaeaea", offset: 1.0 },
        ],
      },
    ],
  });

  useEffect(() => {
    const randomColor = `#${hsv.hex([
      randomUniform(0, 360),
      68,
      80,
    ])}`.toLowerCase() as HexColor;
    const { shadeMap } = generateShadeMap(randomColor, 32);
    const config: FaviconConfig = {
      mode: "separate",
      outline: shadeMap[23],
      gradient: [
        {
          stops: [
            { color: shadeMap[10], offset: 0.0 },
            { color: shadeMap[4], offset: 1.0 },
          ],
        },
      ],
    };

    setFaviconConfig(config);
  }, []);

  return (
    <ConfigFavicon
      className={className}
      customThemeConfig={
        {
          favicon: faviconConfig,
          palette: { page: [{ type: "linear-gradient" }] },
        } as ThemeDataConfig
      }
    />
  );
}
