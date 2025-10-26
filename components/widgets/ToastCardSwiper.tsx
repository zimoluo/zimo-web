"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
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

const TIMEOUT: number = 6000;

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
  const [touchIdentifier, setTouchIdentifier] = useState<null | number>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const canPerformGestureFlipRef = useRef(canPerformGestureFlip);
  canPerformGestureFlipRef.current = canPerformGestureFlip;

  const updateToastState = useCallback(
    (newShift: number, transition: string = "none") => {
      setShift(newShift);
      setToastOpacity(computeOpacity(newShift));
      setToastTransition(transition);
    },
    [setShift, setToastOpacity, setToastTransition]
  );

  const isHorizontal =
    dismissDirection === "left" || dismissDirection === "right";
  const directionMultiplier =
    dismissDirection === "left" || dismissDirection === "up" ? 1 : -1;

  const revertToInitialPosition = () => {
    if (!toastRef.current) {
      return;
    }

    if (shiftRef.current === 0) {
      return;
    }

    setCanPerformGestureFlip(false);
    updateToastState(0, "all 0.15s ease-out");

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
      handleToastTransitionEnd,
      {
        passive: true,
      }
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

    updateToastState(80, "all 0.2s ease-out");

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
      handleToastTransitionEnd,
      {
        passive: true,
      }
    );
  };

  function handleScroll(e: WheelEvent): void {
    if (wasPreviouslyScrolling) {
      const timeoutId = setTimeout(() => {
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

    if ((isHorizontal && e.deltaX !== 0) || (!isHorizontal && e.deltaY !== 0)) {
      e.preventDefault();
    }

    const axisDelta = isHorizontal ? e.deltaX : e.deltaY;
    const deltaScroll = Math.round(0.4 * axisDelta * directionMultiplier);

    if (deltaScroll === 0 || !canPerformGestureFlip) {
      return;
    }

    setWasPreviouslyScrolling(true);

    if (shift === 0 && deltaScroll <= 0) {
      return;
    }

    const newShift = Math.max(0, Math.min(100, shift + deltaScroll));
    updateToastState(newShift);

    if (newShift >= 75) {
      dismissThisToast();
      return;
    }
  }

  function handleTouchStart(e: TouchEvent): void {
    if (!canPerformGestureFlip) {
      return;
    }
    setTouchInitialDelta(
      isHorizontal ? e.changedTouches[0].clientX : e.changedTouches[0].clientY
    );
    setTouchInitialShift(shift);
    setTouchIdentifier(e.changedTouches[0].identifier);
  }

  function handleTouchMove(e: TouchEvent): void {
    if (
      !canPerformGestureFlip ||
      !toastRef.current ||
      touchInitialDelta === null
    ) {
      return;
    }

    const currentDelta = isHorizontal
      ? Array.from(e.touches).find(
          (touch) => touch.identifier === touchIdentifier
        )?.clientX ?? e.touches[0].clientX
      : Array.from(e.touches).find(
          (touch) => touch.identifier === touchIdentifier
        )?.clientY ?? e.touches[0].clientY;
    const deltaTouch =
      ((currentDelta - touchInitialDelta) /
        (isHorizontal
          ? toastRef.current.clientWidth
          : toastRef.current.clientHeight)) *
      100 *
      -directionMultiplier;

    if (shift === 0 && deltaTouch <= 0) {
      return;
    }

    const newShift = Math.max(
      0,
      Math.min(100, deltaTouch + (touchInitialShift || 0))
    );
    updateToastState(newShift);
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
    left: dismissDirection === "right" ? dismissThisToast : undefined, // Intentionally swapped to address some logic issues that are otherwise incomprehensible.
    right: dismissDirection === "left" ? dismissThisToast : undefined,
    up: dismissDirection === "down" ? dismissThisToast : undefined,
    down: dismissDirection === "up" ? dismissThisToast : undefined,
    respectDisableGesturesSetting: false,
    allowMouse: false,
  });

  useEffect(() => {
    if (toastRef.current) {
      toastRef.current.addEventListener("wheel", handleScroll);
      toastRef.current.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      toastRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      toastRef.current.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });
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
      }, TIMEOUT);
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
            isHorizontal ? shift * -directionMultiplier : 0
          }%, ${!isHorizontal ? shift * -directionMultiplier : 0}%)`,
          opacity: toastOpacity,
          transition: toastTransition,
          filter:
            toastOpacity === 1
              ? undefined
              : `blur(${(1 - toastOpacity ** 2.5) * 7.5}px)`,
        }}
      >
        {children}
        <button
          className="hidden md:block absolute top-3.5 right-3.5 opacity-70"
          onClick={() => {
            if (canPerformGestureFlip && mounted) {
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
