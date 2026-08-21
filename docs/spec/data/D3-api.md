# D3 — API design

Resolves F-29 – F-31, F-34. Location: `src/app/api/v1/`, `src/features/*/actions.ts`.

## 1. Transport decision

Three transports, each with a rule for when it applies.

| Transport | Use for | Why |
| --- | --- | --- |
| **RSC direct call** | Any read rendered on the server | No HTTP hop, no serialization, no route to secure. `getEntry(section, slug)` is called from the page. |
| **Server Action** | Every mutation initiated by this app | POST-only, origin-checked by Next, no client fetch wrapper, typed end to end, `revalidateTag` in the same function. |
| **Route Handler** `/api/v1/*` | Reads consumed by the *client* (window readers, polling), and anything consumed by a third party | Cacheable by HTTP, CORS-controllable, versioned. |

This is the answer to *"which protocol to use"*: HTTP+JSON over Route Handlers where a URL is
genuinely needed, and Server Actions everywhere else. Not tRPC, not GraphQL — there is one
client, one server, and a type-safe direct call is strictly better than a schema layer over
HTTP for that case. ADR-011.

Consequence: `lib/dataLayer/client/*` — 4 files, ~500 lines of `fetch` wrappers with
copy-pasted `try/catch/console.error/return null` — is deleted. 11 of the 17 current route
handlers become Server Actions.

### 1.1 Server Actions replace these

| Current route | Server Action |
| --- | --- |
| `POST /api/comments/addComment` | `addComment(section, slug, body)` |
| `POST /api/comments/addReply` | `addReply(section, slug, commentId, body, toId?)` |
| `DELETE /api/comments/deleteSingleComment` | `deleteComment(section, slug, commentId)` |
| `DELETE /api/comments/deleteReply` | `deleteReply(section, slug, commentId, replyId)` |
| `POST /api/comments/likeSingleComment` | `setCommentLike(section, slug, commentId, liked)` |
| `POST /api/comments/updateEntryLike` | `setEntryReaction(section, slug, liked)` |
| `PUT /api/comments/banOrUnbanUser` | `setUserState(sub, state)` |
| `POST /api/accountState/login` | `signIn(provider, code, …)` |
| `POST /api/accountState/clearSession` | `signOut()` |
| `PUT /api/accountState/updateSettings` | `syncSettings(settings)` |
| `DELETE /api/accountState/deleteUser` | `deleteAccount()` |

Note the last four: `sub` disappears from every signature. The current
`updateSettings` and `deleteUser` accept a `sub` from the client and then check it against the
session token (`updateSettings/route.ts:266`, `deleteUser/route.ts:33`). The session *is* the
identity; passing it as a parameter and validating it is a redundant round-trip that must not
be forgotten. Actions read it from the cookie.

Likewise `setCommentLike(…, liked: boolean)` is **idempotent** where the current
`likeSingleComment` toggles. A toggle over an unreliable network double-fires and undoes
itself; setting a state does not.

## 2. Route handlers

```
GET    /api/v1/entries/{section}                     list summaries
GET    /api/v1/entries/{section}/{slug}              one entry (+ document as hast)
GET    /api/v1/entries/{section}/{slug}/comments     comment thread
GET    /api/v1/entries/{section}/{slug}/reactions    { count, likedByMe }
GET    /api/v1/session                               current session, or 204
GET    /api/v1/me/settings                           manual settings download
POST   /api/v1/tools/image-palette                   theme-maker image analysis
GET    /api/v1/tree-messages                         christmas tree (third-party CORS)
POST   /api/v1/tree-messages                         christmas tree (third-party CORS)
GET    /blog/feed.rss                                unchanged location (subscribers exist)
```

Nine handlers, down from twenty-one. Every one is a **read**, except the two Christmas-tree
endpoints (consumed by `tree.zimoluo.me`, so they must be HTTP) and the image-palette tool
(multipart upload).

### 2.1 Conventions

- **Version prefix `/api/v1`.** A breaking change ships `/v2` alongside.
- **kebab-case path segments, plural nouns, no verbs.** `camelCase` and `deleteSingleComment`
  are gone.
- **camelCase JSON fields**, matching the TypeScript types exactly (`02-conventions §2`).
- **Sub-resources are nested** under their parent, so authorization context is in the path.
- **`{section}` is an enum**, validated against `["blog", "album", "projects", "management"]`.
- **Sparse fieldsets:** `?fields=title,publishedAt`, validated against a per-section allowlist.
  Absent ⇒ the full summary.
- **Pagination** on list endpoints: `?limit=` (default 50, max 200) `&cursor=`, cursor being the
  last item's `publishedAt|slug`. The current API returns every entry unbounded.

### 2.2 What is deliberately not on the wire

