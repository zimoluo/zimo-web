"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import CrossIcon from "../assets/CrossIcon";
import { useSwipe } from "@/lib/helperHooks";

interface Props {
  children?: ReactNode;
  dismissDirection?: "up" | "down" | "left" | "right";
  onDismiss?: () => void;
  mounted?: boolean;
}

const computeOpacity = (delta: number) => {
  return Math.max(Math.min(2 / (1 + (delta / 75) ** 2) - 1, 1), 0);
};

export default function ToastCardSwiper({
  children,
  dismissDirection = "left",
  onDismiss = () => {},
  mounted = true,
}: Props) {
  const [shift, setShift] = useState<number>(80);
  const shiftRef = useRef(shift);
  shiftRef.current = shift;

  const [toastOpacity, setToastOpacity] = useState<number>(0);
  const [toastTransition, setToastTransition] = useState<string>("none");
  const [wasPreviouslyScrolling, setWasPreviouslyScrolling] = useState(false);
  const [canPerformGestureFlip, setCanPerformGestureFlip] = useState(false);
  const [touchInitialDelta, setTouchInitialDelta] = useState<null | number>(
    null
  );
  const [touchInitialShift, setTouchInitialShift] = useState<null | number>(
    null
  );
  const toastRef = useRef<HTMLDivElement>(null);
  const canPerformGestureFlipRef = useRef(canPerformGestureFlip);
  canPerformGestureFlipRef.current = canPerformGestureFlip;

  const isHorizontal =
    dismissDirection === "left" || dismissDirection === "right";

  const revertToInitialPosition = () => {
    if (!toastRef.current) {
      return;
    }

    if (shiftRef.current === 0) {
      return;
    }

    setCanPerformGestureFlip(false);
    setToastTransition("all 0.15s ease-out");
    setShift(0);
    setToastOpacity(1);

    const handleToastTransitionEnd = () => {
      if (toastRef.current) {
        setToastTransition("none");
        setCanPerformGestureFlip(true);

        toastRef.current.removeEventListener(
          "transitionend",
          handleToastTransitionEnd
        );
      }
    };

    toastRef.current.addEventListener(
      "transitionend",
      handleToastTransitionEnd
    );
  };

  const dismissThisToast = () => {
    if (!toastRef.current) {
      return;
    }

    setCanPerformGestureFlip(false);

    if (shiftRef.current === 80) {
      onDismiss();
      return;
    }

    setToastTransition("all 0.15s ease-out");
    setShift(80);
    setToastOpacity(0);

    const handleToastTransitionEnd = () => {
      if (toastRef.current) {
        setToastTransition("none");
        setCanPerformGestureFlip(false);
        onDismiss();

        toastRef.current.removeEventListener(
          "transitionend",
          handleToastTransitionEnd
        );
      }
    };

    toastRef.current.addEventListener(
      "transitionend",
      handleToastTransitionEnd
    );
  };

  function handleScroll(e: WheelEvent): void {
    const deltaScroll = Math.round(
      0.4 *
        (dismissDirection === "left"
          ? e.deltaX
          : dismissDirection === "right"
          ? -e.deltaX
          : dismissDirection === "up"
          ? e.deltaY
          : -e.deltaY)
    );

    if (wasPreviouslyScrolling) {
      let timeoutId: NodeJS.Timeout;
      timeoutId = setTimeout(() => {
        setWasPreviouslyScrolling(false);
        if (shift < 75) {
          revertToInitialPosition();
        }
      }, 120);

      const clearPageWindow = () => {
        clearTimeout(timeoutId);
        toastRef.current?.removeEventListener("wheel", clearPageWindow);
      };

      toastRef.current?.addEventListener("wheel", clearPageWindow);
    }

    if (e.deltaX !== 0 && isHorizontal) {
      e.preventDefault();
    }

    if (e.deltaY !== 0 && !isHorizontal) {
      e.preventDefault();
    }

    if (deltaScroll === 0) {
      return;
    }

    if (!canPerformGestureFlip) {
      return;
    }

    setWasPreviouslyScrolling(true);

    if (shift === 0 && deltaScroll <= 0) {
      return;
    }

    const newShift = Math.max(0, Math.min(100, deltaScroll + shift));
    setShift(newShift);
    setToastOpacity(computeOpacity(newShift));

    if (newShift >= 75) {
      dismissThisToast();
    }
  }

  function handleTouchStart(e: TouchEvent): void {
    if (!canPerformGestureFlip) {
      return;
    }
    setTouchInitialDelta(
      isHorizontal ? e.touches[0].clientX : e.touches[0].clientY
    );
    setTouchInitialShift(shift);
  }

  function handleTouchMove(e: TouchEvent): void {
    const isTouchInitialsSet =
      touchInitialDelta !== null && touchInitialShift !== null;

    if (isTouchInitialsSet && canPerformGestureFlip && toastRef.current) {
      const deltaTouch =
        (((isHorizontal ? e.touches[0].clientX : e.touches[0].clientY) -
          touchInitialDelta) /
          (isHorizontal
            ? toastRef.current.clientWidth
            : toastRef.current.clientHeight)) *
        100 *
        (dismissDirection === "left" || dismissDirection === "up" ? -1 : 1);

      if (shift === 0 && deltaTouch <= 0) {
        return;
      }

      const newShift = Math.max(
        0,
        Math.min(100, deltaTouch + touchInitialShift)
      );

      setShift(newShift);
      setToastOpacity(computeOpacity(newShift));
    }
  }

  function handleTouchEnd(e: TouchEvent): void {
    setTouchInitialShift(null);
    setTouchInitialDelta(null);

    if (shift < 60) {
      revertToInitialPosition();
    } else {
      dismissThisToast();
    }
  }

  useSwipe({
    subjectRef: toastRef,
    left: dismissDirection === "right" ? dismissThisToast : undefined, // Intentionally swapped to address some logic issues that are otherwise lame.
    right: dismissDirection === "left" ? dismissThisToast : undefined,
    up: dismissDirection === "down" ? dismissThisToast : undefined,
    down: dismissDirection === "up" ? dismissThisToast : undefined,
    respectDisableGesturesSetting: false,
  });

  useEffect(() => {
    if (toastRef.current) {
      toastRef.current.addEventListener("wheel", handleScroll);
      toastRef.current.addEventListener("touchstart", handleTouchStart);
      toastRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      toastRef.current.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (toastRef.current) {
        toastRef.current.removeEventListener("wheel", handleScroll);
        toastRef.current.removeEventListener("touchstart", handleTouchStart);
        toastRef.current.removeEventListener("touchmove", handleTouchMove);
        toastRef.current.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [toastRef, handleScroll]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mounted) {
      revertToInitialPosition();
      setCanPerformGestureFlip(true);

      timer = setTimeout(() => {
        if (canPerformGestureFlipRef.current && mounted) {
          dismissThisToast();
        }
      }, 4000);
    } else {
      setCanPerformGestureFlip(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [mounted]);

  return (
    <div className="touch-none" ref={toastRef}>
      <div
        className="relative"
        style={{
          transform: `translate(${
            dismissDirection === "left"
              ? -shift
              : dismissDirection === "right"
              ? shift
              : 0
          }%, ${
            dismissDirection === "up"
              ? -shift
              : dismissDirection === "down"
              ? shift
              : 0
          }%)`,
          opacity: toastOpacity,
          transition: toastTransition,
        }}
      >
        {children}
        <button
          className="hidden md:block absolute top-2.5 right-2.5 opacity-70"
          onClick={() => {
            if (canPerformGestureFlip && mounted) {
              dismissThisToast();
            }
          }}
        >
          <CrossIcon className="h-3 w-auto aspect-square" />
        </button>
      </div>
    </div>
  );
}
