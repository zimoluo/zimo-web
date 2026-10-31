import { describe, expect, it } from "vitest";
import matter from "gray-matter";
import { requireSlug } from "./ids";
import { decodeStoredDocument, encodeStoredDocument } from "./document-source";
import { FakeObjectStore } from "../../../server/storage/fake-objects";
import { readEntry } from "../../../server/entries/read";
import { keys } from "../../../server/storage/keys";
import type { StoredEntry } from "./schema";

const entry: StoredEntry = { section: "blog", slug: requireSlug("article"), title: "Atomic metadata", publishedAt: "2026-10-31T00:00:00Z", unlisted: false, tags: [], authors: [], images: [], extras: { section: "blog" } };

describe("canonical document objects", () => {
  it("round trips Markdown and metadata together without a second copy of the body", () => {
    const text = encodeStoredDocument({ ...entry, markdown: "stale body" }, "# Actual article\n");
    expect(matter(text).data).toMatchObject({ formatVersion: 3, ...entry });
    expect(matter(text).data.markdown).toBeUndefined();
    expect(decodeStoredDocument(text)).toEqual({ entry, markdown: "# Actual article\n" });
  });
  it("reads canonical data in one request even when a stale sidecar exists", async () => {
    const store = new FakeObjectStore();
    store.seedText(keys.entry("blog", entry.slug), encodeStoredDocument(entry, "# Current"));
    store.seedJson(keys.entryMetadata("blog", entry.slug), { ...entry, title: "Stale sidecar" });
    expect((await readEntry(store, "blog", entry.slug))?.entry.title).toBe("Atomic metadata");
    expect(store.reads).toEqual([keys.entry("blog", entry.slug)]);
  });
  it("recognizes already migrated full version-two frontmatter and supports old split files", async () => {
    const store = new FakeObjectStore();
    store.seedText(keys.entry("blog", entry.slug), matter.stringify("# V2", { ...entry, formatVersion: 2 }));
    expect((await readEntry(store, "blog", entry.slug))?.entry).toEqual(entry);
    store.seedText(keys.entry("blog", entry.slug), "# Split source");
    store.seedJson(keys.entryMetadata("blog", entry.slug), entry);
    expect((await readEntry(store, "blog", entry.slug))?.markdown).toBe("# Split source");
  });
  it("refuses malformed canonical metadata instead of resurrecting stale content", async () => {
    const store = new FakeObjectStore();
    store.seedText(keys.entry("blog", entry.slug), matter.stringify("# Invalid", { formatVersion: 3, section: "blog" }));
    store.seedJson(keys.entryMetadata("blog", entry.slug), entry);
    await expect(readEntry(store, "blog", entry.slug)).rejects.toThrow();
    store.seedText(keys.entry("blog", entry.slug), encodeStoredDocument({ ...entry, slug: requireSlug("wrong") }, "# Wrong identity"));
    await expect(readEntry(store, "blog", entry.slug)).rejects.toThrow("storage key");
    expect(() => decodeStoredDocument("---\nformatVersion: 9\n---\nFuture")).toThrow("Unsupported");
  });
});
