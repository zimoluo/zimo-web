# D2 — Document format

Resolves F-19 – F-24. Location: `src/features/document/`.

The brief: *"we authored a method to inject custom react components into md, but it's the worse
thing ever. Very custom parsing. Not durable at all… Either make it json-ized (conceptually a
block is either md or react, but also need to take care of the inline glyphs syntax too), or use
the mdx thing (not sure if it fits here at all, since that one is usually compiled time as an
alternative to jsx)."*

The instinct about MDX is correct. Neither of the two named options is the best answer; the
decision below takes the good half of each.

## 1. Decision

**Author in Markdown. Extend it with `remark-directive` — a specified, maintained generic
directive syntax. Parse once on the server with `unified`. Transport the resulting `hast` tree as
JSON. Render it to React elements on either side with `hast-util-to-jsx-runtime`.**

```
  .md in S3
      │  unified: remark-parse → remark-gfm → remark-math → remark-directive
      │          → remarkComponents (directives → hast element nodes)
      │          → remark-rehype → rehype-katex → rehype-highlight
      ▼
  hast (JSON-serializable)                        ← this is what gets cached and transported
      │
      ├── RSC path:    toJsxRuntime(hast, { components })   in a server component
      └── client path: same call, same registry, in the window reader
```

### Why not MDX

MDX compiles Markdown+JSX to a JavaScript module. That is the right tool when content is in the
repository and compiled by the bundler. Here content lives in S3, is fetched at revalidation
time, and is *also* fetched by the browser for the window readers. That forces one of:

- ship the MDX compiler to the client (~200 KB+ parsed), or
- add a server round-trip per document that returns a compiled RSC payload, or
- give up client-side document rendering — which would delete the window system's blog reader,
  a first-class product feature.

MDX also means content can contain arbitrary JavaScript, which makes mechanical migration and
validation impossible: you cannot statically rewrite or lint a document whose meaning depends on
executing it. For a single-author site the security dimension is moot, but the *migratability*
dimension is not, and this spec has to migrate five years of content.

### Why not a JSON block array

`{ blocks: [{ kind: "markdown", value }, { kind: "component", name, props }] }` solves durability
and validation. It costs the authoring experience: writing an article means editing JSON with
Markdown inside string literals, escaped. It also does not solve the inline case at all — an
inline glyph or a `:kbd[⌘K]` inside a paragraph cannot be a block.

### Why directives

`remark-directive` implements a proposed generic extension to Markdown with three forms, all
CommonMark-compatible in the sense that they degrade to visible text rather than corrupting the
parse:

```markdown
:::gallery{ratio="4:3"}                     container directive (has children)
![Sunrise](sunrise.jpg)
![Dusk](dusk.jpg)
:::

::music-player{url="/audio/x.mp3" title="Local Forecast" author="Kevin MacLeod"}

Press :kbd[⌘K] to open the palette.        text directive (inline)
```

Properties that matter here:
- **Specified and maintained.** Part of the unified/remark ecosystem, authored by the same people
  as MDX. Not a regex in this repository.
- **Attributes are parsed, not `JSON.parse`d.** `{key="value" #id .class}` syntax with proper
  quoting and escaping. F-19's constraints — no `}` in props, no multi-line props, no escaping —
  all vanish.
- **Nesting works.** A container directive has real children, so a gallery can contain images and
  a callout can contain paragraphs. The current format cannot express this at all.
- **Content stays `.md`.** S3 keeps Markdown. Migration is a *syntax* rewrite, not a format
  change, which makes it reversible and reviewable as a text diff.
- **Inline components become possible**, which is what the existing `@@keyword@@` glyph hack was
  reaching for.

### Why hast on the wire

The window readers currently fetch raw Markdown and run the full parser in the browser. Under
`unified` that would mean shipping remark + rehype + katex + highlight.js — worse than today.
Transporting `hast` instead means:

- **One parse, on the server**, cached by Next's data cache alongside the entry.
- **The client ships `hast-util-to-jsx-runtime` and the component registry.** Budget **20–25 KB
  min** for it, not 5: its dependency closure pulls `property-information` (a sizeable data
  table), `style-to-object`, `space-separated-tokens`, and `comma-separated-tokens`. Still an
  order of magnitude under a parser. Measured by V-9. No parser,
  no highlighter, no KaTeX. `highlight.js` (currently imported into a client component at
  `ReadingContentProcessor.tsx:2` along with a full CSS theme) leaves the client bundle entirely.
