import { z } from "zod";
import { createRefetcher, watchForRefetch } from "../../lib/data/refetch";

export type AlbumCounts = Readonly<Record<string, number>>;
export const EMPTY_ALBUM_COUNTS: AlbumCounts = {};
const schema = z.record(z.string(), z.number().int().nonnegative());

export function createAlbumCounts(load: (signal: AbortSignal) => Promise<AlbumCounts>) {
  let counts = EMPTY_ALBUM_COUNTS;
  const versions = new Map<string, number>();
  const listeners = new Set<() => void>();
  let owners = 0;
  let request: AbortController | null = null;
  let stopWatching: (() => void) | null = null;
  const notify = () => listeners.forEach(listener => listener());
  const refresh = () => {
    if (request !== null) return;
    const controller = new AbortController();
    const started = new Map(versions);
    request = controller;
    void load(controller.signal).then(next => {
      if (controller.signal.aborted) return;
      const merged = { ...counts };
      for (const [slug, count] of Object.entries(next)) {
        if (started.get(slug) === versions.get(slug)) merged[slug] = count;
      }
      counts = merged;
      notify();
    }, () => {}).finally(() => { if (request === controller) request = null; });
  };
  const refetcher = createRefetcher({ now: () => performance.now(), run: refresh });
  return {
    snapshot: () => counts,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    publish: (slug: string, count: number) => {
      versions.set(slug, (versions.get(slug) ?? 0) + 1);
      if (counts[slug] === count) return;
      counts = { ...counts, [slug]: count };
      notify();
    },
    acquire: (initial: AlbumCounts = EMPTY_ALBUM_COUNTS) => {
      const missing = Object.entries(initial).filter(([slug]) => !Object.hasOwn(counts, slug));
      if (missing.length > 0) { counts = { ...Object.fromEntries(missing), ...counts }; notify(); }
      if (owners++ === 0) {
        stopWatching = watchForRefetch(window, { isVisible: () => document.visibilityState === "visible" }, refetcher);
        refetcher.request("mount");
      }
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        if (--owners !== 0) return;
        stopWatching?.(); stopWatching = null;
        request?.abort(); request = null;
      };
    },
  };
}

export const albumCounts = createAlbumCounts(async signal => {
  const response = await fetch("/api/v1/reactions/album", { signal, cache: "no-store" });
  if (!response.ok) throw new Error("Could not load album reactions.");
  return schema.parse(await response.json());
});
