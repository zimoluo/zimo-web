"use client";

import { useWindowAction } from "@/components/contexts/WindowActionContext";

interface Props {
  url: string;
  className?: string;
  zoom?: number;
}

export default function WindowIFrame({ url, className = "", zoom = 1 }: Props) {
  const { isWindowDragging, isWindowResizing, isActiveWindow } =
    useWindowAction();
  const isDisabled = isWindowDragging || isWindowResizing;

  return (
    <div className="w-full h-full bg-widget-80 relative">
      <iframe
        src={url}
        className={`w-full h-full bg-none bg-transparent relative ${
          isDisabled ? "pointer-events-none select-none touch-none" : ""
        } ${className}`}
        aria-disabled={isDisabled}
        style={{ zoom }}
      />
      <div
        className={`absolute w-full h-full left-0 top-0 ${
          isActiveWindow
            ? "hidden pointer-events-none select-none touch-none invisible"
            : ""
        }`}
      />
    </div>
  );
}