F-30: today the browser sends `directory=blog/text&mode=markdown&fields=…` and, for comments,
`filePath=blog/comments/slug.json`. The S3 layout and the serialization format are part of the
public contract, defended by an allowlist (`readEntryBySlug/route.ts:15-24`) and a regex
(`lib/constants/security.ts:1-4`).

In v11 the client sends `{section}` and `{slug}`. The server derives the key
(`server/storage/keys.ts`). Storage layout becomes a private implementation detail, the
allowlist and the path regex are deleted, and moving `photos/entries` → `album/entries` (D1 §1)
requires no client change.

## 3. Response shapes

Success bodies are the domain type, unwrapped:

```jsonc
// GET /api/v1/entries/blog/my-post
{
  "section": "blog", "slug": "my-post", "title": "…",
  "publishedAt": "2026-01-04T00:00:00Z", "unlisted": false,
  "tags": ["Zimo Web"], "authors": [{ "id": "zimo", "name": "Zimo" }],
  "images": [ { "src": "…", "width": 2400, "height": 1600, "alt": "…" } ],
  "body": { "kind": "document", "document": { /* hast */ } },
  "extras": { "section": "blog" }
}
```

No `{ data: … }` envelope: the status code carries success, the body carries the resource. Lists
are enveloped, because they need cursor metadata:

```jsonc
{ "items": [ /* EntrySummary[] */ ], "nextCursor": "2025-11-03T00:00:00Z|older-post" }
```

## 4. Authentication

Unchanged in mechanism, tightened in detail.

- `session` cookie: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, `Max-Age=15552000`.
  **`Lax`, not `Strict`.** The current `SameSite=Strict` means a user arriving from an external
  link is not authenticated on first paint, so the comment box shows "sign in" until they
  navigate internally. `Lax` sends the cookie on top-level GET navigations, which is the
  intended behavior and is safe because all mutations are POST.
- The cookie name changes `session_token` → `session`; the old name is read for one release.
- JWT `HS256`, 180 d, `jose` — unchanged.
- **Add `iat`-based rotation:** on any authenticated request older than 30 days, reissue. The
  current token has a 180-day fixed lifetime with no rotation and no revocation.
