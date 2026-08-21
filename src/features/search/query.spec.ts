import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { stripMarks } from "../document/marks";
import {
  describeQuery,
  filterEntries,
  matchesQuery,
  matchesTerm,
  parseQuery,
} from "./query";
import type { SearchableEntry } from "./query";

const entries: readonly SearchableEntry[] = [
  {
    title: "On gradients",
    description: "A study of **layered** paint",
    tags: ["design", "color"],
    authors: ["Zimo"],
  },
  {
    title: "Window systems",
    description: "Desktop metaphors on the web",
    tags: ["engineering"],
    authors: ["Zimo", "Guest"],
  },
  { title: "Untagged note", description: "No tags at all" },
];

describe("parseQuery", () => {
  it("reads a bare term as free text", () => {
    expect(parseQuery("gradient").terms).toEqual([
      { kind: "text", value: "gradient", negated: false },
    ]);
  });

  it("reads a # prefix as a tag and a : prefix as an author", () => {
    expect(parseQuery("#design").terms).toEqual([
      { kind: "tag", value: "design", negated: false },
    ]);
    expect(parseQuery(":zimo").terms).toEqual([
      { kind: "author", value: "zimo", negated: false },
    ]);
  });

  it("splits on every separator the v10 grammar accepted, including the CJK forms", () => {
    for (const separator of [",", ";", "，", "；"]) {
      expect(parseQuery(`a${separator}b`).terms).toHaveLength(2);
    }
  });

  it("combines terms with AND", () => {
    const query = parseQuery("#design, :zimo, gradient");
    expect(query.terms.map((term) => term.kind)).toEqual(["tag", "author", "text"]);
  });

  it("trims whitespace around terms and around the sigil", () => {
    expect(parseQuery("  #  design  ").terms).toEqual([
      { kind: "tag", value: "design", negated: false },
    ]);
  });

  it("drops empty terms rather than matching everything", () => {
    expect(parseQuery("").terms).toEqual([]);
    expect(parseQuery("   ").terms).toEqual([]);
    expect(parseQuery(",,;;").terms).toEqual([]);
    expect(parseQuery("a,,b").terms).toHaveLength(2);
  });

  it("drops a bare sigil with nothing after it", () => {
    expect(parseQuery("#").terms).toEqual([]);
    expect(parseQuery(":").terms).toEqual([]);
    expect(parseQuery("# , :").terms).toEqual([]);
  });

  it("reads a leading dash as negation", () => {
    expect(parseQuery("-draft").terms).toEqual([
      { kind: "text", value: "draft", negated: true },
    ]);
    expect(parseQuery("-#design").terms).toEqual([
      { kind: "tag", value: "design", negated: true },
    ]);
    expect(parseQuery("-:guest").terms).toEqual([
      { kind: "author", value: "guest", negated: true },
    ]);
  });

  it("treats a lone dash as text, not as negation of nothing", () => {
    expect(parseQuery("-").terms).toEqual([{ kind: "text", value: "-", negated: false }]);
  });

  it("never throws, for arbitrary input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 80 }), (input) => {
        expect(() => parseQuery(input)).not.toThrow();
        expect(Array.isArray(parseQuery(input).terms)).toBe(true);
      }),
      { numRuns: 300 },
    );
  });
});

