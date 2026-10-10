import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  compareAsc,
  compareDesc,
  formatAbsolute,
  formatRelative,
  isIsoInstant,
  parseInstant,
  readingTime,
  toInstant,
} from "../../lib/datetime";
import { authorNames, resolveAuthor, resolveAuthors } from "./authors";
import {
  buildIndex,
  clean,
  describeDrift,
  diffIndex,
  sortSummaries,
  summarize,
} from "./index-build";
import {
  isSlug,
  parseAuthorId,
  parseCommentId,
  parseSlug,
  requireSlug,
  uuidVersion,
} from "./model/ids";
import type { Slug } from "./model/ids";
import {
  addComment,
  addReply,
  countReplies,
  editComment,
  likeCount,
  likedBy,
  removeComment,
  removeReply,
  sortComments,
  toggleCommentLike,
  toggleLike,
} from "./model/comment";
import type { Comment, CommentThread, Reply } from "./model/comment";
import {
  aspectRatio,
  isSection,
  listed,
  objectPosition,
  SECTIONS,
} from "./model/types";
import type { CommentId, ReplyId } from "./model/ids";
import type { EntrySummary, ImageAsset } from "./model/types";
import {
  commentThreadSchema,
  entrySummarySchema,
  parseEntrySummary,
  parseSectionIndex,
  parseStoredEntry,
  sectionIndexSchema,
  storedEntrySchema,
} from "./model/schema";
import type { StoredEntry } from "./model/schema";
import {
  apiCommentsPath,
  apiEntriesPath,
  apiEntryPath,
  apiReactionsPath,
  entryPath,
  FEED_PATH,
  sectionPath,
  tagPath,
} from "./paths";

const cover: ImageAsset = {
  src: "https://example.test/cover.jpg",
  width: 1600,
  height: 900,
  alt: "A wide photograph",
};

const summary = (overrides: Partial<EntrySummary> = {}): EntrySummary => ({
  section: "blog",
  slug: "on-gradients" as Slug,
  title: "On gradients",
  publishedAt: "2026-08-01T00:00:00Z",
  unlisted: false,
  tags: ["design"],
  authors: [resolveAuthor("zimo")],
  ...overrides,
});

const stored = (overrides: Partial<StoredEntry> = {}): StoredEntry => ({
  ...summary(),
  images: [],
  extras: { section: "blog" },
  ...overrides,
});

describe("D1 C5: slugs are validated at the boundary", () => {
  it("accepts lowercase hyphenated slugs", () => {
    for (const value of ["a", "on-gradients", "v11", "a-1-b-2"]) {
      expect(parseSlug(value)).toBe(value);
    }
  });

  it("rejects traversal, encoding, case, and emptiness", () => {
    for (const value of [
      "..",
      "../secret",
      "a/../b",
      "%2e%2e",
      "%2E%2E%2Fetc",
      "On-Gradients",
      "",
      " ",
      "trailing-",
      "-leading",
      "double--hyphen",
      "under_score",
      "dot.md",
      "a b",
      "café",
    ]) {
      expect(parseSlug(value)).toBeNull();
    }
  });

  it("rejects an absurdly long slug", () => {
    expect(parseSlug("a".repeat(121))).toBeNull();
    expect(parseSlug("a".repeat(120))).not.toBeNull();
  });

  it("never accepts a string containing a path separator or a percent", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 40 }), (input) => {
        if (/[/\\%.]/.test(input)) expect(isSlug(input)).toBe(false);
      }),
      { numRuns: 500 },
    );
  });

  it("round-trips anything it accepts", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 40 }), (input) => {
        const parsed = parseSlug(input);
        if (parsed !== null) expect(parsed as string).toBe(input);
      }),
      { numRuns: 500 },
    );
  });

  it("throws rather than returning a bad slug when a key needs one", () => {
    expect(() => requireSlug("../etc")).toThrow(/not a slug/);
  });
});

