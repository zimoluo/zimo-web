import { readReactions } from "./mutations";
import type { Slug } from "../../features/entries/model/ids";
import type { JsonStore } from "../storage/mutate";

export const albumReactionsTag = "album:reactions";

export async function readAlbumCounts(store: JsonStore, slugs: readonly Slug[]): Promise<Readonly<Record<string, number>>> {
  const counts: Record<string, number> = {};
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(8, slugs.length) }, async () => {
    while (index < slugs.length) {
      const slug = slugs[index++];
      if (slug === undefined) continue;
      try { counts[slug] = (await readReactions(store, "album", slug)).likedBy.length; }
      catch { continue; }
    }
  }));
  return counts;
}
