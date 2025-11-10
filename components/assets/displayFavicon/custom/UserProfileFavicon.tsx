"use client";

import { useMemo } from "react";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import colorConvert from "color-convert";
import ConfigFavicon from "../ConfigFavicon";

const { hsv } = colorConvert;

export default function UserProfileFavicon({
  className = "",
  sub,
}: ImageIconProps & { sub: string }) {
  const faviconConfig = useMemo(() => {
    const hashedColor = `#${hsv.hex([
      Math.abs(
        sub.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) * 137
      ) % 360,
      68,
      80,
    ])}`.toLowerCase() as HexColor;

    const { shadeMap } = generateShadeMap(hashedColor, 32);

    return {
      mode: "separate",
      outline: shadeMap[26],
      gradient: [
        {
          stops: [
            { color: shadeMap[14], offset: 0.0 },
            { color: shadeMap[3], offset: 1.0 },
          ],
        },
      ],
    } as FaviconConfig;
  }, [sub]);

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