describe("ids", () => {
  it("reads the version nibble out of a UUID", () => {
    expect(uuidVersion("019218a0-7c3f-7000-8000-0123456789ab")).toBe(7);
    expect(uuidVersion("019218a0-7c3f-4000-8000-0123456789ab")).toBe(4);
    expect(uuidVersion("nope")).toBeNull();
  });

  it("D1 C3: only a v7 UUID is a comment id", () => {
    expect(parseCommentId("019218a0-7c3f-7000-8000-0123456789ab")).not.toBeNull();
    expect(parseCommentId("019218a0-7c3f-4000-8000-0123456789ab")).toBeNull();
  });

  it("validates author ids the same way", () => {
    expect(parseAuthorId("zimo")).toBe("zimo");
    expect(parseAuthorId("Zimo")).toBeNull();
    expect(parseAuthorId("../zimo")).toBeNull();
  });
});

describe("paths", () => {
  it("routes each section under its own name, the album included", () => {
    expect(SECTIONS.map(sectionPath)).toEqual([
      "/blog",
      "/album",
      "/projects",
      "/management",
    ]);
    expect(entryPath("album", "kyoto")).toBe("/album/kyoto");
  });

  it("cannot build a path from a traversal attempt", () => {
    expect(() => entryPath("blog", "../../secret")).toThrow();
    expect(() => apiEntryPath("blog", "..")).toThrow();
    expect(() => apiCommentsPath("blog", "a/b")).toThrow();
    expect(() => apiReactionsPath("blog", "")).toThrow();
  });

  it("versions the API and nests sub-resources under their parent", () => {
    expect(apiEntriesPath("blog")).toBe("/api/v1/entries/blog");
    expect(apiEntryPath("blog", "x")).toBe("/api/v1/entries/blog/x");
    expect(apiCommentsPath("blog", "x")).toBe("/api/v1/entries/blog/x/comments");
    expect(apiReactionsPath("blog", "x")).toBe("/api/v1/entries/blog/x/reactions");
  });

  it("escapes a tag rather than interpolating it into a URL", () => {
    expect(tagPath("blog", "Zimo Web")).toBe("/blog/tag/Zimo%20Web");
    expect(tagPath("blog", "a/b")).toBe("/blog/tag/a%2Fb");
  });

  it("leaves the feed where subscribers already point", () => {
    expect(FEED_PATH).toBe("/blog/feed.rss");
  });

  it("recognizes exactly the four sections", () => {
    expect(SECTIONS.every(isSection)).toBe(true);
    expect(isSection("photos")).toBe(false);
  });
});

describe("D1 C2: images are complete objects, not parallel arrays", () => {
  it("derives the aspect ratio from real dimensions", () => {
    expect(aspectRatio(cover)).toBeCloseTo(16 / 9, 10);
  });

  it("defaults the crop focus to the center", () => {
    expect(objectPosition(cover)).toBe("50% 50%");
  });

  it("turns a focus point into an object-position", () => {
    expect(objectPosition({ ...cover, focus: { x: 0, y: 1 } })).toBe("0% 100%");
    expect(objectPosition({ ...cover, focus: { x: 0.25, y: 0.625 } })).toBe(
      "25% 62.5%",
    );
  });

  it("accepts an empty alt as a deliberate decorative marker", () => {
    expect(() => parseStoredEntry(stored({ images: [{ ...cover, alt: "" }] }))).not.toThrow();
  });

  it("refuses an image without intrinsic dimensions", () => {
    const broken = { src: "a.jpg", alt: "a" };
    expect(() => parseStoredEntry(stored({ images: [broken as ImageAsset] }))).toThrow();
  });

  it("refuses a focus point outside the frame", () => {
    expect(() =>
      parseStoredEntry(stored({ images: [{ ...cover, focus: { x: 1.5, y: 0 } }] })),
    ).toThrow();
  });
});

describe("authors", () => {
  it("F-24: the hardcoded zimo branch is a registry row", () => {
    const zimo = resolveAuthor("zimo");
    expect(zimo.name).toBe("Zimo Luo");
    expect(zimo.avatar?.src).toBe("/util/zimo-default-profile.svg");
  });

  it("builds a bucket avatar for an author not in the registry", () => {
    const guest = resolveAuthor("guest", "A Guest");
    expect(guest.name).toBe("A Guest");
    expect(guest.avatar?.src).toContain("/blog/author/guest");
  });

  it("does not build a URL out of an id it cannot validate", () => {
    const hostile = resolveAuthor("../../etc/passwd");
    expect(hostile.avatar).toBeUndefined();
    expect(hostile.id).toBe("unknown");
  });

  it("resolves the projects authors array through the same shape", () => {
    const refs = resolveAuthors(["zimo", "guest"], [undefined as unknown as string, "A Guest"]);
    expect(authorNames(refs)).toBe("Zimo Luo, A Guest");
  });
});

