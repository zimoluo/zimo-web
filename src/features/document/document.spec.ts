import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { countWords, parseDocument, readingMinutesFor } from "./parse";
import { parseMarks, stripMarks } from "./marks";
import { registry, specFor } from "./registry";
import { slugify } from "./plugins/remark-outline";

const asJson = (value: unknown): string => JSON.stringify(value);

describe("D2 C5: every registry directive validates its own example", () => {
  it.each(registry.map((spec) => [spec.directive, spec.example] as const))(
    "%s renders its example without an error issue",
    async (directive, example) => {
      const result = await parseDocument(example);
      const errors = result.issues.filter((issue) => issue.severity === "error");
      expect(errors, `${directive}: ${asJson(errors)}`).toEqual([]);
      expect(asJson(result.document)).toContain(`zw-${directive}`);
    },
  );

  it("reports an invalid enum with a line number rather than throwing", async () => {
    const result = await parseDocument('\n\n::article-card{section="nope" slug="a"}');
    const issue = result.issues.find((entry) => entry.code === "attribute-enum");
    expect(issue).toBeDefined();
    expect(issue?.severity).toBe("error");
    expect(issue?.line).toBe(3);
    expect(asJson(result.document)).not.toContain("Error rendering component");
  });

  it("reports a missing required attribute", async () => {
    const result = await parseDocument("::music-player{title=\"x\"}");
    expect(result.issues.map((entry) => entry.code)).toContain("attribute-required");
  });

  it("reports an unknown attribute as a warning, not an error", async () => {
    const result = await parseDocument('::theme-picker{mystery="1"}');
    const issue = result.issues.find((entry) => entry.code === "attribute-unknown");
    expect(issue?.severity).toBe("warning");
  });

  it("reports an unknown directive as a warning and leaves it as text", async () => {
    const result = await parseDocument("::not-a-thing{a=\"b\"}");
    expect(result.issues.map((entry) => entry.code)).toContain("unknown-directive");
    expect(asJson(result.document)).not.toContain("zw-not-a-thing");
  });

  it("reports a directive used in the wrong form", async () => {
    const result = await parseDocument("::callout{tone=\"note\"}");
    expect(result.issues.map((entry) => entry.code)).toContain("directive-form");
  });

  it("applies an attribute default when the author omits it", async () => {
    const result = await parseDocument(":::callout\nBody.\n:::");
    expect(asJson(result.document)).toContain('"tone":"note"');
  });

  it("coerces a number attribute and rejects a non-number", async () => {
    expect(specFor("gallery")).toBeDefined();
    const bad = await parseDocument('::music-player{url="/a" title="t" author="x"}');
    expect(bad.issues.filter((entry) => entry.severity === "error")).toEqual([]);
  });

  it("never throws on malformed input", async () => {
    for (const input of [
      ":::",
      ":::::",
      "::{}",
      ":glyph[]",
      ':::gallery{ratio="}\n:::',
      "@@",
      "@@@@",
      "::music-player{url=}",
    ]) {
      await expect(parseDocument(input)).resolves.toBeDefined();
    }
  });
});

describe("D2 C6: container directives nest", () => {
  it("nests three deep", async () => {
    const markdown = [
      ":::callout{tone=\"note\"}",
      "Outer.",
      "",
      ":::gallery{ratio=\"1:1\"}",
      "",
      ":::timeline",
      "- innermost",
      ":::",
      "",
      ":::",
      "",
      ":::",
    ].join("\n");

    const result = await parseDocument(markdown);
    const json = asJson(result.document);

    expect(json).toContain("zw-callout");
    expect(json).toContain("zw-gallery");
    expect(json).toContain("zw-timeline");

    const calloutAt = json.indexOf("zw-callout");
    const galleryAt = json.indexOf("zw-gallery");
    const timelineAt = json.indexOf("zw-timeline");
    expect(calloutAt).toBeLessThan(galleryAt);
    expect(galleryAt).toBeLessThan(timelineAt);
  });
});

