"id random";
"use client";

import { useTheme } from "@/components/contexts/ThemeContext";
import { hashAndEncode } from "@/lib/generalHelper";
import {
  emptyFaviconStops,
  generateStopNodes,
  generateTranslatedBackdropGradients,
} from "@/lib/themeMaker/faviconHelper";
import { useMemo } from "react";
import { rgb } from "color-convert";
import backdropStyle from "./backdrop.module.css";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";

type Props = ImageIconProps & {
  customThemeConfig?: ThemeDataConfig | null;
  innerClassName?: string;
};

export default function ConfigFavicon({
  className = "",
  customThemeConfig = null,
  innerClassName = "",
}: Props) {
  const { themeConfig } = useTheme();
  const adaptedThemeConfig = customThemeConfig ?? themeConfig;
  const config = adaptedThemeConfig.favicon;

  const baseIds = ["a8cfb8f678da", "bfe8d6b33c2b", "c1c09383770c"];
  const uniqueIdSuffix = useMemo(
    () => hashAndEncode(adaptedThemeConfig),
    [adaptedThemeConfig, hashAndEncode]
  );

  const prohibitSVG = config.backdropProhibitSVG;

  const getUniqueId = (index: number) => `${baseIds[index]}-${uniqueIdSuffix}`;

  const faviconStopsConfigArray: [
    FaviconGradientStopsConfig,
    FaviconGradientStopsConfig,
    FaviconGradientStopsConfig
  ] = (() => {
    const stops: [
      FaviconGradientStopsConfig,
      FaviconGradientStopsConfig,
      FaviconGradientStopsConfig
    ] = [
      structuredClone({ stops: emptyFaviconStops }),
      structuredClone({ stops: emptyFaviconStops }),
      structuredClone({ stops: emptyFaviconStops }),
    ];

    if (!config.gradient) {
      return stops;
    }

    const gradientConfig = config.gradient;

    if (gradientConfig.length === 1) {
      stops.fill(gradientConfig[0]);
    } else {
      stops.forEach((_, index) => (stops[index] = gradientConfig[index]));
    }

    return stops;
  })();

  const rawBackdropConfig: ColorGradient[] =
    config.backdropGradient ?? adaptedThemeConfig.palette.page;

  const strokeColor: HexColor = (() => {
    const outlineConfig = config.outline ?? "primary";
    if (outlineConfig.startsWith("#")) {
      return outlineConfig as HexColor;
    }

    if (outlineConfig === "site") {
      return adaptedThemeConfig.siteThemeColor;
    }

    return `#${rgb.hex(
      adaptedThemeConfig.palette[outlineConfig as Exclude<AccentColors, "site">]
    )}`;
  })();

  const canUseTranslatedBackdropFavicon: boolean = useMemo(() => {
    return (
      !prohibitSVG &&
      rawBackdropConfig
        .filter((element) => !element.disabled)
        .every(
          (element) =>
            ["linear-gradient", "radial-gradient"].includes(element.type) &&
            (!element.colorInterpolation ||
              ["default", "srgb", "oklab"].includes(
                element.colorInterpolation.colorSpace
              ))
        )
    );
  }, [rawBackdropConfig, prohibitSVG]);

  const {
    gradientDefinitions: backdropGradientDefinitions,
    gradientPaths: backdropGradientPaths,
  } = useMemo(() => {
    return config.mode === "backdrop" && canUseTranslatedBackdropFavicon
      ? generateTranslatedBackdropGradients(rawBackdropConfig, getUniqueId(0))
      : { gradientDefinitions: [], gradientPaths: [] };
  }, [rawBackdropConfig, canUseTranslatedBackdropFavicon, config]);

  return (
    <div className={`${backdropStyle.container} ${className}`}>
      {config.mode === "backdrop" && !canUseTranslatedBackdropFavicon && (
        <div
          style={generateInlineStyleObject({
            page: rawBackdropConfig,
          })}
          className={`${backdropStyle.backdrop} ${innerClassName}`}
        />
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        strokeMiterlimit={10}
        style={{
          fillRule: "nonzero",
          clipRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        viewBox="0 0 1024 1024"
        aria-label="The website's favicon used for display purposes"
        className={`relative ${innerClassName}`}
      >
        {!["backdrop", "outline", "custom"].includes(config.mode) && (
          <>
            <defs>
              <linearGradient
                id={getUniqueId(0)}
                x1={61}
                x2={963}
                y1={512}
                y2={512}
                gradientTransform={`rotate(${
                  faviconStopsConfigArray[0].angle || 0
                } 512 512)`}
                gradientUnits="userSpaceOnUse"
              >
                {generateStopNodes(faviconStopsConfigArray[0].stops)}
              </linearGradient>
              <linearGradient
                id={getUniqueId(1)}
                x1={285.3}
                x2={1228.5}
                y1={948.5}
                y2={948.5}
                gradientTransform={`rotate(${
                  faviconStopsConfigArray[1].angle || 0
                } 757 948.5)`}
                gradientUnits="userSpaceOnUse"
              >
                {generateStopNodes(faviconStopsConfigArray[1].stops)}
              </linearGradient>
              <linearGradient
                id={getUniqueId(2)}
                x1={-231.2}
                x2={712}
                y1={951}
                y2={951}
                gradientTransform={`rotate(${
                  faviconStopsConfigArray[2].angle || 0
                } 240.4 951)`}
                gradientUnits="userSpaceOnUse"
              >
                {generateStopNodes(faviconStopsConfigArray[2].stops)}
              </linearGradient>
            </defs>
            <path
              fill={`url(#${getUniqueId(0)})`}
              d="M34 512C34 248.008 248.008 34 512 34C775.992 34 990 248.008 990 512C990 775.992 775.992 990 512 990C248.008 990 34 775.992 34 512Z"
            />
            {config.mode === "separate" && (
              <>
                <path
                  fill={`url(#${getUniqueId(1)})`}
                  d="M748.412 449.005C485.086 450.152 271.392 658.997 262 919.466C334.747 964.159 420.382 990 512.056 990C776.018 990 990 776.279 990 512.639C990 512.285 989.972 511.937 989.972 511.582C918.589 471.453 836.181 448.623 748.412 449.005Z"
                />
                <path
                  fill={`url(#${getUniqueId(2)})`}
                  d="M244.75 451.005C169.309 451.335 97.9533 468.853 34.3228 499.796C34.2112 504.046 34 508.281 34 512.559C34 684.882 124.962 835.871 261.32 920C267.416 750.261 359.842 602.484 496 519.588C422.496 475.69 336.54 450.604 244.75 451.005Z"
                />
              </>
            )}
          </>
        )}
        {config.mode === "backdrop" && canUseTranslatedBackdropFavicon && (
          <>
            <defs>{backdropGradientDefinitions}</defs>
            <g>{backdropGradientPaths}</g>
          </>
        )}
        <path
          fill="none"
          stroke={strokeColor}
          strokeMiterlimit={10}
          strokeWidth={62}
          d="M261.921 919.367C125.21 835.254 34.0113 684.294 34.0113 512.004C34.0113 507.726 34.223 503.493 34.334 499.242C98.13 468.306 169.672 450.791 245.308 450.46C337.338 450.059 423.517 475.142 497.213 519.031C360.7 601.912 268.034 749.66 261.921 919.367ZM261.921 919.367C271.316 658.554 485.031 449.434 748.382 448.285C836.16 447.903 918.576 470.762 989.962 510.945C989.972 511.3 990 511.649 990 512.004C990 775.991 775.991 990 512.004 990C420.32 990 334.677 964.124 261.921 919.367ZM34 511.992C34 248.005 248.005 34 511.992 34C775.98 34 989.981 248.005 989.981 511.992C989.981 775.98 775.981 989.981 511.992 989.981C248.004 989.981 34 775.981 34 511.992Z"
        />
      </svg>
    </div>
  );
}
