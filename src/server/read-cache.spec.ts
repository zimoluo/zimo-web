import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cached = vi.hoisted(() => {
  const values = new Map<string, { value: Promise<unknown>; tags: readonly string[] }>();
  const calls: { keys: readonly string[]; revalidate: number; tags: readonly string[] }[] = [];
  return { values, calls };
});

vi.mock("next/cache", () => ({
  unstable_cache: (read: () => Promise<unknown>, keys: readonly string[], options: { revalidate: number; tags: readonly string[] }) => {
    cached.calls.push({ keys, ...options });
    return () => {
      const key = JSON.stringify(keys);
      const existing = cached.values.get(key);
      if (existing !== undefined) return existing.value;
      const value = read().catch((error: unknown) => { cached.values.delete(key); throw error; });
      cached.values.set(key, { value, tags: options.tags });
      return value;
    };
  },
  updateTag: (tag: string) => {
    for (const [key, entry] of cached.values) if (entry.tags.includes(tag)) cached.values.delete(key);
  },
}));

import { updateTag } from "next/cache";
import { FakeObjectStore } from "./storage/fake-objects";
import { setObjectStore } from "./storage/object";
import { keys } from "./storage/keys";
import { loadPublicProfile } from "./account/public-profile";
import { newUser } from "./account/user";
import { loadBlogFeed } from "./feed/load";
import { authorTag, entriesTag } from "./entries/read";
import { requireSlug } from "../features/entries/model/ids";
import type { EntrySummary } from "../features/entries/model/types";
import { defaultSettings } from "../features/settings/defaults";

const summary = (slug: string, unlisted = false): EntrySummary => ({
  section: "blog", slug: requireSlug(slug), title: slug, description: "**Bold** & *emphasis*",
  publishedAt: "2024-01-01T00:00:00Z", unlisted, tags: [], authors: [],
});
const store = new FakeObjectStore();

beforeEach(() => { cached.values.clear(); cached.calls.length = 0; setObjectStore(store); store.reads.length = 0; });
afterEach(() => { setObjectStore(null); vi.restoreAllMocks(); });

describe("public tagged read caches", () => {
  it("caches only public author fields and partitions identity without session state", async () => {
    store.seedJson(keys.user("one"), newUser("One", null, defaultSettings, "2024-01-01T00:00:00Z"));
    store.seedJson(keys.user("two"), newUser("Two", "https://example.test/avatar.png", null, "2024-01-01T00:00:00Z"));
    const [one, again, two] = await Promise.all([loadPublicProfile("one"), loadPublicProfile("one"), loadPublicProfile("two")]);
    expect(one).toEqual({ sub: "one", name: "One", profilePic: null, state: "normal" });
    expect(again).toEqual(one); expect(two.name).toBe("Two");
    expect(Object.keys(one).sort()).toEqual(["name", "profilePic", "state", "sub"]);
    expect(store.reads).toEqual([keys.user("one"), keys.user("two")]);
    expect(cached.calls[0]).toEqual({ keys: ["public-author", "one"], revalidate: 86400, tags: ["author:one"] });
  });

  it("refreshes changed and deleted profiles only when their author tag expires", async () => {
    store.seedJson(keys.user("mutable"), newUser("Before", null, null, "2024-01-01T00:00:00Z"));
    expect((await loadPublicProfile("mutable")).name).toBe("Before");
    store.seedJson(keys.user("mutable"), { ...newUser("After", null, null, "2024-01-01T00:00:00Z"), state: "banned" });
    expect((await loadPublicProfile("mutable")).name).toBe("Before");
    updateTag(authorTag("mutable"));
    expect(await loadPublicProfile("mutable")).toMatchObject({ name: "After", state: "banned" });
    await store.remove(keys.user("mutable")); updateTag(authorTag("mutable"));
    expect(await loadPublicProfile("mutable")).toEqual({ sub: "mutable", name: "Deleted account", profilePic: null, state: "normal" });
  });

  it("does not turn corrupt stored user data into a durable cached success", async () => {
    store.seedText(keys.user("broken"), "{bad");
    await expect(loadPublicProfile("broken")).rejects.toThrow("validation");
    store.seedJson(keys.user("broken"), newUser("Recovered", null, null, "2024-01-01T00:00:00Z"));
    expect((await loadPublicProfile("broken")).name).toBe("Recovered");
  });

  it("shares the public RSS result, strips marks and excludes unlisted entries until its index tag expires", async () => {
    store.seedJson(keys.sectionIndex("blog"), { section: "blog", builtAt: "2024-01-01T00:00:00Z", entries: [summary("visible"), summary("hidden", true)] });
    const first = await loadBlogFeed();
    expect(first).toContain("<title>visible</title>"); expect(first).not.toContain("<title>hidden</title>");
    expect(first).toContain("Bold &amp; emphasis"); expect(first).not.toContain("**Bold**");
    store.seedJson(keys.sectionIndex("blog"), { section: "blog", builtAt: "2024-01-02T00:00:00Z", entries: [summary("changed")] });
    expect(await loadBlogFeed()).toBe(first); expect(store.reads).toEqual([keys.sectionIndex("blog")]);
    expect(cached.calls[0]).toEqual({ keys: ["blog-rss"], revalidate: 3600, tags: ["entries:blog"] });
    updateTag(entriesTag("blog"));
    expect(await loadBlogFeed()).toContain("<title>changed</title>");
  });
});
