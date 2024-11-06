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
    removeWindowByIndex,
    setActiveWindowByIndex,
    windowOrder,
    windowRefs,
    registerWindowRef,
    isWindowMinimized,
    windowCleanupData,
    saveWindows,
    modifyWindowSavePropsByIndex,
    windowStates,
    updateWindowStateByIndex,
  } = useWindow();

  const windowState = windowStates[index];
  const setWindowState = (
    newState: ((state: WindowState) => WindowState) | Partial<WindowState>
  ) => {
    updateWindowStateByIndex(index, newState);
  };

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
    beginWindowX: 0,
    beginWindowY: 0,
    lastClientX: 0,
    lastClientY: 0,
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
    modifyWindowSavePropsByIndex(index, newProps);
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
      beginWindowX: windowState.x,
      beginWindowY: windowState.y,
      lastClientX: clientX,
      lastClientY: clientY,
    });
    setIsWindowResizing(true);
  };

  const widthClassConfig =
    typeof data.defaultWidth === "number" ? "w-full" : "w-auto";
  const heightClassConfig =
    typeof data.defaultHeight === "number" ? "h-full" : "h-auto";

  const handleResizeMove = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
    if (
      e instanceof KeyboardEvent &&
      (!isWindowResizing || !["Shift", "Alt"].includes(e.key))
    ) {
      return;
    }

    e.preventDefault();

    setWindowStateBeforeFullscreen(null);

    const clientX =
      e instanceof KeyboardEvent
        ? windowResizingData.lastClientX
        : "touches" in e
        ? e.touches[0].clientX
        : e.clientX;
    const clientY =
      e instanceof KeyboardEvent
        ? windowResizingData.lastClientY
        : "touches" in e
        ? e.touches[0].clientY
        : e.clientY;

    const {
      startX,
      startY,
      startWidth,
      startHeight,
      beginWindowX,
      beginWindowY,
    } = windowResizingData;

    setWindowResizingData((prev) => ({
      ...prev,
      lastClientX: clientX,
      lastClientY: clientY,
    }));

    const aspectRatio = startWidth / startHeight;
    const beginCenterX = beginWindowX + startWidth / 2;
    const beginCenterY = beginWindowY + startHeight / 2;
    const isShiftPressed = e.shiftKey;
    const isAltPressed = e.altKey;

    let newWidth = startWidth + clientX - startX;
    let newHeight = startHeight + clientY - startY;
    let newX = beginWindowX;
    let newY = beginWindowY;

    if (isShiftPressed && isAltPressed) {
      newWidth = Math.min(
        Math.max(data.minWidth ?? 0, startWidth + 2 * (clientX - startX)),
        data.maxWidth ?? Infinity
      );
      newHeight = Math.min(
        Math.max(data.minHeight ?? 0, startHeight + 2 * (clientY - startY)),
        data.maxHeight ?? Infinity
      );

      if (newWidth / aspectRatio < newHeight) {
        newWidth = newHeight * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }

      newX = beginCenterX - newWidth / 2;
      newY = beginCenterY - newHeight / 2;

      const maxX = window.innerWidth - newWidth - 24;
      const maxY = window.innerHeight - newHeight - 36;

      if (newX < 24) {
        const scale = (beginCenterX - 24) / (newWidth / 2);
        newWidth *= scale;
        newHeight *= scale;
        newX = 24;
      } else if (newX > maxX) {
        const scale = (window.innerWidth - beginCenterX - 24) / (newWidth / 2);
        newWidth *= scale;
        newHeight *= scale;
        newX = window.innerWidth - newWidth - 24;
      }

      if (newY < 48) {
        const scale = (beginCenterY - 48) / (newHeight / 2);
        newWidth *= scale;
        newHeight *= scale;
        newY = 48;
      } else if (newY > maxY) {
        const scale =
          (window.innerHeight - beginCenterY - 36) / (newHeight / 2);
        newWidth *= scale;
        newHeight *= scale;
        newY = window.innerHeight - newHeight - 36;
      }

      newX = beginCenterX - newWidth / 2;
      newY = beginCenterY - newHeight / 2;
    } else if (isAltPressed) {
      newWidth = Math.min(
        Math.max(data.minWidth ?? 0, startWidth + 2 * (clientX - startX)),
        data.maxWidth ?? Infinity
      );
      newHeight = Math.min(
        Math.max(data.minHeight ?? 0, startHeight + 2 * (clientY - startY)),
        data.maxHeight ?? Infinity
      );

      newX = Math.min(
        beginCenterX - newWidth / 2,
        window.innerWidth - newWidth - 24
      );
      newY = Math.min(
        beginCenterY - newHeight / 2,
        window.innerHeight - newHeight - 36
      );

      if (newX <= 24 && beginCenterX < window.innerWidth / 2) {
        newWidth = Math.min(newWidth, 2 * (beginCenterX - 24));
      } else if (newX === window.innerWidth - newWidth - 24) {
        newWidth = Math.min(
          newWidth,
          2 * (window.innerWidth - beginCenterX - 24)
        );
      }

      if (newY <= 48 && beginCenterY < window.innerHeight / 2) {
        newHeight = Math.min(newHeight, 2 * (beginCenterY - 48));
      } else if (newY === window.innerHeight - newHeight - 36) {
        newHeight = Math.min(
          newHeight,
          2 * (window.innerHeight - beginCenterY - 36)
        );
      }

      newX = Math.max(
        24,
        Math.min(beginCenterX - newWidth / 2, window.innerWidth - newWidth - 24)
      );
      newY = Math.max(
        48,
        Math.min(
          beginCenterY - newHeight / 2,
          window.innerHeight - newHeight - 36
        )
      );
    } else if (isShiftPressed) {
      if (newWidth / aspectRatio < newHeight) {
        newWidth = newHeight * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }

      const clampedWidth = Math.max(
        data.minWidth ?? 0,
        24 - newX,
        Math.min(
          newWidth,
          data.maxWidth ?? Infinity,
          window.innerWidth - 24 - newX
        )
      );
      const clampedHeight = Math.max(
        data.minHeight ?? 0,
        48 - newY,
        Math.min(
          newHeight,
          data.maxHeight ?? Infinity,
          window.innerHeight - 36 - newY
        )
      );

      if (clampedWidth !== newWidth) {
        newWidth = clampedWidth;
        newHeight = clampedWidth / aspectRatio;
      } else if (clampedHeight !== newHeight) {
        newHeight = clampedHeight;
        newWidth = clampedHeight * aspectRatio;
      }

      newWidth = Math.max(
        data.minWidth ?? 0,
        (data.minHeight ?? Infinity) * aspectRatio,
        24 - newX,
        Math.min(newWidth, clampedWidth)
      );
      newHeight = Math.max(
        data.minHeight ?? 0,
        (data.minWidth ?? Infinity) / aspectRatio,
        48 - newY,
        Math.min(newHeight, clampedHeight)
      );
    }

    if (data.disableWidthAdjustment) {
      newX = beginWindowX;
    }

    if (data.disableHeightAdjustment) {
      newY = beginWindowY;
    }

    const adjustedWidth = Math.round(
      Math.max(
        data.minWidth ?? 0,
        24 - newX,
        Math.min(
          newWidth,
          data.maxWidth ?? Infinity,
          window.innerWidth - 24 - newX
        )
      )
    );

    const adjustedHeight = Math.round(
      Math.max(
        data.minHeight ?? 0,
        48 - newY,
        Math.min(
          newHeight,
          data.maxHeight ?? Infinity,
          window.innerHeight - 36 - newY
        )
      )
    );

    setWindowState((prev) => ({
      ...prev,
      width: !data.disableWidthAdjustment ? adjustedWidth : prev.width,
      height: !data.disableHeightAdjustment ? adjustedHeight : prev.height,
      x: newX,
      y: newY,
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

    interpolationTimeoutRef.current = setTimeout(() => {
      saveWindows();
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
    removeWindowByIndex(index);
    saveWindows();
  };

  const setThisWindowActive = () => {
    setActiveWindowByIndex(index);
    saveWindows();
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

    const DETECT_DISTANCE = 27;
    const SNAP_DISTANCE = 8;
    const OBSTRUCT_DISTANCE = 6;

    let minDistanceX = DETECT_DISTANCE + 1;
    let minDistanceY = DETECT_DISTANCE + 1;

    let desiredX: number | null = null;
    let desiredY: number | null = null;

    // "shoulder" is the secondary snapping that occurs after the primary snapping where the window is snapped additionally to the 'shoulder' of the other window
    // The shoulder should participate in the proximity check, but it must be cleaned up if its parent side is no longer the desired X.
    // This is also the only time the windowOrder kicks in. Higher windowOrder has a priority of using its own shoulder when applicable.
    let beforeShoulderMinDistanceX = minDistanceX;
    let beforeShoulderMinDistanceY = minDistanceY;

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

      if (verticalOverlap) {
        const distanceLeft = Math.abs(ownLeft - otherRight);
        const distanceRight = Math.abs(ownRight - otherLeft);

        const sidesToCheck = [
          {
            distance: distanceLeft,
            oppositeDistance: distanceRight,
            sideCondition: ownRight > otherLeft, // to prevent snapping to the opposite side which shouldn't normally happen
            desiredXCalc: () => otherRight + SNAP_DISTANCE,
            area: {
              left: otherRight - OBSTRUCT_DISTANCE,
              right: otherRight + OBSTRUCT_DISTANCE,
              top: Math.max(ownTop, otherTop) - OBSTRUCT_DISTANCE,
              bottom: Math.min(ownBottom, otherBottom) + OBSTRUCT_DISTANCE,
            },
            areaYCalculation: (desiredX: number) => ({
              left: desiredX - OBSTRUCT_DISTANCE,
              right: desiredX + OBSTRUCT_DISTANCE,
              top: otherTop - OBSTRUCT_DISTANCE,
              bottom: otherTop + OBSTRUCT_DISTANCE,
            }),
            desiredYCalcTop: () => otherTop,
            desiredYCalcBottom: () => otherBottom - ownHeight,
          },
          {
            distance: distanceRight,
            oppositeDistance: distanceLeft,
            sideCondition: ownLeft < otherRight,
            desiredXCalc: () => otherLeft - ownWidth - SNAP_DISTANCE,
            area: {
              left: otherLeft - OBSTRUCT_DISTANCE,
              right: otherLeft + OBSTRUCT_DISTANCE,
              top: Math.max(ownTop, otherTop) - OBSTRUCT_DISTANCE,
              bottom: Math.min(ownBottom, otherBottom) + OBSTRUCT_DISTANCE,
            },
            areaYCalculation: (desiredX: number) => ({
              left: desiredX + ownWidth - OBSTRUCT_DISTANCE,
              right: desiredX + ownWidth + OBSTRUCT_DISTANCE,
              top: otherTop - OBSTRUCT_DISTANCE,
              bottom: otherTop + OBSTRUCT_DISTANCE,
            }),
            desiredYCalcTop: () => otherTop,
            desiredYCalcBottom: () => otherBottom - ownHeight,
          },
        ];

        for (const side of sidesToCheck) {
          const {
            distance,
            oppositeDistance,
            sideCondition,
            desiredXCalc,
            area,
            areaYCalculation,
            desiredYCalcTop,
            desiredYCalcBottom,
          } = side;

          if (
            distance <= DETECT_DISTANCE &&
            distance <= oppositeDistance &&
            distance < minDistanceX &&
            sideCondition
          ) {
            if (isUnobstructed(area, ref)) {
              desiredX = desiredXCalc();
              minDistanceX = distance;
              beforeShoulderMinDistanceX = minDistanceX;

              minDistanceY = beforeShoulderMinDistanceY;

              const topDistance = Math.abs(ownTop - otherTop);
              const bottomDistance = Math.abs(ownBottom - otherBottom);

              if (
                topDistance <= DETECT_DISTANCE &&
                topDistance <= bottomDistance &&
                topDistance < minDistanceY
              ) {
                const areaY = areaYCalculation(desiredX);

                if (isUnobstructed(areaY, ref)) {
                  desiredY = desiredYCalcTop();
                  beforeShoulderMinDistanceY = minDistanceY;
                  minDistanceY = topDistance;
                }
              } else if (
                bottomDistance <= DETECT_DISTANCE &&
                bottomDistance <= topDistance &&
                bottomDistance < minDistanceY
              ) {
                const areaY = areaYCalculation(desiredX);

                if (isUnobstructed(areaY, ref)) {
                  desiredY = desiredYCalcBottom();
                  beforeShoulderMinDistanceY = minDistanceY;
                  minDistanceY = bottomDistance;
                }
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

      if (horizontalOverlap) {
        const distanceTop = Math.abs(ownTop - otherBottom);
        const distanceBottom = Math.abs(ownBottom - otherTop);

        const sidesToCheck = [
          {
            distance: distanceTop,
            oppositeDistance: distanceBottom,
            sideCondition: ownBottom > otherTop,
            desiredYCalc: () => otherBottom + SNAP_DISTANCE,
            area: {
              left: Math.max(ownLeft, otherLeft) - OBSTRUCT_DISTANCE,
              right: Math.min(ownRight, otherRight) + OBSTRUCT_DISTANCE,
              top: otherBottom - OBSTRUCT_DISTANCE,
              bottom: otherBottom + OBSTRUCT_DISTANCE,
            },
            areaXCalculation: (desiredY: number) => ({
              left: otherLeft - OBSTRUCT_DISTANCE,
              right: otherLeft + OBSTRUCT_DISTANCE,
              top: desiredY - OBSTRUCT_DISTANCE,
              bottom: desiredY + OBSTRUCT_DISTANCE,
            }),
            desiredXCalcLeft: () => otherLeft,
            desiredXCalcRight: () => otherRight - ownWidth,
          },
          {
            distance: distanceBottom,
            oppositeDistance: distanceTop,
            sideCondition: ownTop < otherBottom,
            desiredYCalc: () => otherTop - ownHeight - SNAP_DISTANCE,
            area: {
              left: Math.max(ownLeft, otherLeft) - OBSTRUCT_DISTANCE,
              right: Math.min(ownRight, otherRight) + OBSTRUCT_DISTANCE,
              top: otherTop - OBSTRUCT_DISTANCE,
              bottom: otherTop + OBSTRUCT_DISTANCE,
            },
            areaXCalculation: (desiredY: number) => ({
              left: otherLeft - OBSTRUCT_DISTANCE,
              right: otherLeft + OBSTRUCT_DISTANCE,
              top: desiredY + ownHeight - OBSTRUCT_DISTANCE,
              bottom: desiredY + ownHeight + OBSTRUCT_DISTANCE,
            }),
            desiredXCalcLeft: () => otherLeft,
            desiredXCalcRight: () => otherRight - ownWidth,
          },
        ];

        for (const side of sidesToCheck) {
          const {
            distance,
            oppositeDistance,
            sideCondition,
            desiredYCalc,
            area,
            areaXCalculation,
            desiredXCalcLeft,
            desiredXCalcRight,
          } = side;

          if (
            distance <= DETECT_DISTANCE &&
            distance <= oppositeDistance &&
            distance < minDistanceY &&
            sideCondition
          ) {
            if (isUnobstructed(area, ref)) {
              desiredY = desiredYCalc();
              minDistanceY = distance;
              beforeShoulderMinDistanceY = minDistanceY;

              minDistanceX = beforeShoulderMinDistanceX;

              const leftDistance = Math.abs(ownLeft - otherLeft);
              const rightDistance = Math.abs(ownRight - otherRight);

              if (
                leftDistance <= DETECT_DISTANCE &&
                leftDistance <= rightDistance &&
                leftDistance < minDistanceX
              ) {
                const areaX = areaXCalculation(desiredY);

                if (isUnobstructed(areaX, ref)) {
                  desiredX = desiredXCalcLeft();
                  beforeShoulderMinDistanceX = minDistanceX;
                  minDistanceX = leftDistance;
                }
              } else if (
                rightDistance <= DETECT_DISTANCE &&
                rightDistance <= leftDistance &&
                rightDistance < minDistanceX
              ) {
                const areaX = areaXCalculation(desiredY);

                if (isUnobstructed(areaX, ref)) {
                  desiredX = desiredXCalcRight();
                  beforeShoulderMinDistanceX = minDistanceX;
                  minDistanceX = rightDistance;
                }
              }
            }
          }
        }
      }
    }

    if (desiredX === null && desiredY === null) {
      return;
    }

    if (interpolationTimeoutRef.current) {
      clearTimeout(interpolationTimeoutRef.current);
    }
    setIsInterpolating(true);
    setWindowStateBeforeFullscreen(null);

    setWindowState((prev) => ({
      ...prev,
      x: desiredX !== null ? desiredX : prev.x,
      y: desiredY !== null ? desiredY : prev.y,
    }));

    interpolationTimeoutRef.current = setTimeout(() => {
      saveWindows();
      setIsInterpolating(false);
    }, 300);
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
        saveWindows(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowProportions, isWindowDragging, isWindowResizing]);

  useEffect(() => {
    window.addEventListener("keydown", handleResizeMove);
    window.addEventListener("keyup", handleResizeMove);

    return () => {
      window.removeEventListener("keydown", handleResizeMove);
      window.removeEventListener("keyup", handleResizeMove);
    };
  }, [windowResizingData, isWindowResizing, windowState]);

  useEffect(() => {
    const cleanupData = windowCleanupData[index];
    if (cleanupData && !data.disableMove) {
      if (interpolationTimeoutRef.current) {
        clearTimeout(interpolationTimeoutRef.current);
      }
      setIsInterpolating(true);
      setWindowStateBeforeFullscreen(null);

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

      interpolationTimeoutRef.current = setTimeout(() => {
        if (index === windowOrder.length - 1) {
          saveWindows();
        }
        setIsInterpolating(false);
      }, 300);
    }
  }, [windowCleanupData[index]]);

  useEffect(() => {
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
        : 20,
      y: data.defaultCenterY
        ? Math.max(
            56,
            Math.min(
              data.defaultCenterY - (windowRef.current?.offsetHeight ?? 0) / 2,
              window.innerHeight - 36 - (windowRef.current?.offsetHeight ?? 0)
            )
          )
        : 20,
    }));
    registerWindowRef(index, windowRef);
    saveWindows();
    setIsMounted(true);

    return () => {
      if (interpolationTimeoutRef.current) {
        clearTimeout(interpolationTimeoutRef.current);
      }
    };
  }, []);

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
          isMounted || data.removeStartingAnimation
            ? "translate-y-0 opacity-100"
            : `${
                data.reducedStartingAnimation
                  ? "translate-y-0"
                  : "translate-y-8"
              } opacity-0`
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
              (isMounted || data.removeStartingAnimation) && !data.disableBlur
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
