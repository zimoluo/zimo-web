# X2 — Task ledger

Every task: an ID, its inputs, its deliverable, its acceptance criteria, and how to verify. `C-n`
references point at the acceptance table of the named spec document. Tasks are sized to one PR.

Legend: **B** = blocked by. Sizes are S (< ½ day), M (½–2 days), L (2–5 days), XL (> 5 days; split
if you can).

---

## Phase 0 — Instrument

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **P1-01** | Build `tools/perf/profile.ts` with the nine scenarios (P1 §9). Capture and commit baselines from `main`. | L | — |
| **P1-02** | Build `tools/visual/capture.ts` (Playwright, 59 themes × 6 routes × 3 viewports, backdrop frozen). Capture and commit the baseline. | L | — |
| **P1-03** | Wire `@next/bundle-analyzer`; commit per-route JS size baselines. | S | — |

Acceptance: baselines exist, are committed, and `profile.ts <scenario>` reproduces them within
10 % on the same machine.

---

## Phase 1 — Foundation

### Hygiene — do `H-01` before anything else in this phase (`03-hygiene.md`)

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **H-01** | Vitest (node + jsdom projects), Playwright, `test/` fixtures and helpers, coverage thresholds per `03-hygiene §1`, `test`/`typecheck` scripts. | L | — |
| **H-02** | `ci.yml`, `visual.yml`, `perf.yml`; scratch-prefix AWS secret for integration tests. | M | H-01 |
| **H-05** | Move page content out of the seven `layout.tsx` files into `page.tsx`. | M | FN-01 |

### Structure

> Foundation task IDs are `FN-nn`. They are **not** the `F-nn` findings of `01-audit.md`, which
> occupy a separate namespace. Cross-references elsewhere in this spec use the `FN-` prefix for
> tasks and the bare `F-` prefix for findings.

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **FN-01** | Create `src/` and move `app`, `components`, `lib` under it. Update `tsconfig` paths and `next.config`. No logic changes. | M | — |
| **FN-02** | Split `components/` into `features/` and `ui/` per `02-conventions §1`. Icons → `ui/icons/`. | L | FN-01 |
| **FN-03** | Move the 121 theme-maker files to `features/theme/studio/`; leave `app/design/theme-maker/{page,layout}.tsx`. | M | FN-02 |
| **FN-04** | Convert `interfaces/**` (17 files, ~90 names) to modules colocated by domain; delete `interfaces/`. | L | FN-02 |
| **FN-05** | Enable `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`. Fix fallout. | L | FN-04 |
| **FN-06** | `lib/errors.ts`: `AppError`, `ErrorCode`, the status/problem-type table. | S | FN-01 |
| **FN-07** | `lib/datetime.ts` on `Intl`; replace all `dayjs`/`date-fns` call sites; remove both deps. | M | FN-01 |
| **FN-08** | `lib/gesture/useDragGesture.ts` (P1 §4). Pointer Events, capture, rAF coalescing, modifier ref. | M | FN-01 |
| **FN-09** | Replace the 14 `lodash` imports with named local helpers; remove `lodash`. | S | FN-01 |
| **FN-10** | `lib/store/` scaffolding: zustand + immer + `createThrottledJsonStorage` (D5 §4). | M | FN-01 |
| **FN-11** | Migrate `.eslintrc.json` → `eslint.config.js` (flat, eslint 9). Add `eslint-plugin-import` `no-restricted-paths` for `app → features → ui → lib` and the selector-less-store-hook rule (P1 §3). | M | FN-10 |
| **FN-13** | `tools/lint-spelling.ts`: fail on the British-form word list in `02-conventions §2`; wire into `ci.yml`. | S | H-02 |
| **FN-12** | Delete `prebuild-helper/svg-id-randomizer.js` (F-69). Triage all **19** files carrying the `"id random"` sentinel per T7 §3.1 — inert ids deleted, single-render ids given a static prefix, `useId` only where a component can render twice with different content. Record each disposition. | M | FN-02 |

Acceptance: `FN-04` → 0 ambient global types (gate S7). `FN-05` → typecheck clean. `FN-11` → 0
lint violations. Build and site behavior unchanged; `P1-01` baselines still pass.

---

## Phase 2 — Color and theme core

