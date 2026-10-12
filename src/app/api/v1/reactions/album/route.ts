import { handler, json } from "@/src/server/http/problem";
import { CACHE_NONE, requestContext } from "@/src/server/http/context";
import { isAdmin } from "@/src/server/session/authorize";
import { readSummaries } from "@/src/server/entries/read";
import { readAlbumCounts } from "@/src/server/comments/album-counts";

export const GET = handler(async () => {
  const { store, viewer } = await requestContext();
  const entries = await readSummaries(store, "album", { includeUnlisted: isAdmin(viewer) });
  return json(await readAlbumCounts(store.asJsonStore(), entries.map(entry => entry.slug)), { headers: { "cache-control": CACHE_NONE, vary: "Cookie" } });
});