describe("D1 §6: one date representation", () => {
  it("accepts an ISO instant and rejects the v10 forms", () => {
    expect(isIsoInstant("2026-08-20T14:32:00Z")).toBe(true);
    expect(isIsoInstant("2026-08-20T14:32Z")).toBe(true);
    expect(isIsoInstant("2026-08-20T14:32:00+02:00")).toBe(true);
    expect(isIsoInstant("2026-8-20")).toBe(false);
    expect(isIsoInstant("2026-08-20")).toBe(false);
    expect(isIsoInstant("Aug 20, 2026")).toBe(false);
    expect(isIsoInstant("2026-02-30T00:00:00Z")).toBe(false);
  });

  it("normalizes to UTC", () => {
    expect(toInstant("2026-08-20T14:32:00+02:00")).toBe("2026-08-20T12:32:00.000Z");
    expect(toInstant("not a date")).toBeNull();
    expect(parseInstant("nope")).toBeNull();
  });

  it("compares as strings, descending, because ISO UTC sorts chronologically", () => {
    const dates = [
      "2024-01-01T00:00:00Z",
      "2026-08-20T14:32:00Z",
      "2025-06-15T09:00:00Z",
    ];
    expect([...dates].sort(compareDesc)).toEqual([
      "2026-08-20T14:32:00Z",
      "2025-06-15T09:00:00Z",
      "2024-01-01T00:00:00Z",
    ]);
    expect([...dates].sort(compareAsc)[0]).toBe("2024-01-01T00:00:00Z");
    expect(compareDesc("a", "a")).toBe(0);
  });

  it("agrees with a Date comparison over arbitrary instants", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2_000_000_000_000 }),
        fc.integer({ min: 0, max: 2_000_000_000_000 }),
        (a, b) => {
          const left = new Date(a).toISOString();
          const right = new Date(b).toISOString();
          expect(Math.sign(compareDesc(left, right))).toBe(Math.sign(b - a));
        },
      ),
      { numRuns: 300 },
    );
  });

  it("formats an absolute date in UTC, so SSR and the client agree", () => {
    expect(formatAbsolute("2026-08-20T23:59:00Z", undefined, "en-US")).toBe(
      "Aug 20, 2026",
    );
    expect(formatAbsolute("garbage")).toBe("");
  });

  it("formats a relative date, falling back to absolute past 15 days", () => {
    const now = new Date("2026-08-20T12:00:00Z");
    expect(formatRelative("2026-08-20T12:00:00Z", now, "en-US")).toBe("now");
    expect(formatRelative("2026-08-20T11:30:00Z", now, "en-US")).toBe(
      "30 minutes ago",
    );
    expect(formatRelative("2026-08-20T09:00:00Z", now, "en-US")).toBe(
      "3 hours ago",
    );
    expect(formatRelative("2026-08-18T12:00:00Z", now, "en-US")).toBe(
      "2 days ago",
    );
    expect(formatRelative("2026-07-01T12:00:00Z", now, "en-US")).toBe(
      "Jul 1, 2026",
    );
    expect(formatRelative("2026-08-21T12:00:00Z", now, "en-US")).toBe(
      "tomorrow",
    );
    expect(formatRelative("nope", now)).toBe("");
  });

  it("keeps v10's reading-time wording, including its joke", () => {
    expect(readingTime(0)).toBe("1 min read");
    expect(readingTime(1)).toBe("1 min read");
    expect(readingTime(12.2)).toBe("13 min read");
    expect(readingTime(60)).toBe("1 hr read");
    expect(readingTime(90)).toBe("1 hr 30 min read");
    expect(readingTime(125)).toBe("2 hrs 5 min read");
    expect(readingTime(1440)).toBe("You don't wanna read this");
  });
});

const commentId = (n: number): CommentId =>
  `019218a0-7c3f-7000-8000-00000000000${n}` as CommentId;
const replyId = (n: number): ReplyId =>
  `019218a0-7c3f-7000-8000-10000000000${n}` as ReplyId;

