import { ReactNode } from "react";
import { hexToRgba } from "./colorHelper";
import colorConvert from "color-convert";

const { rgb } = colorConvert;

const BACKDROP_CANVAS_SIZE = 1024;
const BACKDROP_BASE_SCALE = 940;

export const generateStopNodes = (
  stops: FaviconGradientStop[]
): ReactNode[] => {
  const sortedStops = [...stops].sort((a, b) => a.offset - b.offset);

  const stopNodes = sortedStops.map((stop, index) => (
    <stop key={index} offset={stop.offset} stopColor={stop.color} />
  ));

  return stopNodes;
};

export const getHexOutlineColor = (themeConfig: ThemeDataConfig): HexColor => {
  const outlineConfig = themeConfig.favicon.outline ?? "primary";
  if (outlineConfig.startsWith("#")) {
    return outlineConfig as HexColor;
  }

  if (outlineConfig === "site") {
    return themeConfig.siteThemeColor;
  }

  return `#${rgb.hex(
    themeConfig.palette[outlineConfig as Exclude<AccentColors, "site">]
  )}`;
};

// Get a size-optimized theme config that is only suitable for generating favicons.
// The return type is very confusing and doesn't make sense at all so only use this function when you know what you are doing.
export const getOptimizedThemeConfigForFaviconOnly = (
  themeConfig: ThemeDataConfig
): ThemeDataConfig => {
  const updatedFavicon = {
    ...themeConfig.favicon,
    outline: getHexOutlineColor(themeConfig),
    backdropGradient:
      themeConfig.favicon.mode === "backdrop" &&
      !themeConfig.favicon.backdropGradient
        ? themeConfig.palette.page
        : themeConfig.favicon.backdropGradient,
  };

  return {
    palette: { page: [] },
    favicon: updatedFavicon,
  } as unknown as ThemeDataConfig;
};

export const emptyFaviconStops: FaviconGradientStop[] = [
  {
    color: "#ffffff",
    offset: 0,
  },
  {
    color: "#ffffff",
    offset: 100,
  },
];

export const gradientStopToFaviconGradientStop = (
  gradientStop: Partial<GradientStop>
): FaviconGradientStop => {
  const newStop: any = {};

  if (gradientStop.hasOwnProperty("at")) {
    newStop.offset =
      Math.round(((gradientStop.at as number) / 100) * 1000) / 1000;
  }

  if (
    gradientStop.hasOwnProperty("color") &&
    gradientStop.hasOwnProperty("opacity")
  ) {
    const color = gradientStop.color as ColorTriplet;
    newStop.color = `#${rgb.hex(color).toLowerCase()}`;
  }

  return newStop as FaviconGradientStop;
};

export const faviconGradientStopToGradientStop = (
  faviconGradientStop: FaviconGradientStop
): GradientStop => {
  const { r, g, b, a } = hexToRgba(faviconGradientStop.color);

  return {
    color: [r, g, b],
    opacity: a,
    at: Math.round(faviconGradientStop.offset * 100 * 1000) / 1000,
  };
};

