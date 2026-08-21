import { describe, expect, it } from "vitest";
import { migrateDocument, migrateInlineMarks } from "./migrate-syntax";
import { parseDocument } from "./parse";

describe("migrateDocument: component blocks", () => {
  it("turns ImageViewer's parallel arrays into one node per image, fixing F-25", () => {
    const source =
      '&&{ImageViewer}{"url": ["/a.jpg", "/b.jpg"], "text": ["Sunrise", "Dusk"]}&&';
    const { markdown, changes } = migrateDocument(source);

    expect(markdown).toBe(
      [":::gallery", "![Sunrise](/a.jpg)", "![Dusk](/b.jpg)", ":::"].join("\n"),
    );
    expect(changes.map((change) => change.kind)).toEqual(["directive-ImageViewer"]);
  });

  it("drops captions when the arrays do not align, rather than pairing them wrongly", () => {
    const source = '&&{ImageViewer}{"url": ["/a.jpg", "/b.jpg"], "text": ["Only one"]}&&';
    expect(migrateDocument(source).markdown).toBe(
      [":::gallery", "![](/a.jpg)", "![](/b.jpg)", ":::"].join("\n"),
    );
  });

  it("carries scalar props through as attributes", () => {
    const source = '&&{ImageViewer}{"url": ["/a.jpg"], "aspectRatio": "4:3"}&&';
    expect(migrateDocument(source).markdown).toContain(':::gallery{aspectRatio="4:3"}');
  });

  it("turns Timeline's event map into list items", () => {
    const source = '&&{Timeline}{"events": {"2019-1-1": "began", "2020-6-2": "shipped"}}&&';
    expect(migrateDocument(source).markdown).toBe(
      [":::timeline", "- 2019-1-1 — began", "- 2020-6-2 — shipped", ":::"].join("\n"),
    );
  });

  it("keeps a Timeline boolean flag as a bare attribute", () => {
    const source = '&&{Timeline}{"events": {"a": "b"}, "sorted": true}&&';
    expect(migrateDocument(source).markdown).toContain(":::timeline{sorted}");
  });

  it("converts the leaf components", () => {
    expect(migrateDocument('&&{ArticleCard}{"section": "blog", "slug": "x"}&&').markdown).toBe(
      '::article-card{section="blog" slug="x"}',
    );
    expect(migrateDocument('&&{BlogCard}{"slug": "x"}&&').markdown).toBe(
      '::blog-card{slug="x"}',
    );
    expect(
      migrateDocument('&&{MusicPlayerCard}{"url": "/a.mp3", "title": "T"}&&').markdown,
    ).toBe('::music-player{url="/a.mp3" title="T"}');
    expect(migrateDocument("&&{SettingsThemePicker}{}&&").markdown).toBe("::theme-picker");
  });

  it("reduces Image and Link to plain Markdown, per D2 §4", () => {
    expect(migrateDocument('&&{Image}{"src": "/a.png", "alt": "A"}&&').markdown).toBe(
      "![A](/a.png)",
    );
    expect(
      migrateDocument('&&{Link}{"href": "https://x.com", "text": "X"}&&').markdown,
    ).toBe("[X](https://x.com)");
  });

  it("removes the six theme-editor directives, which are now a route", () => {
    for (const name of [
      "themeAccent",
      "themeGradient",
      "themeProfile",
      "themeFavicon",
      "themeMisc",
      "themeSidebar",
    ]) {
      const result = migrateDocument(`before\n\n&&{${name}}{}&&\n\nafter`);
      expect(result.markdown, name).not.toContain(name);
      expect(result.changes[0]?.kind, name).toBe("directive-removed");
    }
  });

  it("leaves an unparseable props block in place and reports it with a line", () => {
    const source = "line one\n\n&&{ArticleCard}{not json}&&";
    const result = migrateDocument(source);

    expect(result.markdown).toContain("&&{ArticleCard}{not json}&&");
    expect(result.issues[0]?.kind).toBe("unparseable-props");
    expect(result.issues[0]?.line).toBe(3);
  });

  it("leaves an unknown component in place and reports it", () => {
    const result = migrateDocument('&&{Mystery}{"a": 1}&&');
    expect(result.markdown).toContain("&&{Mystery}");
    expect(result.issues[0]?.kind).toBe("unconvertible");
  });

  it("reports an ImageViewer with no urls rather than emitting an empty gallery", () => {
    const result = migrateDocument('&&{ImageViewer}{"text": ["a"]}&&');
    expect(result.issues[0]?.kind).toBe("unconvertible");
  });

  it("converts several blocks in one document and keeps the prose between them", () => {
    const source = [
      "# Title",
      "",
      '&&{BlogCard}{"slug": "a"}&&',
      "",
      "Some prose.",
      "",
      '&&{BlogCard}{"slug": "b"}&&',
    ].join("\n");

    const result = migrateDocument(source);
    expect(result.markdown).toContain('::blog-card{slug="a"}');
    expect(result.markdown).toContain('::blog-card{slug="b"}');
    expect(result.markdown).toContain("Some prose.");
    expect(result.changes).toHaveLength(2);
  });

  it("escapes a quote inside an attribute value", () => {
    const result = migrateDocument('&&{BlogCard}{"slug": "a \\"b\\" c"}&&');
    expect(result.markdown).toContain('slug="a \\"b\\" c"');
  });
});