const comment = (n: number, overrides: Partial<Comment> = {}): Comment => ({
  id: commentId(n),
  authorSub: "sub-a",
  body: "A remark",
  createdAt: "2026-08-01T00:00:00Z",
  likedBy: [],
  replies: [],
  ...overrides,
});

const reply = (n: number, overrides: Partial<Reply> = {}): Reply => ({
  id: replyId(n),
  authorSub: "sub-b",
  body: "A response",
  createdAt: "2026-08-02T00:00:00Z",
  ...overrides,
});

describe("D1 C3 / F-27: comments have identity", () => {
  const thread: CommentThread = { comments: [comment(1), comment(2)] };

  it("deletes by id, not by matching author and body and date", () => {
    const after = removeComment(thread, commentId(1));
    expect(after.comments.map((c) => c.id)).toEqual([commentId(2)]);
  });

  it("leaves the thread alone when the id is not there", () => {
    expect(removeComment(thread, commentId(9)).comments).toHaveLength(2);
  });

  it("deletes the right one even when two comments are identical apart from id", () => {
    const twins: CommentThread = {
      comments: [comment(1), comment(2, { id: commentId(2) })],
    };
    expect(removeComment(twins, commentId(2)).comments[0]?.id).toBe(commentId(1));
  });

  it("sorts by id, which orders by time because v7 is time-ordered", () => {
    const shuffled = [comment(3), comment(1), comment(2)];
    expect(sortComments(shuffled).map((c) => c.id)).toEqual([
      commentId(1),
      commentId(2),
      commentId(3),
    ]);
  });

  it("appends a new comment in order", () => {
    const after = addComment(thread, comment(3));
    expect(after.comments[2]?.id).toBe(commentId(3));
  });

  it("edits by id and records editedAt", () => {
    const after = editComment(thread, commentId(2), "Revised", "2026-08-03T00:00:00Z");
    expect(after.comments[1]?.body).toBe("Revised");
    expect(after.comments[1]?.editedAt).toBe("2026-08-03T00:00:00Z");
    expect(after.comments[0]?.editedAt).toBeUndefined();
  });

  it("mutates nothing in place", () => {
    const before = JSON.stringify(thread);
    removeComment(thread, commentId(1));
    addComment(thread, comment(4));
    editComment(thread, commentId(1), "x", "2026-08-03T00:00:00Z");
    expect(JSON.stringify(thread)).toBe(before);
  });
});

describe("replies", () => {
  const withReplies: CommentThread = {
    comments: [comment(1, { replies: [reply(1), reply(2, { toId: replyId(1) })] })],
  };

  it("always has a replies array, so no call site needs `?? []`", () => {
    expect(comment(1).replies).toEqual([]);
  });

  it("F-27: toId points at an id, not at a display name", () => {
    expect(withReplies.comments[0]?.replies[1]?.toId).toBe(replyId(1));
  });

  it("drops a dangling toId when its target is deleted", () => {
    const after = removeReply(withReplies, commentId(1), replyId(1));
    expect(after.comments[0]?.replies).toHaveLength(1);
    expect(after.comments[0]?.replies[0]?.toId).toBeUndefined();
  });

  it("adds a reply to the addressed comment only", () => {
    const two: CommentThread = { comments: [comment(1), comment(2)] };
    const after = addReply(two, commentId(2), reply(1));
    expect(after.comments[0]?.replies).toHaveLength(0);
    expect(after.comments[1]?.replies).toHaveLength(1);
  });

  it("counts a thread as comments plus replies", () => {
    expect(countReplies(withReplies)).toBe(3);
  });
});

describe("reactions", () => {
  it("toggles a like on and off", () => {
    const once = toggleLike({ likedBy: [] }, "sub-a");
    expect(likeCount(once)).toBe(1);
    expect(likedBy(once, "sub-a")).toBe(true);
    expect(likeCount(toggleLike(once, "sub-a"))).toBe(0);
  });

  it("treats a signed-out visitor as never having liked anything", () => {
    expect(likedBy({ likedBy: ["sub-a"] }, null)).toBe(false);
  });

  it("toggles a like on one comment in a thread", () => {
    const thread: CommentThread = { comments: [comment(1), comment(2)] };
    const after = toggleCommentLike(thread, commentId(2), "sub-c");
    expect(after.comments[0]?.likedBy).toEqual([]);
    expect(after.comments[1]?.likedBy).toEqual(["sub-c"]);
  });
});

