import { ReactNode } from "react";

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
