"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { createDismissTimer } from "../dismiss";
import type { DismissClock, DismissTimer } from "../dismiss";

const browserClock: DismissClock = {
  now: () => performance.now(),
  schedule: (callback, ms) => window.setTimeout(callback, ms),
  cancel: (handle) => {
    window.clearTimeout(handle);
  },
};

export type AutoDismissHandle = {
  readonly pause: () => void;
  readonly resume: () => void;
};

export function useAutoDismiss(
  duration: number | null,
  onElapsed: () => void,
  clock: DismissClock = browserClock,
): AutoDismissHandle {
  const elapsed = useRef(onElapsed);
  const timer = useRef<DismissTimer | null>(null);

  useEffect(() => {
    elapsed.current = onElapsed;
  });

  useEffect(() => {
    const running = createDismissTimer(
      duration,
      () => {
        elapsed.current();
      },
      clock,
    );

    timer.current = running;
    running.start();

    return () => {
      running.stop();
      timer.current = null;
    };
  }, [duration, clock]);

  const pause = useCallback(() => {
    timer.current?.pause();
  }, []);

  const resume = useCallback(() => {
    timer.current?.resume();
  }, []);

  return useMemo(() => ({ pause, resume }), [pause, resume]);
}
