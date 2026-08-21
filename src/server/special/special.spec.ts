import { describe, expect, it } from "vitest";
import { AppError } from "../../lib/errors";
import { resolveAuthor } from "../../features/entries/authors";
import type { Slug } from "../../features/entries/model/ids";
import type { EntrySummary } from "../../features/entries/model/types";
import { buildFeed, mimeFor, rfc2822, xml } from "../feed/rss";
import {
  crowds,
  EMPTY_BOARD,
  hangMessage,
  insideTree,
  MAX_FROM_LENGTH,
  MAX_MESSAGE_LENGTH,
  parseTreeBoard,
  publicMessages,
  requireFreePosition,
  requireTreeText,
  treeBoardSchema,
} from "./tree";
import type { TreeBoard, TreeMessage } from "./tree";

const message = (overrides: Partial<TreeMessage> = {}): TreeMessage => ({
  id: "019218a0-7c3f-7000-8000-000000000001",
  from: "A visitor",
  message: "Happy holidays",
  position: [500, 500],
  sprite: "bauble",
  createdAt: "2026-12-24T00:00:00Z",
  ...overrides,
});

const board = (messages: readonly TreeMessage[]): TreeBoard => ({ messages });

describe("the christmas tree board", () => {
  it("accepts a position inside the tree silhouette", () => {
    expect(insideTree([500, 500])).toBe(true);
    expect(insideTree([500, 140])).toBe(true);
  });

  it("rejects a position outside the box", () => {
    expect(insideTree([-1, 500])).toBe(false);
    expect(insideTree([1001, 500])).toBe(false);
    expect(insideTree([500, 129])).toBe(false);
    expect(insideTree([500, 851])).toBe(false);
  });

  it("rejects a position off the left and right slopes", () => {
    expect(insideTree([100, 200])).toBe(false);
    expect(insideTree([900, 200])).toBe(false);
  });

  it("rejects a spot too close to something already hanging", () => {
    const occupied = board([message({ position: [500, 500] })]);
    expect(crowds([520, 510], occupied)).toBe(true);
    expect(crowds([560, 500], occupied)).toBe(false);
    expect(crowds([500, 540], occupied)).toBe(false);
  });

  it("D3 §5: a bad position is unprocessable, not an internal error", () => {
    try {
      requireFreePosition([0, 0], EMPTY_BOARD);
      expect.unreachable();
    } catch (error) {
      expect((error as AppError).code).toBe("unprocessable");
      expect((error as AppError).message).toBe("That spot is not on the tree.");
    }
  });

  it("distinguishes off-tree from already-taken", () => {
    const occupied = board([message()]);
    expect(() => requireFreePosition([500, 500], occupied)).toThrow(
      /already hanging/,
    );
    expect(() => requireFreePosition([560, 560], occupied)).not.toThrow();
  });

  it("validates the text with the limits v10 used", () => {
    expect(requireTreeText("  Zimo  ", "  Hello  ")).toEqual({
      from: "Zimo",
      message: "Hello",
    });
    expect(() => requireTreeText("", "Hello")).toThrow(AppError);
    expect(() => requireTreeText("Zimo", "   ")).toThrow(AppError);
    expect(() => requireTreeText("a".repeat(MAX_FROM_LENGTH + 1), "Hi")).toThrow(
      /name is limited/,
    );
    expect(() => requireTreeText("Zimo", "a".repeat(MAX_MESSAGE_LENGTH + 1))).toThrow(
      /message is limited/,
    );
  });

  it("counts a trimmed name against the limit, so padding cannot slip past it", () => {
    expect(() =>
      requireTreeText(`  ${"a".repeat(MAX_FROM_LENGTH)}  `, "Hi"),
    ).not.toThrow();
  });

  it("hangs a message without mutating the board", () => {
    const before = EMPTY_BOARD;
    const after = hangMessage(before, message());
    expect(before.messages).toHaveLength(0);
    expect(after.messages).toHaveLength(1);
  });

  it("validates a stored board and rejects a corrupt one", () => {
    expect(() => parseTreeBoard({ messages: [message()] })).not.toThrow();
    expect(treeBoardSchema.safeParse({ messages: [{ from: "a" }] }).success).toBe(
      false,
    );
    expect(
      treeBoardSchema.safeParse({
        messages: [{ ...message(), createdAt: "2026-12-24" }],
      }).success,
    ).toBe(false);
  });

  it("separates the messages marked public from the rest", () => {
    const mixed = board([
      message({ id: "a", isPublic: true }),
      message({ id: "b" }),
    ]);
    expect(publicMessages(mixed).map((entry) => entry.id)).toEqual(["a"]);
  });
});

