# D7 — Notebook document model

Owner: `H-06`. Location: `src/features/notebook/`.

The notebook is the one widget with a bespoke rich-text model, and it is deliberately **not**
folded into D2's document pipeline. Notebook content is a single editable plain-text buffer with
overlaid formatting, not a block document; pushing it through `remark` would mean re-parsing the
whole buffer on every keystroke to render a page that has no headings, lists, images, or
components.

The existing model is sound. This document fixes four defects in it and states the semantics that
`lib/notebookUtil.ts` currently only implies.

## 1. Shape

```ts
export type NotebookPage = {
  readonly id: PageId;                   // new: UUID v7 (see §6)
  readonly text: string;                 // the plain buffer; was `content`
  readonly spans: readonly Span[];       // was `contentStyles`
  readonly createdAt: string;            // ISO 8601 UTC; was `date`
  readonly updatedAt: string;            // ISO 8601 UTC; was `lastEditedDate`
};

export type Span = {
  /** UTF-16 code-unit offset into `text`. Inclusive. */
  readonly from: number;
  /** UTF-16 code-unit offset into `text`. **Exclusive.** See §2. */
  readonly to: number;
  readonly style: SpanStyle;
  /** Only for `link`: the href. */
  readonly href?: string;
};

export type SpanStyle = "bold" | "italic" | "code" | "mark" | "strike" | "link";
```

Four changes from `NotebookPageStyleData`:

| Before | After | Why |
| --- | --- | --- |
| `fromIndex` / `toIndex`, inclusive | `from` / `to`, **`to` exclusive** | §2 |
| `style: … \| "link" \| "email"` | `style: … \| "link"`, `"strike"` added | `email` was a link with a `mailto:` target, which is what `additionalData` already held. Two styles for one concept. `strike` aligns the enum with D2 §5's mark set. |
| `additionalData?: string` | `href?: string` | The field held exactly one thing. Name it. |
| *(none)* | `id` on the page | Pages are reorderable and syncable; `notebookIndex` addressing them positionally is the same defect as F-27. |

## 2. Index semantics — the actual bug

`lib/notebookUtil.ts` disagrees with itself about whether `toIndex` is inclusive.

`generateNotebookPageStyleData` writes:
```ts
toIndex: cleanedIndex + displayText.length - 1,   // inclusive
```

`applyNotebookPageStyleData` clamps with:
```ts
if (toIndex >= inputString.length) toIndex = inputString.length - 1;   // inclusive
```

but the surrounding token loop then applies the suffix *at* `toIndex`, so a span covering the final
character of the buffer round-trips correctly only because both sides are consistently off by one
in the same direction. Any code that computes a length as `to - from` — which is the natural thing
to write, and which `NotebookPage`'s consumers will write — is wrong by one.

**Ruling: `to` is exclusive.** `text.slice(from, to)` is the span's content, `to - from` is its
length, and an empty span is `from === to` (and is dropped on normalization). Both conversion
functions are rewritten to this convention, and `notebook.spec.ts` asserts a span covering the
whole buffer, a span covering the last character, and a single-character span.

## 3. Overlap and normalization

Two spans of the same style overlapping is currently representable, and its rendering is
undefined — `applyNotebookPageStyleData` pushes markers onto per-character prefix/suffix arrays,
so overlapping spans of one style emit duplicated markers that the parser then reads back as
different spans. It is a slow corruption: edit, save, reload, and the formatting has drifted.

`normalizeSpans(spans, textLength)` runs on **every write**, and is total:

1. Drop spans with `from >= to`, or `from < 0`, or `from >= textLength`.
2. Clamp `to` to `textLength`.
3. Drop `link` spans with no `href`.
4. Group by `style`; within a group, sort by `from` and **merge** overlapping or adjacent spans
   (`to >= next.from`). For `link`, merge only when `href` matches; otherwise truncate the earlier
   span at the later one's `from`, because two different links cannot occupy one character.
5. Sort the result by `(from, style)` so serialization is stable and diffs are meaningful.

