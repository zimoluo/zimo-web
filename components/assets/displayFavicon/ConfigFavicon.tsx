"id random";
"use client";

import { useTheme } from "@/components/contexts/ThemeContext";
import { hashAndEncode } from "@/lib/generalHelper";
import {
  emptyFaviconStops,
  generateStopNodes,
  generateTranslatedBackdropGradients,
  getHexOutlineColor,
} from "@/lib/themeMaker/faviconHelper";
import { useMemo } from "react";
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

  const strokeColor = getHexOutlineColor(adaptedThemeConfig);

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
        fill="none"
        viewBox="0 0 1024 1024"
        aria-label="The website's favicon used for display purposes"
        className={`relative ${innerClassName}`}
      >
        {!["backdrop", "outline", "custom"].includes(config.mode) && (
          <>
            <defs>
              <linearGradient
                id={getUniqueId(0)}
                x1={62}
                x2={962}
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
                x1={284.3}
                x2={1229.5}
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
                x1={-232.2}
                x2={713}
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
          strokeWidth={64}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M260.875 921.071C123.592 836.607 32.011 685.015 32.011 512.004C32.011 507.708 32.2239 503.457 32.3354 499.189C96.3983 468.123 168.24 450.535 244.192 450.203C336.607 449.8 423.147 474.988 497.151 519.06C360.067 602.288 267.013 750.654 260.875 921.071ZM260.875 921.071C270.309 659.167 484.918 449.172 749.371 448.018C837.516 447.635 920.277 470.589 991.962 510.941C991.972 511.297 992 511.648 992 512.004C992 777.096 777.096 992 512.004 992C419.936 992 333.935 966.016 260.875 921.071ZM32 511.992C32 246.9 246.9 32 511.992 32C777.084 32 991.981 246.9 991.981 511.992C991.981 777.084 777.086 991.981 511.992 991.981C246.898 991.981 32 777.086 32 511.992Z"
        />
      </svg>
    </div>
  );
}
