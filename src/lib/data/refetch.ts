export type RefetchTrigger = "focus" | "visible" | "manual" | "mount";

export type RefetchEnvironment = {
  readonly now: () => number;
  readonly run: (trigger: RefetchTrigger) => void;
};

export type Refetcher = {
  readonly request: (trigger: RefetchTrigger) => boolean;
  readonly lastRunAt: () => number | null;
  readonly suppressed: () => number;
};

export const DEBOUNCE_MS = 5_000;

const ALWAYS: readonly RefetchTrigger[] = ["manual", "mount"];

export function createRefetcher(
  environment: RefetchEnvironment,
  debounceMs: number = DEBOUNCE_MS,
): Refetcher {
  let lastRunAt: number | null = null;
  let suppressed = 0;

  return {
    request: (trigger) => {
      const at = environment.now();

      const debounced =
        !ALWAYS.includes(trigger) &&
        lastRunAt !== null &&
        at - lastRunAt < debounceMs;

      if (debounced) {
        suppressed += 1;
        return false;
      }

      lastRunAt = at;
      environment.run(trigger);
      return true;
    },

    lastRunAt: () => lastRunAt,
    suppressed: () => suppressed,
  };
}

export type VisibilityTarget = {
  readonly addEventListener: (
    type: string,
    listener: () => void,
  ) => void;
  readonly removeEventListener: (
    type: string,
    listener: () => void,
  ) => void;
};

export type VisibilitySource = {
  readonly isVisible: () => boolean;
};

export function watchForRefetch(
  target: VisibilityTarget,
  source: VisibilitySource,
  refetcher: Refetcher,
): () => void {
  const onFocus = (): void => {
    refetcher.request("focus");
  };

  const onVisibility = (): void => {
    if (source.isVisible()) refetcher.request("visible");
  };

  target.addEventListener("focus", onFocus);
  target.addEventListener("visibilitychange", onVisibility);

  return () => {
    target.removeEventListener("focus", onFocus);
    target.removeEventListener("visibilitychange", onVisibility);
  };
}