- Session lookup is `cache`d per request (`react`'s `cache`), so a page rendering a comment
  thread verifies the JWT once instead of once per authorization check. Today
  `getUserDataBySub(sub, ["state"])` is called — an S3 GET — on *every* comment mutation,
  serially after the JWT verify.

## 5. Errors

F-31: 18 of the 21 handlers return HTTP 500 with `error.message` verbatim, for every failure
including missing parameters and unauthenticated access.

**RFC 9457 `application/problem+json`:**

```jsonc
{
  "type": "https://zimoluo.me/problems/comment-too-long",
  "title": "Comment is too long",
  "status": 422,
  "detail": "Comments are limited to 3000 characters.",
  "instance": "/api/v1/entries/blog/my-post/comments"
}
```

One mapping table, `lib/errors.ts`:

| `ErrorCode` | Status | Notes |
| --- | --- | --- |
| `invalid-request` | 400 | schema failure; `detail` names the field |
| `unauthenticated` | 401 | |
| `forbidden` | 403 | banned user, not the owner, not an admin |
| `not-found` | 404 | |
| `conflict` | 409 | duplicate create |
| `precondition-failed` | 412 | ETag mismatch after retries (D4 §3) |
| `payload-too-large` | 413 | file upload |
| `unprocessable` | 422 | semantically invalid: comment too long, bad tree position |
| `rate-limited` | 429 | with `Retry-After` |
| `upstream-failure` | 502 | S3 unavailable |
| `internal` | 500 | `detail` omitted; logged with a correlation id |

One wrapper, no per-route `try/catch`:

```ts
export const handler = (fn: Handler) => async (req: Request, ctx: Ctx) => {
  try { return await fn(req, ctx); }
  catch (e) { return problemResponse(e); }
};
```

`problemResponse` returns `detail` only for client-error codes. For `internal` it logs
`{ correlationId, error }` and returns the id, so a user can report it without the server
leaking a stack trace or an S3 key.

Server Actions throw the same `AppError`; the client boundary catches and maps to a toast via
one shared helper, replacing 20 copies of
`catch (error: any) { console.error(...); return null; }`.

## 6. Caching

F-34: `revalidate` values of 24, 25, 30, 3600, and 0 appear across routes with no stated
meaning, plus a `revalidatePath("/")` that invalidates the entire site on a user ban.

`use cache` requires opting in. `next.config.ts` gains:

```ts
const nextConfig: NextConfig = {
  cacheComponents: true,   // enables `use cache`, cacheLife, cacheTag
  images: { /* P3 §3.1 */ },
};
```

Without it every `"use cache"` directive in this spec is a no-op or a build error. Confirm the
flag's name against the pinned Next version first (V-13) — it was `experimental.dynamicIO` in
earlier Next 15 canaries and was renamed on the way to stable.

Next 16 semantics, used deliberately:

| Data | Directive | Tags | Invalidated by |
| --- | --- | --- | --- |
| Entry summary index | `cacheLife("hours")` | `entries:<section>` | content write |
| Entry document | `cacheLife("weeks")` | `entry:<section>:<slug>` | content write |
| Comments | **uncached** | — | — |
| Reactions | **uncached** | — | — |
| Session / user | `cache()` per request | — | — |
| Author profiles | `cacheLife("days")` | `author:<id>` | `setUserState` |
| RSS | `cacheLife("hours")` | `entries:blog` | content write |

Comments and reactions are uncached because they are user-generated and change on write. Their
*fetch* cost is one S3 GET; caching them for even 60 s produces a visibly stale thread after
posting, which is a worse trade.

`revalidateTag` is called from the mutating action. `setUserState` invalidates
`author:<id>` — not the whole site.

### 6.1 Polling

F-42: `CommentCardContainer` polls every 10 s, `EntryLikeButton` every 5 s,
`ChristmasTreeDisplay` every 8 s, unconditionally, forever, on every page with comments. Each
tick is an uncached S3 GET through a route handler.

Replaced by:
- **Refetch on window focus and on `visibilitychange` → visible**, debounced 5 s.
- **Optimiztic local update** on the user's own action (React 19 `useOptimiztic`), so the common
  case needs no refetch at all.
- **A manual refresh affordance** on the thread.
- No timer.

A single-author personal site does not have concurrent comment traffic that justifies a 10-second
poll; when it does, that is what the focus refetch covers.

## 7. Rate limiting

Currently absent. Comment and reply creation are open to any authenticated user at unlimited
rate, and each write is an S3 `PutObject`.

Minimum viable, in-scope because it needs no infrastructure: two per-`sub` sliding windows held in
module state — 10 writes / 5 min sustained, 3 writes / 30 s burst, both of which must admit a write
— applied in the action before the S3 read. A token bucket cannot satisfy `C10` and is not used;
see ADR-041. Vercel's serverless instances are not shared, so this is best-effort per instance —
which for a site with one author and occasional visitors is sufficient, and is infinitely better
than nothing. Recorded in `exec/X5-risks.md` as a known limitation with the upgrade path
(Vercel KV / Upstash) if traffic ever warrants it.

The Christmas-tree POST endpoint is public (CORS-allowed to `tree.zimoluo.me`) with only length
validation. Same limiter, keyed by IP.

## 8. CORS

Only `/api/v1/tree-messages` is cross-origin. Its headers are currently duplicated across four
places in two files, including in the error path. One helper:

```ts
export const corsFor = (origin: string) =>
  origin === "https://tree.zimoluo.me"
    ? { "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin" }
    : {};
```

Note `Vary: Origin`, currently missing — without it a CDN can cache a response with one origin's
CORS header and serve it to another. Also `Access-Control-Allow-Credentials: true` is currently
sent on an endpoint that does not use credentials; it is removed, because combined with a
reflected origin it would be a real vulnerability if the origin check were ever loosened.

## 9. No middleware

The repository has no `middleware.ts` and v11 deliberately does not add one. Both candidates were
considered:

- **Session rotation** (§4) happens in the action or route that already verified the session, where
  the result is needed. Middleware would verify the JWT on *every* request including static assets.
- **The `zw.render` cookie** (D5 §6) is read by the root layout, which already runs per request.

Middleware runs on the Edge runtime with a separate bundle and a cold-start cost on every
navigation. Neither need justifies it. Recorded here so the absence is a decision rather than an
oversight.

## 10. Acceptance

| # | Criterion |
| --- | --- |
| C1 | 9 route handlers under `app/api/v1/`; no verbs, no camelCase segments |
| C2 | `lib/dataLayer/client/` deleted |
| C3 | No route handler contains `try/catch`; all use the `handler` wrapper |
| C4 | Every error response is `application/problem+json` with a correct status; contract-tested per `ErrorCode` |
| C5 | No response body contains an S3 key, a stack trace, or an internal `error.message` |
| C6 | No client request contains `directory`, `mode`, or `filePath` |
| C7 | No action or route accepts `sub` as a parameter for the *acting* user |
| C8 | `setCommentLike` and `setEntryReaction` are idempotent: calling twice with the same value yields one state change |
| C9 | Zero `setInterval` in `src/features/comments` and `src/features/entries` |
| C10 | Rate limiter rejects the 11th write in 5 min with 429 + `Retry-After` |
| C11 | `Vary: Origin` present on CORS responses; `Allow-Credentials` absent |
| C12 | Session cookie is `SameSite=Lax`; an authenticated user arriving from an external link sees the comment box authenticated on first paint |