### T2 — Color engine

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **T2-01** | `color/types.ts`, `color/srgb.ts` (transfer functions, hex ↔ linear). | S | FN-01 |
| **T2-02** | `color/oklab.ts`. Both directions. Assert the `#a21caf` vector (T2 C2). | S | T2-01 |
| **T2-03** | `color/gamut.ts`: `isInGamut`, `maxChroma` with memoization, `toGamut`. | M | T2-02 |
| **T2-04** | `color/ramp.ts`: `RampSpec`, `RampStop`, `toneLightness` + inverse, `toneRelativeChroma`, `toneHue`, `sampleRamp`, `blendDeviations`. | L | T2-03 |
| **T2-05** | `color/format.ts`, `color/contrast.ts` (WCAG, APCA, ΔE_OK). | M | T2-02 |
| **T2-06** | Specs for all of the above, including the §5.7 test-vector tables verbatim. | M | T2-04 |
| **T2-07** | Delete `lib/themeMaker/colorHelper.ts`; remove `color-convert`. | S | T2-05 |

Acceptance: T2 C1–C10.

### T3 — Schema

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **T3-01** | `model/types.ts`: `ThemeSource`, `SchemeSet`, `RoleMap`, `RoleValue`, `ColorRef`, `GradientLayer` union, `SurfaceSource`, `MarkSource`, `BackdropSource`, `ReadingSource`. | M | T2-04 |
| **T3-02** | `model/defaults.ts`: `defaultLightRoles`, `defaultSurfaces` (all seven), `defaultReading`, `model/curves.ts` presets. | M | T3-01 |
| **T3-03** | `model/resolve.ts`: the 8-step pipeline (T3 §5), including `mirror` and alias topological resolution. | L | T3-02 |
| **T3-04** | `model/schema.ts`: Zod schemas, `loadThemeSource`, all §7 constraints. | L | T3-01 |
| **T3-05** | `registry/index.ts` with `satisfies`, derived `ThemeId`, `themeOrder` + its completeness test. | S | T3-01 |
| **T3-06** | Delete `lib/themeMaker/themeConfigTypeGuard.ts`, `layerHelper.ts`, `profileOptimizeTool.ts`. | S | T3-04 |
| **T3-07** | Compile-fail fixtures: `posX` on a linear layer, alias cycle, incomplete single-scheme `roles`. | S | T3-04 |

Acceptance: T3 C1–C8.

### T4 — Compiler

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **T4-01** | `compile/surface.ts`: `layerToCss` (exhaustive switch), stop serialization with the alpha `calc()`, `formatOklchWithAlpha`. | M | T3-03 |
| **T4-02** | `compile/compile.ts`: the full `CustomPropertyMap` contract (T4 §1). | M | T4-01 |
| **T4-03** | `compile/apply.ts`: `applyProperties` with diffing, `compileToCss`. | S | T4-02 |
| **T4-04** | `tools/build-theme-css.ts`; wire into `prebuild` and `build`; commit `themes.generated.css`; CI freshness check. | M | T4-02 |
| **T4-05** | `runtime/ThemeHost.tsx`; the no-flash inline scheme script; `data-theme`/`data-scheme` on `<html>` from the server. | M | T4-03 |
| **T4-06** | Golden-file snapshots per theme per scheme. | S | T4-04 |
| **T4-07** | Delete `lib/colorPaletteParser.ts`, `lib/themeMiscParser.ts`, `components/theme/util/ThemeApplier.tsx`, `ThemeDataInitializer.tsx`. | S | T4-05 |

Acceptance: T4 C1–C10.

### T9 — Theme migration

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **T9-01** | `model/lift-v1.ts`: the 12-step lift, shared by CLI and runtime. | L | T3-04 |
| **T9-02** | `tools/migrate-themes.ts`: TS-compiler-API reader + module-eval reader for the 5 generated themes; emit + Prettier + registry wiring. | L | T9-01 |
| **T9-03** | Run it. Review all 59 diffs. Investigate any `maxDeltaEOk > 0.002`. | L | T9-02 |
| **T9-04** | `tools/verify-theme-migration.ts` (T9 §5) reusing the `P1-02` harness. | M | T9-02, P1-02 |
| **T9-05** | Wire `lift-v1` into `loadThemeSource` for runtime v1 profiles. | S | T9-01 |
| **T9-06** | `tools/contrast-report.ts` over the registry (59 × 2 × 6 pairs). Gate only the rows U3 §3.5 marks enforced. **Do not nudge authored role positions** — that would break T9 C1/C2. File a design ticket per authored-scheme failure. | M | T9-03 |

