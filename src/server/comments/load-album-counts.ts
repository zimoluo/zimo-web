import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { objects, storageCacheKey } from "../storage/object";
import { loadSummaries } from "../entries/load";
import { albumReactionsTag, readAlbumCounts } from "./album-counts";

export const loadAlbumCounts = cache(async () => unstable_cache(async () => {
  const entries = await loadSummaries("album");
  return readAlbumCounts(objects().asJsonStore(), entries.map(entry => entry.slug));
}, ["album-reactions", storageCacheKey()], { revalidate: 60, tags: [albumReactionsTag] })());
