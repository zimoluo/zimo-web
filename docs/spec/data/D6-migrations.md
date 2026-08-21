# D6 — Migrations

The brief asks for *"a schema migration script that I can execute either locally or on AWS to
migrate my existing ones."* Location: `tools/migrate/`.

## 1. Shared harness

One CLI, one set of guarantees, several steps.

```
npx tsx tools/migrate/cli.ts <step> [options]

Steps
  documents        blog + management: &&{}{}&& → directives, inline marks → Markdown
  entries          album + projects: ImagesData → ImageAsset[], dates, ids, field renames
  comments         add UUID v7 ids, replies[].toId, ISO dates, key rename
  reactions        likedBy/ → reactions/
  users            settings v1 → v3
  keys             S3 prefix renames (photos/ → album/, about/text/ → management/documents/)
  index            build <section>/index.json
  themes           see T9 (source tree, not S3)
  all              every S3 step in dependency order

Options
  --dry-run              default TRUE. Nothing is written unless --commit is passed.
  --commit               perform writes
  --only <slug|glob>     restrict scope
  --limit <n>            process at most n objects
  --backup <dir>         write originals before mutating; default backup/<ISO>/
  --report <file>        JSON report; default out/migrate-<step>-<ISO>.json
  --concurrency <n>      default 8
  --profile <local|aws>  credential source
```

Guarantees, enforced by the harness rather than by each step:

- **Dry-run by default.** `--commit` is required to write. A step function receives a
  `Writer` that no-ops under dry-run and records what it *would* have done.
- **Idempotent.** Every step detects already-migrated input and skips it. Documents carry
  `formatVersion: 2` in front-matter; JSON entries carry `"schema": 2`; comment threads carry
  `"schema": 2`. Running `all` twice is a no-op and the report says so.
- **Backed up.** Before the first write to an object, the original is copied to
  `backup/<ISO>/<key>`. If bucket versioning is enabled, record version ids instead (D4 §5).
- **Reported.** Machine-readable JSON: per object, `{ key, action, before, after, issues }`, plus
  a summary. Diffable between dry-run and commit.
- **Resumable.** The report doubles as a checkpoint; `--resume <report>` skips objects already
  marked done.
- **Verifiable.** Every step ships a `--verify` mode that reads the migrated state and asserts the
  post-conditions without writing.

Runs locally against production S3, or on AWS — the only difference is `--profile`, which selects
env-var credentials or the ambient instance role. There is no AWS-specific code path.

## 2. `documents`

Transforms blog and management `.md` bodies.

| From | To |
| --- | --- |
| `&&{ImageViewer}{"url": […], "aspectRatio": "4:3", "text": […]}&&` | `:::gallery` block with one `![alt](src)` per image |
| `&&{ArticleCardFetcher}{"section":"blog","slug":"x"}&&` | `::article-card{section="blog" slug="x"}` |
| `&&{BlogCardFetcher}{"slug":"x"}&&` | `::blog-card{slug="x"}` |
| `&&{Timeline}{"events":{…}}&&` | `:::timeline` block with a definition list |
| `&&{MusicPlayerCard}{…}&&` | `::music-player{url="…" title="…" author="…" coverUrl="…"}` |
| `&&{SettingsThemePicker}{}&&` | `::theme-picker` |
| `&&{Image}{"src":…}&&`, `&&{Link}{…}&&` | plain `![]()` / `[]()` |
| `&&{themeAccent}{}&&` etc. (6 kinds) | **removed** — flagged for manual review (T8 §6) |
| `@@cog@@` | `:glyph[cog]` |
| `*x*` | `**x**` |
| `_x_` | `*x*` |
| `\|x\|` | `==x==` |
| `~~{text}{url}~~` | `[text](url)` |
| `@@{text}{email}@@` | `[text](mailto:email)` |
| front-matter `date`, `lastEditedDate` | `publishedAt`, `updatedAt`, ISO 8601 UTC |