Acceptance: T9 C1–C10.

---

## Phase 3 — Tailwind v4, surfaces, mark

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **P5-06** | Rewrite the 5 custom `shadow-xs` → `shadow-2xs`. **Ship against v3 first.** | S | — |
| **P5-07** | Audit bare `border`/`border-*`/`ring` for v4's `currentColor` default; add explicit colors. **Against v3.** | M | — |
| **P5-01** | Install `@tailwindcss/postcss`; run `npx @tailwindcss/upgrade`; review the full diff. | M | P5-06, P5-07, T4-02 |
| **P5-02** | Author `globals.css` (`@theme`, `@theme inline`, imports); delete `tailwind.config.ts`. | M | P5-01 |
| **P5-03** | Port the two plugins to `@utility`; single unprefixed mask. | M | P5-02 |
| **P5-04** | `tools/codemod-unapply.ts`; run; hand-finish the ~22 it cannot resolve. | L | P5-02 |
| **P5-05** | Convert `celebration.module.scss` → CSS; remove `sass`, `autoprefixer`, `postcss-each`, `baseline-browser-mapping`. | S | P5-01 |
| **P5-08** | Visual regression across the full matrix; triage every diff. | M | P5-04, P1-02 |
| **T5-01** | `defaultSurfaces` for all seven surfaces; the lens model values (T5 §4.2). | M | T3-02, P5-03 |
| **T5-02** | `styles/surfaces.css`: seven utilities + alpha modifier + `surface-edge` + `surface-variant-*`. | M | T5-01 |
| **T5-03** | Variation compiler: emit `count` image variants (T5 §4.3). | M | T4-01, T5-01 |
| **T5-04** | `tools/codemod-surfaces.ts`; run; classify the ~22 remainder by hand. | L | T5-02 |
| **T5-05** | Lens-model A/B review across 6 themes; tune `widget` alpha and blur by eye. | M | T5-04 |
| **T7-01** | `MarkSource` + `ResolvedMark` + `resolve` integration. | S | T3-03 |
| **T7-02** | `mark/Mark.tsx` as a server component; `useId` for gradient ids; single code path for `backdrop` mode. | M | T7-01 |
| **T7-03** | `exportMarkSvg`; delete `lib/themeMaker/faviconHelper.tsx`. | M | T7-02 |
| **T7-04** | Move browser-icon generation to `tools/build-browser-icons.ts` and asset optimization to `tools/optimize-assets.ts` (T7 §3); add a `prebuild` script; await every `sharp` write; document or drop `EXCLUDED_PATHS`. | M | — |
| **T7-05** | `<meta name="theme-color">` from the `brand` role, server-rendered. | S | T7-01 |

Acceptance: P5 C1–C12, T5 C1–C10, T7 C1–C8.

---