describe("migrateDocument: glyphs", () => {
  it("rewrites @@name@@ to the directive form", () => {
    const result = migrateDocument("A @@cog@@ and a @@heart@@.");
    expect(result.markdown).toBe("A :glyph[cog] and a :glyph[heart].");
    expect(result.changes.filter((change) => change.kind === "glyph")).toHaveLength(2);
  });

  it("records the line each glyph was on", () => {
    const result = migrateDocument("one\n\n@@cog@@\n\n@@star@@");
    expect(
      result.changes.filter((change) => change.kind === "glyph").map((change) => change.line),
    ).toEqual([3, 5]);
  });

  it("leaves a lone @@ alone", () => {
    expect(migrateDocument("@@ and @@@").markdown).toBe("@@ and @@@");
  });
});

describe("migrateDocument is idempotent", () => {
  const corpus = [
    '&&{ImageViewer}{"url": ["/a.jpg"], "text": ["A"]}&&',
    '&&{Timeline}{"events": {"2019-1-1": "began"}}&&',
    '&&{ArticleCard}{"section": "blog", "slug": "x"}&&',
    "&&{SettingsThemePicker}{}&&",
    "A @@cog@@ inline.",
    "&&{themeAccent}{}&&",
    "# Heading\n\nprose with `code` and a [link](https://x.com)",
  ];

  it.each(corpus)("running twice changes nothing the second time: %s", (source) => {
    const once = migrateDocument(source).markdown;
    const twice = migrateDocument(once);
    expect(twice.markdown).toBe(once);
    expect(twice.changes).toEqual([]);
  });
});

describe("migrated documents parse under the v11 pipeline", () => {
  it("an ImageViewer block becomes a gallery the parser accepts", async () => {
    const { markdown } = migrateDocument(
      '&&{ImageViewer}{"url": ["/a.jpg", "/b.jpg"], "text": ["A", "B"]}&&',
    );
    const parsed = await parseDocument(markdown);

    expect(parsed.issues.filter((issue) => issue.severity === "error")).toEqual([]);
    expect(JSON.stringify(parsed.document)).toContain("zw-gallery");
  });

  it("a migrated glyph carries no deprecation, unlike the source", async () => {
    const before = await parseDocument("A @@cog@@ inline.");
    expect(before.issues.filter((issue) => issue.severity === "deprecated")).toHaveLength(1);

    const { markdown } = migrateDocument("A @@cog@@ inline.");
    const after = await parseDocument(markdown);
    expect(after.issues.filter((issue) => issue.severity === "deprecated")).toEqual([]);
  });

  it("every convertible component yields a document with no error issues", async () => {
    const sources = [
      '&&{Timeline}{"events": {"2019-1-1": "began"}}&&',
      '&&{MusicPlayerCard}{"url": "/a.mp3", "title": "T"}&&',
      "&&{SettingsThemePicker}{}&&",
      '&&{Image}{"src": "/a.png", "alt": "A"}&&',
      '&&{Link}{"href": "https://x.com", "text": "X"}&&',
    ];

    for (const source of sources) {
      const { markdown } = migrateDocument(source);
      const parsed = await parseDocument(markdown);
      expect(
        parsed.issues.filter((issue) => issue.severity === "error"),
        source,
      ).toEqual([]);
    }
  });
});

describe("migrateInlineMarks: the v10 grammar was inverted", () => {
  it("promotes v10 *strong* to Markdown **strong**", () => {
    expect(migrateInlineMarks("a *bold* b").markdown).toBe("a **bold** b");
  });

  it("leaves _emphasis_ alone, since it already meant emphasis", () => {
    expect(migrateInlineMarks("a _em_ b").markdown).toBe("a _em_ b");
  });

  it("rewrites |mark| to ==mark==", () => {
    expect(migrateInlineMarks("a |noted| b").markdown).toBe("a ==noted== b");
  });

  it("rewrites the v10 link and mailto forms", () => {
    expect(migrateInlineMarks("see ~~{here}{https://x.com}~~").markdown).toBe(
      "see [here](https://x.com)",
    );
    expect(migrateInlineMarks("mail @@{me}{a@b.c}@@").markdown).toBe(
      "mail [me](mailto:a@b.c)",
    );
  });

  it("rewrites the mailto form before the glyph form, so neither corrupts the other", () => {
    const result = migrateInlineMarks("@@{me}{a@b.c}@@");
    expect(result.markdown).toBe("[me](mailto:a@b.c)");
    expect(result.markdown).not.toContain("glyph");
  });

  it("does not touch an already-doubled **strong**", () => {
    expect(migrateInlineMarks("a **bold** b").markdown).toBe("a **bold** b");
  });

  it("reports what it changed", () => {
    const result = migrateInlineMarks("*a* |b| ~~{c}{u}~~");
    expect(result.changes.map((change) => change.kind).sort()).toEqual([
      "mark-highlight",
      "mark-link",
      "mark-strong",
    ]);
  });

  it("is idempotent", () => {
    for (const source of ["*a*", "|b|", "~~{c}{u}~~", "@@{d}{a@b.c}@@", "plain"]) {
      const once = migrateInlineMarks(source).markdown;
      expect(migrateInlineMarks(once).markdown, source).toBe(once);
    }
  });

  it("leaves prose with no marks untouched", () => {
    expect(migrateInlineMarks("just prose").markdown).toBe("just prose");
    expect(migrateInlineMarks("just prose").changes).toEqual([]);
  });
});