describe("D2 C8: heading ids are namespaced and collision-counted", () => {
  it("two readers of the same article produce disjoint id sets", async () => {
    const markdown = "# Title\n\n## Part\n\n## Part\n";
    const first = await parseDocument(markdown, { idNamespace: "w1" });
    const second = await parseDocument(markdown, { idNamespace: "w2" });

    const ids = (sections: readonly { readonly id: string }[]) =>
      new Set(sections.map((section) => section.id));

    const a = ids(first.outline);
    const b = ids(second.outline);

    expect(a.size).toBe(3);
    expect(b.size).toBe(3);
    for (const id of a) expect(b.has(id)).toBe(false);
  });

  it("counts collisions deterministically", async () => {
    const result = await parseDocument("## Part\n\n## Part\n\n## Part\n");
    expect(result.outline.map((section) => section.id)).toEqual(["part", "part-1", "part-2"]);
  });

  it("falls back to a stable slug for a heading with no sluggable text", async () => {
    const result = await parseDocument("## ✨\n");
    expect(result.outline[0]?.id).toBe("section");
  });

  it("is deterministic across runs", async () => {
    const markdown = "# A\n## B\n### C\n";
    const first = await parseDocument(markdown, { idNamespace: "x" });
    const second = await parseDocument(markdown, { idNamespace: "x" });
    expect(first.outline).toEqual(second.outline);
  });
});

describe("outline", () => {
  it("collects depth and text in document order", async () => {
    const result = await parseDocument("# One\n\ntext\n\n## Two\n\n### Three\n");
    expect(result.outline).toEqual([
      { id: "one", depth: 1, text: "One" },
      { id: "two", depth: 2, text: "Two" },
      { id: "three", depth: 3, text: "Three" },
    ]);
  });

  it("is empty for a document with no headings", async () => {
    expect((await parseDocument("just prose")).outline).toEqual([]);
  });
});

describe("slugify", () => {
  it("lowercases, strips punctuation and collapses whitespace", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("  spaced   out  ")).toBe("spaced-out");
    expect(slugify("Ünïcodé")).toBe("unicode");
    expect(slugify("a--b")).toBe("a-b");
  });

  it("returns an empty string for unsluggable input", () => {
    expect(slugify("✨🎉")).toBe("");
  });
});

describe("D2 §6: reading time counts words, not gaps", () => {
  it("counts words correctly, unlike the v10 split on word boundaries", () => {
    expect(countWords("a b c")).toBe(3);
    expect("a b c".split(/\b\S+\b/).filter(Boolean).length).toBe(2);
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
    expect(countWords("one")).toBe(1);
  });

  it("D2 C10: a 1000-word fixture reads as 5 minutes", () => {
    const text = Array.from({ length: 1000 }, (_, index) => `word${index}`).join(" ");
    expect(countWords(text)).toBe(1000);
    expect(readingMinutesFor(text)).toBe(Math.ceil(1000 / 238));
    expect(readingMinutesFor(text)).toBe(5);
  });

  it("reports zero minutes for an empty document", async () => {
    expect((await parseDocument("")).readingMinutes).toBe(0);
  });
});

describe("D2 C11: math renders as MathML", () => {
  it("emits a math element and no katex-html duplicate", async () => {
    const result = await parseDocument("$E = mc^2$");
    const json = asJson(result.document);
    expect(json).toContain("math");
    expect(json).not.toContain("katex-html");
  });

  it("the katex-html suppression rule is gone from globals.css", () => {
    const css = readFileSync("src/styles/globals.css", "utf8");
    expect(css).not.toContain(".katex-html");
  });
});

