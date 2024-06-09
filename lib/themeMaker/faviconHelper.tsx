import { ReactNode } from "react";
import { hexToRgba } from "./colorHelper";
import { rgb } from "color-convert";

export const generateStopNodes = (
  stops: FaviconGradientStop[]
): ReactNode[] => {
  const sortedStops = [...stops].sort((a, b) => a.offset - b.offset);

  const stopNodes = sortedStops.map((stop, index) => (
    <stop key={index} offset={stop.offset} stopColor={stop.color} />
  ));

  return stopNodes;
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

      const stops = gradient.stops?.map((stop, stopIndex) => (
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
          const { angle } = gradient as LinearGradientData;
          return (
            <linearGradient
              key={index}
              id={`${uniqueId}-${index}`}
              x1={0}
              x2={1}
              y1={0}
              y2={0}
              gradientTransform={generateBackdropLinearTransform(
                (angle || 0) - 90
              )}
              gradientUnits="userSpaceOnUse"
            >
              {stops}
            </linearGradient>
          );

        case "radial-gradient":
          const { posX, posY, sizeX, sizeY } = gradient as RadialGradientData;
          const gradientTransform = `matrix(${((sizeX / 100) * 1016).toFixed(
            3
          )} 0 0 ${((sizeY / 100) * 1016).toFixed(3)} ${(
            (posX / 100) * 1016 +
            22.3
          ).toFixed(3)} ${((posY / 100) * 1016 + 22.3).toFixed(3)})`;
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

  const gradientPaths = gradients
    .map((gradient, index) => {
      if (gradient.disabled) {
        return null;
      }

      return (
        <path
          key={index}
          d="M22.2699 530.27C22.2699 249.709 249.709 22.2699 530.27 22.2699C810.831 22.2699 1038.27 249.709 1038.27 530.27C1038.27 810.831 810.831 1038.27 530.27 1038.27C249.709 1038.27 22.2699 810.831 22.2699 530.27Z"
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
  const canvasSize = 1060.54;
  const baseScale = 995;

  const radians = angle * (Math.PI / 180);

  const maxDimension =
    Math.abs(Math.cos(radians) * baseScale) +
    Math.abs(Math.sin(radians) * baseScale);

  const transform = `translate(${((canvasSize - maxDimension) / 2).toFixed(
    3
  )} ${(canvasSize / 2).toFixed(3)}) rotate(${angle.toFixed(3)} ${(
    maxDimension / 2
  ).toFixed(3)} 0) scale(${maxDimension.toFixed(3)})`;

  return transform;
};
