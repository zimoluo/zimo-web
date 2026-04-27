"use client";

import { ReactNode, useCallback, useEffect, useRef } from "react";
import CrossIcon from "../assets/CrossIcon";
import { useSwipe } from "@/lib/helperHooks";

interface Props {
  children?: ReactNode;
  dismissDirection?: Direction;
  onDismiss?: () => void;
  mounted?: boolean;
}

const computeOpacity = (delta: number) => {
  return Math.max(Math.min(2 / (1 + (delta / 75) ** 2) - 1, 1), 0);
};

const TIMEOUT = 6000;

export default function ToastCardSwiper({
  children,
  dismissDirection = "left",
  onDismiss = () => {},
  mounted = true,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const isHorizontal =
    dismissDirection === "left" || dismissDirection === "right";
  const directionMultiplier =
    dismissDirection === "left" || dismissDirection === "up" ? 1 : -1;

  const state = useRef({
    shift: 80,
    canPerformGestureFlip: false,
    touchInitialDelta: null as number | null,
    touchInitialShift: null as number | null,
    touchIdentifier: null as number | null,
    scrollTimeout: null as NodeJS.Timeout | null,
    isDismissing: false,
  }).current;

  const applyStyles = useCallback(
    (shift: number, transition: string = "none") => {
      state.shift = shift;
      if (!contentRef.current) return;

      const opacity = computeOpacity(shift);
      const x = isHorizontal ? shift * -directionMultiplier : 0;
      const y = !isHorizontal ? shift * -directionMultiplier : 0;
      const filter =
        opacity === 1 ? "none" : `blur(${(1 - opacity ** 2.5) * 7.5}px)`;

      contentRef.current.style.transform = `translate(${x}%, ${y}%)`;
      contentRef.current.style.opacity = opacity.toString();
      contentRef.current.style.transition = transition;
      contentRef.current.style.filter = filter;
    },
    [isHorizontal, directionMultiplier, state],
  );

  const revertToInitialPosition = useCallback(() => {
    if (!contentRef.current || state.shift === 0 || state.isDismissing) return;

    state.canPerformGestureFlip = false;
    applyStyles(0, "all 0.15s ease-out");

    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.style.transition = "none";
      }
      state.canPerformGestureFlip = true;
    }, 150);
  }, [applyStyles, state]);

  const dismissThisToast = useCallback(() => {
    if (!contentRef.current || state.isDismissing) return;

    state.canPerformGestureFlip = false;
    state.isDismissing = true;

    if (state.shift >= 80) {
      onDismissRef.current();
      return;
    }

    applyStyles(80, "all 0.2s ease-out");

    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.style.transition = "none";
      }
      onDismissRef.current();
    }, 200);
  }, [applyStyles, state]);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const handleScroll = (e: WheelEvent) => {
      if (state.scrollTimeout) clearTimeout(state.scrollTimeout);

      state.scrollTimeout = setTimeout(() => {
        if (state.shift < 75) revertToInitialPosition();
      }, 120);

      if (
        (isHorizontal && e.deltaX !== 0) ||
        (!isHorizontal && e.deltaY !== 0)
      ) {
        e.preventDefault();
      }

      const axisDelta = isHorizontal ? e.deltaX : e.deltaY;
      const deltaScroll = Math.round(0.4 * axisDelta * directionMultiplier);

      if (deltaScroll === 0 || !state.canPerformGestureFlip) return;
      if (state.shift === 0 && deltaScroll <= 0) return;

      const newShift = Math.max(0, Math.min(100, state.shift + deltaScroll));
      applyStyles(newShift);

      if (newShift >= 75) {
        dismissThisToast();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!state.canPerformGestureFlip) return;

      state.touchInitialDelta = isHorizontal
        ? e.changedTouches[0].clientX
        : e.changedTouches[0].clientY;
      state.touchInitialShift = state.shift;
      state.touchIdentifier = e.changedTouches[0].identifier;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        !state.canPerformGestureFlip ||
        !wrapperRef.current ||
        state.touchInitialDelta === null
      )
        return;

      const touch =
        Array.from(e.touches).find(
          (t) => t.identifier === state.touchIdentifier,
        ) ?? e.touches[0];
      const currentDelta = isHorizontal ? touch.clientX : touch.clientY;
      const dimension = isHorizontal
        ? wrapperRef.current.clientWidth
        : wrapperRef.current.clientHeight;

      const deltaTouch =
        ((currentDelta - state.touchInitialDelta) / dimension) *
        100 *
        -directionMultiplier;

      if (state.shift === 0 && deltaTouch <= 0) return;

      const newShift = Math.max(
        0,
        Math.min(100, deltaTouch + (state.touchInitialShift || 0)),
      );
      applyStyles(newShift);
    };

    const handleTouchEnd = () => {
      state.touchInitialShift = null;
      state.touchInitialDelta = null;
      state.touchIdentifier = null;

      if (state.shift < 60) {
        revertToInitialPosition();
      } else {
        dismissThisToast();
      }
    };

    node.addEventListener("wheel", handleScroll, { passive: false });
    node.addEventListener("touchstart", handleTouchStart, { passive: true });
    node.addEventListener("touchmove", handleTouchMove, { passive: true });
    node.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      node.removeEventListener("wheel", handleScroll);
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
      node.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    applyStyles,
    dismissThisToast,
    revertToInitialPosition,
    isHorizontal,
    directionMultiplier,
    state,
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (mounted) {
      revertToInitialPosition();

      timer = setTimeout(() => {
        if (mounted) {
          dismissThisToast();
        }
      }, TIMEOUT);
    } else {
      state.canPerformGestureFlip = false;
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [mounted, dismissThisToast, revertToInitialPosition, state]);

  useSwipe({
    subjectRef: wrapperRef,
    left: dismissDirection === "right" ? dismissThisToast : undefined,
    right: dismissDirection === "left" ? dismissThisToast : undefined,
    up: dismissDirection === "down" ? dismissThisToast : undefined,
    down: dismissDirection === "up" ? dismissThisToast : undefined,
    respectDisableGesturesSetting: false,
    allowMouse: false,
  });

  const initialOpacity = computeOpacity(80);

  return (
    <div className="touch-none" ref={wrapperRef}>
      <div
        className="relative rounded-full md:rounded-3xl backdrop-blur-[6px]"
        ref={contentRef}
        style={{
          transform: `translate(${isHorizontal ? 80 * -directionMultiplier : 0}%, ${
            !isHorizontal ? 80 * -directionMultiplier : 0
          }%)`,
          opacity: initialOpacity,
          transition: "none",
          filter: `blur(${(1 - initialOpacity ** 2.5) * 7.5}px)`,
        }}
      >
        {children}
        <button
          className="hidden md:block absolute top-3.5 right-3.5 opacity-70"
          onClick={() => {
            if (state.canPerformGestureFlip && mounted) {
              dismissThisToast();
            }
          }}
        >
          <CrossIcon className="h-3 w-auto aspect-square transition-transform duration-300 ease-out hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