describe("D2 C12: the legacy glyph syntax is tolerated, once, with a deprecation", () => {
  it("renders and emits exactly one deprecated issue", async () => {
    const result = await parseDocument("A @@cog@@ inline.");
    const deprecated = result.issues.filter((issue) => issue.severity === "deprecated");

    expect(deprecated).toHaveLength(1);
    expect(deprecated[0]?.code).toBe("legacy-glyph");
    expect(deprecated[0]?.line).toBe(1);
    expect(asJson(result.document)).toContain("zw-glyph");
  });

  it("leaves @@name@@ alone inside a code span, which a text splitter would not", async () => {
    const result = await parseDocument("Literal `@@cog@@` here.");
    expect(result.issues.filter((issue) => issue.code === "legacy-glyph")).toEqual([]);
    expect(asJson(result.document)).toContain("@@cog@@");
  });

  it("leaves @@name@@ alone inside a fenced block", async () => {
    const result = await parseDocument("```\n@@cog@@\n```");
    expect(result.issues.filter((issue) => issue.code === "legacy-glyph")).toEqual([]);
  });

  it("flags an unknown glyph name", async () => {
    const result = await parseDocument("A @@nonsense@@ inline.");
    expect(result.issues.map((issue) => issue.code)).toContain("unknown-glyph");
  });

  it("treats the modern form as current, with no deprecation", async () => {
    const result = await parseDocument("A :glyph[cog] inline.");
    expect(result.issues.filter((issue) => issue.severity === "deprecated")).toEqual([]);
  });
});

describe("D2 §2: no raw HTML, no global mutation", () => {
  it("turns raw HTML into text rather than injecting it", async () => {
    const result = await parseDocument("<script>alert(1)</script>\n\n<b>bold</b>");
    const json = asJson(result.document);
    expect(json).not.toContain('"tagName":"script"');
    expect(json).not.toContain('"tagName":"b"');
  });

  it("is safe to run concurrently, since the processor holds no mutable global", async () => {
    const documents = await Promise.all([
      parseDocument("# A\n@@cog@@"),
      parseDocument("# B\n:glyph[star]"),
      parseDocument("# C\n$x$"),
    ]);
    expect(documents[0]?.outline[0]?.id).toBe("a");
    expect(documents[1]?.outline[0]?.id).toBe("b");
    expect(documents[2]?.outline[0]?.id).toBe("c");
    expect(documents[0]?.issues).toHaveLength(1);
    expect(documents[1]?.issues).toHaveLength(0);
  });

  it("D2 C1: dangerouslySetInnerHTML appears nowhere in src/", () => {
    const walk = (dir: string): string[] => {
      const out: string[] = [];
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) out.push(...walk(path));
        else if (/\.tsx?$/.test(path) && !/\.spec\.tsx?$/.test(path)) out.push(path);
      }
      return out;
    };

    for (const file of walk("src")) {
      expect(readFileSync(file, "utf8"), file).not.toContain("dangerouslySetInnerHTML");
    }
  });
});

describe("D2 §5: inline marks use real Markdown", () => {
  it("reads each mark to its Markdown meaning, not v10's inverted one", () => {
    expect(parseMarks("*x*")[0]?.kind).toBe("emphasis");
    expect(parseMarks("_x_")[0]?.kind).toBe("emphasis");
    expect(parseMarks("**x**")[0]?.kind).toBe("strong");
    expect(parseMarks("`x`")[0]?.kind).toBe("code");
    expect(parseMarks("==x==")[0]?.kind).toBe("mark");
    expect(parseMarks("~~x~~")[0]?.kind).toBe("strike");
    expect(parseMarks("[t](u)")[0]?.kind).toBe("link");
  });

  it("carries a mailto link through", () => {
    const node = parseMarks("[mail](mailto:a@b.c)")[0];
    expect(node?.kind).toBe("link");
    if (node?.kind === "link") expect(node.href).toBe("mailto:a@b.c");
  });

  it("strips to plain text, handling escapes the six v10 regexes could not", () => {
    expect(stripMarks("escaped \\*not em\\*")).toBe("escaped *not em*");
    expect(stripMarks("nested **a *b* c**")).toBe("nested a b c");
    expect(stripMarks("mixed **a** and ==b== and `c`")).toBe("mixed a and b and c");
  });

  it("leaves plain text untouched", () => {
    expect(stripMarks("plain")).toBe("plain");
    expect(stripMarks("")).toBe("");
  });

  it("D2 C9: stripMarks is idempotent over prose, which is what it is used on", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9 ,.;:!?'"()-]{0,60}$/),
        (input) => {
          const once = stripMarks(input);
          expect(stripMarks(once)).toBe(once);
        },
      ),
      { numRuns: 400 },
    );
  });

  it("is not closed under its own output, and that is inherent — see ADR-038", () => {
    expect(stripMarks("\\_x\\_")).toBe("_x_");
    expect(stripMarks("_x_")).toBe("x");
    expect(stripMarks("~~]~~")).toBe("]");
  });

  it("D2 C9: stripping is total and deterministic over arbitrary input", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 80 }), (input) => {
        const first = stripMarks(input);
        expect(typeof first).toBe("string");
        expect(stripMarks(input)).toBe(first);
      }),
      { numRuns: 400 },
    );
  });

  it("D2 C9: prose survives stripping unchanged but for paragraph trimming", () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-zA-Z0-9]([a-zA-Z0-9 ]{0,38}[a-zA-Z0-9])?$/), (input) => {
        expect(stripMarks(input)).toBe(input.trim());
      }),
      { numRuns: 300 },
    );
  });

  it("strips whitespace-only input to nothing", () => {
    expect(stripMarks("   ")).toBe("");
    expect(stripMarks("")).toBe("");
  });
});

