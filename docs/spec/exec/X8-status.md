# X8 — Program status

Where the v11 rebuild actually stands. Written against the tree, not against intent.

Read with `X6-implementation-decisions.md` (what diverged from the spec, and why) and
`X7-platform-checks.md` (which platform facts are confirmed).

## 1. Charter gates

`00-charter §5`'s 17 gates, each measured the way `X4 §2` prescribes.

| Gate | Target | Measured | State |
| --- | --- | --- | --- |
| S1 | Adding a theme touches one file + one registry line | registry index derives `ThemeId` from the registry object; `themeOrder` completeness is a unit test | **pass** |
| S2 | Theme switch = 0 React commits | `ThemeHost` written and mounted; it renders `null` and subscribes imperatively. Commit count not yet measured (needs the profiling build) | **partial** |
| S3 | Window drag = 0 React commits | geometry solvers tested, and `useDragGesture` writes to the DOM inside a frame-coalesced `onMove` with no `setState` on the path. The store and the commit measurement are outstanding | **partial** |
| S4 | Stop scrub re-renders ≤ 1 component | `T8` not started | **not started** |
| S5 | Theme CSS < 60 KB br | **22.6 KB br** (37.6 % of budget), 466 KB raw, 90 theme×scheme blocks | **pass** |
| S6 | `@apply` occurrences = 0, from 149 | **0** | **pass** |
| S7 | Ambient global types = 0, from 17 files | **0**; `interfaces/` deleted, 86 names now modules | **pass** |
| S8 | Any backdrop under any theme | `T6` not started | **not started** |
| S9 | Concurrent comments lose nothing | 20 parallel `addComment` calls yield 20 comments and 20 parallel reactions yield 20 subjects, against a fake store with real ETag semantics, including the 409 path and ADR-042's attempt bound. A live bucket test still needs `V-5` (`X7 §2.1`) | **partial** |
| S10 | Document round-trip with zero rendered diff | pipeline, renderer and migration built and cross-tested against each other; the golden diff against the *current* build needs the real corpus (`X7 §2.1`) | **partial** |
| S11 | Blog route JS ≤ 60 % of current | no baseline captured (`X7 §2.3`) | **unmeasured** |
| S12 | `prefers-reduced-motion` suppresses non-essential motion | global suppression in `globals.css`, plus the celebration backdrop; per-scene work in `T6`/`U3` outstanding | **partial** |
| S13 | axe-core clean on every route | needs a running app (`X7 §2.3`) | **unmeasured** |
| S14 | Test infrastructure + coverage thresholds | Vitest, **1077 tests**; every threshold in `03-hygiene §1` for a path that exists is met. Playwright absent (`X7 §2.3`) | **partial** |
| S15 | CI runs the checks on every PR | `ci.yml` + `theme.yml`; `perf.yml` absent because `tools/perf/profile.ts` does not exist | **partial** |
| S16 | Error/not-found boundaries; mistyped slug → 404 | 4 global + 5 section boundaries; `notFound()` in the entry loader | **pass** |
| S17 | American spelling throughout | **1024 files, 0 findings** | **pass** |

**6 pass, 7 partial, 2 unmeasured, 2 not started.** S3, S9 and S14 all moved forward inside
`partial`.

## 2. Workstreams

