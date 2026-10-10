# X8 — Program status

Updated October 10, 2026 after importing the offline `rewrite/v11` branch and reconciling the later main-branch rendering changes. This document supersedes the earlier implementation checkpoint. The application runs through v11 hosts and native features; the old theme editor, context providers, backdrop wrappers, window wrappers, and client/server data layers are removed.

The branch is implemented and locally verified, but the entire charter is not yet release-certified. The remaining external/manual gates below are explicit; none is counted as a passing result.

## Implementation

| Area | Current behavior |
| --- | --- |
| Themes, surfaces, marks | 59 validated built-ins, generated first-paint CSS, perceptual ramps, dual/single schemes, profile migration/persistence, independent account revisions, authored mark geometry and SVG/PNG export. Latest main inset highlight/tint behavior is reconciled through surface-edge. |
| Theme Studio | Five panels, one lazy shared picker, gamut-aware color input, extended gradient positions, ordered ramp stops, layer conversion/reorder/duplication, gesture-coalesced undo/redo, contrast review, profile/image import and save/apply. Route and native window use one site-material workbench with authored profile marks, a hue/chroma field, role swatches and an actual site-surface preview. |
| Backdrops | All 36 authored scene identities survive, parameterized by resolved theme palettes. One document Canvas/WebGL context is leased between the page and active Studio preview. Inactive surfaces retain a captured frame; reduced motion uses authored still representations. |
| Windows and overlays | 17 lazy native window tools; imperative Pointer Events drag/resize, keyboard geometry, normalized persistence, focus restoration, native modal/popover layers, image carousel/grid/lightbox. |
| Content and identity | Canonical entries, shared document renderer, paginated validated reads, UUID-addressed comments/replies/reactions with bounded CAS retries, verified OAuth exchange, account/session checks, independent settings/theme/workspace revisions. Public author/RSS/entry tag caches exclude viewer/session data and partition by backend namespace or local content root. |
| Notebook/workspace | UUID pages, grapheme-safe exclusive UTF-16 spans, Markdown import/export, coalesced workspace persistence, tree viewed IDs, sticky dismissal and calculator appearance. |
| Navigation/accessibility | Command palette with route/theme/profile/widget/settings/entry providers; contribution-based Context Strip, short-notification routing, CSS scroll navbar, focus treatment, reduced motion, forced colors and live route/theme/image announcements. |
| Tooling/migration | Deterministic prebuild with freshness checks, isolated canonical seed, byte-verified backup/restore/resume/idempotency tools, multipart image-upload transport/decode bounds, 77 active shared-prop icons with unchanged geometry. |

The obsolete root `components/` and `lib/` trees are removed. Active presentation belongs to the native feature modules. A small JSON fixture holds original palette and shadow values for equivalence checks; saved-data import boundaries remain. Unused date/Markdown/layout/helper packages are removed from the manifest. `color-convert` remains only for historical HSL shadow conversion at the theme import boundary.

## Charter evidence

| Gate | Local evidence | Remaining requirement |
| --- | --- | --- |
| S1 | Registry-derived IDs and completeness tests; one theme file plus registry entry | None |
| S2 | Imperative ThemeHost/SchemeHost; selector/DOM tests avoid palette-driven React updates | Full nine-scenario profiling build and committed baseline remain unmeasured |
| S3 | Gesture/Profiler tests; 3-second browser drag at 4x CPU records no sampled root transitions or storage writes, one persisted geometry write on release | Frame sampling can miss paired commits within one frame; full profiler baseline is still needed |
| S4 | Actual NumberField Profiler: 50 scrubs update only the owning control; 200-frame gesture writes no profile storage until release | Cross-browser high-refresh-device trace |
| S5 | 25.9 KB Brotli, 477.4 KB raw, 90 theme/scheme blocks; freshness enforced | None |
| S6/S7 | Zero @apply and no interfaces/ ambient-type directory | None |
| S8 | 216 scene/theme captures, zero runtime/asset failures; authored still-scene defects corrected and recaptured | Broader route/viewport equivalence matrix remains separate |
| S9 | Fake ETag and filesystem tests; live S3 conditional create/update, stale/duplicate rejection and cleanup pass; 314 v11 objects and four indexes verified | Bucket-versioning inspection returned AccessDenied; refresh visitor snapshot at cutover |
| S10 | Pipeline, directive recovery, registry/render fallback, and isolated migration/round-trip tests pass | Golden rendered comparison against the actual production corpus |
| S11 | Production route script-size report records raw/gzip/Brotli bytes | Original main baseline absent; the 60% reduction target is unmeasured |
| S12 | Runtime reduced-motion policy, scene still/frame tests, shared motion helper and CSS overrides | Manual Safari/Firefox and device audit |
| S13 | Chromium axe scan: 15 tested route/overlay/mobile states, zero violations | Manual contrast findings, screen reader/device and other-engine checks |
| S14 | Full Vitest coverage run passes unchanged path thresholds | 1,502 tests / 92 files; thresholds unchanged |
| S15 | PR workflows run lint/types/coverage/build/generated checks/theme size, Chromium accessibility/interactions/performance and current route size reports | Full baseline-comparison visual/performance gates are not implemented |
| S16 | Section/global boundaries and not-found loader tests; native route smoke | Production configuration confirmation |
| S17 | Spelling gate runs in CI | None after final document scan |