- **The RSC path and the client path share one renderer and one registry.** F-23's three
  registries become one.
- **TOC, reading time, and plain-text extraction are tree walks**, not regexes over the source
  (F-22).

#### The payload trade-off, and how it is decided

`hast` JSON is larger than the Markdown it came from — plausibly 4–6× raw. It also compresses
far better, because the key names repeat. The relevant comparison is therefore *brotli hast* vs
*brotli markdown + one-time parser download*, and the answer depends on the actual documents.

`D2-09` measures it: for the ten largest existing articles, report raw and brotli sizes of the
markdown and of the hast.

- If brotli hast ≤ 3× brotli markdown, ship hast. The parser is ~200 KB and would have to be
  amortized over many articles in one session to break even, which the window reader's usage
  pattern does not guarantee.
- If it exceeds 3×, ship markdown to the client for the *window reader path only* and lazily
  load the parser there, keeping hast for the RSC path. The registry and renderer are already
  shared, so this is a per-surface transport choice and not a second architecture.

Decide with the measurement. Do not assume either way.

## 2. Pipeline

`features/document/parse.ts`, server-only.

```ts
import "server-only";

export type DocumentNode = HastRoot;      // structurally JSON-safe

export type ParsedDocument = {
  readonly document: DocumentNode;
  readonly outline: readonly OutlineSection[];   // for the TOC
  readonly plainText: string;                    // for meta descriptions, search, reading time
  readonly readingMinutes: number;
  readonly issues: readonly DocumentIssue[];     // unknown directives, bad attrs — never thrown
};

export function parseDocument(markdown: string, opts: {
  /** Suffix for heading ids, so two readers of the same article do not collide. */
  readonly idNamespace?: string;
}): Promise<ParsedDocument>;
```

Plugin order, fixed:

| # | Plugin | Purpose |
| --- | --- | --- |
| 1 | `remark-parse` | Markdown → mdast |
| 2 | `remark-gfm` | tables, strikethrough, task lists, autolinks |
| 3 | `remark-math` | `$…$`, `$$…$$` |
| 4 | `remark-directive` | `:::`, `::`, `:` forms → directive nodes |
| 5 | `remarkComponents` *(ours)* | directive → `hast` element with `data.component` + validated props |
| 6 | `remarkGlyphs` *(ours)* | inline glyph tokens → glyph nodes (§4.1) |
| 7 | `remarkHeadingIds` *(ours)* | deterministic, namespaced, collision-counted ids |
| 8 | `remarkOutline` *(ours)* | collects `outline` |
| 9 | `remark-rehype` | mdast → hast, `allowDangerousHtml: false` |
| 10 | `rehype-katex` | math → MathML + annotation |
| 11 | `rehype-highlight` | fenced code → token spans |
| 12 | `rehypeClasses` *(ours)* | attaches the reading typography classes |

Two structural improvements over the current pipeline fall out of the ordering:

- **No `dangerouslySetInnerHTML`, anywhere.** `allowDangerousHtml: false` means raw HTML in a
  document becomes text. Today each block is injected as HTML (F-20).
- **No global mutation.** `unified()` returns an isolated processor. F-21's four functions that
  mutate `marked`'s module-global renderer and never restore it are replaced by one processor
  built once and used concurrently — `unified` processors are reusable and stateless per run.

`rehype-katex` emits MathML. The current setup renders KaTeX HTML and then hides the HTML
version with `.katex-html { @apply sr-only; }` in `globals.css` — i.e. it ships both
representations and hides one. MathML is smaller, is Baseline (Chromium 109+, Safari 14.1+,
Firefox always), and is what screen readers actually want.

## 3. Rendering

`features/document/render.tsx`.

```tsx
export function DocumentView({ document, registry = defaultRegistry }: {
  readonly document: DocumentNode;
  readonly registry?: ComponentRegistry;
}) {
  return toJsxRuntime(document, { Fragment, jsx, jsxs, components: registry.map });
}
```

One component, used by the blog route (server), the management route (server), and both window
readers (client). `parseCustomMarkdown`, `serverOnlyMarkdownComponentsMap`, and
`clientWindowMarkdownComponentsMap` are all deleted.

## 4. The component registry

