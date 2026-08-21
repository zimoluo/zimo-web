import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStorageProbe } from "./throttled-storage";
import type { StorageValue } from "zustand/middleware";

type Payload = { readonly count: number };

const read = (
  value: StorageValue<Payload> | Promise<StorageValue<Payload> | null> | null,
): number | null => (value !== null && "state" in value ? value.state.count : null);

describe("throttled json storage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not write before the delay elapses", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 250 });
    probe.storage.setItem("zw.test", { state: { count: 1 }, version: 1 });

    expect(probe.writeCount()).toBe(0);
    vi.advanceTimersByTime(249);
    expect(probe.writeCount()).toBe(0);
    vi.advanceTimersByTime(1);
    expect(probe.writeCount()).toBe(1);
  });

  it("D5 C4: coalesces a burst into a single trailing write", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 500 });

    for (let frame = 0; frame < 180; frame += 1) {
      probe.storage.setItem("zw.windows", { state: { count: frame }, version: 1 });
      vi.advanceTimersByTime(16);
    }

    expect(probe.writeCount()).toBe(0);
    vi.advanceTimersByTime(500);
    expect(probe.writeCount()).toBe(1);
  });

  it("writes the last value of the burst, not the first", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 250 });
    probe.storage.setItem("zw.test", { state: { count: 1 }, version: 1 });
    probe.storage.setItem("zw.test", { state: { count: 2 }, version: 1 });
    probe.storage.setItem("zw.test", { state: { count: 3 }, version: 1 });
    vi.advanceTimersByTime(250);

    expect(probe.writeCount()).toBe(1);
    expect(read(probe.storage.getItem("zw.test"))).toBe(3);
  });

  it("reads back a pending value before it is committed", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 250 });
    probe.storage.setItem("zw.test", { state: { count: 9 }, version: 1 });

    expect(probe.writeCount()).toBe(0);
    expect(read(probe.storage.getItem("zw.test"))).toBe(9);
  });

  it("returns null for a key that was never written", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 250 });
    expect(probe.storage.getItem("zw.absent")).toBeNull();
  });

  it("flushes synchronously on demand, as pagehide does", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 5000 });
    probe.storage.setItem("zw.test", { state: { count: 4 }, version: 1 });

    expect(probe.writeCount()).toBe(0);
    probe.flush();
    expect(probe.writeCount()).toBe(1);
    expect(read(probe.storage.getItem("zw.test"))).toBe(4);
  });

  it("a flush with nothing pending writes nothing", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 250 });
    probe.flush();
    expect(probe.writeCount()).toBe(0);
  });

  it("separate keys do not interfere, so one store's write is another's silence", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 250 });
    probe.storage.setItem("zw.windows", { state: { count: 1 }, version: 1 });
    vi.advanceTimersByTime(250);
    probe.storage.setItem("zw.settings", { state: { count: 2 }, version: 1 });
    vi.advanceTimersByTime(250);

    expect(probe.writeCount()).toBe(2);
    expect(read(probe.storage.getItem("zw.windows"))).toBe(1);
    expect(read(probe.storage.getItem("zw.settings"))).toBe(2);
  });

  it("removeItem drops a pending write rather than letting it land later", () => {
    const probe = createStorageProbe<Payload>({ delayMs: 250 });
    probe.storage.setItem("zw.test", { state: { count: 1 }, version: 1 });
    probe.storage.removeItem("zw.test");
    vi.advanceTimersByTime(250);

    expect(probe.writeCount()).toBe(0);
    expect(probe.storage.getItem("zw.test")).toBeNull();
  });
});
