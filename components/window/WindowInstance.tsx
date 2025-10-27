import { useState, useRef, useEffect, useCallback } from "react";
import windowStyle from "./window-instance.module.css";
import { useDragAndTouch } from "@/lib/helperHooks";
import { WindowActionProvider } from "../contexts/WindowActionContext";
import {
  useWindow,
  windowSoftBottomBorder,
  windowSoftLeftBorder,
  windowSoftRightBorder,
  windowSoftTopBorder,
} from "../contexts/WindowContext";
import { useSettings } from "../contexts/SettingsContext";

interface Props {
  data: WindowData;
  isActive: boolean;
  index: number;
}

const parseWindowDimension = (dimension: number): string => `${dimension}px`;
const parseWindowPosition = (position: number): string => `${position}px`;

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

  const windowStateRef = useRef<WindowState>(windowState);
  useEffect(() => {
    windowStateRef.current = windowState;
  }, [windowState]);

  const setWindowState = useCallback(
    (
      newState: ((state: WindowState) => WindowState) | Partial<WindowState>
    ) => {
      if (typeof newState === "function") {
        windowStateRef.current = newState(windowStateRef.current);
        updateWindowStateByIndex(index, (prev) =>
          typeof newState === "function" ? (newState as any)(prev) : newState
        );
      } else {
        windowStateRef.current = { ...windowStateRef.current, ...newState };
        updateWindowStateByIndex(index, (prev) => ({ ...prev, ...newState }));
      }
    },
    [index, updateWindowStateByIndex]
  );

  const setWindowData = useCallback(
    (newData: ((data: WindowData) => WindowData) | Partial<WindowData>) => {
      updateWindowDataByIndex(index, newData);
    },
    [index, updateWindowDataByIndex]
  );

  const [isMounted, setIsMounted] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const windowContentRef = useRef<HTMLDivElement>(null);
  const [isInterpolating, setIsInterpolating] = useState(false);
  const [isCloseButtonActive, setIsCloseButtonActive] = useState(false);
  const [windowStateBeforeFullscreen, setWindowStateBeforeFullscreen] =
    useState<WindowState | null>(null);

  const thisWindowOrder = windowOrder?.[index] || 0;

  const windowDraggingDataRef = useRef({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    lastClientX: 0,
    lastClientY: 0,
    touchIdentifier: null as number | null,
  });
  const isWindowDraggingRef = useRef(false);
  const [, setIsWindowDragging] = useState(false); // only used for UI classes

  const windowResizingDataRef = useRef({
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
  const isWindowResizingRef = useRef(false);
  const [, setIsWindowResizing] = useState(false); // only used for UI classes

  const windowProportionsRef = useRef({
    xProportion: 0,
    yProportion: 0,
  });

  const interpolationTimeoutRef = useRef<number | null>(null);

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

  const pendingStateRef = useRef<Partial<WindowState> | null>(null);
  const rafRef = useRef<number | null>(null);

  const scheduleWindowStateUpdate = useCallback(
    (partial: Partial<WindowState>) => {
      pendingStateRef.current = {
        ...(pendingStateRef.current ?? {}),
        ...partial,
      };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingStateRef.current) {
            setWindowState(pendingStateRef.current);
          }
          pendingStateRef.current = null;
          if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
          }
          rafRef.current = null;
        });
      }
    },
    [setWindowState]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const clientX =
        "touches" in e
          ? e.changedTouches[0].clientX
          : (e as React.MouseEvent).clientX;
      const clientY =
        "touches" in e
          ? e.changedTouches[0].clientY
          : (e as React.MouseEvent).clientY;
      const { width: startWidth, height: startHeight } = windowStateRef.current;
      windowResizingDataRef.current = {
        startX: clientX,
        startY: clientY,
        startWidth,
        startHeight,
        beginWindowX: windowStateRef.current.x,
        beginWindowY: windowStateRef.current.y,
        lastClientX: clientX,
        lastClientY: clientY,
        aspectRatio: startWidth / (startHeight || 1),
        touchIdentifier: "touches" in e ? e.changedTouches[0].identifier : null,
      };
      isWindowResizingRef.current = true;
      setIsWindowResizing(true);
    },
    []
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent &&
        (!isWindowResizingRef.current || !["Shift", "Alt"].includes(e.key))
      ) {
        return;
      }

      if ("preventDefault" in e) e.preventDefault();

      const wr = windowResizingDataRef.current;
      const {
        startX,
        startY,
        startWidth,
        startHeight,
        beginWindowX,
        beginWindowY,
        aspectRatio,
        touchIdentifier,
      } = wr;

      const clientX =
        e instanceof KeyboardEvent
          ? wr.lastClientX
          : "touches" in e
          ? Array.from(e.touches).find(
              (touch) => touch.identifier === touchIdentifier
            )?.clientX ??
            (e.touches[0] && e.touches[0].clientX)
          : (e as MouseEvent).clientX;
      const clientY =
        e instanceof KeyboardEvent
          ? wr.lastClientY
          : "touches" in e
          ? Array.from(e.touches).find(
              (touch) => touch.identifier === touchIdentifier
            )?.clientY ??
            (e.touches[0] && e.touches[0].clientY)
          : (e as MouseEvent).clientY;

      wr.lastClientX = clientX ?? wr.lastClientX;
      wr.lastClientY = clientY ?? wr.lastClientY;

      const beginCenterX = beginWindowX + startWidth / 2;
      const beginCenterY = beginWindowY + startHeight / 2;
      const isShiftPressed = (e as any).shiftKey;
      const isAltPressed = (e as any).altKey;
      const isCenterResizing =
        !!isAltPressed === !!(settings.windowResizeBehavior === "corner");

      let deltaX = (clientX ?? wr.lastClientX) - startX;
      let deltaY = (clientY ?? wr.lastClientY) - startY;

      if (isShiftPressed) {
        if (deltaX / aspectRatio > deltaY) {
          deltaY = deltaX / aspectRatio;
        } else {
          deltaX = deltaY * aspectRatio;
        }
      }

      let isAdaptiveOnX = false;
      let isAdaptiveOnY = false;

      const processDeltasAndGetDimensions = (
        deltaX: number,
        deltaY: number
      ) => {
        let processedDeltaX = deltaX;
        let processedDeltaY = deltaY;

        processedDeltaX = Math.min(
          (maxWidth -
            startWidth -
            (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
            (isCenterResizing && !isAdaptiveOnX ? 2 : 1),
          Math.max(
            processedDeltaX,
            (minWidth -
              startWidth -
              (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
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

        const bottomRightX = isCenterResizing
          ? beginCenterX + startWidth / 2 + processedDeltaX
          : beginWindowX + startWidth + processedDeltaX;
        const bottomRightY = isCenterResizing
          ? beginCenterY + startHeight / 2 + processedDeltaY
          : beginWindowY + startHeight + processedDeltaY;

        if (bottomRightX > window.innerWidth - windowSoftRightBorder) {
          processedDeltaX = isCenterResizing
            ? window.innerWidth -
              windowSoftRightBorder -
              beginCenterX -
              startWidth / 2
            : window.innerWidth -
              windowSoftRightBorder -
              beginWindowX -
              startWidth;
        } else if (bottomRightX < windowSoftLeftBorder) {
          processedDeltaX = isCenterResizing
            ? windowSoftLeftBorder - beginCenterX - startWidth / 2
            : windowSoftLeftBorder - beginWindowX - startWidth;
        }

        if (bottomRightY > window.innerHeight - windowSoftBottomBorder) {
          processedDeltaY = isCenterResizing
            ? window.innerHeight -
              windowSoftBottomBorder -
              beginCenterY -
              startHeight / 2
            : window.innerHeight -
              windowSoftBottomBorder -
              beginWindowY -
              startHeight;
        } else if (bottomRightY < windowSoftTopBorder) {
          processedDeltaY = isCenterResizing
            ? windowSoftTopBorder - beginCenterY - startHeight / 2
            : windowSoftTopBorder - beginWindowY - startHeight;
        }

        // aspect limits
        if (
          (startWidth +
            processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
            (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
            (startHeight +
              processedDeltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
              (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) >
          (data.maxAspectRatio ?? Infinity)
        ) {
          processedDeltaX =
            ((startHeight +
              processedDeltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
              (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) *
              (data.maxAspectRatio ?? Infinity) -
              startWidth -
              (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
            (isCenterResizing && !isAdaptiveOnX ? 2 : 1);
          if (
            startWidth +
              processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
              (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0) <
            minWidth
          ) {
            processedDeltaY =
              (minWidth / (data.maxAspectRatio ?? Infinity) -
                startHeight -
                (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) /
              (isCenterResizing && !isAdaptiveOnY ? 2 : 1);
            processedDeltaX =
              (minWidth -
                startWidth -
                (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
              (isCenterResizing && !isAdaptiveOnX ? 2 : 1);
          }
        } else if (
          (startWidth +
            processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
            (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
            (startHeight +
              processedDeltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
              (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0)) <
          (data.minAspectRatio || 0)
        ) {
          // keep original behavior: clamp to minAspect
          const minAspect = data.minAspectRatio ?? 0.000001;
          processedDeltaY =
            ((startWidth +
              processedDeltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
              (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
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
                (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0)) /
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

        if (
          beginWindowX >= windowSoftLeftBorder &&
          beginWindowX - projection.deltaX < windowSoftLeftBorder
        ) {
          isAdaptiveOnX = true;
        }

        if (
          beginWindowY >= windowSoftTopBorder &&
          beginWindowY - projection.deltaY < windowSoftTopBorder
        ) {
          isAdaptiveOnY = true;
        }

        if (isAdaptiveOnX && isAdaptiveOnY) {
          const projectedWidth =
            startWidth +
            projection.deltaX +
            beginWindowX -
            windowSoftLeftBorder;
          const projectedHeight =
            startHeight +
            projection.deltaY +
            beginWindowY -
            windowSoftTopBorder;

          const { deltaX: reprojectedDeltaX, deltaY: reprojectedDeltaY } =
            processDeltasAndGetDimensions(deltaX, deltaY);
          const reprojectedWidth =
            startWidth +
            reprojectedDeltaX +
            beginWindowX -
            windowSoftLeftBorder;
          const reprojectedHeight =
            startHeight +
            reprojectedDeltaY +
            beginWindowY -
            windowSoftTopBorder;

          if (
            projectedWidth / projectedHeight >
            (data.maxAspectRatio ?? Infinity)
          ) {
            const widthToCalculate = Math.max(
              reprojectedHeight * (data.maxAspectRatio ?? Infinity),
              minWidth
            );
            const newDeltaX =
              widthToCalculate -
              startWidth -
              (beginWindowX - windowSoftLeftBorder);
            if (!(beginWindowX - newDeltaX < windowSoftLeftBorder)) {
              isAdaptiveOnX = false;
            }
          }

          if (projectedWidth / projectedHeight < (data.minAspectRatio ?? 0)) {
            const heightToCalculate = Math.max(
              reprojectedWidth / (data.minAspectRatio ?? 0),
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
      const finalWidth =
        startWidth +
        finalDimensions.deltaX * (isCenterResizing && !isAdaptiveOnX ? 2 : 1) +
        (isAdaptiveOnX ? beginWindowX - windowSoftLeftBorder : 0);
      const finalHeight =
        startHeight +
        finalDimensions.deltaY * (isCenterResizing && !isAdaptiveOnY ? 2 : 1) +
        (isAdaptiveOnY ? beginWindowY - windowSoftTopBorder : 0);

      let newX = isCenterResizing
        ? beginCenterX - finalWidth / 2
        : beginWindowX;
      let newY = isCenterResizing
        ? beginCenterY - finalHeight / 2
        : beginWindowY;

      if (isAdaptiveOnX) newX = windowSoftLeftBorder;
      if (isAdaptiveOnY) newY = windowSoftTopBorder;

      scheduleWindowStateUpdate({
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
    },
    [
      scheduleWindowStateUpdate,
      settings.windowResizeBehavior,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      data.maxAspectRatio,
      data.minAspectRatio,
      windowStateBeforeFullscreen,
      setWindowStateBeforeFullscreen,
      settings,
    ]
  );

  const handleResizeEnd = useCallback(() => {
    isWindowResizingRef.current = false;
    setIsWindowResizing(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (pendingStateRef.current) {
        setWindowState(pendingStateRef.current);
        pendingStateRef.current = null;
      }
    }
    saveWindows();
  }, [setWindowState, saveWindows]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const clientX =
        "touches" in e
          ? e.changedTouches[0].clientX
          : (e as React.MouseEvent).clientX;
      const clientY =
        "touches" in e
          ? e.changedTouches[0].clientY
          : (e as React.MouseEvent).clientY;
      windowDraggingDataRef.current = {
        startX: clientX,
        startY: clientY,
        startLeft: windowRef.current?.offsetLeft || 0,
        startTop: windowRef.current?.offsetTop || 0,
        lastClientX: clientX,
        lastClientY: clientY,
        touchIdentifier: "touches" in e ? e.changedTouches[0].identifier : null,
      };
      isWindowDraggingRef.current = true;
      setIsWindowDragging(true);
    },
    []
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent &&
        (!isWindowDraggingRef.current || !["Shift"].includes(e.key))
      ) {
        return;
      }
      if ("preventDefault" in e) e.preventDefault();

      const dr = windowDraggingDataRef.current;

      const clientX =
        e instanceof KeyboardEvent
          ? dr.lastClientX
          : "touches" in e
          ? Array.from(e.touches).find(
              (touch) => touch.identifier === dr.touchIdentifier
            )?.clientX ??
            (e.touches[0] && e.touches[0].clientX)
          : (e as MouseEvent).clientX;
      const clientY =
        e instanceof KeyboardEvent
          ? dr.lastClientY
          : "touches" in e
          ? Array.from(e.touches).find(
              (touch) => touch.identifier === dr.touchIdentifier
            )?.clientY ??
            (e.touches[0] && e.touches[0].clientY)
          : (e as MouseEvent).clientY;

      dr.lastClientX = clientX ?? dr.lastClientX;
      dr.lastClientY = clientY ?? dr.lastClientY;

      let deltaX = (clientX ?? dr.lastClientX) - dr.startX;
      let deltaY = (clientY ?? dr.lastClientY) - dr.startY;

      const isShiftPressed = (e as any).shiftKey;

      if (isShiftPressed) {
        const originalDeltaX = deltaX;
        const originalDeltaY = deltaY;

        if (Math.abs(originalDeltaX) > Math.abs(originalDeltaY)) {
          deltaY = 0;
        } else {
          deltaX = 0;
        }

        if (
          Math.max(Math.abs(originalDeltaX), Math.abs(originalDeltaY)) <= 50
        ) {
          deltaX = 0;
          deltaY = 0;
        }
      }

      const prev = windowStateRef.current;

      const dragBarAndButtonWidth =
        Math.min(356, Math.max(108, prev.width * 0.3 + 36)) + 15.2;
      const computedHalfWidth = dragBarAndButtonWidth / 2 + 8;

      const newX = Math.max(
        -prev.width / 2 + computedHalfWidth,
        Math.min(
          dr.startLeft + deltaX,
          window.innerWidth - prev.width / 2 - computedHalfWidth
        )
      );
      const newY = Math.max(
        -prev.height + windowSoftTopBorder,
        Math.min(
          dr.startTop + deltaY,
          window.innerHeight - windowSoftBottomBorder - prev.height
        )
      );

      scheduleWindowStateUpdate({ x: newX, y: newY });
    },
    [scheduleWindowStateUpdate]
  );

  const handleDragEnd = useCallback(() => {
    isWindowDraggingRef.current = false;
    setIsWindowDragging(false);

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (pendingStateRef.current) {
        setWindowState(pendingStateRef.current);
        pendingStateRef.current = null;
      }
    }

    snapToClosestWindow();
    saveWindows();
  }, [setWindowState, saveWindows]);

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

  const expandWindowToScreen = useCallback(() => {
    if (data.disableExpandToScreen) return;

    if (interpolationTimeoutRef.current) {
      window.clearTimeout(interpolationTimeoutRef.current);
    }
    setIsInterpolating(true);

    if (windowStateBeforeFullscreen) {
      setWindowState(windowStateBeforeFullscreen);
      setWindowStateBeforeFullscreen(null);
    } else {
      setWindowStateBeforeFullscreen({ ...windowStateRef.current });

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

    interpolationTimeoutRef.current = window.setTimeout(() => {
      saveWindows();
      setIsInterpolating(false);
    }, 300);
  }, [
    data.disableExpandToScreen,
    data.maxAspectRatio,
    data.minAspectRatio,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    windowStateBeforeFullscreen,
    setWindowStateBeforeFullscreen,
    saveWindows,
  ]);

  const updateWindowProportions = useCallback(() => {
    if (windowRef.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      windowProportionsRef.current = {
        xProportion:
          (windowStateRef.current.x + windowStateRef.current.width / 2) /
          windowWidth,
        yProportion:
          (windowStateRef.current.y + windowStateRef.current.height + 16) /
          windowHeight,
      };
    }
  }, []);

  const repositionWindow = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const p = windowProportionsRef.current;
    setWindowState({
      x:
        Math.round(p.xProportion * windowWidth) -
        windowStateRef.current.width / 2,
      y:
        Math.round(p.yProportion * windowHeight) -
        windowStateRef.current.height -
        16,
    });
  }, [setWindowState]);

  const closeThisWindow = useCallback(() => {
    removeWindowByIndex(index);
    saveWindows();
  }, [index, removeWindowByIndex, saveWindows]);

  const setThisWindowActive = useCallback(() => {
    setActiveWindowByIndex(index);
    saveWindows();
  }, [index, setActiveWindowByIndex, saveWindows]);

  const snapToClosestWindow = useCallback(() => {
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

    let beforeShoulderMinDistanceX = minDistanceX;
    let beforeShoulderMinDistanceY = minDistanceY;

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
              right: windowSoftLeftBorder - SNAP_DISTANCE,
              top: -100,
              bottom: window.innerHeight + 100,
              width: 100 + windowSoftLeftBorder - SNAP_DISTANCE,
              height: window.innerHeight + 200,
            },
          },
          {
            rect: {
              left: window.innerWidth - windowSoftRightBorder + SNAP_DISTANCE,
              right: window.innerWidth + 100,
              top: -100,
              bottom: window.innerHeight + 100,
              width: 100 + windowSoftRightBorder - SNAP_DISTANCE,
              height: window.innerHeight + 200,
            },
          },
          {
            rect: {
              left: -100,
              right: window.innerWidth + 100,
              top: window.innerHeight - windowSoftBottomBorder + SNAP_DISTANCE,
              bottom: window.innerHeight + 100,
              width: window.innerWidth + 200,
              height: 100 + windowSoftBottomBorder - SNAP_DISTANCE,
            },
          },
        ];

    const isUnobstructed = (
      area: { left: number; right: number; top: number; bottom: number },
      candidateRef: React.RefObject<HTMLElement | null> | null
    ): boolean => {
      if (candidateRef === null) return true;
      if (!candidateRef.current) return false;
      if (windowRefs.length < 3) return true;

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
        if (!ref.current) continue;

        const style = window.getComputedStyle(ref.current);
        const zIndex = parseInt(style.zIndex) || 0;

        if (zIndex <= candidateZIndex) continue;

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

      if (!otherRect) continue;

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
            sideCondition: ownRight > otherLeft,
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
                !item.isShadow
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

    const currentWindowState = windowStateRef.current;
    const dragBarAndButtonWidth =
      Math.min(356, Math.max(108, currentWindowState.width * 0.3 + 36)) + 15.2;
    const computedHalfWidth = dragBarAndButtonWidth / 2 + 8;

    if (desiredX !== null) {
      desiredX = Math.max(
        -currentWindowState.width / 2 + computedHalfWidth,
        Math.min(
          desiredX,
          window.innerWidth - currentWindowState.width / 2 - computedHalfWidth
        )
      );
    }

    if (desiredY !== null) {
      desiredY = Math.max(
        -currentWindowState.height + windowSoftTopBorder,
        Math.min(
          desiredY,
          window.innerHeight -
            windowSoftBottomBorder -
            currentWindowState.height
        )
      );
    }

    if (
      (desiredX === null || desiredX === currentWindowState.x) &&
      (desiredY === null || desiredY === currentWindowState.y)
    ) {
      return;
    }

    if (interpolationTimeoutRef.current) {
      window.clearTimeout(interpolationTimeoutRef.current);
    }
    setIsInterpolating(true);
    setWindowStateBeforeFullscreen(null);

    scheduleWindowStateUpdate({
      x: desiredX !== null ? desiredX : undefined,
      y: desiredY !== null ? desiredY : undefined,
    });

    interpolationTimeoutRef.current = window.setTimeout(() => {
      saveWindows();
      setIsInterpolating(false);
    }, 300);
  }, [
    windowRefs,
    windowOrder,
    index,
    settings.disableWindowSnapToViewportBorder,
    settings.disableWindowSnapping,
    windowStateBeforeFullscreen,
    isInterpolating,
    scheduleWindowStateUpdate,
    saveWindows,
  ]);

  useEffect(() => {
    const onKeyEvent = (e: KeyboardEvent) => {
      handleResizeMove(e as any);
      handleDragMove(e as any);
    };

    window.addEventListener("keydown", onKeyEvent);
    window.addEventListener("keyup", onKeyEvent);

    return () => {
      window.removeEventListener("keydown", onKeyEvent);
      window.removeEventListener("keyup", onKeyEvent);
    };
  }, [handleResizeMove, handleDragMove]);

  useEffect(() => {
    const handleResizeWindow = () => {
      if (!isWindowDraggingRef.current && !isWindowResizingRef.current) {
        setWindowStateBeforeFullscreen(null);
        repositionWindow();
        saveWindows(false);
      }
    };

    window.addEventListener("resize", handleResizeWindow);
    return () => window.removeEventListener("resize", handleResizeWindow);
  }, [repositionWindow, saveWindows, setWindowStateBeforeFullscreen]);

  useEffect(() => {
    const cleanupData = windowCleanupData[index];
    if (cleanupData) {
      if (interpolationTimeoutRef.current) {
        window.clearTimeout(interpolationTimeoutRef.current);
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

      interpolationTimeoutRef.current = window.setTimeout(() => {
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
            windowSoftLeftBorder,
            Math.min(
              data.defaultCenterX - prev.width / 2,
              window.innerWidth - prev.width - windowSoftRightBorder
            )
          )
        : 20,
      y: data.defaultCenterY
        ? Math.max(
            windowSoftTopBorder,
            Math.min(
              data.defaultCenterY - prev.height / 2,
              window.innerHeight - windowSoftBottomBorder - prev.height
            )
          )
        : 20,
    }));
    registerWindowRef(index, windowRef);
    saveWindows();
    setIsMounted(true);

    return () => {
      if (interpolationTimeoutRef.current) {
        window.clearTimeout(interpolationTimeoutRef.current);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

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
    windowState.width,
    windowState.height,
    updateWindowProportions,
  ]);

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
            className={`absolute right-0 bottom-0 select-none -translate-y-4 -translate-x-4 h-0 w-0 ${
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
                  isWindowResizingRef.current ? "cursor-grabbing" : ""
                }`}
              >
                <div
                  className={`w-full h-full touch-none ${
                    isWindowResizingRef.current ? "" : "cursor-grab"
                  }`}
                  onMouseDown={handleStartResizing}
                  onTouchStart={handleStartTouchResizing}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 512 512"
                    className={`w-full h-auto aspect-square ${
                      isWindowResizingRef.current
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
              borderRadius: `${data.cornerRadius ?? 2}rem`,
            }}
            className={`relative w-full h-full ${
              data.enableEdgeHighlight ? "border-reflect-light" : ""
            } ${!data.disableShadow ? "shadow-xl" : ""} ${
              windowStyle.mountAnimator
            } ${data.disableBlur ? "" : "backdrop-blur-[6px]"} ${
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
              isWindowDragging={isWindowDraggingRef.current}
              isWindowResizing={isWindowResizingRef.current}
              modifyWindowSaveProps={modifyWindowSaveProps}
              windowData={data}
              windowState={windowState}
              setWindowData={setWindowData}
              setWindowState={setWindowState}
            >
              {data.content}
            </WindowActionProvider>
          </div>
          {!data.enableEdgeHighlight && (
            <div
              style={{
                borderRadius: `${data.cornerRadius ?? 2}rem`,
              }}
              className="absolute left-0 top-0 w-full h-full pointer-events-none select-none border border-highlight-light border-opacity-15"
            />
          )}
          <div
            className={`absolute select-none left-1/2 -translate-x-1/2 bottom-0 translate-y-4 h-0 flex items-center justify-center w-full ${
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
                isWindowDraggingRef.current
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
                    style={{ fillRule: "evenodd", strokeWidth: 0 }}
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
                isWindowDraggingRef.current
                  ? windowStyle.dragBarContainerOn
                  : isCloseButtonActive
                  ? windowStyle.dragBarContainerCloseActive
                  : windowStyle.dragBarContainer
              } flex items-center justify-center group transition-all duration-300 ease-out ${
                isWindowDraggingRef.current ? "cursor-grabbing" : ""
              }`}
            >
              <div
                className={`${windowStyle.dragBar} ${
                  isWindowDraggingRef.current
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
