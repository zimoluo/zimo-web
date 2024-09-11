import { useState, useRef, useEffect } from "react";
import windowStyle from "./window-instance.module.css";
import { useDragAndTouch } from "@/lib/helperHooks";

interface Props {
  data: WindowData;
}

const parseWindowDimension = (dimension: WindowDimension): string => {
  if (typeof dimension === "number") {
    return `${dimension}px`;
  }

  if (dimension === "fit") {
    return "fit-content";
  }

  if (dimension === "screen") {
    return "80%";
  }

  return "auto";
};

const parseWindowPosition = (position: WindowPosition): string => {
  if (typeof position === "number") {
    return `${position}px`;
  }

  if (position === "center") {
    return "50%";
  }

  return "0px";
};

export default function WindowInstance({ data }: Props) {
  const [windowState, setWindowState] = useState<WindowState>({
    x: 20,
    y: 20,
    height: data.defaultHeight,
    width: data.defaultWidth,
    data,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  const [windowDraggingData, setWindowDraggingData] = useState({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });
  const [isWindowDragging, setIsWindowDragging] = useState(false);
  const [windowResizingData, setWindowResizingData] = useState({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });
  const [isWindowResizing, setIsWindowResizing] = useState(false);

  const canBeMoved =
    !data.disableMove &&
    typeof windowState.x === "number" &&
    typeof windowState.y === "number";
  const canBeResizedAtAll =
    (!data.disableHeightAdjustment && typeof data.defaultHeight === "number") ||
    (!data.disableWidthAdjustment && typeof data.defaultWidth === "number");

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const isTouchEvent = "touches" in e;
    setWindowResizingData({
      startX: isTouchEvent ? e.touches[0].clientX : e.clientX,
      startY: isTouchEvent ? e.touches[0].clientY : e.clientY,
      startWidth: windowRef.current?.offsetWidth || 0,
      startHeight: windowRef.current?.offsetHeight || 0,
    });
    setIsWindowResizing(true);
  };

  const handleResizeMove = (e: MouseEvent | TouchEvent) => {
    const isTouchEvent = "touches" in e;
    const { startX, startY, startWidth, startHeight } = windowResizingData;
    if (!data.disableWidthAdjustment && typeof windowState.width === "number") {
      const newWidth =
        startWidth + (isTouchEvent ? e.touches[0].clientX : e.clientX) - startX;
      setWindowState((prev) => ({ ...prev, width: newWidth }));
    }
    if (
      !data.disableHeightAdjustment &&
      typeof windowState.height === "number"
    ) {
      const newHeight =
        startHeight +
        (isTouchEvent ? e.touches[0].clientY : e.clientY) -
        startY;
      setWindowState((prev) => ({ ...prev, height: newHeight }));
    }
  };

  const handleResizeEnd = () => {
    setIsWindowResizing(false);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const isTouchEvent = "touches" in e;
    setWindowDraggingData({
      startX: isTouchEvent ? e.touches[0].clientX : e.clientX,
      startY: isTouchEvent ? e.touches[0].clientY : e.clientY,
      startLeft: windowRef.current?.offsetLeft || 0,
      startTop: windowRef.current?.offsetTop || 0,
    });
    setIsWindowDragging(true);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const isTouchEvent = "touches" in e;
    const { startX, startY, startLeft, startTop } = windowDraggingData;

    const newX =
      startLeft + (isTouchEvent ? e.touches[0].clientX : e.clientX) - startX;
    const newY =
      startTop + (isTouchEvent ? e.touches[0].clientY : e.clientY) - startY;
    setWindowState((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleDragEnd = () => {
    setIsWindowDragging(false);
  };

  const { handleStartDragging, handleStartTouching } = useDragAndTouch({
    onStart: handleDragStart,
    onMove: handleDragMove,
    onFinish: handleDragEnd,
  });

  const {
    handleStartDragging: handleStartResizing,
    handleStartTouching: handleStartTouchResizing,
  } = useDragAndTouch({
    onStart: handleResizeStart,
    onMove: handleResizeMove,
    onFinish: handleResizeEnd,
  });

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.width = parseWindowDimension(windowState.width);
      windowRef.current.style.height = parseWindowDimension(windowState.height);
      windowRef.current.style.left = parseWindowPosition(windowState.x);
      windowRef.current.style.top = parseWindowPosition(windowState.y);
    }
  }, [windowState]);

  return (
    <div
      ref={windowRef}
      className="rounded-xl shadow-lg fixed"
      style={{
        zIndex: (data.layer || 0) + 11,
      }}
    >
      <div className="relative">
        <div className="absolute right-0 bottom-0 -translate-y-4 -translate-x-4 h-0 w-0">
          {canBeResizedAtAll && (
            <div
              className={`h-10 w-10 p-1 group ${
                isWindowResizing ? "cursor-grabbing" : ""
              }`}
            >
              <div
                className={`w-full h-full touch-none ${
                  isWindowResizing ? "" : "cursor-grab"
                }`}
                onMouseDown={handleStartResizing}
                onTouchStart={handleStartTouchResizing}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 512 512"
                  className={`w-full h-auto aspect-square ${
                    isWindowResizing
                      ? "opacity-90 scale-[1.18]"
                      : "opacity-30 group-hover:opacity-80 group-hover:scale-110"
                  } transition-all duration-300 ease-out`}
                >
                  <path
                    className="stroke-saturated backdrop-blur"
                    strokeLinecap="round"
                    strokeWidth={145}
                    d="M389.032 129.005a316.213 316.213 0 0 1-266.789 254.72"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="relative">{data.content}</div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-4 h-0 flex items-center justify-center w-full">
          {canBeMoved && (
            <div
              className={`${
                isWindowDragging
                  ? windowStyle.dragBarContainerOn
                  : windowStyle.dragBarContainer
              } flex items-center justify-center group transition-all duration-300 ease-out ${
                isWindowDragging ? "cursor-grabbing" : ""
              }`}
            >
              <div
                className={`${windowStyle.dragBar} ${
                  isWindowDragging
                    ? "opacity-90"
                    : "cursor-grab opacity-30 group-hover:opacity-80"
                } bg-saturated transition-all duration-300 ease-out rounded-full touch-none`}
                onMouseDown={handleStartDragging}
                onTouchStart={handleStartTouching}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
