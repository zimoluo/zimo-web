import { ReactNode } from "react";
import { hexToRgba, rgbaToHex } from "./colorHelper";
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
    color: "#ffffff00",
    offset: 0,
  },
  {
    color: "#ffffff00",
    offset: 100,
  },
];

export const gradientStopToFaviconGradientStop = (
  gradientStop: Partial<GradientStop>
): FaviconGradientStop => {
  const newStop: any = {};

  if (gradientStop.hasOwnProperty("at")) {
    newStop.offset = (gradientStop.at as number) / 100;
  }

  if (
    gradientStop.hasOwnProperty("color") &&
    gradientStop.hasOwnProperty("opacity")
  ) {
    const color = gradientStop.color as ColorTriplet;
    newStop.color = rgbaToHex({
      r: color[0],
      g: color[1],
      b: color[2],
      a: gradientStop.opacity as number,
    });
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
    at: faviconGradientStop.offset * 100,
  };
};
