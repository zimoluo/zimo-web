# D4 — Storage and concurrency

Resolves F-27, F-32, F-33. Location: `src/server/storage/`.

**S3 stays.** That is a scope decision and it is final. This document shows that the concurrency
problem the brief calls out — *"it's probably not safe for concurrent stuff like commenting"* —
is solvable with S3 primitives, and specifies the solution.

## 1. Key layout

One module owns every key. Nothing else in the repository constructs an S3 key.

```ts
// server/storage/keys.ts
export const keys = {
  entryDocument: (section: DocumentSection, slug: Slug) => `${section}/documents/${slug}.md`,
  entryData:     (section: DataSection,     slug: Slug) => `${section}/entries/${slug}.json`,
  sectionIndex:  (section: Section)                     => `${section}/index.json`,
  commentThread: (section: Section, slug: Slug)         => `${section}/comments/${slug}.json`,
  reactions:     (section: Section, slug: Slug)         => `${section}/reactions/${slug}.json`,
  homeMessages:  ()                                     => `home/messages.json`,
  user:          (sub: string)                          => `account/users/${encodeSub(sub)}.json`,
  treeMessages:  ()                                     => `special/christmas/tree.json`,
} as const;
```

Changes from today:
- `photos/` → `album/`, `about/text/` → `management/documents/`, `blog/text/` →
  `blog/documents/`, `likedBy/` → `reactions/`, `about/homepage/messages.json` →
  `home/messages.json`. Names describe content.
- `encodeSub` percent-encodes the OAuth subject. Today `account/users/${sub}.json` interpolates
  a provider-supplied string directly into a key. Google `sub` values are numeric and Apple's are
  prefixed `apple_`, so nothing currently breaks — but a provider is not a validator.
- Keys are constructed **only** from validated `Slug` (D1 §7) and `Section` enum values.

The migration renames objects with `CopyObject` + `DeleteObject`, with the old prefixes retained
read-only for one release (D6 §4).

## 2. One client, one codec

F-33: four modules each construct `new S3Client`, each re-throw on missing credentials at module
scope, and four separate copies of the same gunzip-stream pipeline exist.

```ts
// server/storage/client.ts
import "server-only";
export const s3 = new S3Client({ region, credentials, requestHandler: { requestTimeout: 8_000 } });

// server/storage/object.ts
export async function readJson<T>(key: string, schema: z.ZodType<T>): Promise<Versioned<T> | null>;
export async function readText(key: string): Promise<Versioned<string> | null>;
export async function writeJson<T>(key: string, value: T, opts?: WriteOpts): Promise<string /* etag */>;
export async function writeText(key: string, value: string, opts?: WriteOpts): Promise<string>;
export async function remove(key: string): Promise<void>;
export async function list(prefix: string): Promise<readonly ObjectRef[]>;

export type Versioned<T> = { readonly value: T; readonly etag: string };
export type WriteOpts = {
  readonly ifMatch?: string;      // conditional write
  readonly ifAbsent?: boolean;    // If-None-Match: *
  readonly gzip?: boolean;        // default true
  readonly contentType?: string;
};
```

Notes:
- **`readJson` validates.** Every read passes through a Zod schema. Today `JSON.parse(fileContents)`
  is trusted, so a hand-edited or partially-written object produces a runtime crash deep in a
  component. A validation failure is an `upstream-failure`, logged with the key.
- **`readJson` returns the ETag.** This is what makes §3 possible, and it is why the current
  code cannot do conditional writes: `getComments` discards all response metadata.
- **`requestTimeout: 8_000`.** Currently unbounded, so a slow S3 response holds a serverless
  invocation until the platform kills it.
- **Gunzip once.** The four duplicated `pipeline(Body, createGunzip(), …)` blocks collapse. They
  also currently accumulate the whole object into a string via `fileContents += chunk` — O(n²)
  string concatenation. Use `Buffer.concat` on a chunk array.

## 3. Concurrent writes

### 3.1 The defect

`commentManager.ts:37-105` and every sibling: read the object, mutate in memory, write it back.

