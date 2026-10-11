export type DismissClock = {
  readonly now: () => number;
  readonly schedule: (callback: () => void, ms: number) => number;
  readonly cancel: (handle: number) => void;
};

export type DismissTimer = {
  readonly start: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly stop: () => void;
  readonly remaining: () => number;
  readonly running: () => boolean;
};

export function createDismissTimer(
  duration: number | null,
  onElapsed: () => void,
  clock: DismissClock,
): DismissTimer {
  let handle: number | null = null;
  let left = duration ?? 0;
  let startedAt = 0;
  let started = false;

  const clear = (): void => {
    if (handle !== null) {
      clock.cancel(handle);
      handle = null;
    }
  };

  const arm = (): void => {
    if (duration === null || left <= 0) return;
    startedAt = clock.now();
    handle = clock.schedule(() => {
      handle = null;
      left = 0;
      onElapsed();
    }, left);
  };

  return {
    start: () => {
      clear();
      started = true;
      left = duration ?? 0;
      arm();
    },

    pause: () => {
      if (handle === null) return;
      left = Math.max(0, left - (clock.now() - startedAt));
      clear();
    },

    resume: () => {
      if (!started || handle !== null || duration === null || left <= 0) return;
      arm();
    },

    stop: () => {
      clear();
      started = false;
      left = 0;
    },

    remaining: () => left,
    running: () => handle !== null,
  };
}

export const SWIPE_THRESHOLD_RATIO = 0.35;
export const SWIPE_MIN_DISTANCE = 64;

export const swipeThreshold = (width: number): number =>
  Math.max(SWIPE_MIN_DISTANCE, width * SWIPE_THRESHOLD_RATIO);

export const dismissesOnRelease = (dx: number, width: number): boolean =>
  Math.abs(dx) >= swipeThreshold(width);

export const swipeOpacity = (dx: number, width: number): number => {
  const shift = dx / Math.max(1, width) * 100;
  return Math.max(0, Math.min(1, 2 / (1 + (shift / 75) ** 2) - 1));
};