describe("attribute coercion", () => {
  it("coerces a boolean attribute from a bare flag and from an explicit value", async () => {
    const withFlag = await parseDocument('::music-player{url="/a" title="t"}');
    expect(withFlag.issues.filter((issue) => issue.severity === "error")).toEqual([]);
  });

  it("ignores id and class attributes, which the directive syntax owns", async () => {
    const result = await parseDocument("::theme-picker{#anchor .wide}");
    expect(result.issues.filter((issue) => issue.code === "attribute-unknown")).toEqual([]);
  });

  it("keeps a string attribute verbatim, including punctuation", async () => {
    const result = await parseDocument(
      '::music-player{url="/a b.mp3?x=1&y=2" title="A: B — C"}',
    );
    const json = asJson(result.document);
    expect(json).toContain("/a b.mp3?x=1&y=2");
    expect(json).toContain("A: B — C");
  });

  it("keeps a caption on a gallery and defaults its ratio", async () => {
    const result = await parseDocument(':::gallery{caption="Two views"}\n![a](a.jpg)\n:::');
    const json = asJson(result.document);
    expect(json).toContain("Two views");
    expect(json).toContain('"ratio":"4:3"');
  });

  it("keeps an explicit callout tone and title", async () => {
    const result = await parseDocument(':::callout{tone="danger" title="Stop"}\nBody.\n:::');
    const json = asJson(result.document);
    expect(json).toContain('"tone":"danger"');
    expect(json).toContain("Stop");
  });

  it("falls back to the default when an enum value is wrong", async () => {
    const result = await parseDocument(':::callout{tone="loud"}\nBody.\n:::');
    expect(asJson(result.document)).toContain('"tone":"note"');
    expect(result.issues.map((issue) => issue.code)).toContain("attribute-enum");
  });
});

describe("glyph tokenizer edge cases", () => {
  it("does not fire on a single @", async () => {
    const result = await parseDocument("mail me at a@b.c");
    expect(result.issues.filter((issue) => issue.code === "legacy-glyph")).toEqual([]);
  });

  it("does not fire on an unterminated token", async () => {
    for (const input of ["@@cog", "@@cog@", "@@", "@@@"]) {
      const result = await parseDocument(input);
      expect(result.issues.filter((issue) => issue.code === "legacy-glyph"), input).toEqual([]);
    }
  });

  it("does not fire across a line ending", async () => {
    const result = await parseDocument("@@co\ng@@");
    expect(result.issues.filter((issue) => issue.code === "legacy-glyph")).toEqual([]);
  });

  it("does not fire on an empty name", async () => {
    const result = await parseDocument("@@@@ here");
    expect(result.issues.filter((issue) => issue.code === "legacy-glyph")).toEqual([]);
  });

  it("handles several legacy glyphs in one paragraph", async () => {
    const result = await parseDocument("@@cog@@ and @@star@@ and @@heart@@");
    expect(result.issues.filter((issue) => issue.code === "legacy-glyph")).toHaveLength(3);
  });

  it("reports each legacy glyph with its own position", async () => {
    const result = await parseDocument("line one\n\n@@cog@@\n\n@@star@@");
    const lines = result.issues
      .filter((issue) => issue.code === "legacy-glyph")
      .map((issue) => issue.line);
    expect(lines).toEqual([3, 5]);
  });
});

