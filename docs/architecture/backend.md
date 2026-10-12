# Backend and content storage

Implemented at `91d20ccf`; reviewed October 12, 2026. [Runtime guide](application-runtime.md). This is an object-storage backend with validated domain operations, not a relational database.

## Canonical content and shared presentation

Sections are blog, album, projects and management. [`storage/keys.ts`](../../src/server/storage/keys.ts) owns logical keys; routes/widgets should not invent another bucket convention.

| Data | Logical key |
| --- | --- |
| Blog/management document | `<section>/documents/<slug>.md` plus `<slug>.meta.json` |
| Album/project entry | `<section>/entries/<slug>.json` |
| Section summaries | `<section>/index.json` |
| Entry comments/reactions | `<section>/comments/<slug>.json`, `<section>/reactions/<slug>.json` |
| Account envelope | `account/users/<encoded-sub>.json` |
| Home message thread/reactions | `home/messages.json`, `home/reactions.json` |
| Christmas messages | `special/christmas/tree.json` |

Slugs and stored identities are validated. Comments/replies use stable UUIDs and reply targets, not array positions. Document metadata retains measured media, authors, dates and section extras. Markdown is parsed into a shared document representation with validated directives/highlighting; a route, reading overlay and floating reader reuse that representation rather than maintaining three parsers.

[`entries/read.ts`](../../src/server/entries/read.ts) is the storage/domain boundary. [`entries/load.ts`](../../src/server/entries/load.ts) adds request/shared caching, parsed documents and the route's not-found behavior. Browser entry clients validate wire data and follow pagination. Unlisted summaries are filtered from public indexes; a direct entry identity is a separate read.

## Public reads and private authority

The versioned API lives under [`src/app/api/v1`](../../src/app/api/v1). It covers section/entry/document reads, comments/reactions, batch album reactions, session reads, settings beacons, image-palette extraction and tree messages. Account/comment mutations also use server actions; callers share server authorization/validation rather than duplicating trust rules in UI widgets. HTTP handlers use common problem responses and bounded input parsing.

Public entry/index/RSS/author projections use explicit Next caches, partitioned by storage namespace or local root. Index/RSS lifetime is one hour, documents one week, public authors one day; tags identify the affected resource. Viewer/session and complete account envelopes are not shared-cache projections. External content tooling must rebuild affected indexes and account for the running server's cache invalidation/lifetime; writing an object is not itself a live cache-invalidation broadcast.

[`session/current.ts`](../../src/server/session/current.ts) verifies signed session claims and requires a current stored account. Deletion/ban state cannot be bypassed merely by retaining an old cookie. OAuth code exchange and identity verification are server-owned. Public author projection is intentionally narrower than an account envelope. `zw.render` is only a first-paint hint; it grants no authority.

## Conditional object mutation

[`objects()`](../../src/server/storage/object.ts) chooses the native filesystem adapter for local storage or the namespaced S3 store. Call this interface for domain mutation; do not use a raw SDK sender or the older local SDK-command emulator as a replacement for its conditional-write contract.

[`mutateJson`](../../src/server/storage/mutate.ts) reads/validates an object with an ETag, computes an immutable update, and conditionally creates or replaces it. A failed condition causes a bounded reread/recompute retry. An update function must therefore be replayable; an external side effect does not belong inside it. Exhaustion returns a conflict rather than silently overwriting newer data.

This protects one object. Related document/metadata/index changes are not one bucket-wide transaction. Migration/publishing needs its own ordering, backup, read-back verification and index-rebuild contract. The filesystem adapter is useful for reproducible tests; it does not establish the deployment's distributed behavior by itself.

The current rate limiter keeps sliding-window histories in process memory. Its limits are local to that server instance, not a globally shared quota across independently running instances. Global enforcement would need a separately designed shared boundary.

## Sync is revisioned domain replacement

The account envelope can hold settings, theme preferences/profiles, and workspace. `syncSettings` validates them and applies their revisions independently under one account-object CAS: an older settings revision cannot erase a newer notebook/theme domain. Equal revisions can replace the corresponding domain; this is not a collaborative merge or CRDT. Concurrent edits to the same domain on different devices can still need product-level reconciliation.

`SettingsHost` schedules sync after two seconds of quiet changes when signed in and enabled; it uses a JSON lifecycle beacon on pagehide. The beacon endpoint requires the appropriate origin/content type, bounds its streamed body, applies account rate limiting, and returns private/no-store data. Local writes are separately coalesced by each durable store. Temporary window/scroll/animation geometry is not account-synced on every frame.

## The remote namespace and rollout boundary

The native remote store defaults to `ZIMO_WEB_STORAGE_PREFIX=v11/` in the existing bucket. Physical keys receive that prefix; listings return logical keys. Local filesystem storage is unaffected by the prefix. `ZIMO_WEB_LOCAL_STORAGE_ONLY=true` forces local storage; absent configured credentials also selects local storage. A live preview requires deliberate environment/backend selection, not just a running web server.

The October 10 migration uploaded a verified isolated copy: 129 entries and 314 canonical objects, including four indexes and visitor records. Original bucket root formats and OneDrive authoring files were preserved. Existing published media URLs are reused rather than moving every media asset beneath `v11/`. These are historical migration results, not fresh verification performed during this documentation pass.

Visitor records are a snapshot. Before actual cutover, reconcile subsequent old-site writes and verify the target corpus, account/comment compatibility and indexes. Bucket versioning remains unconfirmed because its inspection was denied. The operational steps and private evidence are in [content-migration](../operations/content-migration.md); the broad application contracts are in [architecture.md](../architecture.md).

No migration, remote write, push or deployment is part of this documentation review.

## Maintaining the backend

Keep key generation, validation, session/role authorization, replayable mutation and public cache invalidation in their owned server modules. Add UI through feature exports, not direct bucket reads from a component. Test malformed input, absent records, stale ETags/retry exhaustion, immutable comment identity, independent sync domains and namespace partitioning. Verify actual remote preconditions during an authorized rollout; unit stubs alone do not establish S3 configuration.

Remaining decisions include external publish/cache invalidation, global limiter semantics if deployment requires them, same-domain multi-device conflict behavior, deployment freshness of visitor snapshots, and whether future content scale justifies a different index/storage architecture. Replacing the storage system without a measured need would create another migration rather than resolve these contracts.
