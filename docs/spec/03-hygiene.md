# 03 — Project hygiene

Seven things this codebase does not have that a v11 rebuild must not ship without. None of them
belong to a feature workstream, which is exactly why they were missing from the first draft of
this spec and are missing from the repository.

## 1. There are no tests

**Current state:** zero. No test runner, no test files, no `vitest.config`, no `jest.config`.
`X4-verification.md` specifies nine test layers and 100+ acceptance criteria across the spec, all
of which presume infrastructure that does not exist.

```
tools/                     — no test config
package.json scripts       — dev, build, start, lint, predev
```

**Required.** `H-01` in the ledger, and it blocks the acceptance criteria of every other task.

```
vitest.config.ts           projects: "node" (pure logic) and "jsdom" (components)
src/**/*.spec.ts           colocated
tools/**/*.spec.ts
test/setup.ts              @testing-library/jest-dom, jsdom polyfills
test/fixtures/             theme fixtures, document fixtures, S3 response fixtures
test/helpers/s3.ts         scratch-prefix helpers for integration tests
```

Scripts: `test`, `test:watch`, `test:coverage`, `typecheck`.

Additional packages: `vitest`, `@vitest/coverage-v8`, `jsdom`,
`@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `@playwright/test`,
`axe-core`/`@axe-core/playwright`, `expect-type`.

Coverage thresholds, enforced, on the modules where correctness is load-bearing rather than
repo-wide:

| Path | Statements | Branches |
| --- | --- | --- |
| `features/theme/color/**` | 100 % | 100 % |
| `features/theme/model/**`, `compile/**` | 95 % | 90 % |
| `features/windows/geometry/**` | 95 % | 95 % |
| `features/document/**` | 90 % | 85 % |
| `server/storage/**` | 90 % | 85 % |
| `tools/migrate/**` | 90 % | 85 % |
| everything else | no threshold | — |

Repo-wide coverage targets produce tests written to satisfy a number. These six paths are the
ones where a silent error is expensive and untraceable.

## 2. There is no CI

**Current state:** no `.github/`, no pipeline. `X4 §7` describes a pipeline that does not exist.

**Required.** `H-02`. GitHub Actions, three workflows:

- `ci.yml` — on every push and PR: install, `lint`, `typecheck`, `test`, `build`, bundle-size
  gate, axe-core. Caches `node_modules` and `.next/cache`.
- `visual.yml` — on PRs labeled `theme` or `style`, or touching `src/styles/**` or
  `features/theme/**`: the 1 062-screenshot regression (X4 §4.1). Manual-dispatchable.
- `perf.yml` — on PRs touching `features/{windows,media,notifications,theme}/**`: the nine
  scenarios against committed baselines.

Also required and currently absent: a check that `themes.generated.css` is byte-identical after
regeneration (T4 C6), and a check that `tools/reindex.ts --check` passes.

Secrets needed: AWS credentials scoped to a **test** prefix for integration tests. Do not run
integration tests against production content.

## 3. There are no route boundaries

**Current state:** zero `error.tsx`, `not-found.tsx`, `loading.tsx`, or `global-error.tsx` in the
entire `app/` tree.

Consequences today: a thrown error in a server component — a failed S3 fetch, a malformed entry,
an unknown slug — produces Next's default error page with no theme, no navigation, and no way
back. `fetchEntryBySlug` for a nonexistent slug throws from the AWS SDK, so a mistyped blog URL
is a hard 500 rather than a 404.

**Required.** `H-03`:

| File | Purpose |
| --- | --- |
| `app/global-error.tsx` | last resort; must not depend on the theme (it renders outside the layout) |
| `app/error.tsx` | themed error with a reset action and a link home |
| `app/not-found.tsx` | themed 404 |
| `app/loading.tsx` | route-level skeleton using `surface-widget` |
| `app/{blog,album,projects,management}/[slug]/not-found.tsx` | section-specific: "that entry does not exist", with a link to the section index |

Plus: entry loaders call `notFound()` for a missing slug instead of letting the SDK throw
(`server/entries/read.ts`), and `error.tsx` reports to the notification store rather than
swallowing.

`ErrorScreen.tsx` and `LoadingScreen.tsx` already exist for *window* content and are reused.

## 4. There is no sitemap

**Current state:** `app/robots.ts` and `app/manifest.ts` exist; `app/sitemap.ts` does not. The
site has ~100 indexable URLs across four sections plus tag pages, and no sitemap.

**Required.** `H-04`. `app/sitemap.ts` generated from the section indexes (D1 §8), excluding
`unlisted` entries, with `lastModified` from `updatedAt ?? publishedAt`. Tag pages included.
This is a one-file change with real SEO value, and the section index makes it nearly free.

While there: `robots.ts` currently has no `sitemap` field. Add it.

## 5. Seven routes have an empty `page.tsx`

**Current state:**

```
app/notebook/page.tsx              export default function NotebookPage() {}
app/photos/[slug]/page.tsx         export default function PhotosEntryPage() {}
app/projects/[slug]/page.tsx       export default function ProjectsPage() {}
app/blog/[slug]/page.tsx           export default function BlogEntry() {}
app/blog/tags/[tag]/page.tsx       export default function BlogTagEntry() {}
app/management/[slug]/page.tsx     export default function ManagementArticle() {}
app/design/theme-maker/page.tsx    export default function ThemeMakerPage() {}
```

Each returns `undefined`. The real content lives in the sibling `layout.tsx`, which fetches data,
generates metadata, and renders the page. `page.tsx` exists only because Next requires it to make
the segment routable.

Why it matters, beyond oddity: `layout.tsx` does not re-render on navigation between sibling
segments in the same layout, and it cannot use `loading.tsx` or streaming boundaries the way a
page can. Putting page content in a layout is what forces the `{children}` prop in
`app/blog/[slug]/layout.tsx` to be rendered *in the middle of the article* — the layout renders
the header, the document, then `{children}` (nothing), then the comments.

**Required.** `H-05`. Move content from `layout.tsx` to `page.tsx` for all seven. Where a layout
is genuinely needed (shared chrome across `[slug]` and a nested route), keep only the chrome.
This is mechanical and it unblocks `loading.tsx` per route (§3).

## 6. The notebook's rich-text model is unspecified

**Current state:** `NotebookData` carries a flat span model that no spec document covers:

```ts
interface NotebookPageStyleData {
  fromIndex: number;
  toIndex: number;
  style: "bold" | "italic" | "code" | "mark" | "link" | "email";
  additionalData?: string;
}
```

`lib/notebookUtil.ts` converts between marker syntax and index ranges. It is a reasonable flat
span model — closer to Portable Text than to the document format — and it is **deliberately not**
folded into D2's document pipeline: notebook content is a single editable plain-text buffer with
overlaid formatting, not a block document, and forcing it through remark would mean re-parsing
the whole buffer on every keystroke.

**Specified in `data/D7-notebook.md`.** `H-06` implements it. It covers:

- The span model, retained, with the style enum aligned to D2 §5's mark set (`bold`, `italic`,
  `code`, `mark`, `strike`, `link`) — `email` collapses into `link` with a `mailto:` target,
  which is what `additionalData` already holds.
- Index semantics: currently ambiguous whether `toIndex` is inclusive. Fix and document; the
  conversion functions in `notebookUtil.ts` disagree with each other at boundaries.
- Overlap rules: two spans of the same style overlapping is currently representable and its
  rendering is undefined. Normalize on write.
- UTF-16 vs code-point indices: `fromIndex` is a JS string index, so an emoji in a notebook page
  splits a span. Document that indices are UTF-16 code units and clamp span boundaries to
  grapheme boundaries on write.
- Storage: `workspaceStore.notebook`, persisted to `zw.workspace`, synced with account settings.
- Migration: `NotebookData[]` → the new shape, in `D6-04`.

### Rulings on the other widgets

So that no widget is left without a disposition:

| Widget | Ruling |
| --- | --- |
| **Sticky notes** | Trivial state (text + position). Shape lives in `workspaceStore` (D5 §2). No document needed. |
| **Calculator** | State is an expression string plus an `appearance` enum. `workspaceStore.calculator`. `lib/calculatorUtil.ts` and `lib/calculatorMathHelper.ts` are leaf modules under `02-conventions §1`'s `lib/` rule and move unchanged. No document needed. |
| **Signal generator** | Uses Web Audio. **No document needed, and no change beyond the mechanical ones**: it becomes `features/signal/`, its drag handling adopts `useDragGesture` (P1 §4), and its `AudioContext` must be created on a user gesture and closed on unmount — verify that it is, because an un-closed `AudioContext` per window open is a real leak. One line in `P2-02`'s PR. |
| **Christmas tree** | 14 components. Its data, API, storage keys, and migration are covered (D1, D3, D4, D6); its `viewedChristmasTreeMessages` setting moves to `workspaceStore`; its selector context is retained (D5 §7). **No component-level document**, because it is a seasonal feature whose implementation is not a problem anyone has reported. Moves to `features/christmas-tree/` in `FN-02`. |
| **Notebook** | The one that needs a document: it has a bespoke rich-text model. `data/D7-notebook.md`, H-06. |

## 7. Search exists four times and is global nowhere

**Current state:** `FilterSearchProvider` is instantiated in four places (`app/blog/page.tsx`,
`ArticleListLayout`, `EntryWindowFrame`, and transitively for management), each holding its own
`filterSearchContent` string, each paired with its own `SearchBar` and `SearchCardColumn`. There
is no cross-section search.

`SearchCardColumn` also implements a small query language — `#tag`, `:author`, comma-separated
terms — that is undocumented and available only inside those four boxes.

**Required.** `H-07`:

- One search module, `features/search/`, owning the query grammar (`#tag`, `:author`, free text,
  comma-separated AND) as a parsed structure rather than a string split at the point of use.
- It operates on `EntrySummary[]` from the section indexes (D1 §8), so it works for one section
  or all of them with the same code.
- The four in-page search boxes become thin views over it, keeping their current scoped
  behavior.
- The command palette (U2 §2.2) is the fifth consumer and the first global one.
- The grammar is documented in `features/search/README.md`, since it is user-facing and currently
  discoverable only by reading `SearchCardColumn.tsx`.

## 8. Ledger

These become tasks `H-01` … `H-07`, inserted into Phase 1 except where noted.

| ID | Task | Size | Phase | Blocks |
| --- | --- | --- | --- | --- |
| **H-01** | Vitest + Playwright + fixtures + coverage thresholds + scripts | L | 1 | every acceptance criterion |
| **H-02** | Three GitHub Actions workflows; scratch-prefix AWS secret | M | 1 | the gates in X4 §7 |
| **H-03** | Route boundaries: 4 global + 4 section `not-found`; `notFound()` in loaders | M | 4 | — |
| **H-04** | `app/sitemap.ts` from the section indexes; `sitemap` in `robots.ts` | S | 4 | needs D1-03 |
| **H-05** | Move page content out of the seven `layout.tsx` files into `page.tsx` | M | 1 | H-03 (`loading.tsx`) |
| **H-06** | Implement `data/D7-notebook.md`: span model, `normalizeSpans`, grapheme clamping, export/paste, migration | M | 4 | — |
| **H-07** | `features/search/` with a parsed grammar; four call sites ported | L | 4 | U2-02 |

`H-01` is the first task of Phase 1, ahead of the file moves. Writing tests after a refactor
verifies the refactor's output against itself.
