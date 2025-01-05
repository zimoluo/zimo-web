import { useState, useRef, useEffect } from "react";
import windowStyle from "./window-instance.module.css";
import { useDragAndTouch } from "@/lib/helperHooks";
import { WindowActionProvider } from "../contexts/WindowActionContext";
import { useWindow, windowSoftTopBorder } from "../contexts/WindowContext";
import { useSettings } from "../contexts/SettingsContext";

interface Props {
  data: WindowData;
  isActive: boolean;
  index: number;
}

const parseWindowDimension = (dimension: number): string => {
  return `${dimension}px`;
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
    updateWindowDataByIndex,
  } = useWindow();

  const windowState = windowStates[index];
  const setWindowState = (
    newState: ((state: WindowState) => WindowState) | Partial<WindowState>
  ) => {
    updateWindowStateByIndex(index, newState);
  };

  // This should rarely be used, as window data isn't meant to be changed at any time. Its sole purpose is for the debugger.
  const setWindowData = (
    newData: ((data: WindowData) => WindowData) | Partial<WindowData>
  ) => {
    updateWindowDataByIndex(index, newData);
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
    lastClientX: 0,
    lastClientY: 0,
    touchIdentifier: null as number | null,
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
    aspectRatio: 0,
    touchIdentifier: null as number | null,
  });
  const [isWindowResizing, setIsWindowResizing] = useState(false);

  const [windowProportions, setWindowProportions] = useState({
    xProportion: 0,
    yProportion: 0,
  });

  const interpolationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { settings } = useSettings();

  const minWidth = data.disableWidthAdjustment
    ? windowState.width
    : data.minWidth ?? 0;
  const minHeight = data.disableHeightAdjustment
    ? windowState.height
    : data.minHeight ?? 0;
  const maxWidth = data.disableWidthAdjustment
    ? windowState.width
    : data.maxWidth ?? Infinity;
  const maxHeight = data.disableHeightAdjustment
    ? windowState.height
    : data.maxHeight ?? Infinity;

  const canBeResizedAtAll =
    !data.disableHeightAdjustment || !data.disableWidthAdjustment;

  const modifyWindowSaveProps = (newProps: Record<string, any>) => {
    modifyWindowSavePropsByIndex(index, newProps);
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.changedTouches[0].clientY : e.clientY;
    const { width: startWidth, height: startHeight } = windowState;
    setWindowResizingData({
      startX: clientX,
      startY: clientY,
      startWidth,
      startHeight,
      beginWindowX: windowState.x,
      beginWindowY: windowState.y,
      lastClientX: clientX,
      lastClientY: clientY,
      aspectRatio: startWidth / (startHeight || 1),
      touchIdentifier: "touches" in e ? e.changedTouches[0].identifier : null,
    });
    setIsWindowResizing(true);
  };

  const handleResizeMove = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
    if (
      e instanceof KeyboardEvent &&
      (!isWindowResizing || !["Shift", "Alt"].includes(e.key))
    ) {
      return;
    }

    e.preventDefault();

    const {
      startX,
      startY,
      startWidth,
      startHeight,
      beginWindowX,
      beginWindowY,
      aspectRatio,
      touchIdentifier,
    } = windowResizingData;

    const clientX =
      e instanceof KeyboardEvent
        ? windowResizingData.lastClientX
        : "touches" in e
        ? Array.from(e.touches).find(
            (touch) => touch.identifier === touchIdentifier
          )?.clientX ?? e.touches[0].clientX
        : e.clientX;
    const clientY =
      e instanceof KeyboardEvent
        ? windowResizingData.lastClientY
        : "touches" in e
        ? Array.from(e.touches).find(
            (touch) => touch.identifier === touchIdentifier
          )?.clientY ?? e.touches[0].clientY
        : e.clientY;

    setWindowResizingData((prev) => ({
      ...prev,
      lastClientX: clientX,
      lastClientY: clientY,
    }));

    const beginCenterX = beginWindowX + startWidth / 2;
    const beginCenterY = beginWindowY + startHeight / 2;
    const isShiftPressed = e.shiftKey;
    const isAltPressed = e.altKey;
    const isCenterResizing =
      !!isAltPressed === !!(settings.windowResizeBehavior === "corner");

    let deltaX = clientX - startX;
    let deltaY = clientY - startY;

    const minAspect = isShiftPressed ? aspectRatio : data.minAspectRatio ?? 0;
    const maxAspect = isShiftPressed
      ? aspectRatio
      : data.maxAspectRatio ?? Infinity;

    if (isShiftPressed) {
      if (deltaX / aspectRatio > deltaY) {
        deltaY = deltaX / aspectRatio;
      } else {
        deltaX = deltaY * aspectRatio;
      }
    }

    let isAdaptiveOnX = false;
    let isAdaptiveOnY = false;

    // This function pipes the deltaX and deltaY through all the constraints and returns the processed values.
    // It also takes into account the adaptive flag at the point of execution.
    // It's used for both the adaptive projection and the actual processing.
    const processDeltasAndGetDimensions = (deltaX: number, deltaY: number) => {
      let processedDeltaX = deltaX;
      let processedDeltaY = deltaY;

      // First restrict the window min max width height.
      processedDeltaX = Math.min(
        (maxWidth - startWidth - (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
          (isCenterResizing && !isAdaptiveOnX ? 2 : 1),
        Math.max(
          processedDeltaX,
          (minWidth - startWidth - (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
            (isCenterResizing && !isAdaptiveOnX ? 2 : 1)
        )
      );
      processedDeltaY = Math.min(
        (maxHeight -
          startHeight -
          (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) /
          (isCenterResizing && !isAdaptiveOnY ? 2 : 1),
        Math.max(
          processedDeltaY,
          (minHeight -
            startHeight -
            (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) /
            (isCenterResizing && !isAdaptiveOnY ? 2 : 1)
        )
      );

      // Then check the left and bottom viewport borders.
      const bottomRightX = isCenterResizing
        ? beginCenterX + startWidth / 2 + processedDeltaX
        : beginWindowX + startWidth + processedDeltaX;
      const bottomRightY = isCenterResizing
        ? beginCenterY + startHeight / 2 + processedDeltaY
        : beginWindowY + startHeight + processedDeltaY;

      if (bottomRightX > window.innerWidth - 24) {
        processedDeltaX = isCenterResizing
          ? window.innerWidth - 24 - beginCenterX - startWidth / 2
          : window.innerWidth - 24 - beginWindowX - startWidth;
      } else if (bottomRightX < 24) {
        processedDeltaX = isCenterResizing
          ? 24 - beginCenterX - startWidth / 2
          : 24 - beginWindowX - startWidth;
      }

      if (bottomRightY > window.innerHeight - 36) {
        processedDeltaY = isCenterResizing
          ? window.innerHeight - 36 - beginCenterY - startHeight / 2
          : window.innerHeight - 36 - beginWindowY - startHeight;
      } else if (bottomRightY < windowSoftTopBorder) {
        processedDeltaY = isCenterResizing
          ? windowSoftTopBorder - beginCenterY - startHeight / 2
          : windowSoftTopBorder - beginWindowY - startHeight;
      }

      // Then check the aspect ratio limit of the window.
      if (
        (startWidth +
          processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
          (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
          (startHeight +
            processedDeltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
            (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) >
        maxAspect
      ) {
        processedDeltaX =
          ((startHeight +
            processedDeltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
            (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) *
            maxAspect -
            startWidth -
            (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
          (isCenterResizing && !isAdaptiveOnX ? 2 : 1);
        if (
          startWidth +
            processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
            (isAdaptiveOnX ? beginWindowX - 24 : 0) <
          minWidth
        ) {
          processedDeltaY =
            (minWidth / maxAspect -
              startHeight -
              (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) /
            (isCenterResizing && !isAdaptiveOnY ? 2 : 1);
          processedDeltaX =
            (minWidth - startWidth - (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
            (isCenterResizing && !isAdaptiveOnX ? 2 : 1);
        }
      } else if (
        (startWidth +
          processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
          (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
          (startHeight +
            processedDeltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
            (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) <
        minAspect
      ) {
        processedDeltaY =
          ((startWidth +
            processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
            (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
            minAspect -
            startHeight -
            (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) /
          (isCenterResizing && !isAdaptiveOnY ? 2 : 1);
        if (
          startHeight +
            processedDeltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
            (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0) <
          minHeight
        ) {
          processedDeltaX =
            (minHeight * minAspect -
              startWidth -
              (isAdaptiveOnX ? beginWindowX - 24 : 0)) /
            (isCenterResizing && !isAdaptiveOnX ? 2 : 1);
          processedDeltaY =
            (minHeight -
              startHeight -
              (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) /
            (isCenterResizing && !isAdaptiveOnY ? 2 : 1);
        }
      }

      return {
        deltaX: processedDeltaX,
        deltaY: processedDeltaY,
      };
    };

    if (isCenterResizing && settings.windowResizeBehavior === "adaptive") {
      const projection = processDeltasAndGetDimensions(deltaX, deltaY);

      if (beginWindowX >= 24 && beginWindowX - projection.deltaX < 24) {
        isAdaptiveOnX = true;
      }

      if (
        beginWindowY >= windowSoftTopBorder &&
        beginWindowY - projection.deltaY < windowSoftTopBorder
      ) {
        isAdaptiveOnY = true;
      }

      // The overcounting check for adaptives.
      // If both are adaptive, we need to additionally project the width and "cut" the part and apply the min max aspect to see if the adaptive is still needed.
      if (isAdaptiveOnX && isAdaptiveOnY) {
        const projectedWidth =
          startWidth + projection.deltaX + beginWindowX - 24;
        const projectedHeight =
          startHeight + projection.deltaY + beginWindowY - windowSoftTopBorder;

        // The width and height to calculate need to be calculated from the newly projected delta, which has adaptive applied.
        const { deltaX: reprojectedDeltaX, deltaY: reprojectedDeltaY } =
          processDeltasAndGetDimensions(deltaX, deltaY);
        const reprojectedWidth =
          startWidth + reprojectedDeltaX + beginWindowX - 24;
        const reprojectedHeight =
          startHeight + reprojectedDeltaY + beginWindowY - windowSoftTopBorder;

        if (projectedWidth / projectedHeight > maxAspect) {
          const widthToCalculate = Math.max(
            reprojectedHeight * maxAspect,
            minWidth
          );
          const newDeltaX = widthToCalculate - startWidth - (beginWindowX - 24);

          if (!(beginWindowX - newDeltaX < 24)) {
            isAdaptiveOnX = false;
          }
        }

        if (projectedWidth / projectedHeight < minAspect) {
          const heightToCalculate = Math.max(
            reprojectedWidth / minAspect,
            minHeight
          );
          const newDeltaY =
            heightToCalculate -
            startHeight -
            (beginWindowY - windowSoftTopBorder);

          if (!(beginWindowY - newDeltaY < windowSoftTopBorder)) {
            isAdaptiveOnY = false;
          }
        }
      }
    }

    const finalDimensions = processDeltasAndGetDimensions(deltaX, deltaY);

    // This final width has considered adaptive.
    const finalWidth =
      startWidth +
      finalDimensions.deltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
      (isAdaptiveOnX ? beginWindowX - 24 : 0);
    const finalHeight =
      startHeight +
      finalDimensions.deltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
      (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0);

    let newX = isCenterResizing ? beginCenterX - finalWidth / 2 : beginWindowX;
    let newY = isCenterResizing ? beginCenterY - finalHeight / 2 : beginWindowY;

    if (isAdaptiveOnX) {
      newX = 24;
    }

    if (isAdaptiveOnY) {
      newY = windowSoftTopBorder;
    }

    setWindowState({
      width: finalWidth,
      height: finalHeight,
      x: newX,
      y: newY,
    });

    if (
      windowStateBeforeFullscreen &&
      !(
        Math.abs(newX + finalWidth / 2 - window.innerWidth / 2) < 2 &&
        Math.abs(newY + finalHeight / 2 - window.innerHeight / 2) < 2
      )
    ) {
      setWindowStateBeforeFullscreen(null);
    }
  };

  const handleResizeEnd = () => {
    setIsWindowResizing(false);
    saveWindows();
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.changedTouches[0].clientY : e.clientY;
    setWindowDraggingData({
      startX: clientX,
      startY: clientY,
      startLeft: windowRef.current?.offsetLeft || 0,
      startTop: windowRef.current?.offsetTop || 0,
      lastClientX: clientX,
      lastClientY: clientY,
      touchIdentifier: "touches" in e ? e.changedTouches[0].identifier : null,
    });
    setIsWindowDragging(true);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
    if (
      e instanceof KeyboardEvent &&
      (!isWindowDragging || !["Shift"].includes(e.key))
    ) {
      return;
    }

    e.preventDefault();

    const clientX =
      e instanceof KeyboardEvent
        ? windowDraggingData.lastClientX
        : "touches" in e
        ? Array.from(e.touches).find(
            (touch) => touch.identifier === windowDraggingData.touchIdentifier
          )?.clientX ?? e.touches[0].clientX
        : e.clientX;
    const clientY =
      e instanceof KeyboardEvent
        ? windowDraggingData.lastClientY
        : "touches" in e
        ? Array.from(e.touches).find(
            (touch) => touch.identifier === windowDraggingData.touchIdentifier
          )?.clientY ?? e.touches[0].clientY
        : e.clientY;
    const { startX, startY, startLeft, startTop } = windowDraggingData;

    setWindowStateBeforeFullscreen(null);

    setWindowDraggingData((prev) => ({
      ...prev,
      lastClientX: clientX,
      lastClientY: clientY,
    }));

    let deltaX = clientX - startX;
    let deltaY = clientY - startY;

    const isShiftPressed = e.shiftKey;

    if (isShiftPressed) {
      const originalDeltaX = deltaX;
      const originalDeltaY = deltaY;

      if (Math.abs(originalDeltaX) > Math.abs(originalDeltaY)) {
        deltaY = 0;
      } else {
        deltaX = 0;
      }

      if (Math.max(Math.abs(originalDeltaX), Math.abs(originalDeltaY)) <= 50) {
        deltaX = 0;
        deltaY = 0;
      }
    }

    setWindowState((prev) => {
      // Values taken from the dragging width of the drag bar converted to pixels.
      const dragBarAndButtonWidth =
        Math.min(356, Math.max(108, prev.width * 0.3 + 36)) + 15.2;

      // Add padding.
      const computedHalfWidth = dragBarAndButtonWidth / 2 + 8;

      return {
        ...prev,
        x: Math.max(
          -prev.width / 2 + computedHalfWidth,
          Math.min(
            startLeft + deltaX,
            window.innerWidth - prev.width / 2 - computedHalfWidth
          )
        ),
        y: Math.max(
          -prev.height + windowSoftTopBorder,
          Math.min(startTop + deltaY, window.innerHeight - 36 - prev.height)
        ),
      };
    });
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

      let fullWidth = Math.max(
        minWidth,
        Math.min(maxWidth, window.innerWidth - 56)
      );

      let fullHeight = Math.max(
        minHeight,
        Math.min(maxHeight, window.innerHeight - 120)
      );

      if (fullWidth / fullHeight > (data.maxAspectRatio || Infinity)) {
        fullWidth = fullHeight * (data.maxAspectRatio || 1);
      }

      if (fullWidth / fullHeight < (data.minAspectRatio || 0)) {
        fullHeight = fullWidth / (data.minAspectRatio || 1);
      }

      const centerX = window.innerWidth / 2 - fullWidth / 2;
      const centerY = window.innerHeight / 2 - fullHeight / 2;

      setWindowState({
        x: centerX,
        y: centerY,
        width: fullWidth,
        height: fullHeight,
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
        xProportion: (windowState.x + windowState.width / 2) / windowWidth,
        yProportion: (windowState.y + windowState.height + 16) / windowHeight,
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
        windowState.width / 2,
      y:
        Math.round(windowProportions.yProportion * windowHeight) -
        windowState.height -
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
      (windowRefs.length < 2 && settings.disableWindowSnapToViewportBorder) ||
      settings.disableWindowSnapping ||
      windowStateBeforeFullscreen ||
      isInterpolating
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

    let minDistanceX = DETECT_DISTANCE;
    let minDistanceY = DETECT_DISTANCE;

    let desiredX: number | null = null;
    let desiredY: number | null = null;

    // "shoulder" is the secondary snapping that occurs after the primary snapping where the window is snapped additionally to the 'shoulder' of the other window
    // The shoulder should participate in the proximity check, but it must be cleaned up if its parent side is no longer the desired X.
    // This is also the only time the windowOrder kicks in. Higher windowOrder has a priority of using its own shoulder when applicable.
    let beforeShoulderMinDistanceX = minDistanceX;
    let beforeShoulderMinDistanceY = minDistanceY;

    // Shadow windows are the invisible windows that participate in the proximity and snapping check, but aren't actually windows.
    // They are used to create the snapping to the viewport border.
    const shadowWindows = settings.disableWindowSnapToViewportBorder
      ? []
      : [
          {
            rect: {
              left: -100,
              right: window.innerWidth + 100,
              top: -100,
              bottom: windowSoftTopBorder - SNAP_DISTANCE,
              width: window.innerWidth + 200,
              height: 100 + windowSoftTopBorder - SNAP_DISTANCE,
            },
          },
          {
            rect: {
              left: -100,
              right: 24 - SNAP_DISTANCE,
              top: -100,
              bottom: window.innerHeight + 100,
              width: 124 - SNAP_DISTANCE,
              height: window.innerHeight + 200,
            },
          },
          {
            rect: {
              left: window.innerWidth - 24 + SNAP_DISTANCE,
              right: window.innerWidth + 100,
              top: -100,
              bottom: window.innerHeight + 100,
              width: 124 - SNAP_DISTANCE,
              height: window.innerHeight + 200,
            },
          },
          {
            rect: {
              left: -100,
              right: window.innerWidth + 100,
              top: window.innerHeight - 36 + SNAP_DISTANCE,
              bottom: window.innerHeight + 100,
              width: window.innerWidth + 200,
              height: 136 - SNAP_DISTANCE,
            },
          },
        ];

    const isUnobstructed = (
      area: { left: number; right: number; top: number; bottom: number },
      candidateRef: React.RefObject<HTMLElement> | null
    ): boolean => {
      if (candidateRef === null) {
        return true;
      }

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

    const sortedWindows = [
      ...windowRefs
        .map((ref, idx) => ({
          ref,
          order: windowOrder[idx],
          idx,
          isShadow: false,
        }))
        .filter((item) => item.idx !== index && item.ref.current),
      ...shadowWindows.map((shadow, idx) => ({
        ref: null,
        order: -1 - idx,
        idx: windowRefs.length + idx,
        isShadow: true,
        shadowRect: shadow.rect,
      })),
    ].sort((a, b) => b.order - a.order);

    for (const item of sortedWindows) {
      const otherRect = item.isShadow
        ? (
            item as {
              shadowRect: {
                left: number;
                right: number;
                top: number;
                bottom: number;
                width: number;
                height: number;
              };
            }
          ).shadowRect
        : item.ref?.current?.getBoundingClientRect();

      if (!otherRect) {
        continue;
      }

      const otherLeft = otherRect.left;
      const otherRight = otherRect.right;
      const otherTop = otherRect.top;
      const otherBottom = otherRect.bottom;
      const otherWidth = otherRect.width;
      const otherHeight = otherRect.height;

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
            areaYCalculation: (desiredX: number, isTop: boolean = false) => ({
              left: desiredX - OBSTRUCT_DISTANCE,
              right: desiredX + OBSTRUCT_DISTANCE,
              top: otherTop + (isTop ? 0 : otherHeight) - OBSTRUCT_DISTANCE,
              bottom: otherTop + (isTop ? 0 : otherHeight) + OBSTRUCT_DISTANCE,
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
            areaYCalculation: (desiredX: number, isTop: boolean = false) => ({
              left: desiredX + ownWidth - OBSTRUCT_DISTANCE,
              right: desiredX + ownWidth + OBSTRUCT_DISTANCE,
              top: otherTop + (isTop ? 0 : otherHeight) - OBSTRUCT_DISTANCE,
              bottom: otherTop + (isTop ? 0 : otherHeight) + OBSTRUCT_DISTANCE,
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
            distance <= minDistanceX &&
            sideCondition
          ) {
            if (isUnobstructed(area, item.ref)) {
              desiredX = desiredXCalc();
              minDistanceX = distance;
              beforeShoulderMinDistanceX = minDistanceX;

              minDistanceY = beforeShoulderMinDistanceY;

              const topDistance = Math.abs(ownTop - otherTop);
              const bottomDistance = Math.abs(ownBottom - otherBottom);

              if (
                topDistance <= DETECT_DISTANCE &&
                topDistance <= bottomDistance &&
                topDistance <= minDistanceY &&
                !item.isShadow // Shadow windows do not participate in shoulder snapping
              ) {
                const areaY = areaYCalculation(desiredX, true);

                if (isUnobstructed(areaY, item.ref)) {
                  desiredY = desiredYCalcTop();
                  beforeShoulderMinDistanceY = minDistanceY;
                  minDistanceY = topDistance;
                }
              } else if (
                bottomDistance <= DETECT_DISTANCE &&
                bottomDistance <= topDistance &&
                bottomDistance <= minDistanceY &&
                !item.isShadow
              ) {
                const areaY = areaYCalculation(desiredX);

                if (isUnobstructed(areaY, item.ref)) {
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
            areaXCalculation: (desiredY: number, isLeft: boolean = false) => ({
              left: otherLeft + (isLeft ? 0 : otherWidth) - OBSTRUCT_DISTANCE,
              right: otherLeft + (isLeft ? 0 : otherWidth) + OBSTRUCT_DISTANCE,
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
            areaXCalculation: (desiredY: number, isLeft: boolean = false) => ({
              left: otherLeft + (isLeft ? 0 : otherWidth) - OBSTRUCT_DISTANCE,
              right: otherLeft + (isLeft ? 0 : otherWidth) + OBSTRUCT_DISTANCE,
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
            distance <= minDistanceY &&
            sideCondition
          ) {
            if (isUnobstructed(area, item.ref)) {
              desiredY = desiredYCalc();
              minDistanceY = distance;
              beforeShoulderMinDistanceY = minDistanceY;

              minDistanceX = beforeShoulderMinDistanceX;

              const leftDistance = Math.abs(ownLeft - otherLeft);
              const rightDistance = Math.abs(ownRight - otherRight);

              if (
                leftDistance <= DETECT_DISTANCE &&
                leftDistance <= rightDistance &&
                leftDistance <= minDistanceX &&
                !item.isShadow
              ) {
                const areaX = areaXCalculation(desiredY, true);

                if (isUnobstructed(areaX, item.ref)) {
                  desiredX = desiredXCalcLeft();
                  beforeShoulderMinDistanceX = minDistanceX;
                  minDistanceX = leftDistance;
                }
              } else if (
                rightDistance <= DETECT_DISTANCE &&
                rightDistance <= leftDistance &&
                rightDistance <= minDistanceX &&
                !item.isShadow
              ) {
                const areaX = areaXCalculation(desiredY);

                if (isUnobstructed(areaX, item.ref)) {
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

    // Borrowed from the drag move function.
    // This part ensures the snapping would not go out of bounds.
    const dragBarAndButtonWidth =
      Math.min(356, Math.max(108, windowState.width * 0.3 + 36)) + 15.2;

    const computedHalfWidth = dragBarAndButtonWidth / 2 + 8;

    if (desiredX !== null) {
      desiredX = Math.max(
        -windowState.width / 2 + computedHalfWidth,
        Math.min(
          desiredX,
          window.innerWidth - windowState.width / 2 - computedHalfWidth
        )
      );
    }

    if (desiredY !== null) {
      desiredY = Math.max(
        -windowState.height + windowSoftTopBorder,
        Math.min(desiredY, window.innerHeight - 36 - windowState.height)
      );
    }

    if (
      (desiredX === null || desiredX === windowState.x) &&
      (desiredY === null || desiredY === windowState.y)
    ) {
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
  }, [windowState.x, windowState.y, windowState.width, windowState.height]);

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
    window.addEventListener("keydown", handleDragMove);
    window.addEventListener("keyup", handleDragMove);

    return () => {
      window.removeEventListener("keydown", handleResizeMove);
      window.removeEventListener("keyup", handleResizeMove);
      window.removeEventListener("keydown", handleDragMove);
      window.removeEventListener("keyup", handleDragMove);
    };
  }, [
    windowResizingData,
    isWindowResizing,
    windowState,
    windowDraggingData,
    isWindowDragging,
  ]);

  useEffect(() => {
    const cleanupData = windowCleanupData[index];
    if (cleanupData) {
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
          : Math.max(minWidth, minHeight * (data.minAspectRatio ?? 0)),
        height: data.disableHeightAdjustment
          ? prev.height
          : Math.max(minHeight, minWidth / (data.maxAspectRatio ?? Infinity)),
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
              data.defaultCenterX - prev.width / 2,
              window.innerWidth - prev.width - 24
            )
          )
        : 20,
      y: data.defaultCenterY
        ? Math.max(
            windowSoftTopBorder,
            Math.min(
              data.defaultCenterY - prev.height / 2,
              window.innerHeight - 36 - prev.height
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
        className={`relative w-full h-full ${windowStyle.mountAnimator} ${
          windowStyle.mountAnimatorTransform
        } ${
          isMounted ||
          data.removeStartingAnimation ||
          data.reducedStartingAnimation
            ? "translate-y-0"
            : "translate-y-6"
        }`}
      >
        <div className="relative w-full h-full">
          <div
            className={`absolute right-0 bottom-0 -translate-y-4 -translate-x-4 h-0 w-0 ${
              windowStyle.mountAnimator
            } ${
              isMounted || data.removeStartingAnimation
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
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
                        : `${
                            isActive ? "opacity-40" : "opacity-30"
                          } group-hover:opacity-80 group-hover:scale-110`
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
            style={{
              borderRadius: `${data.cornerRadius ?? 0.75}rem`,
            }}
            className={`relative w-full h-full ${
              !data.disableShadow ? "shadow-xl" : ""
            } ${windowStyle.mountAnimator} ${
              data.disableBlur ? "" : "backdrop-blur-2xl"
            } ${
              isMounted || data.removeStartingAnimation
                ? "opacity-100"
                : "opacity-0"
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
              windowData={data}
              windowState={windowState}
              setWindowData={setWindowData}
              setWindowState={setWindowState}
            >
              {data.content}
            </WindowActionProvider>
          </div>
          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-4 h-0 flex items-center justify-center w-full ${
              windowStyle.mountAnimator
            } ${
              isMounted || data.removeStartingAnimation
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
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
                    className={`transition-all duration-300 ease-out fill-saturated ${
                      isActive ? "opacity-40" : "opacity-30"
                    } group-hover:opacity-80`}
                  />
                </svg>
              </button>
            </div>
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
                    : `cursor-grab ${
                        isActive ? "opacity-40" : "opacity-30"
                      } group-hover:opacity-80`
                } bg-saturated transition-all duration-300 ease-out rounded-full touch-none`}
                onMouseDown={handleStartDragging}
                onTouchStart={handleStartTouching}
                onDoubleClick={expandWindowToScreen}
              />
            </div>
            <div
              className={`pointer-events-none select-none opacity-0 bg-none bg-transparent border-0 border-none ${windowStyle.closeButtonContainer} aspect-square`}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