describe("matching", () => {
  const first = entries[0] as SearchableEntry;
  const third = entries[2] as SearchableEntry;

  it("matches a tag by prefix, case-insensitively", () => {
    expect(matchesTerm(first, { kind: "tag", value: "des", negated: false }, stripMarks)).toBe(
      true,
    );
    expect(matchesTerm(first, { kind: "tag", value: "DES", negated: false }, stripMarks)).toBe(
      true,
    );
    expect(matchesTerm(first, { kind: "tag", value: "esign", negated: false }, stripMarks)).toBe(
      false,
    );
  });

  it("matches an author by prefix", () => {
    expect(
      matchesTerm(first, { kind: "author", value: "zim", negated: false }, stripMarks),
    ).toBe(true);
    expect(
      matchesTerm(first, { kind: "author", value: "guest", negated: false }, stripMarks),
    ).toBe(false);
  });

  it("matches free text against the title", () => {
    expect(
      matchesTerm(first, { kind: "text", value: "gradients", negated: false }, stripMarks),
    ).toBe(true);
  });

  it("matches free text against the description with its marks stripped", () => {
    expect(
      matchesTerm(first, { kind: "text", value: "layered paint", negated: false }, stripMarks),
    ).toBe(true);
  });

  it("does not match the description's mark syntax itself", () => {
    expect(
      matchesTerm(first, { kind: "text", value: "**layered**", negated: false }, stripMarks),
    ).toBe(false);
  });

  it("treats an entry with no tags or authors as not matching those terms", () => {
    expect(matchesTerm(third, { kind: "tag", value: "any", negated: false }, stripMarks)).toBe(
      false,
    );
    expect(
      matchesTerm(third, { kind: "author", value: "any", negated: false }, stripMarks),
    ).toBe(false);
  });

  it("inverts a negated term", () => {
    expect(matchesTerm(third, { kind: "tag", value: "design", negated: true }, stripMarks)).toBe(
      true,
    );
    expect(matchesTerm(first, { kind: "tag", value: "design", negated: true }, stripMarks)).toBe(
      false,
    );
  });

  it("requires every term to match", () => {
    expect(matchesQuery(first, parseQuery("#design, :zimo"), stripMarks)).toBe(true);
    expect(matchesQuery(first, parseQuery("#design, :guest"), stripMarks)).toBe(false);
  });

  it("matches everything when the query is empty", () => {
    expect(matchesQuery(third, parseQuery(""), stripMarks)).toBe(true);
  });
});

describe("filterEntries", () => {
  it("returns the same array when there is nothing to filter by", () => {
    expect(filterEntries(entries, "  ", stripMarks)).toBe(entries);
  });

  it("filters by tag", () => {
    expect(filterEntries(entries, "#engineering", stripMarks).map((entry) => entry.title)).toEqual(
      ["Window systems"],
    );
  });

  it("filters by author", () => {
    expect(filterEntries(entries, ":guest", stripMarks).map((entry) => entry.title)).toEqual([
      "Window systems",
    ]);
  });

  it("filters by free text across title and description", () => {
    expect(filterEntries(entries, "metaphors", stripMarks).map((entry) => entry.title)).toEqual([
      "Window systems",
    ]);
  });

  it("combines a tag and free text with AND", () => {
    expect(filterEntries(entries, "#design, paint", stripMarks)).toHaveLength(1);
    expect(filterEntries(entries, "#design, metaphors", stripMarks)).toHaveLength(0);
  });

  it("excludes with a negated term", () => {
    expect(filterEntries(entries, "-#design", stripMarks).map((entry) => entry.title)).toEqual([
      "Window systems",
      "Untagged note",
    ]);
  });

  it("returns nothing when a term matches nothing", () => {
    expect(filterEntries(entries, "#nonexistent", stripMarks)).toHaveLength(0);
  });

  it("preserves input order", () => {
    expect(filterEntries(entries, ":zimo", stripMarks).map((entry) => entry.title)).toEqual([
      "On gradients",
      "Window systems",
    ]);
  });

  it("H-07: the same code filters one section or all of them", () => {
    const acrossSections = [...entries, { title: "A project", tags: ["engineering"] }];
    expect(filterEntries(acrossSections, "#engineering", stripMarks)).toHaveLength(2);
  });
});

describe("describeQuery", () => {
  it("reads back as prose, for an accessible live region", () => {
    expect(describeQuery(parseQuery("#design, :zimo, paint"))).toBe(
      'tag design and author zimo and "paint"',
    );
    expect(describeQuery(parseQuery("-#draft"))).toBe("not tag draft");
    expect(describeQuery(parseQuery("-:guest"))).toBe("not author guest");
    expect(describeQuery(parseQuery(""))).toBe("");
  });
});