describe("D1 §8: the section index", () => {
  const entries = [
    stored({ slug: "old" as Slug, publishedAt: "2024-01-01T00:00:00Z" }),
    stored({ slug: "new" as Slug, publishedAt: "2026-01-01T00:00:00Z" }),
    stored({ slug: "middle" as Slug, publishedAt: "2025-01-01T00:00:00Z" }),
  ];

  it("F-26: a summary carries no body", () => {
    const summarized = summarize(stored());
    expect(Object.keys(summarized)).not.toContain("images");
    expect(Object.keys(summarized)).not.toContain("extras");
    expect(Object.keys(summarized)).not.toContain("body");
  });

  it("omits absent optional fields rather than writing undefined", () => {
    expect(Object.keys(summarize(stored())).sort()).toEqual([
      "authors",
      "publishedAt",
      "section",
      "slug",
      "tags",
      "title",
      "unlisted",
    ]);
  });

  it("carries the optional fields when they are there", () => {
    const full = summarize(
      stored({ description: "d", updatedAt: "2026-02-01T00:00:00Z", cover }),
    );
    expect(full.description).toBe("d");
    expect(full.cover).toEqual(cover);
  });

  it("preserves an authored hidden opening cover independently of its listing image", () => {
    const entry=stored({cover,displayCover:false});
    const parsed=parseStoredEntry(entry);
    const summary=summarize(parsed);
    expect(summary.cover).toEqual(cover);
    expect(summary.displayCover).toBe(false);
    expect(entrySummarySchema.parse(summary).displayCover).toBe(false);
    const index=buildIndex("blog",[entry],"2026-01-01T00:00:00Z");
    expect(diffIndex(index,[{...entry,displayCover:true}]).changed).toEqual([entry.slug]);
  });

  it("carries measured project marks and album photographs without a body", () => {
    const project = summarize(stored({section:"projects",extras:{section:"projects",icon:cover,links:[]},display:{readingMinutes:4}}));
    expect(project.display).toEqual({icon:cover,readingMinutes:4});
    const album = summarize(stored({section:"album",extras:{section:"album"},images:[cover]}));
    expect(album.display).toEqual({images:[cover]});
    expect(entrySummarySchema.safeParse(project).success).toBe(true);
    expect(entrySummarySchema.safeParse(album).success).toBe(true);
  });

  it("detects changed nested display metadata when rebuilding an index", () => {
    const previous = stored({section:"projects",extras:{section:"projects",icon:cover,links:[]}});
    const index = buildIndex("projects",[previous],"2026-01-01T00:00:00Z");
    const changed = {...previous,extras:{section:"projects" as const,icon:{...cover,src:"https://example.test/new-mark.svg"},links:[]}};
    expect(diffIndex(index,[changed]).changed).toEqual([previous.slug]);
    const reordered = {...previous,extras:{...previous.extras,icon:{alt:cover.alt,height:cover.height,width:cover.width,src:cover.src}}};
    expect(diffIndex(index,[reordered]).changed).toEqual([]);
  });

  it("sorts newest first, at write time", () => {
    const index = buildIndex("blog", entries, "2026-08-20T00:00:00Z");
    expect(index.entries.map((entry) => entry.slug)).toEqual([
      "new",
      "middle",
      "old",
    ]);
  });

  it("breaks a date tie by slug, so the order is total", () => {
    const same = ["b", "a", "c"].map((slug) =>
      summarize(stored({ slug: slug as Slug })),
    );
    expect(sortSummaries(same).map((entry) => entry.slug)).toEqual(["a", "b", "c"]);
  });

  it("filters unlisted entries without an `as any` cast", () => {
    const mixed = [summary(), summary({ slug: "hidden" as Slug, unlisted: true })];
    expect(listed(mixed).map((entry) => entry.slug)).toEqual(["on-gradients"]);
  });
});