Method:
1. **Split on the component pattern with the existing regex** — deliberately the same one, so the
   segmentation is identical to what the current renderer sees. Anything the old parser treated as
   a component, the migration treats as a component.
2. `JSON.parse("{" + props + "}")`. A parse failure is a hard **issue**, not a fallback: the
   document is skipped and reported, because such a document renders as
   `Error rendering component X` today and needs a human.
3. Validate props against the target directive's Zod schema. A mismatch is an issue with the
   field name.
4. Emit directive syntax with proper attribute quoting.
5. Rewrite inline marks in the prose segments **only** — not inside fenced code, not inside inline
   code, not inside directive attributes. This requires a real inline walk, not a global
   `String.replace`. Implement by parsing each prose segment with `micromark` in inline mode and
   rewriting on the token stream.
6. Set `formatVersion: 2` in front-matter.

**Verification (`--verify`, and gate S10):** for every document, render the *pre*-migration source
through the current pipeline and the *post*-migration source through the new pipeline, normalize
both to a canonical HTML string (sorted attributes, collapsed whitespace, ids stripped), and diff.
A non-empty diff is either a known-and-listed intentional change (the mark-syntax corrections
produce different `<strong>`/`<em>` nesting where the old parser was wrong) or a bug. The list of
intentional changes lives in `tools/migrate/documents/expected-diffs.ts` and each entry names the
finding that justifies it.

Step 5 is where the risk is. Mitigation: `--only` allows one document at a time, and the report
includes a unified diff of the source per document, so the author can review five years of content
incrementally rather than as one 200-file commit.

## 3. `entries`

Album and projects JSON.

- `images: ImagesData` → `images: ImageAsset[]`:
  - `url[i]` → `src`, `original[i]` → `originalSrc`, `text[i]` → `caption`.
  - `alt`: set from `text[i]` if present, else **empty string plus an issue**. A generated alt is
    worse than an acknowledged gap; the report lists every image needing one.
  - `width`/`height`: `HEAD` each object, then read dimensions with `sharp` from a ranged `GET` of
    the first 64 KB (enough for JPEG/PNG/WebP headers). Falls back to a full `GET` if that fails.
  - `placeholder`: generate an 10 px-wide WebP base64 LQIP with `sharp`.
  - The shared `aspectRatio` string is dropped; a mismatch between it and the measured dimensions
    of the first image is reported (it will exist — it was one value for a whole set).
- `date` → `publishedAt` (ISO UTC), `lastEditedDate` → `updatedAt`.
- `author` + `authorId` → `authors: [{ id, name }]`; `authors: string[]` on projects → the same.
- `location` → `extras.place`; `instagramLink` → `extras.instagramUrl`.
- `links: { [label]: url }` → `extras.links: ProjectLink[]`, with `kind` inferred from the URL host
  (`github.com` → `source`, `apps.apple.com` → `store`, …) and `other` otherwise.
- `faviconFormat` → `extras.icon: ImageAsset`, dimensions measured.
- `unlisted` defaulted to `false`; `tags` to `[]`.
- `"schema": 2`.

Image measurement is the slow part: ~1 200 assets across the album. `--concurrency 8` and the
resumable report make this a background job rather than one long transaction.

## 4. `keys`

Prefix renames, as `CopyObject` + `DeleteObject` pairs:

```
photos/entries/        → album/entries/
photos/comments/       → album/comments/
photos/likedBy/        → album/reactions/
blog/text/             → blog/documents/
blog/likedBy/          → blog/reactions/
projects/likedBy/      → projects/reactions/
about/text/            → management/documents/
about/comments/        → management/comments/
about/homepage/        → home/
```

Old prefixes are **retained** for one release: the copy happens, the delete is deferred behind
`--delete-old`, and `server/storage/object.ts` falls back to the legacy key on a 404 for that
release. This matters because the RSS feed and search engines have indexed URLs, and because a
rollback must not require restoring data.

