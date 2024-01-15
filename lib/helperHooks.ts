import { RefObject, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getNavigation } from "./constants/navigationFinder";
import { useSettings } from "@/components/contexts/SettingsContext";

export function useNavigation(): NavigationKey {
  const pathname = usePathname();
  const navigation = useMemo(() => {
    return getNavigation(pathname);
  }, [pathname]);

  return navigation;
}

export function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const useSwipe = ({
  left,
  right,
  up,
  down,
  subjectRef,
  respectDisableGesturesSetting = true,
}: {
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
  subjectRef?: RefObject<any>;
  respectDisableGesturesSetting?: boolean;
}) => {
  const { settings } = useSettings();
  const touchCoordsRef = useRef({
    touchStart: { x: 0, y: 0, time: Date.now() },
  });
  const fnsRef = useRef({ up, down, left, right });
  fnsRef.current = {
    up,
    left,
    down,
    right,
  };

  const handleTouchStart = (e: TouchEvent) => {
    const { clientX, clientY } = e.targetTouches[0];
    touchCoordsRef.current.touchStart = {
      x: clientX,
      y: clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (settings.disableGestures && respectDisableGesturesSetting) {
      return;
    }
    const threshold = 40;
    const swipeSpeed = 5; // sec;
    const { clientX: touchEndX, clientY: touchEndY } = e.changedTouches[0];
    const {
      x: touchStartX,
      y: touchStartY,
      time: touchStartTime,
    } = touchCoordsRef.current.touchStart;
    const elapsedTime = (Date.now() - touchStartTime) / 1000;

    if (elapsedTime > swipeSpeed) {
      return;
    }

    const xDistance = touchStartX - touchEndX;
    const yDistance = touchStartY - touchEndY;

    if (Math.abs(xDistance) < threshold && Math.abs(yDistance) < threshold) {
      return;
    }

    if (Math.abs(xDistance) >= Math.abs(yDistance)) {
      xDistance > 0 ? fnsRef.current.right?.() : fnsRef.current.left?.();
    } else {
      yDistance > 0 ? fnsRef.current.down?.() : fnsRef.current.up?.();
    }
  };

  useEffect(() => {
    if (!subjectRef) {
      return;
    }

    if (!subjectRef.current) {
      return;
    }

    subjectRef.current.addEventListener("touchstart", handleTouchStart);
    subjectRef.current.addEventListener("touchend", handleTouchEnd);
    return () => {
      if (!subjectRef.current) {
        return;
      }

      subjectRef.current.removeEventListener("touchstart", handleTouchStart);
      subjectRef.current.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
};

export function useNextRenderEffect(callback: () => void, dependencies: any[]) {
  const [hasExecuted, setHasExecuted] = useState(true);

  useEffect(() => {
    if (hasExecuted) {
      return;
    }

    callback();
    setHasExecuted(true);
  }, [hasExecuted, callback, ...dependencies]);

  return () => {
    setHasExecuted(false);
  };
}