export const generateTranslatedBackdropGradients = (
  gradients: ColorGradient[],
  uniqueId: string
): { gradientDefinitions: ReactNode[]; gradientPaths: ReactNode[] } => {
  const gradientDefinitions = gradients
    .map((gradient, index) => {
      if (gradient.disabled) {
        return null;
      }

      const stops = structuredClone(gradient)
        .stops?.sort((a, b) => a.at - b.at)
        .map((stop, stopIndex) => (
          <stop
            key={stopIndex}
            offset={`${(stop.at / 100).toFixed(3)}`}
            style={{
              stopColor: `rgb(${stop.color[0]}, ${stop.color[1]}, ${stop.color[2]})`,
              stopOpacity: stop.opacity,
            }}
          />
        ));

      switch (gradient.type) {
        case "linear-gradient":
          const {
            angle,
            linearGradientKeyword,
            linearHorizontalOrientation,
            linearVerticalOrientation,
          } = gradient as LinearGradientData & LinearGradientOrientationData;

          let parsedAngle = angle || 0;

          if (linearGradientKeyword) {
            const horizontal = linearHorizontalOrientation ?? "left";
            const vertical = linearVerticalOrientation ?? "top";

            const angleMap = {
              "left-top": -45,
              "left-bottom": 225,
              "right-top": 45,
              "right-bottom": 135,
            };

            const angleKey =
              `${horizontal}-${vertical}` as keyof typeof angleMap;
            parsedAngle = angleMap[angleKey];
          }

          return (
            <linearGradient
              key={index}
              id={`${uniqueId}-${index}`}
              x1={0}
              x2={1}
              y1={0}
              y2={0}
              gradientTransform={generateBackdropLinearTransform(
                parsedAngle - 90
              )}
              gradientUnits="userSpaceOnUse"
            >
              {stops}
            </linearGradient>
          );

        case "radial-gradient":
          const { posX, posY, sizeX, sizeY, isCircle, sizeKeyword } =
            gradient as RadialGradientData & CircleRadialGradientAdditionalData;

          let gradientTransform;

          if (!isCircle) {
            gradientTransform = `matrix(${(
              (sizeX / 100) *
              BACKDROP_BASE_SCALE
            ).toFixed(3)} 0 0 ${((sizeY / 100) * BACKDROP_BASE_SCALE).toFixed(
              3
            )} ${(
              (posX / 100) * BACKDROP_BASE_SCALE +
              (BACKDROP_CANVAS_SIZE - BACKDROP_BASE_SCALE) / 2
            ).toFixed(3)} ${(
              (posY / 100) * BACKDROP_BASE_SCALE +
              (BACKDROP_CANVAS_SIZE - BACKDROP_BASE_SCALE) / 2
            ).toFixed(3)})`;
          } else {
            let radius: number = 0;

            switch (sizeKeyword ?? "farthest-corner") {
              case "farthest-side":
                radius = Math.max(
                  Math.abs(posX - 0),
                  Math.abs(posX - 100),
                  Math.abs(posY - 0),
                  Math.abs(posY - 100)
                );
                break;
              case "farthest-corner":
                radius = Math.max(
                  Math.sqrt(Math.pow(posX - 0, 2) + Math.pow(posY - 0, 2)),
                  Math.sqrt(Math.pow(posX - 100, 2) + Math.pow(posY - 0, 2)),
                  Math.sqrt(Math.pow(posX - 0, 2) + Math.pow(posY - 100, 2)),
                  Math.sqrt(Math.pow(posX - 100, 2) + Math.pow(posY - 100, 2))
                );
                break;
              case "closest-side":
                radius = Math.min(
                  Math.abs(posX - 0),
                  Math.abs(posX - 100),
                  Math.abs(posY - 0),
                  Math.abs(posY - 100)
                );
                break;
              case "closest-corner":
                radius = Math.min(
                  Math.sqrt(Math.pow(posX - 0, 2) + Math.pow(posY - 0, 2)),
                  Math.sqrt(Math.pow(posX - 100, 2) + Math.pow(posY - 0, 2)),
                  Math.sqrt(Math.pow(posX - 0, 2) + Math.pow(posY - 100, 2)),
                  Math.sqrt(Math.pow(posX - 100, 2) + Math.pow(posY - 100, 2))
                );
                break;
            }

            radius = (radius / 100) * BACKDROP_BASE_SCALE;

            gradientTransform = `matrix(${radius.toFixed(
              3
            )} 0 0 ${radius.toFixed(3)} ${(
              (posX / 100) * BACKDROP_BASE_SCALE +
              (BACKDROP_CANVAS_SIZE - BACKDROP_BASE_SCALE) / 2
            ).toFixed(3)} ${(
              (posY / 100) * BACKDROP_BASE_SCALE +
              (BACKDROP_CANVAS_SIZE - BACKDROP_BASE_SCALE) / 2
            ).toFixed(3)})`;
          }
          return (
            <radialGradient
              key={index}
              id={`${uniqueId}-${index}`}
              gradientTransform={gradientTransform}
              gradientUnits="userSpaceOnUse"
              cx={0}
              cy={0}
              r={1}
            >
              {stops}
            </radialGradient>
          );

        default:
          return null;
      }
    })
    .filter(Boolean);

  const gradientPaths = structuredClone(gradients)
    .map((gradient, index) => {
      if (gradient.disabled) {
        return null;
      }

      return (
        <circle
          cx={512}
          cy={512}
          r={470}
          key={index}
          fill={`url(#${uniqueId}-${index})`}
          fillRule="nonzero"
          opacity="1"
          stroke="none"
        />
      );
    })
    .filter(Boolean);

  gradientPaths.reverse();

  return { gradientDefinitions, gradientPaths };
};

const generateBackdropLinearTransform = (angle: number) => {
  const radians = angle * (Math.PI / 180);

  const maxDimension =
    Math.abs(Math.cos(radians) * BACKDROP_BASE_SCALE) +
    Math.abs(Math.sin(radians) * BACKDROP_BASE_SCALE);

  const transform = `translate(${(
    (BACKDROP_CANVAS_SIZE - maxDimension) /
    2
  ).toFixed(3)} ${(BACKDROP_CANVAS_SIZE / 2).toFixed(
    3
  )}) rotate(${angle.toFixed(3)} ${(maxDimension / 2).toFixed(
    3
  )} 0) scale(${maxDimension.toFixed(3)})`;

  return transform;
};