## Verification

The final isolated production build passed (34 routes). Both strict source/tools and full application type checks passed. Lint has zero errors and 10 existing warnings. The full coverage run passed 1,502 tests across 92 files with unchanged thresholds. Spelling scanned 936 files with zero findings; CSS checked 64 stylesheets plus four recognized Tailwind files with zero failures; directive placement scanned 751 files. Comment, layer and polling bans remain intact. The generated theme CSS is 25.9 KB Brotli against the 60 KB budget. Production output tracing checked 37 manifests and 45,747 file references with zero private-path or root-escape violations; both CI builds enforce this check.

The authored interface restoration covers settings controls and circular theme previews, notebook tools and pages, blog rows, project marks, album layouts, author/comment identity, floating media controls and the original Whiteout/Home composition. Surface orientation preserves authored material behavior in either scheme. Window controls remain reachable inside oversized frames. The final media regression also corrects non-first slide alignment when a hidden native lightbox opens or resizes.

The completed isolated bucket migration validated 129 entries and uploaded 314 canonical objects under `v11/`. All outputs were read back against staged SHA-256 values; all four indexes matched. The 238 original remote records were backed up and restored into a local check directory. All 542 OneDrive source files retained their hashes, and no existing bucket root key was overwritten or deleted. The remote production preview returned matching public APIs (60 blog, 21 project, 36 album, 7 management entries; five unlisted blog posts remain excluded) and successfully opened 11 real-content routes with zero page errors. Representative project and album images decoded before capture. The real corpus reports 501 nonblocking image-description/shared-ratio warnings for editorial review; migration does not invent descriptions.

Latest affected-surface browser checks pass settings keyboard/ranges, notebook formatting/search/duplicate/export/persistence, media arrows/grid/captions/numeric navigation/lightbox/focus, and Studio's five panels, keyboard tabs, picker, gradients, mark exports and save/apply. Their tested desktop/mobile/light/dark axe states have zero violations; incomplete checks remain manual. Final Studio captures confirm explicit navigation SVG foreground paint and no mobile overflow. The three-second held window drag and navbar scroll still produce no sampled React root transitions or preference writes; release persists geometry once. The backdrop lease check retains one WebGL context and restores the page renderer after preview focus. These are bounded checks, not the full charter visual matrix.


The October 9 baseline production browser run passed 25 interaction steps across windows/media/notebook/mobile navigation, command-palette modal focus, and Studio. Studio text/panel contrast remained 12.61:1 after ramp-stop insertion; real SVG/PNG downloads and profile refresh were verified. Fifteen Chromium accessibility states had zero violations, with incomplete contrast/link/attribute checks retained for manual follow-up. Three performance scenarios at 4x CPU recorded no sampled React root transitions, storage writes, or long tasks during held drag and navbar scroll; release produced one geometry persistence write. The production renderer retained one context, one canvas and the same canvas identity across page/window focus, close and SPA return; a separately painted PNG export mounted no canvas.

The browser harnesses are `tools/perf/{browser-smoke,navigation-smoke,studio-smoke,accessibility-smoke,interaction-performance-smoke,size-report}.mjs`. They use canonical fixtures and write local evidence under ignored `work/`. The backdrop matrix and lease harness separately verify authored scenes and one live context. `browser.yml` preserves screenshots and reports as CI artifacts.