```ts
export type ComponentSpec<P> = {
  readonly directive: string;                    // e.g. "music-player"
  readonly form: "leaf" | "container" | "text";
  readonly schema: z.ZodType<P>;
  /** Where it may render. A `server`-only component in a client document renders a placeholder. */
  readonly environment: "any" | "server";
  readonly Component: React.ComponentType<P>;
};

export const registry = [gallery, musicPlayer, articleCard, timeline, kbd, glyph, callout, …]
  satisfies readonly ComponentSpec<never>[];
```

`schema` does real work: an author's typo in an attribute becomes a `DocumentIssue` with a line
number, surfaced in the build log and (in development) inline in the rendered document. Today a
`JSON.parse` failure renders the literal string `Error rendering component X`
(`markdownParser.tsx:81-85`).

**Environment** replaces the three-registry split. `article-card` needs a server fetch, so it is
`environment: "server"` and its client counterpart is a fetching client component registered
under the same directive with `environment: "any"` — resolved by the registry at render time
based on which surface is rendering. One directive name, one document, two implementations,
chosen by the renderer rather than by the author choosing between `ArticleCard` and
`ArticleCardFetcher` as they must today.

Directives currently in use, mapped:

| Today | v11 directive | Form |
| --- | --- | --- |
| `&&{ImageViewer}{...}&&` | `:::gallery` | container (children are images) |
| `&&{ArticleCard}{...}&&` / `ArticleCardFetcher` | `::article-card` | leaf |
| `&&{BlogCard}{...}&&` / `BlogCardFetcher` | `::blog-card` | leaf |
| `&&{Timeline}{...}&&` | `:::timeline` | container (children are list items) |
| `&&{MusicPlayerCard}{...}&&` | `::music-player` | leaf |
| `&&{SettingsThemePicker}{}&&` | `::theme-picker` | leaf |
| `&&{Image}{...}&&`, `&&{Link}{...}&&` | *(removed)* | plain Markdown `![]()` / `[]()` |
| `themeAccent`, `themeGradient`, `themeProfile`, `themeFavicon`, `themeMisc`, `themeSidebar` | *(removed)* | the Studio is a route, not a document (T8 §6) |
| `@@cog@@` etc. (21 glyphs) | `:glyph[cog]` | text |

Removing the six theme-editor directives is what stops the document pipeline from importing the
theme editor (F-23) — which today means importing the markdown parser pulls in
`AccentColorEditor`, `GradientEditor`, and four more.

### 4.1 Glyphs

21 inline SVGs live as raw strings in `lib/markdownInlineAssets.ts` (a 40 KB module of template
literals) and are substituted into the HTML by a `renderer.text` override
(`markdownParser.tsx:110-128`) that also synthesizes alt text by regex-splitting camelCase.

v11: `:glyph[cog]` resolves through the icon registry that the rest of the app already uses,
rendering a real React component with a real `aria-label`. `inlineAssetKeywordMap` and
`inlineAssetSpecialAltMap` are deleted; the 21 SVGs become components under
`ui/icons/` alongside the existing 130.

Backwards compatibility during migration: `remarkGlyphs` also accepts `@@keyword@@`.

`@@…@@` is **not** directive syntax, so this needs a real mechanism, and the choice matters:

- **A micromark syntax extension** (`micromarkExtensionGlyph`) registered on `remark-parse` via
  `data("micromarkExtensions")`. Correct: it participates in tokenization, so it will not fire
  inside fenced code, inline code, autolinks, or attribute values, and every match carries a
  `position` for the `DocumentIssue`'s line number.
- **An mdast text-node splitter** run as a transformer. Half the code, and wrong in exactly the
  ways that matter: `@@cog@@` inside a code span would be rewritten, and positions on synthesized
  nodes are approximate.

**Use the micromark extension.** The splitter is the tempting shortcut and it is the same class
of mistake as the current `renderer.text` override it replaces
(`markdownParser.tsx:110-128`, which rewrites glyph tokens *after* Markdown has already decided
what is code). This is a discrete sub-task of `D2-01` and is not optional, because the deprecation
path is what lets content migrate incrementally rather than in one commit.

Severity `deprecated` issues do not fail a build; they are counted in the build log so the
remaining surface is visible.

## 5. Inline marks

F-24: a second, separate grammar, used for short single-line strings in JSON fields — entry
descriptions, image captions, toast bodies, timeline text, comment bodies. It is not a document
and should not be a document. But it should be *Markdown-compatible*, which today it is not:

| Today | Means | Markdown means |
| --- | --- | --- |
| `*x*` | **strong** | *emphasiz* |
| `_x_` | *emphasiz* | *emphasiz* |
| `` `x` `` | code | code |
| `\|x\|` | mark | — |
| `~~{text}{url}~~` | link | strikethrough |
| `@@{text}{email}@@` | mailto | — |