| Workstream | State |
| --- | --- |
| `T2` color engine | **complete.** 100 % statement and branch coverage; the `§5.7` tables assert to exact 8-bit hex |
| `T3` schema | **complete.** Types, `resolve()`, `mirror()`, zod schema, `loadThemeSource` with permanent v1 lifting |
| `T4` compiler | **complete.** `compile()`, `compileToCss()`, `applyProperties()`, gradient serialization, build-time emission, and `§5`'s `ThemeHost` mounted and owning application |
| `T5` surfaces | **complete.** All seven surfaces plus alpha modifiers, variants and `surface-edge`; call sites swept, so `T5 C2` passes — zero `bg-widget-`, `bg-light/`, `bg-pastel bg-opacity-` in the tree |
| `T9` theme migration | **complete.** 59 themes lifted, worst ΔE_OK 0.001639, 0 failures, idempotent |
| `P5` Tailwind v4 | **complete.** v4 installed, config deleted, `@apply` at 0, Sass gone, dependencies removed, `§6`'s renames swept across 292 files |
| `H-01` tests | **complete** for Vitest. Playwright absent |
| `H-02` CI | **2 of 3 workflows** |
| `H-03` boundaries | **complete** |
| `H-04` sitemap | **complete** |
| `T7` identity mark | **complete.** Server component, gradient ids without hashing, no `memo`, `exportMarkSvg`. Its v10 call sites are not yet ported |
| `D5` state | **settings and theme stores complete**, with the throttled storage and the 41-field migration. `windowStore`, `studioStore`, `notificationStore`, `overlayStore`, `workspaceStore` follow their features |
| `T6` backdrops | **contract complete** — `SceneModule`, param validation, `resolveQuality`, GLSL dedup. The 36 scene modules, shared canvas and 36-to-22 consolidation are not written |
| `D2` documents | **complete.** unified pipeline, component registry, micromark glyph tolerance, marks, one renderer for both surfaces. `D2-09` measured but open (ADR-040) |
| `D6` migration | **document and entry syntax complete**, idempotent, dry-runnable. The S3-side backup, restore and reindex steps are not written |
| `D4` storage | **complete on the server side.** One `S3Client` created lazily, one gzip codec, one key module, the object layer that returns ETags, and `mutateJson` driving it. The comment, reaction, settings and tree mutations all go through it. `tools/backup.ts` and the live `V-5` confirmation are outstanding |
| `P2` windows | **geometry, gesture, store and overlay layer complete** — the pure solvers, `useDragGesture`, the normalized store with five-field persistence and dropping restoration, and the overlay layer as `<dialog showModal()>` with a lazy kind registry. The window frame component and the twelve overlay call sites are not ported |
| `P4` notifications | **complete.** Queue, store with one cancellable exit timer, the single presenter with `@starting-style` enter/exit, `useAutoDismiss` with hover and focus pause, and swipe over `useDragGesture`. Its call sites still use the v10 toast context |
| `T8` studio | **not started** |
| `D1` content model | **complete.** Summaries separated from bodies, `ImageAsset` with real dimensions, UUID v7 comment identity, ISO-8601-only dates over `Intl`, branded slugs, the section index and its drift check. The entry migration that fills `width`/`height` is `D6`'s and is outstanding |
| `D3` API | **reads and mutations complete.** The problem+json layer, the sliding-window limiter, CORS, pagination and sparse fieldsets; seven of nine route handlers; the comment, reaction and account Server Actions; sessions with `Lax`, rotation and per-request `cache`. Outstanding: `signIn`'s OAuth exchange, `/tools/image-palette` (needs `T8`'s palette code), `use cache` directives (needs `cacheComponents`, see `V-13`), and deleting `lib/dataLayer/client/` with its 17 consumers |
| `D7` notebook | **not started** |
| `P1` rendering | **the gesture primitive is written** (`§4`), which `P2`, `P4` and `T8` depend on and `P4` now uses. The rest is not started |
| `U1`, `U2` | **not started** |
| `U3` motion | **the token layer is written** — four durations, four easings, and the reduced-motion override declared once at the point of definition. `U3-01`'s literal-`ms` grep and the per-scene work are outstanding |
| `H-05`–`H-07` | **not started** |

## 3. Coexistence: application is v11 only; the editor still previews v10

`04 §1` requires that the old theme engine and the new one never coexist. **The application path
no longer does. The editor still does.**

What is now v11 only, with no v10 fallback and no bridge:

- **Theme application.** `<html data-theme data-scheme>` is set server-side from the `zw.render`
  cookie; `themes.generated.css` supplies built-in themes at first paint with zero client JS;
  `ThemeHost` handles user profiles imperatively. Nothing writes `--color-primary`,
  `--color-highlight-*`, `--color-darklight-*` or `--bg-widget-N` anywhere in the repository.
- **Every class in the markup.** 472 class lists across 292 files were swept to the v11 roles and
  surface utilities. Compiling `globals.css` against the tree emits zero v10 utilities.

What is still v10:

- **`lib/colorPaletteParser.ts`**, imported by eight files — six Studio panels, `ConfigFavicon`,
  and `ThemeMakerWindowToolset` — all of which render *previews* of v10 gradient data. They go
  with `T8`.
