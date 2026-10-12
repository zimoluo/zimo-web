import { afterEach, describe, expect, it, vi } from "vitest";
import { createAlbumCounts } from "./album-counts";
import type { AlbumCounts } from "./album-counts";

const deferred = () => {
  let resolve!: (counts: AlbumCounts) => void, reject!: (cause: Error) => void;
  const promise = new Promise<AlbumCounts>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
afterEach(() => vi.restoreAllMocks());

describe("shared album reaction presentation", () => {
  it("loads once for simultaneous page/window owners and protects a successful like against an older read", async () => {
    const pending = deferred();
    const load = vi.fn<((signal: AbortSignal) => Promise<AlbumCounts>)>(() => pending.promise);
    const counts = createAlbumCounts(load);
    const listener = vi.fn(), unsubscribe = counts.subscribe(listener);
    const releasePage = counts.acquire({ one: 3 }), releaseWindow = counts.acquire({ one: 0, two: 8 });
    try {
      expect(load).toHaveBeenCalledTimes(1);
      expect(counts.snapshot()).toEqual({ one: 3, two: 8 });
      counts.publish("one", 4);
      pending.resolve({ one: 3, two: 9 });
      await vi.waitFor(() => expect(counts.snapshot()).toEqual({ one: 4, two: 9 }));
      const notifications = listener.mock.calls.length;
      counts.publish("one", 4);
      expect(listener).toHaveBeenCalledTimes(notifications);
      releasePage(); releasePage();
      expect(load.mock.calls[0]?.[0]?.aborted).not.toBe(true);
    } finally { releasePage(); releaseWindow(); unsubscribe(); }
  });
  it("aborts the last owner's read, removes listeners, ignores late completion, and reloads on a later mount", async () => {
    const first = deferred(), second = deferred();
    const load = vi.fn<((signal: AbortSignal) => Promise<AlbumCounts>)>().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const remove = vi.spyOn(window, "removeEventListener");
    const counts = createAlbumCounts(load);
    const release = counts.acquire();
    release();
    expect(load.mock.calls[0]?.[0].aborted).toBe(true);
    expect(remove.mock.calls.map(call => call[0])).toContain("focus");
    expect(remove.mock.calls.map(call => call[0])).toContain("visibilitychange");
    const again = counts.acquire();
    try {
      first.resolve({ old: 2 });
      second.resolve({ current: 5 });
      await vi.waitFor(() => expect(counts.snapshot()).toEqual({ current: 5 }));
    } finally { again(); }
  });
  it("keeps unknown counts unknown after failure and retries when returning to the page", async () => {
    const pending = deferred();
    const load = vi.fn<((signal: AbortSignal) => Promise<AlbumCounts>)>().mockReturnValueOnce(pending.promise).mockResolvedValue({ recovered: 2 });
    const counts = createAlbumCounts(load), release = counts.acquire();
    try {
      pending.reject(new Error("Offline"));
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(counts.snapshot()).toEqual({});
      vi.spyOn(performance, "now").mockReturnValue(performance.now() + 6000);
      window.dispatchEvent(new Event("focus"));
      await vi.waitFor(() => expect(counts.snapshot()).toEqual({ recovered: 2 }));
    } finally { release(); }
  });
});
