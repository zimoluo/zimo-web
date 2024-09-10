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

  const canBeMoved =
    data.canBeMoved &&
    typeof windowState.x === "number" &&
    typeof windowState.y === "number";

  const handleResize = (
    e: React.MouseEvent,
    direction: "width" | "height" | "both"
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowRef.current?.offsetWidth || 0;
    const startHeight = windowRef.current?.offsetHeight || 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (
        (direction === "width" || direction === "both") &&
        windowState.data.widthAdjustible
      ) {
        const newWidth = startWidth + e.clientX - startX;
        setWindowState((prev) => ({ ...prev, width: newWidth }));
      }
      if (
        (direction === "height" || direction === "both") &&
        windowState.data.heightAdjustible
      ) {
        const newHeight = startHeight + e.clientY - startY;
        setWindowState((prev) => ({ ...prev, height: newHeight }));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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

  const handleMove = (e: MouseEvent | TouchEvent) => {
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
    onMove: handleMove,
    onStart: handleDragStart,
    onFinish: handleDragEnd,
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
        <div className="relative">{data.content}</div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-4 h-0 flex items-center justify-center w-full">
          <div
            className={`${
              windowStyle.dragBarContainer
            } flex items-center justify-center group transition-all duration-300 ease-out ${
              isWindowDragging ? "cursor-grabbing" : ""
            }`}
          >
            <div
              className={`${windowStyle.dragBar} ${
                isWindowDragging ? "" : "cursor-grab"
              } bg-saturated bg-opacity-50 group-hover:bg-opacity-70 transition-all duration-300 ease-out rounded-full backdrop-blur shadow-sm`}
              onMouseDown={handleStartDragging}
              onTouchStart={handleStartTouching}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