`blog/posts/<slug>/<image>` and `blog/author/<id>` are asset prefixes referenced by content and
are **not** renamed; renaming them would invalidate every cover-image URL in every document. They
stay, and `keys.ts` reflects that. Consistency is not worth breaking live URLs.

## 5. `users`

`SettingsState` v1 → `Settings` v3 (D5 §3). Runs against `account/users/*.json`.

The same function, `migrateSettings`, is used by:
- this CLI, for account-synced settings;
- `zustand/persist`'s `migrate`, for `localStorage` on each visitor's machine.

It must therefore be pure, dependency-light, and importable from both — `features/settings/migrate.ts`,
no `server-only`, no S3.

Table-driven, one row per legacy field, so the mapping is reviewable:

```ts
const map: readonly FieldMigration[] = [
  { from: "disableSerifFont",       to: "reading.serif",              transform: not },
  { from: "disableTableOfContents", to: "reading.tableOfContents",    transform: not },
  { from: "backgroundRichness",     to: "motion.backdrop",            transform: richnessToBackdrop },
  { from: "disableGestures",        to: "motion.gestures",            transform: not },
  { from: "notificationStyle",      to: "notifications.style",        transform: styleToStyle },
  // …
  { from: "customThemeData",        to: null, note: "→ themeStore.profiles, lifted per T9 §8" },
  { from: "notebookData",           to: null, note: "→ workspaceStore.notebook" },
  { from: "windowSaveData",         to: null, note: "→ windowStore, dropped if incompatible" },
  { from: "floatingCodeSpeed",      to: null, note: "→ scene param; discarded" },
];
```

Every legacy field appears exactly once, with either a target or an explicit reason for being
dropped. A unit test asserts the table covers all 41 fields — so a field cannot be forgotten
silently, which is the failure mode of a hand-written migration.

`windowSaveData` is dropped rather than migrated: window instances reference
`saveComponentKey` values and store React-element-adjacent data (F-47), and P2 changes the
persisted shape entirely. Losing a restored window layout on upgrade is a cosmetic one-off; a
mis-restored window is a crash.

## 6. `index`

Builds `<section>/index.json` from the migrated entries (D1 §8). Runs last. Idempotent by
construction — it is a pure function of the entries. `--verify` re-derives and compares, which is
also the ongoing drift check (`tools/reindex.ts --check`).

## 7. Order and rollback

```
backup → keys → documents → entries → comments → reactions → users → index
```

`keys` first so later steps read and write final locations. `index` last so it sees final data.

Rollback: restore from `backup/<ISO>/` with `tools/migrate/restore.ts <dir>`, which is a plain
recursive `PutObject` of the backup contents. Tested as part of C6 below — an untested restore path
is not a rollback plan.

## 8. Acceptance

| # | Criterion |
| --- | --- |
| C1 | Every step is dry-run by default; `--commit` is required to write |
| C2 | Every step is idempotent: second run reports 0 changes |
| C3 | `documents --verify` passes for every document, with every diff attributable to a listed expected change (gate S10) |
| C4 | `documents` never rewrites marks inside fenced code, inline code, or directive attributes — fixture-tested |
| C5 | Every `ImageAsset` has non-zero `width`/`height`; images lacking `alt` are enumerated in the report |
| C6 | Restore test: migrate a copied bucket prefix, restore from backup, assert byte-identical to the original |
| C7 | `migrateSettings` covers all 41 legacy fields; unit test fails if a field is added without a row |
| C8 | `migrateSettings` is importable in a browser bundle (no `server-only`, no node builtins) |
| C9 | Legacy S3 prefixes still resolve after `keys` runs without `--delete-old` |
| C10 | `--resume` skips completed objects; killing mid-run and resuming completes correctly |
| C11 | Reports are valid JSON and include per-object before/after for every change |
