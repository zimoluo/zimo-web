"use client";

import { useWindowAction } from "@/components/contexts/WindowActionContext";

interface Props {
  url: string;
}

export default function WindowIFrame({ url }: Props) {
  const { isWindowDragging, isWindowResizing } = useWindowAction();
  const isDisabled = isWindowDragging || isWindowResizing;

  return (
    <iframe
      src={url}
      className={`w-full h-full bg-widget-80 ${
        isDisabled ? "pointer-events-none select-none touch-none" : ""
      }`}
      aria-disabled={isDisabled}
    />
  );
}
