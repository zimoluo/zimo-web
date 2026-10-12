"use client";
import { useEffect, useSyncExternalStore } from "react";
import { albumCounts, EMPTY_ALBUM_COUNTS } from "./album-counts";
import type { AlbumCounts } from "./album-counts";

const idleSubscribe = () => () => {};

export function useAlbumCounts(enabled: boolean, initial: AlbumCounts = EMPTY_ALBUM_COUNTS): AlbumCounts {
  const counts = useSyncExternalStore(enabled ? albumCounts.subscribe : idleSubscribe, enabled ? albumCounts.snapshot : () => EMPTY_ALBUM_COUNTS, () => initial);
  useEffect(() => enabled ? albumCounts.acquire(initial) : undefined, [enabled, initial]);
  return enabled ? { ...initial, ...counts } : EMPTY_ALBUM_COUNTS;
}
