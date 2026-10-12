import { describe, expect, it } from "vitest";
import { FakeJsonStore } from "../storage/fake-store";
import { keys } from "../storage/keys";
import { requireSlug } from "../../features/entries/model/ids";
import { readAlbumCounts } from "./album-counts";

describe("public album reaction counts", () => {
  it("returns only totals, distinguishes absent reactions from damaged data, and never writes", async () => {
    const store = new FakeJsonStore();
    store.seed(keys.reactions("album", "liked"), { likedBy: ["private-one", "private-two"] });
    store.seed(keys.reactions("album", "damaged"), { likes: 99 });
    const counts = await readAlbumCounts(store, ["liked", "empty", "damaged", "constructor"].map(requireSlug));
    expect(counts).toEqual({ liked: 2, empty: 0, constructor: 0 });
    expect(JSON.stringify(counts)).not.toContain("private");
    expect(store.writes).toEqual([]);
  });
  it("bounds storage fan-out while completing every requested album", async () => {
    let active = 0, peak = 0;
    const store = new FakeJsonStore();
    const read = store.readRaw;
    store.readRaw = async key => {
      peak = Math.max(peak, ++active);
      await new Promise(resolve => setTimeout(resolve, 1));
      const value = await read(key);
      active--;
      return value;
    };
    const counts = await readAlbumCounts(store, Array.from({ length: 21 }, (_, index) => requireSlug(`album-${index}`)));
    expect(Object.keys(counts)).toHaveLength(21);
    expect(peak).toBe(8);
    expect(await readAlbumCounts(store, [])).toEqual({});
  });
});