Different styles may overlap freely — bold and italic over the same range is the point.

## 4. Grapheme boundaries

`from`/`to` are UTF-16 code-unit offsets, which is what JS string indexing gives and what the
`<textarea>` selection API reports, so that is the right storage unit. But a span boundary
*inside* a surrogate pair or a combining sequence splits a glyph: bolding half of an emoji renders
as a replacement character.

`normalizeSpans` therefore snaps each boundary outward to the nearest grapheme boundary, using
`Intl.Segmenter("und", { granularity: "grapheme" })` — no dependency, available everywhere in the
v11 browser floor. Outward, not nearest, so a span never shrinks to nothing.

## 5. Serialized form

The buffer and its spans are stored **separately**. The current design round-trips through a
marker syntax (`*italic*`, `_bold_`, `` `code` ``, `|mark|`, `~~{text}{url}~~`, `@@{text}{email}@@`)
on every save and load, via `generateNotebookPageStyleData` / `applyNotebookPageStyleData` and an
escaping pass over six special characters. That is lossy in exactly the way §3 describes, and it
inherits the inverted `*`/`_` of F-24.

v11 stores `{ text, spans }` directly. No markers, no escaping, no parse on load.

The marker syntax survives in exactly two places, both explicit user actions:
- **Export** — `spansToMarkdown(page)` emits real Markdown (`**bold**`, `*italic*`, `==mark==`,
  `[text](href)`), matching D2 §5. Used by `ExportNotebookButton`.
- **Paste** — `markdownToSpans(text)` parses pasted Markdown into spans, so pasting from the blog
  keeps its formatting.

Both are pure, both are tested against each other, and neither runs on save.

## 6. Storage

`workspaceStore.notebook: { pages: NotebookPage[]; activeId: PageId | null }`, persisted to
`zw.workspace` (D5 §2) and synced with account settings. Replaces `settings.notebookData` and
`settings.notebookIndex`.

`activeId` rather than an index, for the same reason spans carry ids: deleting page 2 must not
silently change which page is open.

Writes are throttled at 500 ms (D5 §4) — the notebook is a text editor, and a keystroke must not
reach `localStorage`.

## 7. Migration

`D6-04`, `users` step, per page:

```
content            → text
contentStyles      → spans, with:
                       toIndex + 1                        → to           (inclusive → exclusive)
                       style "email"                      → "link"
                       additionalData (for email)         → `mailto:${additionalData}`
                       additionalData (for link)          → href
                     then normalizeSpans()
date               → createdAt   (ISO 8601 UTC)
lastEditedDate     → updatedAt   (ISO 8601 UTC)
(new)              → id: uuid v7 seeded from createdAt, so page order is preserved
```

The inclusive→exclusive conversion is the step that must not be forgotten; a migration that omits
it silently truncates the last character of every span. `--verify` asserts, for every page, that
`spansToMarkdown(migrated)` equals `applyNotebookPageStyleData(old.content, old.contentStyles)`
after normalizing both to the same marker vocabulary.

## 8. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `to` is exclusive throughout; `text.slice(from, to)` is the span content; asserted for whole-buffer, last-character, and single-character spans |
| C2 | `normalizeSpans` is idempotent and total: property-tested over random spans and buffers, never throws, never returns an invalid span |
| C3 | Two overlapping same-style spans merge; two overlapping `link` spans with different `href` truncate rather than merge |
| C4 | A span boundary inside a surrogate pair or combining sequence snaps outward; bolding half an emoji is not representable after normalization |
| C5 | Saving performs no marker round-trip: `{ text, spans }` is stored verbatim |
| C6 | `spansToMarkdown` ∘ `markdownToSpans` is identity on the supported mark set |
| C7 | Exported Markdown uses D2 §5's vocabulary (`**bold**`, `==mark==`), not the legacy inverted one |
| C8 | Typing for 5 s performs ≤ 10 `zw.workspace` writes |
| C9 | Deleting a page leaves the previously active page active, unless it was the one deleted |
| C10 | Migration `--verify` passes for every existing notebook page |
