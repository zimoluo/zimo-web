import { useState, useRef, useEffect } from "react";
import windowStyle from "./window-instance.module.css";
import { useDragAndTouch } from "@/lib/helperHooks";
import { WindowActionProvider } from "../contexts/WindowActionContext";
import { useWindow } from "../contexts/WindowContext";
import { useSettings } from "../contexts/SettingsContext";

interface Props {
  data: WindowData;
  isActive: boolean;
  index: number;
}

const parseWindowDimension = (dimension: WindowDimension): string => {
  if (typeof dimension === "number") {
    return `${dimension}px`;
  }

  if (dimension === "fit") {
    return "auto";
  }

  return "auto";
};

const parseWindowPosition = (position: number): string => {
  return `${position}px`;
};

export default function WindowInstance({ data, isActive, index }: Props) {
  const {
    removeWindowByUniqueId,
    setActiveWindow,
    windowOrder,
    windowRefs,
    registerWindowRef,
    isWindowMinimized,
    windowCleanupData,
    saveWindows,
    modifyWindowSaveProps: contextModifyWindowSaveProps,
  } = useWindow();

  const [windowState, setWindowState] = useState<WindowState>({
    x: 20,
    y: 20,
    height: data.defaultHeight,
    width: data.defaultWidth,
    data,
  });

  const [isMounted, setIsMounted] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);

  const [isInterpolating, setIsInterpolating] = useState(false);

  const [isCloseButtonActive, setIsCloseButtonActive] = useState(false);

  const [windowStateBeforeFullscreen, setWindowStateBeforeFullscreen] =
    useState<WindowState | null>(null);

  const thisWindowOrder = windowOrder?.[index] || 0;

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

  const interpolationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { settings } = useSettings();

  const canBeMoved = !data.disableMove;
  const canBeResizedAtAll =
    (!data.disableHeightAdjustment && typeof data.defaultHeight === "number") ||
    (!data.disableWidthAdjustment && typeof data.defaultWidth === "number");

  const modifyWindowSaveProps = (newProps: Record<string, any>) => {
    contextModifyWindowSaveProps(index, newProps);
  };

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

  const widthClassConfig =
    typeof data.defaultWidth === "number" ? "w-full" : "w-auto";
  const heightClassConfig =
    typeof data.defaultHeight === "number" ? "h-full" : "h-auto";

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
              data.minWidth ?? 0,
              24 - windowState.x,
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
              data.minHeight ?? 0,
              48 - windowState.y,
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
    saveWindows();
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
    snapToClosestWindow();
    saveWindows();
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
    if (data.disableExpandToScreen) {
      return;
    }

    if (interpolationTimeoutRef.current) {
      clearTimeout(interpolationTimeoutRef.current);
    }
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

    saveWindows();

    interpolationTimeoutRef.current = setTimeout(() => {
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

  const snapToClosestWindow = () => {
    if (
      !windowRef.current ||
      windowRefs.length < 2 ||
      settings.disableWindowSnapping ||
      isInterpolating ||
      data.disableMove
    ) {
      return;
    }

    const ownRect = windowRef.current.getBoundingClientRect();
    const ownLeft = ownRect.left;
    const ownRight = ownRect.right;
    const ownTop = ownRect.top;
    const ownBottom = ownRect.bottom;
    const ownWidth = ownRect.width;
    const ownHeight = ownRect.height;

    const DETECT_DISTANCE = 24;
    const SNAP_DISTANCE = 8;
    const OBSTRUCT_DISTANCE = 6;

    let desiredX: number | null = null;
    let desiredY: number | null = null;

    const isUnobstructed = (
      area: { left: number; right: number; top: number; bottom: number },
      candidateRef: React.RefObject<HTMLElement>
    ): boolean => {
      if (!candidateRef.current) {
        return false;
      }

      if (windowRefs.length < 3) {
        return true;
      }

      const candidateStyle = window.getComputedStyle(candidateRef.current);
      const candidateZIndex = parseInt(candidateStyle.zIndex) || 0;

      for (let i = 0; i < windowRefs.length; i++) {
        if (
          i === index ||
          windowRefs[i] === candidateRef ||
          windowRefs[i] === windowRef ||
          windowRefs[i] === null
        ) {
          continue;
        }

        const ref = windowRefs[i];
        if (!ref.current) {
          continue;
        }

        const style = window.getComputedStyle(ref.current);
        const zIndex = parseInt(style.zIndex) || 0;

        if (zIndex <= candidateZIndex) {
          continue;
        }

        const rect = ref.current.getBoundingClientRect();
        if (
          rect.left <= area.left &&
          rect.right >= area.right &&
          rect.top <= area.top &&
          rect.bottom >= area.bottom
        ) {
          return false;
        }
      }
      return true;
    };

    const sortedWindows = windowRefs
      .map((ref, idx) => ({ ref, order: windowOrder[idx], idx }))
      .filter((item) => item.idx !== index && item.ref.current)
      .sort((a, b) => b.order - a.order);

    for (const { ref } of sortedWindows) {
      if (!ref || !ref.current) {
        continue;
      }

      const otherRect = ref.current.getBoundingClientRect();
      const otherLeft = otherRect.left;
      const otherRight = otherRect.right;
      const otherTop = otherRect.top;
      const otherBottom = otherRect.bottom;

      const verticalOverlap =
        Math.max(
          0,
          Math.min(ownBottom, otherBottom) - Math.max(ownTop, otherTop)
        ) > 0;

      if (verticalOverlap && desiredX === null) {
        const distanceLeft = Math.abs(ownLeft - otherRight);
        const distanceRight = Math.abs(otherLeft - ownRight);

        // The second check might seem redundant, but it's there to prevent edge cases like super slim window.
        if (distanceLeft <= DETECT_DISTANCE && ownRight > otherLeft) {
          const area = {
            left: otherRight - OBSTRUCT_DISTANCE,
            right: otherRight + OBSTRUCT_DISTANCE,
            top: Math.max(ownTop, otherTop) - OBSTRUCT_DISTANCE,
            bottom: Math.min(ownBottom, otherBottom) + OBSTRUCT_DISTANCE,
          };

          if (isUnobstructed(area, ref)) {
            desiredX = otherRight + SNAP_DISTANCE;

            const topDistance = Math.abs(ownTop - otherTop);
            const bottomDistance = Math.abs(ownBottom - otherBottom);

            if (topDistance <= DETECT_DISTANCE) {
              const areaY = {
                left: desiredX - OBSTRUCT_DISTANCE,
                right: desiredX + OBSTRUCT_DISTANCE,
                top: otherTop - OBSTRUCT_DISTANCE,
                bottom: otherTop + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaY, ref)) {
                desiredY = otherTop;
              }
            } else if (bottomDistance <= DETECT_DISTANCE) {
              const areaY = {
                left: desiredX - OBSTRUCT_DISTANCE,
                right: desiredX + OBSTRUCT_DISTANCE,
                top: otherBottom - OBSTRUCT_DISTANCE,
                bottom: otherBottom + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaY, ref)) {
                desiredY = otherBottom - ownHeight;
              }
            }
          }
        } else if (distanceRight <= DETECT_DISTANCE && ownLeft < otherRight) {
          const area = {
            left: otherLeft - OBSTRUCT_DISTANCE,
            right: otherLeft + OBSTRUCT_DISTANCE,
            top: Math.max(ownTop, otherTop) - OBSTRUCT_DISTANCE,
            bottom: Math.min(ownBottom, otherBottom) + OBSTRUCT_DISTANCE,
          };

          if (isUnobstructed(area, ref)) {
            desiredX = otherLeft - ownWidth - SNAP_DISTANCE;

            const topDistance = Math.abs(ownTop - otherTop);
            const bottomDistance = Math.abs(ownBottom - otherBottom);

            if (topDistance <= DETECT_DISTANCE) {
              const areaY = {
                left: desiredX - OBSTRUCT_DISTANCE,
                right: desiredX + OBSTRUCT_DISTANCE,
                top: otherTop - OBSTRUCT_DISTANCE,
                bottom: otherTop + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaY, ref)) {
                desiredY = otherTop;
              }
            } else if (bottomDistance <= DETECT_DISTANCE) {
              const areaY = {
                left: desiredX - OBSTRUCT_DISTANCE,
                right: desiredX + OBSTRUCT_DISTANCE,
                top: otherBottom - OBSTRUCT_DISTANCE,
                bottom: otherBottom + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaY, ref)) {
                desiredY = otherBottom - ownHeight;
              }
            }
          }
        }
      }

      const horizontalOverlap =
        Math.max(
          0,
          Math.min(ownRight, otherRight) - Math.max(ownLeft, otherLeft)
        ) > 0;

      if (horizontalOverlap && desiredY === null) {
        const distanceTop = Math.abs(ownTop - otherBottom);
        const distanceBottom = Math.abs(otherTop - ownBottom);

        if (distanceTop <= DETECT_DISTANCE && ownBottom > otherTop) {
          const area = {
            left: Math.max(ownLeft, otherLeft) - OBSTRUCT_DISTANCE,
            right: Math.min(ownRight, otherRight) + OBSTRUCT_DISTANCE,
            top: otherBottom - OBSTRUCT_DISTANCE,
            bottom: otherBottom + OBSTRUCT_DISTANCE,
          };

          if (isUnobstructed(area, ref)) {
            desiredY = otherBottom + SNAP_DISTANCE;

            const leftDistance = Math.abs(ownLeft - otherLeft);
            const rightDistance = Math.abs(ownRight - otherRight);

            if (leftDistance <= DETECT_DISTANCE) {
              const areaX = {
                left: otherLeft - OBSTRUCT_DISTANCE,
                right: otherLeft + OBSTRUCT_DISTANCE,
                top: desiredY - OBSTRUCT_DISTANCE,
                bottom: desiredY + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaX, ref)) {
                desiredX = otherLeft;
              }
            } else if (rightDistance <= DETECT_DISTANCE) {
              const areaX = {
                left: otherRight - OBSTRUCT_DISTANCE,
                right: otherRight + OBSTRUCT_DISTANCE,
                top: desiredY - OBSTRUCT_DISTANCE,
                bottom: desiredY + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaX, ref)) {
                desiredX = otherRight - ownWidth;
              }
            }
          }
        } else if (distanceBottom <= DETECT_DISTANCE && ownTop < otherBottom) {
          const area = {
            left: Math.max(ownLeft, otherLeft) - OBSTRUCT_DISTANCE,
            right: Math.min(ownRight, otherRight) + OBSTRUCT_DISTANCE,
            top: otherTop - OBSTRUCT_DISTANCE,
            bottom: otherTop + OBSTRUCT_DISTANCE,
          };

          if (isUnobstructed(area, ref)) {
            desiredY = otherTop - ownHeight - SNAP_DISTANCE;

            const leftDistance = Math.abs(ownLeft - otherLeft);
            const rightDistance = Math.abs(ownRight - otherRight);

            if (leftDistance <= DETECT_DISTANCE) {
              const areaX = {
                left: otherLeft - OBSTRUCT_DISTANCE,
                right: otherLeft + OBSTRUCT_DISTANCE,
                top: desiredY - OBSTRUCT_DISTANCE,
                bottom: desiredY + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaX, ref)) {
                desiredX = otherLeft;
              }
            } else if (rightDistance <= DETECT_DISTANCE) {
              const areaX = {
                left: otherRight - OBSTRUCT_DISTANCE,
                right: otherRight + OBSTRUCT_DISTANCE,
                top: desiredY - OBSTRUCT_DISTANCE,
                bottom: desiredY + OBSTRUCT_DISTANCE,
              };

              if (isUnobstructed(areaX, ref)) {
                desiredX = otherRight - ownWidth;
              }
            }
          }
        }
      }

      if (desiredX !== null && desiredY !== null) {
        break;
      }
    }

    if (desiredX === null && desiredY === null) {
      return;
    }

    if (interpolationTimeoutRef.current) {
      clearTimeout(interpolationTimeoutRef.current);
    }
    setIsInterpolating(true);

    setWindowState((prev) => ({
      ...prev,
      x: desiredX !== null ? desiredX : prev.x,
      y: desiredY !== null ? desiredY : prev.y,
    }));

    saveWindows();

    interpolationTimeoutRef.current = setTimeout(
      () => setIsInterpolating(false),
      300
    );
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
  }, [
    windowState.x,
    windowState.y,
    windowRef.current?.offsetHeight,
    windowRef.current?.offsetWidth,
  ]);

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

  useEffect(() => {
    const cleanupData = windowCleanupData[index];
    if (cleanupData && !data.disableMove) {
      if (interpolationTimeoutRef.current) {
        clearTimeout(interpolationTimeoutRef.current);
      }
      setIsInterpolating(true);

      setWindowState((prev) => ({
        ...prev,
        x: cleanupData.newX,
        y: cleanupData.newY,
        width: data.disableWidthAdjustment
          ? prev.width
          : data.minWidth ?? prev.width,
        height: data.disableHeightAdjustment
          ? prev.height
          : data.minHeight ?? prev.height,
      }));

      if (index === windowOrder.length - 1) {
        saveWindows();
      }

      interpolationTimeoutRef.current = setTimeout(() => {
        setIsInterpolating(false);
      }, 300);
    }
  }, [windowCleanupData[index]]);

  useEffect(() => {
    if (isMounted) {
      saveWindows();
    } else
      setWindowState((prev) => ({
        ...prev,
        x: data.defaultCenterX
          ? Math.max(
              24,
              Math.min(
                data.defaultCenterX - (windowRef.current?.offsetWidth ?? 0) / 2,
                window.innerWidth - (windowRef.current?.offsetWidth ?? 0) - 24
              )
            )
          : prev.x,
        y: data.defaultCenterY
          ? Math.max(
              56,
              Math.min(
                data.defaultCenterY -
                  (windowRef.current?.offsetHeight ?? 0) / 2,
                window.innerHeight - 36 - (windowRef.current?.offsetHeight ?? 0)
              )
            )
          : prev.y,
      }));
    registerWindowRef(index, windowRef);
    setIsMounted(true);
  }, [isMounted]);

  return (
    <div
      ref={windowRef}
      className={`absolute ${
        isWindowMinimized ? "pointer-events-none" : "pointer-events-auto"
      } ${isInterpolating ? "transition-all duration-300 ease-out" : ""}`}
      style={{
        zIndex: thisWindowOrder + windowOrder.length * (data.layer || 0),
      }}
      onMouseDown={setThisWindowActive}
    >
      <div
        className={`relative ${widthClassConfig} ${heightClassConfig} ${
          windowStyle.mountAnimator
        } ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className={`relative ${widthClassConfig} ${heightClassConfig}`}>
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
            className={`relative rounded-xl ${widthClassConfig} ${heightClassConfig} ${
              !data.disableShadow ? "shadow-xl" : ""
            } ${windowStyle.mountBlurAnimator} ${
              isMounted && !data.disableBlur
                ? "backdrop-blur-2xl"
                : "backdrop-blur-0"
            } ${data.allowOverflow ? "" : "overflow-hidden"}`}
            ref={windowContentRef}
          >
            <WindowActionProvider
              closeWindow={closeThisWindow}
              setActiveWindow={setThisWindowActive}
              isActiveWindow={isActive}
              windowContentRef={windowContentRef}
              uniqueId={data.uniqueId}
              isWindowDragging={isWindowDragging}
              isWindowResizing={isWindowResizing}
              modifyWindowSaveProps={modifyWindowSaveProps}
            >
              {data.content}
            </WindowActionProvider>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-4 h-0 flex items-center justify-center w-full">
            {!data.disableClose && (
              <div
                className={`${
                  windowStyle.closeButtonContainer
                } aspect-square transition-all duration-300 group ease-out flex items-center justify-center ${
                  isWindowDragging
                    ? "pointer-events-none opacity-0 select-none"
                    : ""
                }`}
                onMouseOver={() => setIsCloseButtonActive(true)}
                onMouseLeave={() => setIsCloseButtonActive(false)}
              >
                <button
                  className="w-5/6 h-5/6 aspect-square"
                  onClick={closeThisWindow}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    className="w-full h-auto aspect-square"
                  >
                    <path
                      d={`${
                        isCloseButtonActive
                          ? "M400 800c220.914 0 400-179.086 400-400S620.914 0 400 0 0 179.086 0 400s179.086 400 400 400Zm113.282-574.533c17.085-17.085 44.787-17.085 61.872 0 17.085 17.086 17.085 44.787 0 61.872L462.183 400.311l112.97 112.971c17.086 17.086 17.086 44.787 0 61.872-17.084 17.086-44.786 17.086-61.87 0L400.31 462.183l-112.972 112.97c-17.085 17.086-44.786 17.086-61.872 0-17.085-17.084-17.085-44.786 0-61.87L338.44 400.31 225.467 287.34c-17.085-17.086-17.085-44.787 0-61.872s44.787-17.086 61.872 0l112.972 112.971 112.971-112.972Z"
                          : "M400 800c220.914 0 400-179.086 400-400S620.914 0 400 0 0 179.086 0 400s179.086 400 400 400Zm175.154-574.533c17.085-17.085-17.085-17.085 0 0 17.085 17.086 0 0 0 0L400 400l175.154 175.154c17.085 17.086 17.085-17.085 0 0-17.085 17.086 17.085 17.086 0 0L400 400 225.467 575.154c-17.085 17.085 17.086 17.085 0 0-17.085-17.085-17.085 17.085 0 0L400 400 225.467 225.468c-17.085-17.086-17.085 17.085 0 0s-17.085-17.086 0 0L400 400l175.154-174.533Z"
                      }`}
                      style={{
                        fillRule: "evenodd",
                        strokeWidth: 0,
                      }}
                      transform="translate(112 112)"
                      className="transition-all duration-300 ease-out fill-saturated opacity-30 group-hover:opacity-80"
                    />
                  </svg>
                </button>
              </div>
            )}
            {canBeMoved && (
              <div
                className={`${
                  isWindowDragging
                    ? windowStyle.dragBarContainerOn
                    : isCloseButtonActive
                    ? windowStyle.dragBarContainerCloseActive
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
            {!data.disableClose && canBeMoved && (
              <div
                className={`pointer-events-none select-none opacity-0 bg-none bg-transparent border-0 border-none ${windowStyle.closeButtonContainer} aspect-square`}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
