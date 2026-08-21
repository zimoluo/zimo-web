# D1 — Content model

Resolves F-25 – F-28. Location: `src/features/entries/model/`.

## 1. Sections

Four sections, one shape family.

| Section | Content | Storage | Document? |
| --- | --- | --- | --- |
| `blog` | Long-form articles | `blog/documents/<slug>.md` | yes |
| `album` | Photo sets | `album/entries/<slug>.json` | no |
| `projects` | Project write-ups | `projects/entries/<slug>.json` | yes (inline) |
| `management` | Policy and meta articles | `management/documents/<slug>.md` | yes |

`photos` → `album` throughout. The product has called this section "Album" in the UI for years
(`app/photos/page.tsx` metadata: `title: "Album - Zimo Web"`) while every path, type, and S3 key
says `photos`. One name.

## 2. Summary vs document

F-26's real cost is that `PostData` includes `content: string`, so every list query carries every
article body. `fetchAllEntries("blog/text", "markdown", [...])` fetches and gray-matter-parses
every article to build the index page.

```ts
/** What a list needs. Always cheap. */
export type EntrySummary = {
  readonly section: Section;
  readonly slug: Slug;
  readonly title: string;
  readonly description?: string;
  readonly publishedAt: string;          // ISO 8601 UTC
  readonly updatedAt?: string;           // ISO 8601 UTC
  readonly unlisted: boolean;            // no longer `(entry as any).unlisted`
  readonly tags: readonly string[];      // always present, possibly empty
  readonly authors: readonly AuthorRef[];// always present, possibly empty
  readonly cover?: ImageAsset;
};

/** A summary plus the body. Fetched for one entry at a time. */
export type Entry = EntrySummary & {
  readonly body: EntryBody;
  readonly images: readonly ImageAsset[];
  readonly extras: SectionExtras;        // discriminated on `section`
};

export type EntryBody =
  | { readonly kind: "document"; readonly document: DocumentNode }   // D2
  | { readonly kind: "none" };
```

`unlisted`, `tags`, and `authors` are **required with defaults** rather than optional. Optionality
was the source of `(entry as any).unlisted` in four files and of `post.tags ?? []` scattered at
call sites.

`SectionExtras` is a discriminated union, so `location` exists only on album entries and
`links` only on projects — today `ProjectsEntry.links: { [key: string]: string }` is untyped and
`PhotosEntry.location?` is optional on a type shared with nothing.

```ts
export type SectionExtras =
  | { readonly section: "blog" }
  | { readonly section: "management" }
  | { readonly section: "album"; readonly place?: Place; readonly instagramUrl?: string }
  | { readonly section: "projects"; readonly links: readonly ProjectLink[]; readonly icon: ImageAsset };

export type ProjectLink = { readonly label: string; readonly url: string; readonly kind: LinkKind };
export type LinkKind = "source" | "demo" | "download" | "article" | "store" | "other";
```

`ProjectsEntry.faviconFormat: string` — a *file extension* stored as content data, used to
build a URL at `lib/projects/helper.ts:3` — becomes an `ImageAsset` with a real `src`.

## 3. Images

F-25: `ImagesData` is three parallel arrays plus one shared aspect-ratio string.

```ts
interface ImagesData { url: string[]; text?: string[]; aspectRatio: string; original?: string[] }
```

Consequences in the current code: `imageViewerTextParser` (30 lines) exists solely to pad or
truncate `text` and `original` back into alignment with `url`; `aspectRatio` is parsed with
`.split(":").map(Number)` at eight sites; and because no per-image dimensions exist,
`next/image` receives `Math.min(2500, Math.round((2500 / widthRatio) * heightRatio))`
(`ImageViewer.tsx:693-700`) — a guess, for every image.

```ts
export type ImageAsset = {
  readonly src: string;
  /** Full-resolution original, when a downscaled `src` is served. */
  readonly originalSrc?: string;
  /** Intrinsic pixel dimensions. Required. */
  readonly width: number;
  readonly height: number;
  /** Accessible description. Empty string is a valid, deliberate "decorative". */
  readonly alt: string;
  /** Visible caption, inline-mark syntax (D2 §5). */
  readonly caption?: string;
  /** `object-position` for `cover` crops, 0–1. Default center. */
  readonly focus?: { readonly x: number; readonly y: number };
  /** Base64 LQIP, 8–12 px wide. */
  readonly placeholder?: string;
};
```

One array of complete objects. Alignment is structural. `next/image` gets real dimensions, which
fixes cumulative layout shift on the album and blog routes and makes `sizes` meaningful.

Migration (D6) fills `width`/`height` by `HEAD`-ing each asset and reading dimensions with
`sharp`; it fills `alt` from `text` where present and flags the rest for authoring, because a
generated alt string is worse than an acknowledged gap.

`focus` replaces the `forceGridViewCenter` prop and the `object-center` class applied
unconditionally today. `placeholder` enables `next/image`'s `blurDataURL`, which the site does
not currently use anywhere.

## 4. Authors

```ts
export type AuthorRef = { readonly id: AuthorId; readonly name: string; readonly avatar?: ImageAsset };
```

