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
import backdropStyles from "./backdrop.module.css";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";

type Props = ImageIconProps & { customThemeConfig?: ThemeDataConfig | null };

export default function ConfigFavicon({
  className = "",
  customThemeConfig = null,
}: Props) {
  const { themeConfig } = useTheme();
  const adaptedThemeConfig = customThemeConfig ?? themeConfig;
  const config = adaptedThemeConfig.favicon;

  const baseIds = ["a8cfb8f678d", "bfe8d6b33c2", "c1c09383770"];
  const uniqueIdSuffix = useMemo(
    () => hashAndEncode(adaptedThemeConfig),
    [adaptedThemeConfig, hashAndEncode]
  );

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
    return rawBackdropConfig
      .filter((element) => !element.disabled)
      .every((element) =>
        ["linear-gradient", "radial-gradient"].includes(element.type)
      );
  }, [rawBackdropConfig]);

  const {
    gradientDefinitions: backdropGradientDefinitions,
    gradientPaths: backdropGradientPaths,
  } = useMemo(() => {
    return config.mode === "backdrop" && canUseTranslatedBackdropFavicon
      ? generateTranslatedBackdropGradients(rawBackdropConfig, getUniqueId(0))
      : { gradientDefinitions: [], gradientPaths: [] };
  }, [rawBackdropConfig, canUseTranslatedBackdropFavicon, config]);

  return (
    <div className={`${backdropStyles.container} ${className}`}>
      {config.mode === "backdrop" && !canUseTranslatedBackdropFavicon && (
        <div
          style={generateInlineStyleObject({
            page: rawBackdropConfig,
          })}
          className={`${backdropStyles.backdrop}`}
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
        viewBox="0 0 1060.54 1060.54"
        aria-label="The website's favicon used for display purposes"
        className="relative"
      >
        {!["backdrop", "outline", "custom"].includes(config.mode) && (
          <>
            <defs>
              <linearGradient
                id={getUniqueId(0)}
                x1={0}
                x2={1}
                y1={0}
                y2={0}
                gradientTransform={`translate(0 525) rotate(${
                  faviconStopsConfigArray[0].angle || 0
                } 525 0) scale(1050)`}
                gradientUnits="userSpaceOnUse"
              >
                {generateStopNodes(faviconStopsConfigArray[0].stops)}
              </linearGradient>
              <linearGradient
                id={getUniqueId(1)}
                x1={0}
                x2={1}
                y1={0}
                y2={0}
                gradientTransform={`translate(265 960) rotate(${
                  faviconStopsConfigArray[1].angle || 0
                } 500 0) scale(1050)`}
                gradientUnits="userSpaceOnUse"
              >
                {generateStopNodes(faviconStopsConfigArray[1].stops)}
              </linearGradient>
              <linearGradient
                id={getUniqueId(2)}
                x1={0}
                x2={1}
                y1={0}
                y2={0}
                gradientTransform={`translate(-270.9 960) rotate(${
                  faviconStopsConfigArray[2].angle || 0
                } 500 0) scale(1040)`}
                gradientUnits="userSpaceOnUse"
              >
                {generateStopNodes(faviconStopsConfigArray[2].stops)}
              </linearGradient>
            </defs>
            <path
              fill={`url(#${getUniqueId(0)})`}
              d="M22.27 530.27c0-280.561 227.439-508 508-508s508 227.439 508 508-227.439 508-508 508-508-227.439-508-508"
            />
            {config.mode === "separate" && (
              <>
                <path
                  fill={`url(#${getUniqueId(1)})`}
                  d="M781.5 462.562c-279.885 1.221-507.017 223.47-517 500.657 77.322 47.561 168.342 75.061 265.781 75.061 280.561 0 507.999-227.438 507.999-507.999 0-.377-.03-.748-.03-1.125-75.872-42.705-163.462-67-256.75-66.594"
                />
                <path
                  fill={`url(#${getUniqueId(2)})`}
                  d="M246.844 464.875c-80.385.351-156.418 18.965-224.219 51.844-.119 4.517-.344 9.016-.344 13.562 0 183.107 96.924 343.544 242.219 432.938 6.496-180.361 104.98-337.385 250.062-425.469-78.322-46.645-169.911-73.301-267.718-72.875"
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
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeWidth={40}
          d="M22.264 530.264c0-280.56 227.44-508 508-508s507.996 227.44 507.996 508-227.435 507.996-507.996 507.996-508-227.435-508-507.996Zm224.574-65.395c-80.385.351-156.418 18.966-224.219 51.844-.118 4.518-.343 9.017-.343 13.563 0 183.106 96.924 343.543 242.218 432.937 6.496-180.361 104.98-337.385 250.063-425.469-78.323-46.644-169.912-73.301-267.719-72.875Zm534.656-2.312c-279.884 1.221-507.016 223.469-517 500.656 77.323 47.567 168.342 75.067 265.782 75.067 280.56 0 508.004-227.444 508.004-508.004 0-.377-.03-.748-.04-1.125-75.868-42.706-163.458-67-256.746-66.594Z"
        />
      </svg>
    </div>
  );
}