v11 uses **actual Markdown inline syntax**, parsed by `micromark` in inline mode with a minimal
extension set:

| v11 | Means |
| --- | --- |
| `*x*` or `_x_` | emphasiz |
| `**x**` | strong |
| `` `x` `` | code |
| `==x==` | mark |
| `[text](url)` | link |
| `[text](mailto:a@b.c)` | mailto |
| `~~x~~` | strikethrough |

```ts
// features/document/marks.ts
export function renderMarks(input: string): ReactNode;      // for display
export function stripMarks(input: string): string;          // for <meta>, search, aria-label
```

`stripMarks` replaces `restoreDisplayText`'s six regexes (`lightMarkUpProcessor.tsx:118-133`),
which cannot handle escapes or nesting and are currently used to build `<meta name="description">`
— so a description containing `*` produces broken output today.

This is a **breaking content change**: `*bold*` becomes `**bold**` and `|mark|` becomes
`==mark==`. The migration (D6) rewrites it mechanically. It is worth the migration because the
inverted `*`/`_` is a five-year-old trap that will keep costing authoring mistakes, and because
`stripMarks` correctness matters for SEO output.

## 6. TOC, reading time, plain text

All three become tree walks over the parsed document, computed once during `parseDocument`.

| Today | v11 |
| --- | --- |
| `generateTOCSectionData` — parses the document a 3rd time with a mutated global renderer, after stripping components with a greedy regex | `remarkOutline` collects headings during the single parse |
| `needTOC` — parses twice (`findTopLevelHeader` + itself), counts headings in a 3-element array indexed by level | `outline.length` and depth, computed |
| `readingTime` — regexes out components and glyphs, then `split(/\b\S+\b/)` (which splits *on* words, so it counts separators) | word count from `plainText` |
| `restoreDisplayText` — six regexes | `stripMarks` |

`readingTime`'s word count is currently wrong: `"a b c".split(/\b\S+\b/)` yields
`["", " ", " ", ""]`, so `.filter(Boolean).length` counts *gaps*, not words. It happens to be
close for prose. `plainText.trim().split(/\s+/).length` is correct.

Heading ids: deterministic slug + collision counter + optional namespace, which is what
`getUniqueId` does today and is worth keeping. The namespace exists because two window readers
showing the same article would otherwise emit duplicate ids — a real bug the current code
already guards against by threading `uniqueId` through from `useWindowAction()`.

## 7. Caching

`parseDocument` output is cached with the entry:

```ts
export const getDocument = async (section: Section, slug: Slug) => {
  "use cache";
  cacheTag(`entry:${section}:${slug}`);
  cacheLife("weeks");
  const markdown = await readDocument(section, slug);
  return parseDocument(markdown, {});
};
```

`hast` is JSON-safe, so it caches cleanly. Invalidation is `revalidateTag("entry:blog:x")` on
write, replacing the current `revalidate = 24` / `revalidate = 25` numeric guesses (F-34).

The client path (`GET /api/v1/entries/{section}/{slug}` with `Accept: application/json`) returns
the same cached `hast`, so a window reader and the server route serve byte-identical trees.

## 8. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `dangerouslySetInnerHTML` appears 0 times in `src/` |
| C2 | `marked`, `marked-katex-extension`, `html-escaper` absent from `package.json` |
| C3 | `highlight.js` absent from every client bundle (bundle analyzer) |
| C4 | Golden test: all existing blog + management documents, migrated, render to output that differs from the current build only by known-and-listed changes (gate S10) |
| C5 | Every registry directive validates its own example; an invalid attribute yields a `DocumentIssue` with a line number, never a thrown error and never `Error rendering component` |
| C6 | Container directives nest ≥ 3 deep correctly |
| C7 | `parseDocument` is called at most once per document per revalidation (instrument + assert) |
| C8 | Two window readers of the same article produce disjoint heading id sets |
| C9 | `stripMarks` round-trips: `stripMarks(renderMarksToText(s)) === stripMarks(s)` over a property-test corpus including escapes and nesting |
| C10 | `readingMinutes` for a 1 000-word fixture equals `ceil(1000/238) = 5` |
| C11 | Math renders as MathML; `.katex-html` rule removed from `globals.css` |
| C12 | A document containing `@@cog@@` still renders, and emits exactly one `deprecated` issue |