## Phase 4 — Data

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **D1-01** | `EntrySummary`, `Entry`, `ImageAsset`, `SectionExtras`, `AuthorRef`, `Comment`, `Reply`, `Slug` + `parseSlug`. | M | FN-04 |
| **D1-02** | Author registry (`features/entries/authors.ts`); remove the `zimo` special case. | S | D1-01 |
| **D1-03** | Section index model + `tools/reindex.ts` with `--check`. | M | D1-01, D4-03 |
| **D2-01** | `features/document/parse.ts`: the 12-plugin pipeline, `remarkComponents`, `remarkGlyphs`, `remarkHeadingIds`, `remarkOutline`. | XL | D1-01 |
| **D2-02** | Component registry with `ComponentSpec`, schemas, `environment`; port the 8 content directives. | L | D2-01 |
| **D2-03** | Move the 21 inline SVGs to `ui/icons/`; `:glyph[]` directive; `@@x@@` deprecation path. | M | D2-01 |
| **D2-04** | `features/document/render.tsx` (`DocumentView`); wire into both routes and both window readers. | M | D2-02 |
| **D2-05** | `marks.ts`: `renderMarks`, `stripMarks` on `micromark` inline. Replace `lightMarkUpProcessor`. | M | D2-01 |
| **D2-06** | `outline`, `plainText`, `readingMinutes` from the tree; delete `generateTOCSectionData`, `needTOC`, `findTopLevelHeader`, `readingTime`. | M | D2-01 |
| **D2-07** | Golden-file render harness over all existing documents (D2 C4, gate S10). | L | D2-04 |
| **D2-08** | Remove `marked`, `marked-katex-extension`, `html-escaper`; move `highlight.js` server-side. | S | D2-04 |
| **D4-01** | `server/storage/{client,keys,object}.ts`: one client, one codec, `Versioned<T>`, schema-validated reads, timeout. | L | FN-06 |
| **D4-02** | **Verify S3 conditional writes** (V-5). Decide CAS vs key partitioning. Record the decision as an ADR. | S | D4-01 |
| **D4-03** | `server/storage/mutate.ts`: `mutateJson` with bounded jittered retry. | M | D4-02 |
| **D4-04** | Port every mutation to `mutateJson`; concurrency tests (D4 C5, C6; gate S9). | L | D4-03 |
| **D4-05** | `tools/backup.ts`; check bucket versioning and prefer version ids if enabled. | S | D4-01 |
| **D3-01** | `handler` wrapper + `problemResponse` + the `ErrorCode` → status/type table. | M | FN-06 |
| **D3-02** | The nine `/api/v1/*` route handlers. | L | D3-01, D1-01, D4-01 |
| **D3-03** | The eleven Server Actions; delete `lib/dataLayer/client/`. | L | D4-04 |
| **D3-04** | Session: cookie rename, `SameSite=Lax`, `iat` rotation, per-request `cache`. | M | D3-01 |
| **D3-05** | `cacheLife`/`cacheTag`/`revalidateTag` per the D3 §6 table; remove every ad-hoc `revalidate`. | M | D3-02 |
| **D3-06** | Replace the three polling intervals with focus/visibility refetch + `useOptimiztic`. | M | D3-03 |
| **D3-07** | Rate limiter (D3 §7); CORS helper with `Vary: Origin` (D3 §8). | M | D3-01 |
| **D5-01** | The six store slices; `Settings` v3 shape; defaults with no theme imports. | L | FN-10 |
| **D5-02** | `features/settings/migrate.ts`: the 41-row table + its coverage test. | M | D5-01 |
| **D5-03** | Port all 115 `useSettings` consumers to selectors. | XL | D5-01 |
| **D5-04** | `zw.render` cookie (D5 §6) + server read in the root layout. | M | D5-01 |
| **D5-05** | Delete the seven data-carrying contexts (D5 §7). | M | D5-03 |
| **D6-01** | Migration harness: dry-run default, idempotency, backup, report, resume, verify. | L | D4-01 |
| **D6-02** | `documents` step (D6 §2), including the inline-mark token-stream rewrite. | XL | D6-01, D2-01 |
| **D6-03** | `entries` step, including image measurement and LQIP generation. | L | D6-01, D1-01 |
| **D6-04** | `comments`, `reactions`, `users`, `keys`, `index` steps. | L | D6-01, D5-02 |
| **D6-05** | Dry-run everything against production; triage the report. | M | D6-02, D6-03, D6-04 |
| **D6-06** | Restore test on a copied prefix (D6 C6). | M | D6-01 |
| **D6-07** | Execute the migration with `--commit`. | M | D6-05, D6-06 |
| **H-03** | Route boundaries: `global-error`, `error`, `not-found`, `loading`, plus four section `not-found`; `notFound()` in entry loaders. | M | H-05 |
| **H-04** | `app/sitemap.ts` from the section indexes; add `sitemap` to `robots.ts`. | S | D1-03 |
| **H-06** | Implement `data/D7-notebook.md`: exclusive `to`, `normalizeSpans`, grapheme clamping, `spansToMarkdown`/`markdownToSpans`, migration. | M | D1-01 |
| **H-07** | `features/search/` with a parsed grammar + `README.md`; port the four call sites. | L | D1-03 |
| **D2-09** | Measure brotli hast vs brotli markdown for the ten largest articles; decide the client transport per D2 §1. | S | D2-01 |

Acceptance: D1 C1–C9, D2 C1–C12, D3 C1–C12, D4 C1–C11, D5 C1–C11, D6 C1–C11.

---

## Phase 5 — Engines