Today: `author: string` (display name), `authorId: string` (used to build an avatar URL at
`lib/blog/helper.ts:3-9`, with a hardcoded `authorId === "zimo"` branch), and separately
`authors: string[]` on projects. One shape, one resolver, and the `zimo` special case becomes a
row in an author registry (`features/entries/authors.ts`).

## 5. Comments and reactions

F-27: comments have no identity, so deletion targets an array index guarded by comparing
`author`/`content`/`date`, which fails under concurrency and produces "please refresh the page".

```ts
export type Comment = {
  readonly id: CommentId;              // UUID v7 — time-sortable, so ordering is free
  readonly authorSub: string;
  readonly body: string;               // inline-mark syntax
  readonly createdAt: string;          // ISO 8601 UTC
  readonly editedAt?: string;
  readonly likedBy: readonly string[];
  readonly replies: readonly Reply[];   // always present
};

export type Reply = {
  readonly id: ReplyId;
  readonly authorSub: string;
  readonly toId?: ReplyId;             // was `to: string` (a *name*), now an id
  readonly body: string;
  readonly createdAt: string;
  readonly editedAt?: string;
};

export type ReactionSet = { readonly likedBy: readonly string[] };
```

Three fixes:
- **`id`** makes every mutation address a stable target. The API becomes
  `DELETE …/comments/{commentId}` (D3 §2) and the optimiztic-match guard disappears.
- **`toId`** replaces `to: string`, which stored a *display name* and therefore broke when a user
  changed their name and could not distinguish two users with the same name.
- **`replies: readonly Reply[]`** always present, replacing `replies?: ReplyProps[]` and the
  `comment.replies || []` at every call site.

UUID v7 is chosen over v4 because it is lexicographically time-ordered: the comment list is
sorted by id, and a new comment appends. `uuid` v14 (already a dependency) provides `v7`.

## 6. Dates

F-28: three representations and two libraries.

- All timestamps are **ISO 8601 with explicit UTC offset**, e.g. `2026-08-20T14:32:00Z`.
- Field names end in `At`: `publishedAt`, `updatedAt`, `createdAt`, `editedAt`. `date` and
  `lastEditedDate` are renamed.
- One utility, `lib/datetime.ts`, built on `Intl`:
  ```ts
  export const formatAbsolute = (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
  export const formatRelative = (iso: string, now?: Date) => string;   // Intl.RelativeTimeFormat
  export const compareDesc = (a: string, b: string) => number;         // string compare; ISO sorts
  ```
- `dayjs` (+2 plugins) and `date-fns` are removed. `Timeline`'s `parse(dateStr, "yyyy-M-d")` is
  replaced by requiring ISO in the content; the migration normalizes the existing values.

`compareDesc` is a **string** comparison. ISO 8601 UTC strings sort lexicographically in
chronological order, so `awsEntryFetcher`'s `new Date(a) > new Date(b)` — which allocates two
`Date` objects per comparison across an O(n log n) sort — becomes a string compare.

## 7. Slugs

```ts
export type Slug = string & { readonly __brand: "Slug" };
export const parseSlug = (input: string): Slug | null;   // /^[a-z0-9]+(?:-[a-z0-9]+)*$/
```

Branded and validated at every boundary. Today a slug travels from a URL segment into an S3 key
via `getEntryBySlug`'s `slug.replace(/\.(md|json)$/, "")` (`awsEntryFetcher.ts:504`), which
strips an extension but does nothing about `../`. The path is then interpolated into a `Key`.
The directory allowlist limits the damage, but the correct fix is to validate the slug shape.

## 8. Sorting and indexing

Listing a section currently fetches and parses **every** entry
(`getAllEntries` → `getSlugs` → `Promise.all(getEntryBySlug)`), then sorts in memory. For blog
that is one S3 GET plus one gray-matter parse per article, on every ISR revalidation.

v11 maintains a per-section **index object**: `<section>/index.json`, an array of
`EntrySummary`, written by the same migration/authoring tooling that writes entries.

- Listing = one GET.
- Sorting = precomputed at write time.
- Search filtering (`SearchCardColumn`) operates on the index.
- Tag pages read the index, not every article.

The index is rebuilt by `tools/reindex.ts` after any content write and is verifiable
(`tools/reindex.ts --check` compares the index against a full listing and exits non-zero on
drift). This is the one place where denormalization is worth it: the listing is the hottest read
path on the site and it currently costs O(entries) S3 requests.

## 9. Acceptance

| # | Criterion |
| --- | --- |
| C1 | No `as any` and no `(x as any).unlisted` in `features/entries` |
| C2 | `ImageAsset` has real `width`/`height` for every migrated image; zero call sites parse `"w:h"` |
| C3 | Every `Comment` and `Reply` has a UUID v7 `id` after migration |
| C4 | `dayjs` and `date-fns` absent from `package.json` |
| C5 | `parseSlug` rejects `../`, `%2e%2e`, uppercase, and empty; property-tested |
| C6 | Listing `/blog` performs exactly 1 S3 GET |
| C7 | `tools/reindex.ts --check` passes against production content |
| C8 | `SectionExtras` makes `entry.extras.links` a type error for a blog entry (compile-fail fixture) |
| C9 | Album route CLS < 0.02 (was unmeasured; images had no intrinsic size) |
