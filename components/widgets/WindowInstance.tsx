import { useState, useRef, useEffect } from "react";
import windowStyle from "./window-instance.module.css";
import { useDragAndTouch } from "@/lib/helperHooks";
import { WindowActionProvider } from "../contexts/WindowActionContext";
import { useWindow } from "../contexts/WindowContext";

interface Props {
  data: WindowData;
}

const parseWindowDimension = (dimension: WindowDimension): string => {
  if (typeof dimension === "number") {
    return `${dimension}px`;
  }

  if (dimension === "fit") {
    return "auto";
  }

  if (dimension === "screen") {
    return "80%";
  }

  return "auto";
};

const parseWindowPosition = (position: number): string => {
  return `${position}px`;
};

export default function WindowInstance({ data }: Props) {
  const { removeWindowByUniqueId, setActiveWindow } = useWindow();

  const [windowState, setWindowState] = useState<WindowState>({
    x: 20,
    y: 20,
    height: data.defaultHeight,
    width: data.defaultWidth,
    data,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  const [isInterpolating, setIsInterpolating] = useState(false);

  const [windowStateBeforeFullscreen, setWindowStateBeforeFullscreen] =
    useState<WindowState | null>(null);

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

  const [windowProportions, setWindowProportions] = useState({
    xProportion: 0,
    yProportion: 0,
  });

  const canBeMoved = !data.disableMove;
  const canBeResizedAtAll =
    (!data.disableHeightAdjustment && typeof data.defaultHeight === "number") ||
    (!data.disableWidthAdjustment && typeof data.defaultWidth === "number");

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setWindowResizingData({
      startX: clientX,
      startY: clientY,
      startWidth: windowRef.current?.offsetWidth || 0,
      startHeight: windowRef.current?.offsetHeight || 0,
    });
    setIsWindowResizing(true);
  };

  const handleResizeMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const { startX, startY, startWidth, startHeight } = windowResizingData;

    setWindowStateBeforeFullscreen(null);

    setWindowState((prev) => ({
      ...prev,
      width:
        !data.disableWidthAdjustment && typeof prev.width === "number"
          ? Math.max(
              data.minWidth ?? startWidth + clientX - startX,
              Math.min(
                startWidth + clientX - startX,
                data.maxWidth ?? Infinity,
                window.innerWidth - 24 - windowState.x
              )
            )
          : prev.width,
      height:
        !data.disableHeightAdjustment && typeof prev.height === "number"
          ? Math.max(
              data.minHeight ?? startHeight + clientY - startY,
              Math.min(
                startHeight + clientY - startY,
                data.maxHeight ?? Infinity,
                window.innerHeight - 36 - windowState.y
              )
            )
          : prev.height,
    }));
  };

  const handleResizeEnd = () => {
    setIsWindowResizing(false);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setWindowDraggingData({
      startX: clientX,
      startY: clientY,
      startLeft: windowRef.current?.offsetLeft || 0,
      startTop: windowRef.current?.offsetTop || 0,
    });
    setIsWindowDragging(true);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const { startX, startY, startLeft, startTop } = windowDraggingData;

    setWindowStateBeforeFullscreen(null);

    setWindowState((prev) => ({
      ...prev,
      x: Math.max(
        -(windowRef.current?.offsetWidth ?? 0) * 0.3 + 28,
        Math.min(
          startLeft + clientX - startX,
          window.innerWidth - (windowRef.current?.offsetWidth ?? 0) * 0.7 - 28
        )
      ),
      y: Math.max(
        -(windowRef.current?.offsetHeight ?? 0) + 48,
        Math.min(
          startTop + clientY - startY,
          window.innerHeight - 36 - (windowRef.current?.offsetHeight ?? 0)
        )
      ),
    }));
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

  const expandWindowToScreen = () => {
    setIsInterpolating(true);

    if (windowStateBeforeFullscreen) {
      setWindowState(windowStateBeforeFullscreen);
      setWindowStateBeforeFullscreen(null);
    } else {
      setWindowStateBeforeFullscreen({ ...windowState });
      setWindowState((prev) => {
        const fullWidth =
          !data.disableWidthAdjustment && typeof prev.width === "number"
            ? Math.max(
                data.minWidth ?? prev.width,
                Math.min(data.maxWidth ?? Infinity, window.innerWidth - 56)
              )
            : windowRef.current?.offsetWidth || 0;

        const fullHeight =
          !data.disableHeightAdjustment && typeof prev.height === "number"
            ? Math.max(
                data.minHeight ?? prev.height,
                Math.min(data.maxHeight ?? Infinity, window.innerHeight - 108)
              )
            : windowRef.current?.offsetHeight || 0;

        const centerX = window.innerWidth / 2 - fullWidth / 2;
        const centerY = window.innerHeight / 2 - fullHeight / 2;

        return {
          ...prev,
          x: data.disableMove ? prev.x : centerX,
          y: data.disableMove ? prev.y : centerY,
          width:
            !data.disableWidthAdjustment && typeof prev.width === "number"
              ? fullWidth
              : prev.width,
          height:
            !data.disableHeightAdjustment && typeof prev.height === "number"
              ? fullHeight
              : prev.height,
        };
      });
    }

    setTimeout(() => {
      setIsInterpolating(false);
    }, 300);
  };

  const updateWindowProportions = () => {
    if (windowRef.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setWindowProportions({
        xProportion:
          (windowState.x + windowRef.current.offsetWidth / 2) / windowWidth,
        yProportion:
          (windowState.y + windowRef.current.offsetHeight + 16) / windowHeight,
      });
    }
  };

  const repositionWindow = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    setWindowState((prev) => ({
      ...prev,
      x:
        Math.round(windowProportions.xProportion * windowWidth) -
        (windowRef.current?.offsetWidth || 0) / 2,
      y:
        Math.round(windowProportions.yProportion * windowHeight) -
        (windowRef.current?.offsetHeight || 0) -
        16,
    }));
  };

  const closeThisWindow = () => {
    removeWindowByUniqueId(data.uniqueId);
  };

  const setThisWindowActive = () => {
    setActiveWindow(data.uniqueId);
  };

  useEffect(() => {
    if (windowRef.current) {
      const { style } = windowRef.current;
      style.width = parseWindowDimension(windowState.width);
      style.height = parseWindowDimension(windowState.height);
      style.left = parseWindowPosition(windowState.x);
      style.top = parseWindowPosition(windowState.y);
    }
  }, [windowState]);

  useEffect(() => {
    updateWindowProportions();
  }, [windowState.x, windowState.y, windowState.width, windowState.height]);

  useEffect(() => {
    const handleResize = () => {
      if (!isWindowDragging && !isWindowResizing) {
        setWindowStateBeforeFullscreen(null);
        repositionWindow();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowProportions, isWindowDragging, isWindowResizing]);

  return (
    <div
      ref={windowRef}
      className={`absolute pointer-events-auto select-auto ${
        isInterpolating ? "transition-all duration-300 ease-out" : ""
      }`}
      style={{
        zIndex: data.layer || 0,
      }}
      onMouseDown={setThisWindowActive}
    >
      <div className="relative w-full h-full">
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
                    className="stroke-saturated"
                    strokeLinecap="round"
                    strokeWidth={145}
                    d="M389.032 129.005a316.213 316.213 0 0 1-266.789 254.72"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div
          className={`relative rounded-xl w-full h-full shadow-lg backdrop-blur-xl ${
            data.allowOverflow ? "" : "overflow-hidden"
          }`}
        >
          <WindowActionProvider
            closeWindow={closeThisWindow}
            setActiveWindow={setThisWindowActive}
          >
            {data.content}
          </WindowActionProvider>
        </div>
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
                onDoubleClick={expandWindowToScreen}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