```
t0  A: GET comments.json  → [c1]
t1  B: GET comments.json  → [c1]
t2  A: PUT [c1, cA]
t3  B: PUT [c1, cB]        ← cA is gone
```

Same pattern for reactions, user settings, and the Christmas tree. Comment identity by *array
index* (F-27) makes it worse: a concurrent insert shifts the index a delete is aimed at, and the
content-comparison guard then reports "please refresh the page".

### 3.2 The fix: conditional writes

S3 supports conditional writes on `PutObject`:
- **`IfNoneMatch: "*"`** — succeed only if the object does not exist. Create-if-absent.
- **`IfMatch: "<etag>"`** — succeed only if the current ETag matches. Compare-and-swap.

A mismatch returns HTTP **412 PreconditionFailed**. That is optimiztic concurrency control, and
it is exactly what read-modify-write needs.

```ts
// server/storage/mutate.ts
export async function mutateJson<T>(
  key: string,
  schema: z.ZodType<T>,
  initial: () => T,
  update: (current: T) => T,
  opts?: { readonly attempts?: number },
): Promise<T> {
  const attempts = opts?.attempts ?? 5;
  for (let i = 0; i < attempts; i++) {
    const current = await readJson(key, schema);
    const next = update(current?.value ?? initial());
    try {
      await writeJson(key, next,
        current ? { ifMatch: current.etag } : { ifAbsent: true });
      return next;
    } catch (e) {
      if (!isRetryableConflict(e)) throw e;
      await sleep(jitteredBackoff(i));   // 25, 60, 140, 320 ms ± 40 %
    }
  }
  throw new AppError("conflict", "Could not apply the change; please retry.");
}
```

```ts
/**
 * S3 signals a failed precondition three ways, and all three mean "re-read and retry":
 *   412 PreconditionFailed            — IfMatch did not match
 *   409 ConditionalRequestConflict    — two conditional writes raced on the same key
 *   428 PreconditionRequired          — a conditional write was required but absent
 * Missing the 409 is the subtle one: it is exactly the concurrent case gate S9 tests, and
 * rethrowing it reintroduces the lost write this whole section exists to prevent.
 */
const isRetryableConflict = (e: unknown): boolean => {
  const name = (e as { name?: string })?.name;
  const status = (e as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
  return name === "PreconditionFailed"
      || name === "ConditionalRequestConflict"
      || name === "PreconditionRequired"
      || status === 412 || status === 409 || status === 428;
};
```

Every mutation in the application goes through `mutateJson`. There is no other write path for
mutable objects.

Properties:
- **No lost updates.** A concurrent writer's `IfMatch` fails, it re-reads, and it re-applies its
  `update` against the winner's state.
- **`update` must be a pure function of current state.** That is the contract, and it is what
  makes retry correct. `addComment`'s update is `t => ({ …t, comments: [...t.comments, newComment] })`
  — with the comment's `id` and `createdAt` generated **before** the loop so a retry does not
  produce a different comment.
- **Deletes and likes address ids, not indices** (D1 §5), so retry is unambiguous.
- **Bounded.** Five attempts with jittered backoff, ~550 ms worst case, then a 409 with a
  user-facing message. For this site's traffic a second attempt will essentially never be needed.

`IfNoneMatch: "*"` on first create closes the other race: two writers creating the same thread
simultaneously. One wins; the loser sees 412, re-reads, and appends.

### 3.3 Verification and fallback

Conditional-write support must be confirmed against the account and region before this is relied
on (`exec/X4 §5`, check V-5). The one-line check:

```sh
aws s3api put-object --bucket zimo-web-bucket --key tmp/cas-probe.json \
  --body /dev/null --if-none-match '*'
# expect success; run twice, expect 412 PreconditionFailed on the second
```

If conditional writes are unavailable, the fallback is **key partitioning**, and it is specified
here so the design is not blocked:

