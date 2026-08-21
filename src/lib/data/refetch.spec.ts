import { describe, expect, it, vi } from "vitest";
import {
  createRefetcher,
  DEBOUNCE_MS,
  watchForRefetch,
} from "./refetch";
import type { RefetchTrigger } from "./refetch";

const harness = () => {
  const clock = { at: 0 };
  const runs: RefetchTrigger[] = [];
  const refetcher = createRefetcher({
    now: () => clock.at,
    run: (trigger) => runs.push(trigger),
  });
  return { clock, runs, refetcher };
};

describe("D3 §6.1: refetch on focus, not on a timer", () => {
  it("runs the first request immediately", () => {
    const { runs, refetcher } = harness();
    expect(refetcher.request("mount")).toBe(true);
    expect(runs).toEqual(["mount"]);
  });

  it("debounces a second focus inside five seconds", () => {
    const { clock, runs, refetcher } = harness();

    refetcher.request("focus");
    clock.at = DEBOUNCE_MS - 1;
    expect(refetcher.request("focus")).toBe(false);

    expect(runs).toEqual(["focus"]);
    expect(refetcher.suppressed()).toBe(1);
  });

  it("allows one once the window has passed", () => {
    const { clock, runs, refetcher } = harness();

    refetcher.request("focus");
    clock.at = DEBOUNCE_MS;
    expect(refetcher.request("visible")).toBe(true);

    expect(runs).toEqual(["focus", "visible"]);
  });

  it("collapses a focus and a visibilitychange that arrive together", () => {
    const { runs, refetcher } = harness();

    refetcher.request("focus");
    refetcher.request("visible");

    expect(runs).toHaveLength(1);
  });

  it("never debounces a manual refresh, which is the affordance on the thread", () => {
    const { runs, refetcher } = harness();

    refetcher.request("focus");
    expect(refetcher.request("manual")).toBe(true);
    expect(refetcher.request("manual")).toBe(true);

    expect(runs).toEqual(["focus", "manual", "manual"]);
  });

  it("restarts the window from a manual refresh", () => {
    const { clock, refetcher } = harness();

    refetcher.request("focus");
    clock.at = 3_000;
    refetcher.request("manual");
    clock.at = 5_001;

    expect(refetcher.request("focus")).toBe(false);
    expect(refetcher.lastRunAt()).toBe(3_000);
  });

  it("reports nothing has run yet", () => {
    const { refetcher } = harness();
    expect(refetcher.lastRunAt()).toBeNull();
    expect(refetcher.suppressed()).toBe(0);
  });
});

const fakeWindow = () => {
  const listeners = new Map<string, Set<() => void>>();
  return {
    addEventListener: (type: string, listener: () => void) => {
      const set = listeners.get(type) ?? new Set();
      set.add(listener);
      listeners.set(type, set);
    },
    removeEventListener: (type: string, listener: () => void) => {
      listeners.get(type)?.delete(listener);
    },
    fire: (type: string) => {
      for (const listener of listeners.get(type) ?? []) listener();
    },
    count: () =>
      [...listeners.values()].reduce((total, set) => total + set.size, 0),
  };
};

describe("F-42: two listeners, no interval", () => {
  it("refetches on focus and on becoming visible", () => {
    const { runs, refetcher } = harness();
    const target = fakeWindow();
    const visibility = { visible: true };

    watchForRefetch(target, { isVisible: () => visibility.visible }, refetcher);

    target.fire("focus");
    expect(runs).toEqual(["focus"]);
  });

  it("does not refetch when the tab becomes hidden", () => {
    const { runs, refetcher } = harness();
    const target = fakeWindow();
    const visibility = { visible: false };

    watchForRefetch(target, { isVisible: () => visibility.visible }, refetcher);
    target.fire("visibilitychange");

    expect(runs).toEqual([]);
  });

  it("refetches when it becomes visible again", () => {
    const { clock, runs, refetcher } = harness();
    const target = fakeWindow();
    const visibility = { visible: false };

    watchForRefetch(target, { isVisible: () => visibility.visible }, refetcher);

    target.fire("visibilitychange");
    visibility.visible = true;
    clock.at = 10_000;
    target.fire("visibilitychange");

    expect(runs).toEqual(["visible"]);
  });

  it("attaches exactly two listeners and detaches both", () => {
    const { refetcher } = harness();
    const target = fakeWindow();

    const stop = watchForRefetch(target, { isVisible: () => true }, refetcher);
    expect(target.count()).toBe(2);

    stop();
    expect(target.count()).toBe(0);
  });

  it("uses no timer at all", () => {
    const timers = vi.spyOn(globalThis, "setInterval");
    const { refetcher } = harness();
    const target = fakeWindow();

    watchForRefetch(target, { isVisible: () => true }, refetcher);
    target.fire("focus");

    expect(timers).not.toHaveBeenCalled();
    timers.mockRestore();
  });
});
