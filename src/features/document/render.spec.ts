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
    expect(gallery).toContain('href="a.jpg"');

    expect(await render(":::timeline\n- one\n:::")).toContain("zw-timeline");

    const music = await render('::music-player{url="/a.mp3" title="Forecast" author="Kevin"}');
    expect(music).toContain("<audio");
    expect(music).toContain(">Forecast</h2>");
    expect(music).toContain(">Kevin</h3>");
    expect(music).toContain('aria-label="Play track"');
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
    expect(html).toContain('href="/blog/a-post"');
  });

  it("renders a usable article link on the client surface", async () => {
    const html = await render('::article-card{section="blog" slug="a-post"}', "client");
    expect(html).toContain("zw-article-card");
    expect(html).toContain('href="/blog/a-post"');
    expect(html).not.toContain("aria-busy");
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

  it("renders the interactive theme picker", async () => {
    expect(await render("::theme-picker")).toContain("zw-theme-picker");
  });

  it("renders a usable blog link on both surfaces", async () => {
    expect(await render('::blog-card{slug="x"}', "server")).toContain('href="/blog/x"');
    expect(await render('::blog-card{slug="x"}', "client")).toContain('href="/blog/x"');
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

describe("document media uses authored dimensions", () => {
  it("groups gallery assets into one native carousel and leaves them lazy", async () => {
    const { document } = await parseDocument(":::gallery\n![One](/one.jpg)\n\n![Two](/two.jpg)\n:::");
    const enrich = (node: import("hast").Root | import("hast").Element) => { for (const child of node.children) { if (child.type !== "element") continue; if (child.tagName === "img") Object.assign(child.properties, { width: 1200, height: 800 }); enrich(child); } };
    enrich(document);
    const html = renderToStaticMarkup(renderDocument({document}) as never);
    expect(html.match(/aria-roledescription="carousel"/g)).toHaveLength(1);
    expect(html.match(/loading="lazy"/g)).toHaveLength(2);
    expect(html).toContain('width="1200"');
    expect(html).not.toContain('fetchPriority="high"');
  });
  it("keeps undimensioned images visible as their authored source link", async () => {
    const html = await render("![Authored alt](/unmeasured.jpg)");
    expect(html).toContain('href="/unmeasured.jpg"');
    expect(html).toContain("Authored alt");
    expect(html).not.toContain("<img");
  });
});

describe("document image recovery preserves all authored content", () => {
  it("keeps an unmeasured gallery member alongside a measured image", async () => {
    const {document}=await parseDocument(":::gallery\n![Measured](/measured.jpg)\n\n![Unmeasured](/unmeasured.jpg)\n:::");
    const enrich=(node:import("hast").Root|import("hast").Element)=>{for(const child of node.children){if(child.type!=="element")continue;if(child.tagName==="img"&&child.properties.src==="/measured.jpg")Object.assign(child.properties,{width:640,height:480});enrich(child);}};
    enrich(document);
    const html=renderToStaticMarkup(renderDocument({document}) as never);
    expect(html).toContain('width="640"');
    expect(html).toContain('href="/unmeasured.jpg"');
    expect(html).toContain("Unmeasured");
  });
  it("does not invent dimensions for an invalid image or drop missing-source alt text", () => {
    const document:import("hast").Root={type:"root",children:[
      {type:"element",tagName:"img",properties:{src:"/broken.jpg",width:0,height:200,alt:""},children:[]},
      {type:"element",tagName:"img",properties:{alt:"A missing source"},children:[]},
    ]};
    const html=renderToStaticMarkup(renderDocument({document}) as never);
    expect(html).toContain('href="/broken.jpg"');
    expect(html).toContain("View image");
    expect(html).toContain("A missing source");
    expect(html).not.toContain("<img");
  });
  it("renders a measured Markdown image outside a paragraph to keep valid HTML", async () => {
    const {document}=await parseDocument("![Measured](/measured.jpg)");
    const paragraph=document.children.find(child=>child.type==="element"&&child.tagName==="p");
    if(paragraph?.type!=="element")throw new Error("Expected authored paragraph");
    const image=paragraph.children.find(child=>child.type==="element"&&child.tagName==="img");
    if(image?.type!=="element")throw new Error("Expected authored image");
    Object.assign(image.properties,{width:"640",height:"480"});
    const html=renderToStaticMarkup(renderDocument({document}) as never);
    expect(html).toContain('<div><figure');
    expect(html).not.toContain('<p><figure');
    expect(html).toContain('height="480"');
  });
});
