import { brotliCompressSync, constants } from "node:zlib";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { parseDocument } from "./parse";
import { buildRegistry, renderDocument } from "./render";
import { registry } from "./registry";

const render = async (markdown: string, surface: "server" | "client" = "server") => {
  const { document } = await parseDocument(markdown);
  return renderToStaticMarkup(renderDocument({ document, surface }) as never);
};

describe("D2 §3: one renderer for both surfaces", () => {
  it("renders headings, prose and emphasis", async () => {
    const html = await render("# Title\n\nSome **bold** prose.");
    expect(html).toContain("<h1");
    expect(html).toContain("Title");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("gives every heading its id, so the outline links resolve", async () => {
    const html = await render("## A section\n");
    expect(html).toContain('id="a-section"');
  });

  it("renders a glyph as an SVG with a real accessible name", async () => {
    const html = await render("A :glyph[cog] inline.");
    expect(html).toContain("<svg");
    expect(html).toContain('aria-label="cog"');
    expect(html).toContain('role="img"');
  });

  it("labels a camel-cased glyph name readably", async () => {
    const html = await render("A :glyph[arrowRight] inline.");
    expect(html).toContain('aria-label="arrow right"');
  });

  it("renders an unknown glyph visibly rather than silently dropping it", async () => {
    const html = await render("A :glyph[nonsense] inline.");
    expect(html).toContain("data-zw-unknown-glyph");
  });

  it("renders a legacy @@glyph@@ identically to the modern form", async () => {
    const legacy = await render("A @@cog@@ inline.");
    const modern = await render("A :glyph[cog] inline.");
    expect(legacy).toBe(modern);
  });

  it("renders kbd, callout, gallery, timeline and music-player", async () => {
    expect(await render("Press :kbd[⌘K].")).toContain("<kbd");

    const callout = await render(':::callout{tone="warning" title="Careful"}\nBody.\n:::');
    expect(callout).toContain("zw-callout");
    expect(callout).toContain('data-tone="warning"');
    expect(callout).toContain("Careful");

    const gallery = await render(':::gallery{columns="2" caption="Two"}\n![a](a.jpg)\n:::');
    expect(gallery).toContain("zw-gallery");
    expect(gallery).toContain("<figcaption>Two</figcaption>");
    expect(gallery).toContain("<img");

    expect(await render(":::timeline\n- one\n:::")).toContain("zw-timeline");

    const music = await render('::music-player{url="/a.mp3" title="Forecast" author="Kevin"}');
    expect(music).toContain("<audio");
    expect(music).toContain("Forecast — Kevin");
  });

  it("renders a code block with highlight token spans and no client highlighter", async () => {
    const html = await render("```js\nconst x = 1;\n```");
    expect(html).toContain("hljs");
    expect(html).toContain("<code");
  });

  it("renders math as MathML", async () => {
    const html = await render("$E = mc^2$");
    expect(html).toContain("<math");
  });

  it("drops raw HTML tags rather than injecting them", async () => {
    expect(await render("<script>alert(1)</script>")).toBe("");
    expect(await render("<b>bold</b>")).toBe("<p>bold</p>");

    const mixed = await render("before <b>x</b> after");
    expect(mixed).toContain("before");
    expect(mixed).toContain("after");
    expect(mixed).not.toContain("<b>");
    expect(mixed).not.toContain("&lt;b&gt;");
  });

  it("renders a table from GFM", async () => {
    const html = await render("| a | b |\n| - | - |\n| 1 | 2 |");
    expect(html).toContain("<table");
    expect(html).toContain("<td>1</td>");
  });
});

describe("D2 §4: environment decides which implementation renders", () => {
  it("renders a server-only directive on the server surface", async () => {
    const html = await render('::article-card{section="blog" slug="a-post"}', "server");
    expect(html).toContain("zw-article-card");
    expect(html).toContain('data-slug="a-post"');
  });

  it("renders a placeholder for the same directive on the client surface", async () => {
    const html = await render('::article-card{section="blog" slug="a-post"}', "client");
    expect(html).toContain("zw-server-placeholder");
    expect(html).toContain('data-directive="article-card"');
    expect(html).not.toContain('data-slug="a-post"');
  });

  it("renders an environment-any directive identically on both surfaces", async () => {
    const markdown = "Press :kbd[⌘K].";
    expect(await render(markdown, "server")).toBe(await render(markdown, "client"));
  });

  it("registers a component for every directive in the registry", () => {
    const components = buildRegistry("server");
    for (const spec of registry) {
      expect(components[`zw-${spec.directive}`], spec.directive).toBeDefined();
    }
  });
});

describe("D2-09: hast payload against markdown", () => {
  const brotli = (value: string): number =>
    brotliCompressSync(Buffer.from(value, "utf8"), {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).byteLength;

  const LEXICON =
    ("the quick brown fox jumps over a lazy dog while seventeen violet herons " +
      "consider whether gradient lightness ought to precede chroma in any " +
      "perceptual ordering worth defending publicly against measurement")
      .split(" ");

  const sentence = (seed: number, words: number): string => {
    let state = seed * 2654435761;
    const out: string[] = [];
    for (let index = 0; index < words; index += 1) {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      out.push(LEXICON[state % LEXICON.length] ?? "word");
    }
    return `${out.join(" ")}.`;
  };

  const article = (sections: number): string => {
    const body: string[] = ["# An article", ""];
    for (let index = 0; index < sections; index += 1) {
      body.push(`## ${sentence(index * 7, 4)}`, "");
      body.push(
        `${sentence(index, 28)} **${sentence(index + 91, 2)}** ${sentence(index + 3, 24)} ` +
          `[${sentence(index + 17, 2)}](https://example.com/${index}) ${sentence(index + 5, 20)}`,
        "",
      );
      if (index % 3 === 0) {
        body.push(':::callout{tone="note"}', sentence(index + 41, 18), ":::", "");
      }
      if (index % 4 === 0) {
        body.push("```ts", `const ${LEXICON[index % LEXICON.length]} = ${index};`, "```", "");
      }
    }
    return body.join("\n");
  };

  it("reports the ratio the transport decision turns on", async () => {
    const rows: string[] = [];
    let worstRatio = 0;

    for (const paragraphs of [5, 20, 60]) {
      const markdown = article(paragraphs);
      const { document } = await parseDocument(markdown);
      const hast = JSON.stringify(document);

      const markdownBr = brotli(markdown);
      const hastBr = brotli(hast);
      const ratio = hastBr / markdownBr;
      worstRatio = Math.max(worstRatio, ratio);

      rows.push(
        `  ${String(paragraphs).padStart(3)} sections  ` +
          `md ${String(markdown.length).padStart(6)}B / br ${String(markdownBr).padStart(5)}B   ` +
          `hast ${String(hast.length).padStart(7)}B / br ${String(hastBr).padStart(5)}B   ` +
          `ratio ${ratio.toFixed(2)}x`,
      );
    }

    console.log("D2-09 payload measurement (synthetic corpus):");
    for (const row of rows) console.log(row);
    console.log(
      `  worst brotli ratio ${worstRatio.toFixed(2)}x against D2 §1's 3x threshold.`,
    );
    console.log(
      "  INDICATIVE ONLY: this straddles the threshold, and the ratio is dominated by how",
    );
    console.log(
      "  repetitive the prose is -- an earlier corpus of repeated paragraphs read 15.5x.",
    );
    console.log(
      "  D2-09 needs the ten largest real articles to close. See X6 ADR-040.",
    );

    expect(worstRatio).toBeGreaterThan(2);
    expect(worstRatio).toBeLessThan(4);
  });
});

describe("optional attributes render without their values", () => {
  it("renders a callout with no title", async () => {
    const html = await render(":::callout\nBody.\n:::");
    expect(html).toContain("zw-callout");
    expect(html).not.toContain("zw-callout-title");
  });

  it("renders a gallery with no caption", async () => {
    const html = await render(":::gallery\n![a](a.jpg)\n:::");
    expect(html).toContain("zw-gallery");
    expect(html).not.toContain("<figcaption");
  });

  it("renders a music player with no author", async () => {
    const html = await render('::music-player{url="/a.mp3" title="Solo"}');
    expect(html).toContain("Solo");
    expect(html).not.toContain("—");
  });

  it("renders a glyph directive with no name at all", async () => {
    const html = await render("A :glyph[] inline.");
    expect(html).toContain("data-zw-unknown-glyph");
  });

  it("renders the theme picker placeholder", async () => {
    expect(await render("::theme-picker")).toContain("zw-theme-picker");
  });

  it("renders a blog card on the server and a placeholder on the client", async () => {
    expect(await render('::blog-card{slug="x"}', "server")).toContain("zw-blog-card");
    expect(await render('::blog-card{slug="x"}', "client")).toContain("zw-server-placeholder");
  });

  it("accepts a caller-supplied component map", async () => {
    const { document } = await parseDocument("Press :kbd[Z].");
    const html = renderToStaticMarkup(
      renderDocument({
        document,
        components: { "zw-kbd": (() => null) as never },
      }) as never,
    );
    expect(html).not.toContain("<kbd");
  });
});