### P2 — Windows

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **P2-01** | Normalized `windowStore`; `element-registry.ts`. | M | D5-01 |
| **P2-02** | `WindowDefinition` / `WindowInstance` split; lazy definition registry. | L | P2-01 |
| **P2-03** | Extract `solveDrag`, `solveResize`, `solveSnap`, `solveTidy` as pure functions — verbatim behavior. | L | P2-01 |
| **P2-04** | Specs for the four solvers, including the 24-case snap fixture set and the adaptive-anchor matrix. | L | P2-03 |
| **P2-05** | `WindowFrame` + imperative gesture writer on `useDragGesture`. | L | P2-03, FN-08 |
| **P2-06** | Split `WindowInstance.tsx` into the seven `ui/` components. | M | P2-05 |
| **P2-07** | Persistence: `zw.windows`, throttled, validated restore. | M | P2-02 |
| **P2-08** | Accessibility: `role="dialog"`, labels, focus management, keyboard move/resize (P2 §8). | M | P2-06 |

Acceptance: P2 C1–C12 (gate S3).

### P3 — Image viewer

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **P3-01** | Scroll-snap track + `useScrollSnapIndex` with the `IntersectionObserver` fallback. | M | FN-01 |
| **P3-02** | **Decide image delivery** (P3 §3.1) on measured storage cost; ADR. | S | — |
| **P3-03** | Derivative generation in `tools/migrate/entries`; loader or `srcset`. | L | P3-02, D6-03 |
| **P3-04** | Grid mode via `withViewTransition` + CSS grid; delete the imperative code. | M | P3-01 |
| **P3-05** | `priority`/`loading`/`sizes` correctness; `placeholder="blur"`. | M | P3-03 |
| **P3-06** | Lightbox as `<dialog>` + `showModal`; delete `DarkOverlay` and the manual `Escape`. | M | P3-01 |
| **P3-07** | Keyboard + accessibility (P3 §5); themed caption via the `overlay` surface. | M | P3-01, T5-02 |

Acceptance: P3 C1–C12.

### P4 — Notifications

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **P4-01** | `notificationStore` with pure `promote`/`enqueue`/`dismiss`; property tests. | M | D5-01 |
| **P4-02** | `NotificationLayer` + `NotificationCard`; CSS placement; delete the five old components and `MobileDesktopEntryRenderer`. | L | P4-01 |
| **P4-03** | `@starting-style` + `allow-discrete` enter/exit; delete the `max-height` animation. | M | P4-02 |
| **P4-04** | Swipe on `useDragGesture`; `useAutoDismiss` with hover/focus pause. | M | P4-02, FN-08 |
| **P4-05** | `tone`, `dedupeKey`, `action`; `aria-live`; visible close at all widths. | M | P4-02 |

Acceptance: P4 C1–C11.

### T6 — Backdrops

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **T6-01** | `SceneModule` contract; registry with derived `SceneId`; `resolveQuality`. | M | T3-01 |
| **T6-02** | `BackdropStack` + `SceneCanvas` (single WebGL context, lazy three.js) + `useSceneUniforms`. | L | T6-01 |
| **T6-03** | `glsl/` chunk library; `displaced-field` and `displaced-sphere` absorbing 4 scenes. | L | T6-02 |
| **T6-04** | Port the remaining 32 scenes to the contract; palette injection; SVG treatment per T6 §3.1. | XL | T6-01 |
| **T6-05** | Consolidations per T6 §6, each A/B screenshot-verified; abandon any that fails. | L | T6-04 |
| **T6-06** | `quality: "still"` static frame for every scene; reduced-motion assertion. | M | T6-04 |
| **T6-07** | Delete `Gallery3DAnimatedBackgroundSimple.tsx`, `backgroundAnimationMap.tsx`, `ThemeAnimatedBackgroundKey`. | S | T6-04 |

Acceptance: T6 C1–C10 (gate S8).