const summary = (
  slug: string,
  overrides: Partial<EntrySummary> = {},
): EntrySummary => ({
  section: "blog",
  slug: slug as Slug,
  title: slug,
  publishedAt: "2026-01-04T00:00:00Z",
  unlisted: false,
  tags: [],
  authors: [resolveAuthor("zimo")],
  ...overrides,
});

const options = {
  baseUrl: "https://www.zimoluo.me/",
  builtAt: new Date("2026-08-21T12:00:00Z"),
};

describe("the RSS feed", () => {
  it("stays at its published location with a well-formed channel", () => {
    const feed = buildFeed([summary("one")], options);
    expect(feed).toContain('<?xml version="1.0" encoding="UTF-8" ?>');
    expect(feed).toContain("<title>Blog | Zimo Web</title>");
    expect(feed).toContain("<link>https://www.zimoluo.me/blog</link>");
    expect(feed).toContain("<lastBuildDate>Fri, 21 Aug 2026 12:00:00 GMT</lastBuildDate>");
  });

  it("omits unlisted entries without an as-any cast", () => {
    const feed = buildFeed(
      [summary("public"), summary("hidden", { unlisted: true })],
      options,
    );
    expect(feed).toContain("<title>public</title>");
    expect(feed).not.toContain("hidden");
  });

  it("escapes markup in a title so the feed cannot be broken by content", () => {
    const feed = buildFeed(
      [summary("x", { title: 'Ampersands & <b>tags</b> & "quotes"' })],
      options,
    );
    expect(feed).toContain(
      "<title>Ampersands &amp; &lt;b&gt;tags&lt;/b&gt; &amp; &quot;quotes&quot;</title>",
    );
    expect(feed).not.toContain("<b>");
  });

  it("strips inline marks from the description rather than shipping the syntax", () => {
    const feed = buildFeed(
      [summary("x", { description: "A study of **layered** paint" })],
      options,
    );
    expect(feed).toContain("<description>A study of layered paint</description>");
  });

  it("uses updatedAt for pubDate when there is one", () => {
    const feed = buildFeed(
      [summary("x", { updatedAt: "2026-02-01T00:00:00Z" })],
      options,
    );
    expect(feed).toContain("<pubDate>Sun, 01 Feb 2026 00:00:00 GMT</pubDate>");
  });

  it("falls back to the build time rather than emitting an invalid date", () => {
    expect(rfc2822("not a date", options.builtAt)).toBe(
      "Fri, 21 Aug 2026 12:00:00 GMT",
    );
  });

  it("encodes a slug into the item link", () => {
    const feed = buildFeed([summary("a-b-c")], options);
    expect(feed).toContain("<link>https://www.zimoluo.me/blog/a-b-c</link>");
    expect(feed).toContain('<guid isPermaLink="true">');
  });

  it("attaches the cover as an enclosure with a real mime type", () => {
    const feed = buildFeed(
      [
        summary("x", {
          cover: {
            src: "https://example.test/cover.webp",
            width: 1600,
            height: 900,
            alt: "",
          },
        }),
      ],
      options,
    );
    expect(feed).toContain('type="image/webp"');
  });

  it("guesses a mime type from the extension, ignoring a query string", () => {
    expect(mimeFor("a.png")).toBe("image/png");
    expect(mimeFor("a.JPEG")).toBe("image/jpeg");
    expect(mimeFor("a.webp?v=2")).toBe("image/webp");
    expect(mimeFor("a")).toBe("image/jpeg");
  });

  it("emits no enclosure when there is no cover", () => {
    expect(buildFeed([summary("x")], options)).not.toContain("<enclosure");
  });

  it("names every author of an entry", () => {
    const feed = buildFeed(
      [
        summary("x", {
          authors: [resolveAuthor("zimo"), resolveAuthor("guest", "A Guest")],
        }),
      ],
      options,
    );
    expect(feed).toContain("<author>Zimo Luo, A Guest</author>");
  });

  it("honors a limit and handles an empty blog", () => {
    const many = ["a", "b", "c"].map((slug) => summary(slug));
    expect(buildFeed(many, { ...options, limit: 2 }).match(/<item>/g)).toHaveLength(2);
    expect(buildFeed([], options)).not.toContain("<item>");
  });

  it("removes control characters that would make the XML invalid", () => {
    expect(xml("a\u0000b\u001Fc")).toBe("abc");
  });
});