Use Node 24:

```sh
npm ci
npm run content:seed
npm run typecheck
npx tsc -p tsconfig.json --noEmit
npm run lint
npm run test:coverage
npm run lint:spelling
npm run lint:css
npm run lint:directives
npm run themes:verify
npm run themes:check
npm run assets:ids:check
npm run assets:optimize:check
npm run assets:browser-icons:check
npm run themes:posters:check
npm run assets:celebration:check
ZIMO_WEB_LOCAL_STORAGE_ONLY=true npm run build
npm run build:traces:check
ZIMO_WEB_LOCAL_STORAGE_ONLY=true npm run start -- --port 3481
node tools/perf/browser-smoke.mjs http://localhost:3481
node tools/perf/navigation-smoke.mjs http://localhost:3481
node tools/perf/studio-smoke.mjs http://localhost:3481
node tools/perf/accessibility-smoke.mjs http://localhost:3481
node tools/perf/interaction-performance-smoke.mjs http://localhost:3481
NODE_ENV=production node tools/perf/size-report.mjs http://localhost:3481
```

## October 9 route script payload

Measured from the production preview after initial hydration, independently recompressed; this is the earlier baseline measurement, not the S11 reduction comparison or a measurement of the latest interface restoration.

| Fixture route | Raw bytes | Gzip bytes | Brotli bytes |
| --- | ---: | ---: | ---: |
| `/` | 1,405,580 | 379,647 | 323,964 |
| `/blog/on-gradients` | 1,405,004 | 379,442 | 323,839 |
| `/album` | 1,412,966 | 379,674 | 324,015 |
| `/design/theme-maker` | 1,404,791 | 379,149 | 323,569 |

## Deliberate decisions and release work

- The public-registry lockfile preserves pinned versions/integrities and removes private Apple/mirror URLs inherited from the copied environment. A clean isolated npm ci verifies portability. Ignored work/ evidence is excluded from application type compilation.
- Code comments remain banned by the user's explicit decision. Effect/external-system explanations are in implementation/operations docs; CI retains its comment check.
- `cacheComponents` remains disabled. Actual public read caches use tag-scoped Next caching; ADR-048 records the cookie-driven root html/viewport first-paint constraint. The framework streaming/cache migration is a separate decision, not a claimed completion of use-cache directives.
- One live backdrop renderer trades simultaneous independent animations for retained inactive frames. ADR-050 explains leasing, focus priority, and snapshot lifetime.
- Global image optimization remains disabled under the inherited quota policy. Image dimensions, loading priority and sizes are present, but responsive optimized variants need an explicit delivery-policy decision.
- Surface highlight/tint integration preserves later main improvements; ADR-045 records the intentional ambient blend difference. Phase-1 color output remains sRGB.
- The isolated v11 production corpus upload and live conditional-write checks are complete. Original-main performance/JS comparisons, the 1,062 full visual comparisons, manual VoiceOver/forced-colors/120Hz-device checks, and Safari/Firefox regression remain release work. Bucket versioning is unconfirmed because inspection was denied. The v11 frontend has not been deployed; refresh visitor records at cutover.

Read [implementation decisions](X6-implementation-decisions.md), [application contracts](../../architecture.md), [Studio runtime](../../implementation/theme-studio.md), [native interactions](../../implementation/native-interactions.md), [backdrop runtime](../../operations/backdrop-runtime.md), and [content migration](../../operations/content-migration.md).

## Repository handoff

The main checkout at /Users/zimoluo/Documents/CodesForFun/zimo-web is on rewrite/v11. The original implementation commit 8a941a8a follows f26df117's merge of the newer main rendering changes; the October 10 interface and isolated-backend changes are integrated as its continuation. A clean dependency installation and the full 34-route application production build were also verified directly there using the integration fixture root; generated files and Git status stayed clean. The old root app/interfaces/prebuild-helper directories contained only Finder metadata and were removed because an otherwise empty app directory shadows src/app in Next. The obsolete main build cache was preserved outside the checkout before regeneration.

The originally copied aug21 folder and its corresponding zip are removed. Imported Git history/stash references and private local-state safety archives remain recoverable; the main checkout's environment and local content were preserved. Stable main has not been advanced to this release, and no remote Git push or frontend deployment was performed. The isolated v11 bucket data has been uploaded. Local browser verification used both a separate synthetic fixture preview and a preview reading the actual uploaded corpus.