describe("D1 C7: reindex --check detects drift", () => {
  const entries = [
    stored({ slug: "one" as Slug, publishedAt: "2026-01-01T00:00:00Z" }),
    stored({ slug: "two" as Slug, publishedAt: "2025-01-01T00:00:00Z" }),
  ];
  const index = buildIndex("blog", entries, "2026-08-20T00:00:00Z");

  it("passes on a freshly built index", () => {
    const drift = diffIndex(index, entries);
    expect(clean(drift)).toBe(true);
    expect(describeDrift("blog", drift)).toContain("matches");
  });

  it("reports an entry the index has not caught up with", () => {
    const drift = diffIndex(index, [
      ...entries,
      stored({ slug: "three" as Slug }),
    ]);
    expect(drift.missing).toEqual(["three"]);
    expect(clean(drift)).toBe(false);
    expect(describeDrift("blog", drift)).toContain("1 missing (three)");
  });

  it("reports an entry the index still lists after deletion", () => {
    const drift = diffIndex(index, [entries[0] as StoredEntry]);
    expect(drift.extra).toEqual(["two"]);
  });

  it("reports a retitled entry", () => {
    const drift = diffIndex(index, [
      { ...(entries[0] as StoredEntry), title: "Renamed" },
      entries[1] as StoredEntry,
    ]);
    expect(drift.changed).toEqual(["one"]);
    expect(describeDrift("blog", drift)).toContain("out of date");
  });

  it("reports an index whose order has gone stale", () => {
    const scrambled = { ...index, entries: [...index.entries].reverse() };
    expect(diffIndex(scrambled, entries).misordered).toBe(true);
    expect(describeDrift("blog", diffIndex(scrambled, entries))).toContain(
      "out of order",
    );
  });

  it("does not care about key order inside a summary", () => {
    const reordered = {
      ...index,
      entries: index.entries.map(
        (entry) =>
          Object.fromEntries(
            Object.entries(entry).reverse(),
          ) as unknown as EntrySummary,
      ),
    };
    expect(clean(diffIndex(reordered, entries))).toBe(true);
  });
});

describe("schemas", () => {
  it("accepts a well-formed summary and index", () => {
    expect(parseEntrySummary(summary()).slug).toBe("on-gradients");
    const index = buildIndex("blog", [stored()], "2026-08-20T00:00:00Z");
    expect(parseSectionIndex(JSON.parse(JSON.stringify(index))).entries).toHaveLength(1);
  });

  it("insists on UTC instants, so the string sort stays chronological", () => {
    expect(
      entrySummarySchema.safeParse(summary({ publishedAt: "2026-08-20T14:32:00+02:00" }))
        .success,
    ).toBe(false);
    expect(sectionIndexSchema.safeParse({ section: "blog", builtAt: "2026", entries: [] }).success).toBe(
      false,
    );
  });

  it("insists tags and authors are present, not optional", () => {
    const { tags: _tags, ...withoutTags } = summary();
    expect(entrySummarySchema.safeParse(withoutTags).success).toBe(false);
  });

  it("insists unlisted is a real boolean field", () => {
    const { unlisted: _unlisted, ...withoutUnlisted } = summary();
    expect(entrySummarySchema.safeParse(withoutUnlisted).success).toBe(false);
  });

  it("D1 C8: extras are discriminated on section", () => {
    expect(
      storedEntrySchema.safeParse({
        ...stored(),
        extras: { section: "projects", links: [], icon: cover },
      }).success,
    ).toBe(true);
    expect(
      storedEntrySchema.safeParse({
        ...stored(),
        extras: { section: "projects", links: [] },
      }).success,
    ).toBe(false);
    expect(
      storedEntrySchema.safeParse({
        ...stored(),
        extras: { section: "album", place: { latitude: 200, longitude: 0 } },
      }).success,
    ).toBe(false);
  });

  it("types a project link's kind instead of an untyped string map", () => {
    expect(
      storedEntrySchema.safeParse({
        ...stored(),
        extras: {
          section: "projects",
          links: [{ label: "Source", url: "https://example.test", kind: "invented" }],
          icon: cover,
        },
      }).success,
    ).toBe(false);
  });

  it("rejects a comment id that is not a v7 UUID", () => {
    expect(
      commentThreadSchema.safeParse({
        comments: [{ ...comment(1), id: "1" }],
      }).success,
    ).toBe(false);
  });

  it("accepts a comment thread with replies", () => {
    expect(
      commentThreadSchema.safeParse(
        JSON.parse(
          JSON.stringify({
            comments: [comment(1, { replies: [reply(1, { toId: replyId(2) })] })],
          }),
        ),
      ).success,
    ).toBe(true);
  });
});
