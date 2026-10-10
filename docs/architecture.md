# v11 application contracts

Routes compose public feature exports. `src/features/entries` owns the canonical sections `blog`, `album`, `projects`, and `management`; `/photos` permanently redirects to `/album`. `src/features/home` and `src/features/about` retain the home frames and about presentation. Windows use the same `ArticleView` and validated `LoadedEntry` as full-page routes.

## Content reads

`src/server/entries/load.ts` is server-only. `loadSummaries(section)` reads a section index; `findEntry(section, slug)` validates identity, reads complete metadata, parses the document once, and returns `LoadedEntry | null`; `loadEntry` converts a missing record to the route's 404. React request caching and tag-scoped Next caching share those reads across routes and the read API. Stored Markdown metadata is a sibling `.meta.json` object, so images, authors, dates, and section extras survive the read. Measured inline-image assets are attached to the parsed HAST before rendering.

The shared caches contain public projections only: summary indexes and RSS for one hour under entries:<section>, parsed documents for one week under entry:<section>:<slug>, and public authors for one day under author:<id>. Profile changes, moderation and account deletion invalidate only the author tag. Viewer/session and full synced account envelopes are never shared-cache values. [ADR-048](spec/exec/X6-implementation-decisions.md#adr-048--preserve-cookie-driven-first-paint-with-explicit-public-read-caches) records why cacheComponents remains disabled for the request-cookie html/viewport first-paint contract.

The public entry module exports `Entry`, `EntrySummary`, `LoadedEntry`, `ImageAsset`, `Section`, `ArticleView`, `EntryList`, `fetchEntry`, `fetchSummaries`, and path/slug helpers. Browser readers validate wire data and consume every index cursor page. Album/project cards can open native desktop overlays; their normal links remain canonical full-page destinations.

`home/slide.json` contains featured references and timeline data; `about/intro.json` contains introduction paragraphs; `home/messages.json` is a comment thread `{comments: [...]}`. Neither home nor about reads legacy bucket keys.

## Comments and identity

`src/features/comments` exports `Comments` and server actions for thread/reaction reads and UUID-addressed mutations. Home comments use `{section:"home",slug:"home"}`. Optimistic updates operate on immutable comments and reply IDs, with server CAS retry, author/admin checks, and rollback on failure. Replies reference `toId`; order/index is never identity. `fetchPublicUser` returns only public account fields.

`src/features/account` exports `useAccount(selector)`, stable `accountStore`, `signIn`, `signOut`, `restoreAccount`, `deleteAccount`, `syncSettings`, `downloadSettings`, `downloadAccountData`, and moderation actions. OAuth exchanges authorization codes on the server and verifies identity-token signatures/audience. Signed session cookies alone cannot resurrect deleted accounts; every viewer also requires a live stored account, including its current ban state.

`syncSettings(settings, {theme,workspace})` validates all three domains and applies their revisions independently under the same object CAS. A lower settings revision cannot discard a newer notebook. Sync-off uploads are rejected. `downloadAccountData()` restores the complete account envelope, including theme profiles and workspace.

`POST /api/v1/me/settings` accepts JSON `{settings,domains:{theme,workspace}}` for lifecycle beacon flushing. It requires the same Origin, rejects cross-site requests, requires JSON, bounds the streamed body to 1 MiB, and rate-limits the authenticated account. It returns `{revision}` with private/no-store caching. Errors use the shared problem response.

## Durable workspace

`src/features/workspace` exports `useWorkspace(selector)`, stable `workspaceStore`, `workspaceDataOf`, `workspaceSchema`, defaults, and legacy migration. Its persisted `zw.workspace` value includes version/revision, notebook pages and active UUID, sticky-note dismissal, calculator appearance, and viewed Christmas-tree IDs. Window dragging does not change it. Storage writes are coalesced at 500 ms and flushed on lifecycle events.

`src/features/notebook` exports `NotebookEditor`, immutable page/span types, `normalizeSpans`, `shiftSpans`, `markdownToSpans`, `spansToMarkdown`, and `newPage`. Ranges are `[from,to)`, snap to whole graphemes, and save as text plus spans. Markdown is an import/export format, never the autosave representation. Pages are stable UUIDv7 identities; removing another page cannot shift the active identity.

## Image-seeded themes

`POST /api/v1/tools/image-palette` accepts multipart `file`: JPEG, PNG, or WebP, at most 4 MiB and 40 million decoded pixels. The streamed multipart body is capped at 4 MiB plus 64 KiB framing before parsing, including requests without Content-Length. Server decoding applies EXIF orientation and downsamples before weighted palette extraction; grayscale images have a visible-pixel fallback. The response is `{theme,seed:{hue,chroma,torsion},scheme,roles,swatches}`. `theme` is a validated v2 ThemeSource, `swatches` are OKLCh values, and `scheme` describes source brightness. The Studio retains explicit review/apply controls. The route is rate-limited and no-store.

## Icons

The 100 surviving icon components live under src/ui/icons and use the shared IconProps type: size, className and strokeWidth. Monochrome icons inherit currentColor, authored stroke defaults remain intact, and the multicolor sign-in identity artwork retains its original colors. The account state wrapper belongs to the account feature. A comparison against the original Git assets found no SVG geometry differences across all 100 components.

## Production output traces

`next.config.ts` pins `outputFileTracingRoot` to the application directory and excludes `work/**`, `.local-storage/**`, `coverage/**`, Git metadata (including a worktree's `.git` pointer file), and environment files from every server route's deployment trace. These directories hold local content, review captures, test output, or machine-specific configuration; they are runtime inputs or development evidence rather than application dependencies. Required package dependencies and application assets remain traceable. [Next.js output tracing documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) describes the global route exclusion key and project-relative file patterns.

The local storage adapter still accepts `ZIMO_WEB_LOCAL_STORAGE` as an absolute or relative runtime path, and S3 selection remains unchanged. A packaged local deployment must supply or mount its content separately; fixtures are not bundled implicitly. Statically forcing all storage reads beneath `.local-storage` would discard supported external runtime paths. This correction therefore uses explicit packaging boundaries rather than changing storage semantics or adding tracing suppression comments. The framework may still report its conservative dynamic-filesystem tracing warning; that warning is distinct from the final excluded artifact lists.

After a production build, run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./tools/register.mjs tools/check-output-traces.ts`. The checker scans all production `.nft.json` manifests, skips the separate development/cache trees, resolves each path against its manifest, and rejects local-only directories, environment files or references outside the application trace root. It also examines actual symlink targets, declared Turbopack symlink targets and additional roots, and fails closed if traces are absent or malformed. The root boundary prevents a sibling repository's local content from being bundled indirectly. Its report includes total manifests, references and rejected paths; a nonzero exit prevents an unsafe artifact from passing verification.

Both verification and browser-regression CI run `npm run build:traces:check` immediately after their production build. The pre-correction build contained 37 production trace manifests and 61,964 file references, including 16,337 references to 527 distinct private paths. The coordinated production rebuild on 2026-10-10 completed successfully; its 37 manifests contain 45,685 file references and zero rejected paths. The before/after reports are local evidence under `work/output-tracing-before.json` and `work/output-tracing-after.log`, themselves excluded from deployment. Seven focused checker tests cover each forbidden directory, environment files, normal dependencies, traversal normalization, real and declared symlinks, additional roots, sibling repository content and malformed/missing output. Focused strict type checking and lint pass.

## Verification record

The owned server/document/entry/search/notebook suite passed 609 tests in 30 files on 2026-10-09, including the beacon origin/body boundary and independent-domain sync regressions. Type checking and focused lint completed without errors. Browser interaction and full-repository verification are recorded separately in the execution ledger.

The isolated migration exercise is described in [Content migration](operations/content-migration.md). The October 9 implementation used isolated fixtures. The October 10 migration uploaded a verified copy under the separate v11 bucket namespace; the existing root content was preserved. The current remote production preview and source-integrity evidence are recorded in the execution ledger.

Implementation source files retain the repository comment ban. Effect rationale belongs here: comment profile/thread effects synchronize mounted UI with their server resource and cancel state updates after unmount; session/settings hosts synchronize persisted state with browser lifecycle and account actions. Migration backup/restore happens before content mutation, and source cleanup follows verification of all planned outputs.