Final handoff verification: the main checkout fast-forwarded through interface/backend commit `ddf4a83b` and the equivalent text-delimiter cleanup `63849f50`. Its production build then passed directly against the uploaded `v11/` corpus. The main-checkout trace audit found 37 manifests, 49,852 references, and zero violations; generated files and Git status remained clean. The integration audit has fewer references because its dependency checkout differs. The delimiter cleanup passed 82 focused entry/index/migration tests after the full 1,502-test coverage run. Private migration backups and browser evidence remain in the integration workspace, excluded from Git and deployment.

## Live site fidelity continuation, October 10

The user clarified that Studio tabs are acceptable and that the site’s overall craft is the priority. Live original-versus-v11 review found substantive regressions after the earlier interface pass: route identity, font scope, transform validity, camera orientation, mark fill/orientation, gallery ordering, and native dialog paint. [Site fidelity restoration](../../implementation/site-fidelity.md) records the repairs and their exact visual review scope. Shared reading and window controls now preserve the original composition while retaining the v11 engines. The new request proxy and route-aware render cookie preserve built-in identity before hydration; custom profiles still paint after browser restoration. Earlier test/build success did not establish comprehensive visual fidelity. The full scene/browser/device matrix remains a release check.

The production fidelity follow-up passes all 1,512 tests across 92 files, both TypeScript trees, lint with zero errors, generated assets and theme equivalence, all retained source gates, and a fresh production build. Real-content desktop/mobile captures and the nested project lightbox are covered by `tools/perf/site-fidelity-smoke.mjs`; the one-context lease and held-drag/scroll checks pass on that production preview. See [site fidelity restoration](../../implementation/site-fidelity.md) for the repairs and the bounded verification scope.

## Design-system and source cleanup continuation

The second comparison pass moves the Context Strip immediately to the left of the window picker at desktop and intermediate widths, including when the desktop menu is open. The palette uses authored icons, inset search material, native popover entry/exit, and the site's raised selection treatment. Its empty header flex space no longer intercepts page controls. Album menu links and highlighting share canonical route identity. Theme Studio and Navigator window controls use the same site materials. Notebook is one bounded desktop workbook with scrolling page lists and a mobile stack; the shared custom audio controls replace the disconnected native audio presentation.

The original shadow geometry alone was insufficient: the old shadow tint came from the light palette's historical HSL shade, not the new text endpoint. All 59 built-ins and saved-theme import now preserve that authored tint. The reference fixture verifies palettes, browser tint, and shadows without retaining old executable configuration. Dependency analysis removes the obsolete component/helper trees, duplicate type modules, unused icon/CSS modules, and redundant migration generator. Only data migration boundaries remain.

The follow-up coverage run passes 1,575 tests in 93 files. Both application type checks pass, and lint has zero errors with nine existing image-policy warnings. Production visual/interaction evidence and remaining browser/device limits are recorded in [site fidelity restoration](../../implementation/site-fidelity.md).

A further dark-mode check exposed runtime requests for unreviewed schemes excluded from generated CSS. Published paint now uses the available authored scheme while retaining the stored preference; Studio keeps unreviewed draft preview available. Registry-wide and DOM checks cover built-ins, retained preferences, and an active profile becoming reviewed.

## Second cleanup handoff

The main checkout on `rewrite/v11` fast-forwarded through `e713d029` (single presentation tree, authored shadow tint, command layout/materials, contained Notebook and audio controls, published-scheme availability) and `1c17fb7c` (Studio and Notebook use actual widget surface layers). Its production build passes directly against the isolated `v11/` corpus. The main output trace check reports 38 manifests, 46,452 references, and zero violations; generated files and Git status remain clean. Empty obsolete component/helper directories containing only Finder metadata were also removed from disk.

The final production browser run passes desktop/intermediate strip placement, palette keyboard dispatch and click-through, mobile navigation and palette bounds, Notebook containment, Studio, and audio controls in authored light and dark paint. The separate dark-preference Whiteout case confirms supported paint fallback. Real-content route/readers/lightbox checks pass, and the one-context lease and held drag/scroll performance checks remain green. Private captures and reports stay in the ignored integration workspace. No Git push or frontend deployment was performed. The full cross-browser/device matrix remains release work.