- **`components/theme/config/*.ts`**, the 59 v10 configs. They are the migration's input and are
  still read by `tools/migrate-themes.ts` and `tools/verify-theme-properties.ts`, so they outlive
  the engine by design until the registry is the only source.
- **`components/contexts/ThemeContext.tsx`**, consumed by 23 files: 7 Studio, 5 mark, 4 backdrop,
  7 miscellaneous. `T6`, `T7`'s call sites, and `T8` are what retire it.
- **`lib/dataLayer/client/`**, 4 files and 528 lines of `fetch` wrappers, with 17 consumers across
  the comments UI, the account menu, the window loaders and the christmas tree. `D3 C2` deletes it,
  and the v11 side it delegates to now exists — the `/api/v1` reads and the Server Actions. What is
  left is porting those 17 call sites, which is the comments and account UI.
- **`lib/dataLayer/server/`**, whose `accountStateManager.ts` still constructs the second
  `S3Client` in the repository and still throws at module scope when credentials are absent. It goes
  when `signIn`'s OAuth exchange moves to an action; until then `D4 C1` reads two, not one.

`T4 §7`'s deletion list, with present state:

| File | State |
| --- | --- |
| `tailwind.config.ts` | **deleted** |
| `components/theme/util/ThemeApplier.tsx` | **deleted** |
| `components/theme/util/ThemeDataInitializer.tsx` | **deleted** |
| `lib/themeMiscParser.ts` | **deleted** |
| `lib/colorPaletteParser.ts` | present — Studio preview renderer, goes with `T8` |
| `lib/themeMaker/colorHelper.ts` | present |
| `lib/themeMaker/layerHelper.ts` | present |
| `lib/themeMaker/profileOptimizeTool.ts` | present |
| `lib/themeMaker/themeConfigTypeGuard.ts` | present |

Four of nine deleted.

## 4. Debt registered rather than hidden

- **449 lint warnings** in `src/app/`, `components/`, `lib/`, itemized by rule. The notable ones are
  **31 `react-hooks/set-state-in-effect`** and **14 `react-hooks/refs`** — independent evidence for
  `P1`'s rendering claims and for F-38. ADR-036 explains the two-tier enforcement and states the
  condition for retiring it.
- **109 `no-explicit-any`** in legacy code, against `02-conventions §3`.
- **141 bare store subscriptions** (`useSettings()` with no selector) across the legacy tree, which
  is the 115-file blast radius `D5` opens by describing. Each is a lint warning naming D5 C1.
- **740 KB** of generated CSS for the `celebration` backdrop (ADR-034). Loads only with that scene;
  the strongest argument for `T6 §6`'s consolidation.
- **`.katex-html`** survives in `globals.css`; `P5 §4` is right that `D2 §2`'s MathML output makes it
  obsolete. `D2` is now built, so this can go with the reader port.
- **`use cache` is absent** and `cacheComponents` is off. Route handlers set explicit
  `Cache-Control` instead, which is real HTTP caching but not the tag-scoped invalidation `D3 §6`
  specifies. The tags exist and `updateTag` is called; only the read-side directives are missing.
  Enabling the flag changes caching for every legacy route under `src/app` and cannot be verified
  without a build (`X7 §2.2`).

## 5. Reproducing every number in this document

```sh
npm run test:coverage     # 1077 tests, coverage against 03-hygiene §1
npm run typecheck         # v11 strict flags over src/ and tools/
npx tsc -p tsconfig.json --noEmit   # legacy tree
npm run lint              # 0 errors, 123 warnings over src/, 449 across the legacy tree
npm run lint:spelling     # gate S17
npm run lint:css          # 107 stylesheets through lightningcss
npm run themes:check      # gate S5 and T4 C6
npm run themes:verify     # T9 C6 against the v10 palette
npm run themes:migrate    # T9, idempotent
npm run docs:migrate -- <dir>       # D6 document + entry syntax, dry run
grep -rho "@apply" src app components lib | wc -l   # gate S6
ls interfaces                                        # gate S7
```

`npm run build` is **not** verified. The `[slug]` route layouts fetch from S3 at build time and
S3 egress is blocked in the environment this was built in (`X7 §2.1`).