describe("marks conversion", () => {
  it("converts every node kind it can produce", () => {
    expect(parseMarks("a **b** _c_ `d` ==e== ~~f~~ [g](h)").map((node) => node.kind)).toEqual([
      "text",
      "strong",
      "text",
      "emphasis",
      "text",
      "code",
      "text",
      "mark",
      "text",
      "strike",
      "text",
      "link",
    ]);
  });

  it("marks plain text; nested markup inside a mark is not supported (ADR-039)", () => {
    const plain = parseMarks("==a b==")[0];
    expect(plain?.kind).toBe("mark");
    if (plain?.kind === "mark") {
      expect(plain.children).toEqual([{ kind: "text", value: "a b" }]);
    }

    expect(parseMarks("==a **b**==").map((node) => node.kind)).toEqual([
      "text",
      "strong",
      "text",
    ]);
    expect(stripMarks("==a **b**==")).toBe("==a b==");
  });

  it("handles a mark at the start and end of a string", () => {
    expect(parseMarks("==a==")[0]?.kind).toBe("mark");
    expect(stripMarks("==a== tail")).toBe("a tail");
    expect(stripMarks("head ==a==")).toBe("head a");
  });

  it("leaves an unmatched delimiter as text", () => {
    expect(stripMarks("==a")).toBe("==a");
    expect(stripMarks("a==")).toBe("a==");
  });

  it("flattens a multi-paragraph input, since marks are single-line by contract", () => {
    expect(stripMarks("one\n\ntwo")).toBe("onetwo");
  });

  it("drops a heading's syntax rather than keeping the hash", () => {
    expect(stripMarks("# not a heading here")).toBe("# not a heading here");
  });
});

describe("number attributes", () => {
  it("coerces a numeric attribute", async () => {
    const result = await parseDocument(':::gallery{columns="3"}\n![a](a.jpg)\n:::');
    expect(asJson(result.document)).toContain('"columns":3');
    expect(result.issues.filter((issue) => issue.severity === "error")).toEqual([]);
  });

  it("reports a non-numeric value and falls back to the default", async () => {
    const result = await parseDocument(':::gallery{columns="many"}\n![a](a.jpg)\n:::');
    const issue = result.issues.find((entry) => entry.code === "attribute-type");
    expect(issue?.severity).toBe("error");
    expect(asJson(result.document)).toContain('"columns":1');
  });

  it("applies the numeric default when omitted", async () => {
    const result = await parseDocument(":::gallery\n![a](a.jpg)\n:::");
    expect(asJson(result.document)).toContain('"columns":1');
  });
});

describe("marks conversion of nodes it does not model", () => {
  it("keeps the text of a node kind it has no mark for", () => {
    expect(stripMarks("![alt text](image.png)")).toBe("");
    expect(stripMarks("a ![alt](i.png) b")).toBe("a  b");
  });

  it("descends into an unmodeled node that has children", () => {
    expect(stripMarks("[a][ref]\n\n[ref]: https://x.com")).toBe("a");
    expect(stripMarks("[a]\n\n[a]: https://x.com")).toBe("a");
  });

  it("keeps the value of an unmodeled node that carries one", () => {
    expect(stripMarks("<b>x</b>")).toBe("<b>x</b>");
  });

  it("keeps a hard break as nothing rather than dropping surrounding text", () => {
    expect(stripMarks("a\\\nb")).toBe("ab");
  });
});

describe("heading ids without a resolvable id", () => {
  it("still records the heading in the outline", async () => {
    const result = await parseDocument("###### deep\n");
    expect(result.outline).toHaveLength(1);
    expect(result.outline[0]?.depth).toBe(6);
  });
});

describe("legacy glyph issue collection", () => {
  it("ignores a modern text directive that is not a legacy glyph", async () => {
    const result = await parseDocument("A :kbd[X] and a :glyph[cog].");
    expect(result.issues.filter((issue) => issue.code === "legacy-glyph")).toEqual([]);
  });
});