### T8 — Studio

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **T8-01** | `studioStore` with immer patches, undo/redo; id-based selection. | L | D5-01, T3-01 |
| **T8-02** | Live preview: `resolve`+`compile`+`applyProperties` on the preview root, rAF-coalesced. | M | T4-03, T8-01 |
| **T8-03** | Debounced commit to `themeStore`; debounced account sync. | M | T8-01, D5-01 |
| **T8-04** | The single popover color picker (T8 §3.1): `colorPickerStore`, `useColorPicker`, `ColorSwatch`, native `popover` + anchor positioning, hue wheel, L×relC pad, tone rail, numeric fields, eyedropper. Delete the four `*PanelPropsGenerator` components, `ColorPanelContext`, `react-colorful`, `colorful-style.css`. Then the seed panel (hue / chroma / torsion). | XL | T8-02 |
| **T8-05** | Ramp editor: strip, role markers, control stops, per-stop deviation tabs. | XL | T8-02 |
| **T8-06** | Curve presets; `lightest`/`darkest` endpoints. | M | T8-05 |
| **T8-07** | Port the gradient editor to the store; kind-switch conversion; `niceRange` bounds. | L | T8-01 |
| **T8-08** | `ControlsFromSchema` + backdrop scene panel. | L | T6-01, T8-01 |
| **T8-09** | Contrast panel (WCAG + APCA, six pairs). | M | T2-05, T8-02 |
| **T8-10** | Remove the six editor directives from the document registry; make the Studio a route. | M | D2-02 |
| **T8-11** | Profile management via the settings store; one implementation shared with the window widget. | M | T8-03 |

Acceptance: T8 C1–C10 (gate S4).

---

## Phase 6 — Experience

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **U1-01** | Motion tokens + reduced-motion override; `lib/motion.ts` with `withViewTransition`. | S | P5-02 |
| **U1-02** | `--zw-radius-*` scale + `radius-inner`; apply concentricity where it is currently hand-computed. | M | P5-02 |
| **U1-03** | Elevation ladder applied: audit every elevated element against the six levels. | L | T5-04 |
| **U1-04** | `IconProps` unification; `currentColor`; remove the 40 `color?: HexColor` props. | M | FN-02 |
| **U1-05** | `text-wrap: balance`/`pretty`; `font-variant-numeric: tabular-nums`. | S | P5-02 |
| **U2-01** | Navbar collapse via `animation-timeline: scroll()`; shrink the navigation store. | M | P5-02 |
| **U2-02** | Command palette: `popover`, `⌘K`, providers for themes/profiles/widgets/routes/settings/entries. | XL | D5-01, D1-03 |
| **U2-03** | Context strip + `useStripContribution` + the priority resolver. | L | U2-02 |
| **U2-04** | Pill ↔ palette morph via `withViewTransition`. | M | U2-03, U1-01 |
| **U2-05** | Route qualifying confirmations to the strip; `shouldRouteToStrip`. | M | U2-03, P4-01 |
| **U3-01** | Global `:focus-visible`; remove every unreplaced `outline-none`. | M | P5-02 |
| **U3-02** | `inert` on the side menu; focus restoration for every dismissible surface. | M | U3-01 |
| **U3-03** | Announcements: route change, theme change, comment post, image page. | M | P4-01 |
| **U3-04** | 44 px hit areas; Playwright bounding-box audit. | M | U3-01 |
| **U3-05** | axe-core in CI over 9 routes + 3 overlay states. | M | U3-01 |
| **U3-06** | Forced-colors mode audit and fixes. | M | U3-01 |

Acceptance: U1 (review), U2 C1–C11, U3 C1–C11 (gate S12, S13).

---

## Phase 7 — Close

| ID | Task | Size | B |
| --- | --- | --- | --- |
| **X-01** | Verify all 16 charter gates; record results. | M | all |
| **X-02** | Delete every file listed in T4 §7, D5 §7, P4 C4, T6-07. Assert no dangling imports. | S | all |
| **X-03** | Final visual regression + perf comparison against Phase 0. | M | all |
| **X-04** | `README.md` update; write `CLAUDE.md` (architecture map, invariants, where to add things). | M | all |
| **X-05** | Reconcile `01-audit.md`: every finding closed or deferred with an X5 entry. | S | all |

---

## Task count and shape

162 tasks: 32 S, 85 M, 39 L, 6 XL. The 6 XL tasks are the ones to watch, and each has a
stated split if needed:
stated split if needed:

| XL task | Split on |
| --- | --- |
| T8-04 color picker | picker shell + store + anchoring, then the four controls |
| D2-01 pipeline | per plugin: directives / glyphs / ids+outline. The `@@x@@` back-compat path (D2 §4.1) is its own sub-task — it needs a micromark syntax extension, not a directive. |
| D5-03 selector port | per feature directory, behind the compatibility shim (X5 R-08) |
| D6-02 documents migration | per transform: components / glyphs / marks / front-matter |
| T6-04 scene port | by scene class (DOM-CSS / DOM-SVG / r3f) |
| T8-05 ramp editor | strip render / role markers / stop editing |
| U2-02 palette | shell+search / per command provider |
