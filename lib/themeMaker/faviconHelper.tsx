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
