import { describe, expect, it } from "vitest";
import { resolveAuthor } from "../../features/entries/authors";
import { buildIndex } from "../../features/entries/index-build";
import type { Slug } from "../../features/entries/model/ids";
import type { StoredEntry } from "../../features/entries/model/schema";
import type { EntrySummary } from "../../features/entries/model/types";
import { FakeObjectStore } from "../storage/fake-objects";
import { keys } from "../storage/keys";
import {
  authorTag,
  EMPTY_INDEX,
  entriesTag,
  entryTag,
  listSlugs,
  readAllEntries,
  readEntry,
  readSectionIndex,
  readSummaries,
  tagsIn,
  withTag,
} from "./read";

const summary = (
  slug: string,
  overrides: Partial<EntrySummary> = {},
): EntrySummary => ({
  section: "blog",
  slug: slug as Slug,
  title: slug,
  publishedAt: "2026-01-01T00:00:00Z",
  unlisted: false,
  tags: [],
  authors: [resolveAuthor("zimo")],
  ...overrides,
});

const stored = (slug: string, overrides: Partial<StoredEntry> = {}): StoredEntry => ({
  ...summary(slug),
  images: [],
  extras: { section: "blog" },
  ...overrides,
});

const seededBlog = (entries: readonly StoredEntry[]): FakeObjectStore => {
  const store = new FakeObjectStore();
  store.seedJson(
    keys.sectionIndex("blog"),
    JSON.parse(JSON.stringify(buildIndex("blog", entries, "2026-08-21T00:00:00Z"))),
  );
  for (const entry of entries) {
    store.seedText(keys.entry("blog", entry.slug), `# ${entry.title}`);
    store.seedJson(`blog/documents/${entry.slug}.meta.json`, JSON.parse(JSON.stringify(entry)));
  }
  return store;
};

describe("D3 §6: cache tags name exactly what a write invalidates", () => {
  it("scopes an index to its section and an entry to its slug", () => {
    expect(entriesTag("blog")).toBe("entries:blog");
    expect(entryTag("blog", "on-gradients")).toBe("entry:blog:on-gradients");
    expect(authorTag("zimo")).toBe("author:zimo");
  });

  it("gives every section a distinct index tag, so one write does not clear another", () => {
    const tags = new Set(
      (["blog", "album", "projects", "management"] as const).map(entriesTag),
    );
    expect(tags.size).toBe(4);
  });
});

describe("D4 C11: listing a section is one request", () => {
  it("reads the index and nothing else", async () => {
    const store = seededBlog([stored("one"), stored("two")]);
    store.reads.length = 0;

    const summaries = await readSummaries(store, "blog");

    expect(summaries).toHaveLength(2);
    expect(store.reads).toEqual([keys.sectionIndex("blog")]);
  });

  it("hides unlisted entries by default and reveals them on request", async () => {
    const store = seededBlog([
      stored("public"),
      stored("hidden", { unlisted: true }),
    ]);

    expect((await readSummaries(store, "blog")).map((entry) => entry.slug)).toEqual([
      "public",
    ]);
    expect(
      (await readSummaries(store, "blog", { includeUnlisted: true })).map(
        (entry) => entry.slug,
      ),
    ).toHaveLength(2);
  });

  it("reads an empty index for a section that has never been built", async () => {
    const store = new FakeObjectStore();
    expect(await readSectionIndex(store, "album")).toEqual(EMPTY_INDEX("album"));
    expect(await readSummaries(store, "album")).toEqual([]);
  });

  it("reports a corrupt index as upstream-failure rather than rendering nothing", async () => {
    const store = new FakeObjectStore();
    store.seedJson(keys.sectionIndex("blog"), { section: "blog" });
    await expect(readSectionIndex(store, "blog")).rejects.toMatchObject({
      code: "upstream-failure",
    });
  });
});

describe("reading one entry", () => {
  it("pairs a markdown document with complete metadata without reading its index", async () => {
    const store = seededBlog([stored("on-gradients", { title: "On gradients" })]);

    const source = await readEntry(store, "blog", "on-gradients" as Slug);

    expect(source?.markdown).toBe("# On gradients");
    expect(source?.entry.title).toBe("On gradients");
  });

  it("returns null when the document is absent", async () => {
    const store = seededBlog([stored("one")]);
    expect(await readEntry(store, "blog", "missing" as Slug)).toBeNull();
  });

  it("returns null when the document exists but its metadata is absent", async () => {
    const store = new FakeObjectStore();
    store.seedText(keys.entry("blog", "orphan"), "# Orphan");
    expect(await readEntry(store, "blog", "orphan" as Slug)).toBeNull();
  });

  it("reads a data section straight out of its json, with no index lookup", async () => {
    const store = new FakeObjectStore();
    const entry = {
      ...stored("kyoto"),
      section: "album" as const,
      extras: { section: "album" as const, instagramUrl: "https://example.test" },
    };
    store.seedJson(keys.entry("album", "kyoto"), JSON.parse(JSON.stringify(entry)));
    store.reads.length = 0;

    const source = await readEntry(store, "album", "kyoto" as Slug);

    expect(source?.markdown).toBeUndefined();
    expect(source?.entry.extras).toEqual({
      section: "album",
      instagramUrl: "https://example.test",
    });
    expect(store.reads).toEqual([keys.entry("album", "kyoto")]);
  });
});

describe("enumerating a section from storage", () => {
  it("recovers slugs from keys and ignores anything else under the prefix", async () => {
    const store = seededBlog([stored("one"), stored("two")]);
    store.seedText("blog/documents/Not-A-Slug.md", "x");
    store.seedText("blog/documents/notes/scratch.md", "x");

    expect([...(await listSlugs(store, "blog"))].sort()).toEqual(["one", "two"]);
  });

  it("reads every entry, which is what reindex needs and a page never does", async () => {
    const store = seededBlog([stored("one"), stored("two")]);
    expect(await readAllEntries(store, "blog")).toHaveLength(2);
  });

  it("drops an entry without metadata instead of failing the whole rebuild", async () => {
    const store = seededBlog([stored("one")]);
    store.seedText(keys.entry("blog", "orphan"), "# Orphan");
    expect(await readAllEntries(store, "blog")).toHaveLength(1);
  });
});

describe("tags", () => {
  const entries = [
    summary("a", { tags: ["Design", "Color"] }),
    summary("b", { tags: ["design"] }),
    summary("c", { tags: ["Engineering"] }),
  ];

  it("counts tags, most used first and alphabetical within a count", () => {
    expect(tagsIn(entries)).toEqual([
      { tag: "Color", count: 1 },
      { tag: "Design", count: 1 },
      { tag: "Engineering", count: 1 },
      { tag: "design", count: 1 },
    ]);
  });

  it("filters case-insensitively, so a tag page is not case-sensitive in a URL", () => {
    expect(withTag(entries, "design").map((entry) => entry.slug)).toEqual(["a", "b"]);
    expect(withTag(entries, "DESIGN").map((entry) => entry.slug)).toEqual(["a", "b"]);
    expect(withTag(entries, "nothing")).toEqual([]);
  });

  it("reads tags off the index, not off every article", () => {
    expect(tagsIn([])).toEqual([]);
  });
});