- Each comment becomes its own object: `<section>/comments/<slug>/<commentId>.json`.
- Writers never share a key, so lost updates are structurally impossible.
- Reading a thread costs one `ListObjectsV2` plus N `GetObject`, parallelized.
- Deletion is `DeleteObject` on one key.
- Per-comment likes still share that comment's object, and are handled by
  last-write-wins — acceptable for a like count, unlike a comment body.
- Cost: reading a 30-comment thread becomes 31 requests instead of 1. At S3's
  $0.0004 per 1 000 GETs this is immaterial at this site's volume; the reason it is the fallback
  rather than the default is latency, not price.

Choose one, on evidence, in task `D4-02`. Do not implement both.

### 3.4 Settings sync

`syncSettings` has the same shape and the same fix, with one addition: the client sends a
**monotonic revision number** with the settings, and the update function rejects a write whose
revision is lower than the stored one. Two devices editing settings concurrently is a real
scenario (the brief's own `syncSettings` feature exists for it), and ETag CAS alone would let the
slower device's stale full-object write win the retry. See D5 §5.

## 4. Reads

```ts
// server/entries/read.ts
export const getEntrySummaries = async (section: Section) => {
  "use cache";
  cacheTag(`entries:${section}`);
  cacheLife("hours");
  return (await readJson(keys.sectionIndex(section), sectionIndexSchema))?.value.items ?? [];
};
```

- **Listing is one GET** of the section index (D1 §8), not `ListObjectsV2` + N `GetObject` +
  in-memory sort.
- For **cross-request** caching of content reads, `react`'s `cache` is replaced by Next's
  `use cache` with explicit tags and lifetimes, so invalidation is targeted (D3 §6). `react`'s
  `cache` is still the right tool for **per-request** memoization — session lookup uses it
  (D3 §4) — and the two are not alternatives.
- `fetchSlugs` / `fetchEntryBySlug` / `fetchAllEntries` and their `fields: string[]` parameter
  disappear. Field selection at the *storage* layer never saved a byte — the whole object was
  fetched and parsed either way, then filtered. Field selection belongs at the API boundary
  (D3 §2.1) where it saves *transport*.

## 5. Integrity

- **Every object write is gzipped** with `ContentEncoding: "gzip"` and
  `ContentType: "application/json"`. Today `commentManager` sets `ContentEncoding` but not
  `ContentType`, so a browser fetching the object directly gets `binary/octet-stream`.
- **Every read tolerates both** gzipped and plain, as today, because the bucket contains a
  mixture.
- **Schema on read** (§2) turns a corrupt object into a logged `upstream-failure` rather than a
  crash.
- **Backups.** `tools/backup.ts` writes a timestamped tarball of every mutable prefix
  (`*/comments/`, `*/reactions/`, `account/users/`, `special/`) to `backup/<ISO>/`. Run before
  any migration; runnable ad hoc. S3 versioning is the better answer if it is enabled on the
  bucket — check, and if it is, this tool only needs to record the version ids.

## 6. Acceptance

| # | Criterion |
| --- | --- |
| C1 | Exactly one `new S3Client(` in the repository |
| C2 | Exactly one gunzip implementation; no `fileContents +=` string accumulation |
| C3 | No S3 key is constructed outside `server/storage/keys.ts` |
| C4 | Every mutable-object write goes through `mutateJson` |
| C5 | **Concurrency test:** 20 parallel `addComment` calls against one thread yield 20 comments (gate S9) |
| C6 | **Concurrency test:** 20 parallel `setEntryReaction` calls from 20 subjects yield 20 entries in `likedBy` |
| C7 | `mutateJson` throws `conflict` after 5 failed attempts, and the message is user-facing |
| C7a | `mutateJson` retries on **412, 409, and 428**; a stubbed 409 does not escape (this is the case gate S9 exercises) |
| C8 | `update` functions are pure: called twice with the same input, identical output (including no new uuid/timestamp) |
| C9 | Every `readJson` call site passes a schema; a malformed object yields `upstream-failure`, not a crash |
| C10 | `requestTimeout` is set; a stubbed 30 s S3 response fails in ≤ 9 s |
| C11 | Listing any section performs exactly 1 S3 request |
