# X8 — Program status

Updated October 9, 2026 after importing the offline `rewrite/v11` branch and reconciling the later main-branch rendering changes. This document supersedes the earlier implementation checkpoint. The application runs through v11 hosts and native features; the old theme editor, context providers, backdrop wrappers, window wrappers, and client/server data layers are removed.

The branch is implemented and locally verified, but the entire charter is not yet release-certified. The remaining external/manual gates below are explicit; none is counted as a passing result.

## Implementation

| Area | Current behavior |
| --- | --- |
| Themes, surfaces, marks | 59 validated built-ins, generated first-paint CSS, perceptual ramps, dual/single schemes, profile migration/persistence, independent account revisions, authored mark geometry and SVG/PNG export. Latest main inset highlight/tint behavior is reconciled through surface-edge. |
| Theme Studio | Five panels, one lazy shared picker, gamut-aware color input, extended gradient positions, ordered ramp stops, layer conversion/reorder/duplication, gesture-coalesced undo/redo, contrast review, profile/image import and save/apply. Route and native window use one implementation. |
| Backdrops | All 36 authored scene identities survive, parameterized by resolved theme palettes. One document Canvas/WebGL context is leased between the page and active Studio preview. Inactive surfaces retain a captured frame; reduced motion uses authored still representations. |
| Windows and overlays | 17 lazy native window tools; imperative Pointer Events drag/resize, keyboard geometry, normalized persistence, focus restoration, native modal/popover layers, image carousel/grid/lightbox. |
| Content and identity | Canonical entries, shared document renderer, paginated validated reads, UUID-addressed comments/replies/reactions with bounded CAS retries, verified OAuth exchange, account/session checks, independent settings/theme/workspace revisions. Public author/RSS/entry tag caches exclude viewer/session data. |
| Notebook/workspace | UUID pages, grapheme-safe exclusive UTF-16 spans, Markdown import/export, coalesced workspace persistence, tree viewed IDs, sticky dismissal and calculator appearance. |
| Navigation/accessibility | Command palette with route/theme/profile/widget/settings/entry providers; contribution-based Context Strip, short-notification routing, CSS scroll navbar, focus treatment, reduced motion, forced colors and live route/theme/image announcements. |
| Tooling/migration | Deterministic prebuild with freshness checks, isolated canonical seed, byte-verified backup/restore/resume/idempotency tools, multipart image-upload transport/decode bounds, 100 shared-prop icons with unchanged geometry. |

Retained `components/theme/config` files are migration verification fixtures, not a second runtime. Some presentation widgets remain under `components/`; their live imports use the native feature contracts. Unused date/Markdown/layout/helper packages are removed from the manifest. `color-convert` remains for the penumbra migration fixture.

## Charter evidence

| Gate | Local evidence | Remaining requirement |
| --- | --- | --- |
| S1 | Registry-derived IDs and completeness tests; one theme file plus registry entry | None |
| S2 | Imperative ThemeHost/SchemeHost; selector/DOM tests avoid palette-driven React updates | Full nine-scenario profiling build and committed baseline remain unmeasured |
| S3 | Gesture/Profiler tests; 3-second browser drag at 4x CPU records no sampled root transitions or storage writes, one persisted geometry write on release | Frame sampling can miss paired commits within one frame; full profiler baseline is still needed |
| S4 | Actual NumberField Profiler: 50 scrubs update only the owning control; 200-frame gesture writes no profile storage until release | Cross-browser high-refresh-device trace |
| S5 | 22.6 KB Brotli, 466.2 KB raw, 90 theme/scheme blocks; freshness enforced | None |
| S6/S7 | Zero @apply and no interfaces/ ambient-type directory | None |
| S8 | 216 scene/theme captures, zero runtime/asset failures; authored still-scene defects corrected and recaptured | Broader route/viewport equivalence matrix remains separate |
| S9 | Fake ETag store plus isolated filesystem concurrency/backup/restore tests pass | Live scratch-prefix S3 conditional-write/versioning confirmation, V-5/V-7 |
| S10 | Pipeline, directive recovery, registry/render fallback, and isolated migration/round-trip tests pass | Golden rendered comparison against the actual production corpus |
| S11 | Production route script-size report records raw/gzip/Brotli bytes | Original main baseline absent; the 60% reduction target is unmeasured |
| S12 | Runtime reduced-motion policy, scene still/frame tests, shared motion helper and CSS overrides | Manual Safari/Firefox and device audit |
| S13 | Chromium axe scan: 15 tested route/overlay/mobile states, zero violations | Manual contrast findings, screen reader/device and other-engine checks |
| S14 | Full Vitest coverage run passes unchanged path thresholds | 1,452 tests / 85 files; thresholds unchanged |
| S15 | PR workflows run lint/types/coverage/build/generated checks/theme size, Chromium accessibility/interactions/performance and current route size reports | Full baseline-comparison visual/performance gates are not implemented |
| S16 | Section/global boundaries and not-found loader tests; native route smoke | Production configuration confirmation |
| S17 | Spelling gate runs in CI | None after final document scan |