describe("attribute conversion edge cases", () => {
  it("drops a false boolean rather than emitting a negated attribute", () => {
    const result = migrateDocument('&&{Timeline}{"events": {"a": "b"}, "sorted": false}&&');
    expect(result.markdown).toBe(":::timeline\n- a — b\n:::");
  });

  it("drops null and nested-object props from the attribute list", () => {
    const result = migrateDocument(
      '&&{BlogCard}{"slug": "x", "meta": {"a": 1}, "empty": null}&&',
    );
    expect(result.markdown).toBe('::blog-card{slug="x"}');
  });

  it("keeps a numeric prop as an attribute", () => {
    expect(migrateDocument('&&{BlogCard}{"slug": "x", "rank": 3}&&').markdown).toBe(
      '::blog-card{slug="x" rank="3"}',
    );
  });

  it("emits no attribute block when every prop is skipped", () => {
    expect(migrateDocument('&&{ImageViewer}{"url": ["/a.jpg"]}&&').markdown).toBe(
      ":::gallery\n![](/a.jpg)\n:::",
    );
  });

  it("escapes a backslash inside an attribute value", () => {
    expect(migrateDocument('&&{BlogCard}{"slug": "a\\\\b"}&&').markdown).toContain(
      'slug="a\\\\b"',
    );
  });

  it("accepts Image with url instead of src, and Link with url instead of href", () => {
    expect(migrateDocument('&&{Image}{"url": "/a.png"}&&').markdown).toBe("![](/a.png)");
    expect(migrateDocument('&&{Link}{"url": "https://x.com"}&&').markdown).toBe(
      "[https://x.com](https://x.com)",
    );
  });

  it("uses caption as Image alt text when alt is absent", () => {
    expect(migrateDocument('&&{Image}{"src": "/a.png", "caption": "C"}&&').markdown).toBe(
      "![C](/a.png)",
    );
  });

  it("uses label as Link text when text is absent", () => {
    expect(
      migrateDocument('&&{Link}{"href": "https://x.com", "label": "L"}&&').markdown,
    ).toBe("[L](https://x.com)");
  });

  it("reports Image and Link with no source at all", () => {
    expect(migrateDocument('&&{Image}{"alt": "A"}&&').issues[0]?.kind).toBe("unconvertible");
    expect(migrateDocument('&&{Link}{"text": "T"}&&').issues[0]?.kind).toBe("unconvertible");
  });

  it("reports a Timeline whose events are not an object", () => {
    expect(migrateDocument('&&{Timeline}{"events": "nope"}&&').issues[0]?.kind).toBe(
      "unconvertible",
    );
    expect(migrateDocument("&&{Timeline}{}&&").issues[0]?.kind).toBe("unconvertible");
  });

  it("handles a props block spanning several lines", () => {
    const source = '&&{BlogCard}{\n  "slug": "x"\n}&&';
    expect(migrateDocument(source).markdown).toBe('::blog-card{slug="x"}');
  });
});

describe("inline mark edge cases", () => {
  it("leaves a bare asterisk alone", () => {
    expect(migrateInlineMarks("2 * 3 = 6").markdown).toBe("2 * 3 = 6");
  });

  it("leaves a lone pipe alone", () => {
    expect(migrateInlineMarks("a | b").markdown).toBe("a | b");
  });

  it("promotes strong at the very start of a string", () => {
    expect(migrateInlineMarks("*lead* rest").markdown).toBe("**lead** rest");
  });

  it("handles several strong runs in one string", () => {
    expect(migrateInlineMarks("*a* and *b*").markdown).toBe("**a** and **b**");
  });

  it("leaves an empty string alone", () => {
    expect(migrateInlineMarks("").markdown).toBe("");
    expect(migrateInlineMarks("").changes).toEqual([]);
  });
});
