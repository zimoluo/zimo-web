import { ReactNode } from "react";
import { hexToOpacity, opacityToHex } from "./colorHelper";
import { rgb, hex } from "color-convert";

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
    newStop.offset = Math.round(gradientStop.at as number) / 100;
  }

  if (
    gradientStop.hasOwnProperty("color") &&
    gradientStop.hasOwnProperty("opacity")
  ) {
    newStop.color = `#${rgb.hex(
      gradientStop.color as ColorTriplet
    )}${opacityToHex(gradientStop.opacity as number)}`.toLowerCase();
  }

  return newStop as FaviconGradientStop;
};

export const faviconGradientStopToGradientStop = (
  faviconGradientStop: FaviconGradientStop
): GradientStop => {
  const trimmedColor = faviconGradientStop.color.startsWith("#")
    ? faviconGradientStop.color.slice(1)
    : faviconGradientStop.color;

  return {
    color: hex.rgb(trimmedColor.slice(0, 6)),
    opacity:
      trimmedColor.length === 8 ? hexToOpacity(trimmedColor.slice(6)) : 1,
    at: faviconGradientStop.offset * 100,
  };
};