## Verification

The isolated production build passed (34 routes), and a clean npm ci installed 901 packages from the normalized public-registry lockfile. Both strict source/tools and complete application type checks passed. Lint passed with zero errors and 10 remaining warnings (native image delivery, standalone global-error home anchor and a migration fixture binding). Spelling scanned 915 files with zero findings; 65 stylesheets parsed/recognized with zero failures; directive placement, unchanged comment/z-index/polling checks, and all generated-artifact freshness checks passed. The owned data/document/account/workspace suite passed 609 tests across 30 files. The full coverage run passed 1,452 tests across 85 files after SVG-scoping and ramp-endpoint regression tests were added; document, theme, storage and migration thresholds passed without changing their targets.

The final production browser run passed 25 interaction steps across windows/media/notebook/mobile navigation, command-palette modal focus, and Studio. Studio text/panel contrast remained 12.61:1 after ramp-stop insertion; real SVG/PNG downloads and profile refresh were verified. Fifteen Chromium accessibility states had zero violations, with incomplete contrast/link/attribute checks retained for manual follow-up. Three performance scenarios at 4x CPU recorded no sampled React root transitions, storage writes, or long tasks during held drag and navbar scroll; release produced one geometry persistence write. The production renderer retained one context, one canvas and the same canvas identity across page/window focus, close and SPA return; a separately painted PNG export mounted no canvas.

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
ZIMO_WEB_LOCAL_STORAGE_ONLY=true npm run start -- --port 3481
node tools/perf/browser-smoke.mjs http://localhost:3481
node tools/perf/navigation-smoke.mjs http://localhost:3481
node tools/perf/studio-smoke.mjs http://localhost:3481
node tools/perf/accessibility-smoke.mjs http://localhost:3481
node tools/perf/interaction-performance-smoke.mjs http://localhost:3481
NODE_ENV=production node tools/perf/size-report.mjs http://localhost:3481
```

## Current route script payload

Measured from the production preview after initial hydration, independently recompressed; this is a current measurement, not the S11 reduction comparison.

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
- Production migration, scratch-bucket checks, original-main performance/JS baselines, the 1,062 full visual comparisons, manual VoiceOver/forced-colors/120Hz-device checks, and Safari/Firefox browser regression remain release work. No production content was mutated, and this implementation has not been deployed.

Read [implementation decisions](X6-implementation-decisions.md), [application contracts](../../architecture.md), [Studio runtime](../../implementation/theme-studio.md), [native interactions](../../implementation/native-interactions.md), [backdrop runtime](../../operations/backdrop-runtime.md), and [content migration](../../operations/content-migration.md).

## Repository handoff

The main checkout at /Users/zimoluo/Documents/CodesForFun/zimo-web is on rewrite/v11 with implementation commit 8a941a8a, following f26df117's merge of the newer main rendering changes. A clean dependency installation and the full 34-route application production build were also verified directly there using the integration fixture root; generated files and Git status stayed clean. The old root app/interfaces/prebuild-helper directories contained only Finder metadata and were removed because an otherwise empty app directory shadows src/app in Next. The obsolete main build cache was preserved outside the checkout before regeneration.

The originally copied aug21 folder and its corresponding zip are removed. Imported Git history/stash references and private local-state safety archives remain recoverable; the main checkout's environment and local content were preserved. Stable main has not been advanced to this release, and no remote push or deployment was performed. The local production preview uses synthetic fixtures, not production content.
