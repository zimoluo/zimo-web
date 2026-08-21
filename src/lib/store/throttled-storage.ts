import type { PersistStorage, StorageValue } from "zustand/middleware";

export type ThrottledStorageOptions = {
  readonly delayMs: number;
  readonly flushOn?: readonly ("pagehide" | "visibilitychange")[];
};

type Pending = { readonly name: string; readonly serialized: string };

const hasWindow = (): boolean => typeof window !== "undefined";

export function createThrottledJsonStorage<S>(
  options: ThrottledStorageOptions,
): PersistStorage<S> {
  let pending: Pending | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let writes = 0;

  const commit = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (pending === null) return;

    const { name, serialized } = pending;
    pending = null;

    try {
      window.localStorage.setItem(name, serialized);
      writes += 1;
    } catch {
      /* quota or private mode: a lost preference is not worth throwing over */
    }
  };

  if (hasWindow()) {
    for (const event of options.flushOn ?? ["pagehide", "visibilitychange"]) {
      window.addEventListener(
        event,
        () => {
          if (event === "visibilitychange" && document.visibilityState !== "hidden") return;
          commit();
        },
        { capture: true },
      );
    }
  }

  return {
    getItem: (name) => {
      if (!hasWindow()) return null;

      if (pending !== null && pending.name === name) {
        return JSON.parse(pending.serialized) as StorageValue<S>;
      }

      const raw = window.localStorage.getItem(name);
      if (raw === null) return null;

      try {
        return JSON.parse(raw) as StorageValue<S>;
      } catch {
        return null;
      }
    },

    setItem: (name, value) => {
      if (!hasWindow()) return;

      pending = { name, serialized: JSON.stringify(value) };

      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(commit, options.delayMs);
    },

    removeItem: (name) => {
      if (!hasWindow()) return;
      if (pending !== null && pending.name === name) pending = null;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      window.localStorage.removeItem(name);
    },
  };
}

export function createStorageProbe<S>(options: ThrottledStorageOptions): {
  readonly storage: PersistStorage<S>;
  readonly writeCount: () => number;
  readonly flush: () => void;
} {
  let writes = 0;
  let pending: Pending | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const memory = new Map<string, string>();

  const commit = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (pending === null) return;
    memory.set(pending.name, pending.serialized);
    pending = null;
    writes += 1;
  };

  return {
    writeCount: () => writes,
    flush: commit,
    storage: {
      getItem: (name) => {
        const raw = pending?.name === name ? pending.serialized : memory.get(name);
        if (raw === undefined || raw === null) return null;
        return JSON.parse(raw) as StorageValue<S>;
      },
      setItem: (name, value) => {
        pending = { name, serialized: JSON.stringify(value) };
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(commit, options.delayMs);
      },
      removeItem: (name) => {
        memory.delete(name);
        pending = null;
      },
    },
  };
}
