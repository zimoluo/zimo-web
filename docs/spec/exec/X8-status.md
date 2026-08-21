# X8 — Program status

Where the v11 rebuild actually stands. Written against the tree, not against intent.

Read with `X6-implementation-decisions.md` (what diverged from the spec, and why) and
`X7-platform-checks.md` (which platform facts are confirmed).

## 1. Charter gates

`00-charter §5`'s 17 gates, each measured the way `X4 §2` prescribes.

| Gate | Target | Measured | State |
| --- | --- | --- | --- |
| S1 | Adding a theme touches one file + one registry line | registry index derives `ThemeId` from the registry object; `themeOrder` completeness is a unit test | **pass** |
| S2 | Theme switch = 0 React commits | `ThemeHost` not written; needs `D5` store | **not started** |
| S3 | Window drag = 0 React commits | `P2` not started | **not started** |
| S4 | Stop scrub re-renders ≤ 1 component | `T8` not started | **not started** |
| S5 | Theme CSS < 60 KB br | **22.6 KB br** (37.6 % of budget), 466 KB raw, 90 theme×scheme blocks | **pass** |
| S6 | `@apply` occurrences = 0, from 149 | **0** | **pass** |
| S7 | Ambient global types = 0, from 17 files | **0**; `interfaces/` deleted, 86 names now modules | **pass** |
| S8 | Any backdrop under any theme | `T6` not started | **not started** |
| S9 | Concurrent comments lose nothing | `D4` not started; blocked on `V-5` (`X7 §2.1`) | **not started** |
| S10 | Document round-trip with zero rendered diff | `D2` not started | **not started** |
| S11 | Blog route JS ≤ 60 % of current | no baseline captured (`X7 §2.3`) | **unmeasured** |
| S12 | `prefers-reduced-motion` suppresses non-essential motion | global suppression in `globals.css`; per-scene work in `T6`/`U3` outstanding | **partial** |
| S13 | axe-core clean on every route | needs a running app (`X7 §2.3`) | **unmeasured** |
| S14 | Test infrastructure + coverage thresholds | Vitest, 301 tests; every threshold in `03-hygiene §1` for a path that exists is met. Playwright absent (`X7 §2.3`) | **partial** |
| S15 | CI runs the checks on every PR | `ci.yml` + `theme.yml`; `perf.yml` absent because `tools/perf/profile.ts` does not exist | **partial** |
| S16 | Error/not-found boundaries; mistyped slug → 404 | 4 global + 5 section boundaries; `notFound()` in the entry loader | **pass** |
| S17 | American spelling throughout | **899 files, 0 findings** | **pass** |

**6 pass, 3 partial, 2 unmeasured, 6 not started.**

## 2. Workstreams

| Workstream | State |
| --- | --- |
| `T2` color engine | **complete.** 100 % statement and branch coverage; the `§5.7` tables assert to exact 8-bit hex |
| `T3` schema | **complete.** Types, `resolve()`, `mirror()`, zod schema, `loadThemeSource` with permanent v1 lifting |
| `T4` compiler | **§1–§4 complete** — `compile()`, `compileToCss()`, `applyProperties()`, gradient serialization, build-time emission. **§5 `ThemeHost` not written** (needs `D5`) |
| `T5` surfaces | **CSS complete** — all seven surfaces, alpha modifiers, variants, `surface-edge`. **Call-site migration not done**: `T5 C2` still fails |
| `T9` theme migration | **complete.** 59 themes lifted, worst ΔE_OK 0.001639, 0 failures, idempotent |
| `P5` Tailwind v4 | **mostly complete.** v4 installed, config deleted, `@apply` at 0, Sass gone, dependencies removed. Class renames of `§6` not swept |
| `H-01` tests | **complete** for Vitest. Playwright absent |
| `H-02` CI | **2 of 3 workflows** |
| `H-03` boundaries | **complete** |
| `H-04` sitemap | **complete** |
| `T1`, `T6`, `T7`, `T8` | **not started** |
| `D1`–`D7` | **not started** |
| `P1`–`P4` | **not started** |
| `U1`–`U3` | **not started** apart from the global motion and focus rules |
| `H-05`–`H-07` | **not started** |

## 3. The coexistence violation

`04 §1` requires that the old theme engine and the new one never coexist. **They do.**

`components/theme/`, `lib/colorPaletteParser.ts`, `lib/themeMaker/` and
`components/theme/util/ThemeApplier.tsx` are all still present and still the path the running site
uses. Nothing under `src/features/theme/` is wired into the app.

This is a consequence of the pass not completing, not a design choice. The mitigating facts:

- Which engine is live is unambiguous — the old one. There is no feature flag and no bridge.
- The v11 engine is verified against the v10 palette independently of the app
  (`tools/verify-theme-properties.ts`), so it does not need to be mounted to be trusted.
- `T4 §7`'s deletion list is unchanged and still correct; it becomes actionable once `D5` and
  `T4 §5` land.

The files `T4 §7` names as deleted, and their present state: `lib/colorPaletteParser.ts` present,
`lib/themeMaker/colorHelper.ts` present, `lib/themeMiscParser.ts` present,
`lib/themeMaker/layerHelper.ts` present, `lib/themeMaker/profileOptimizeTool.ts` present,
`lib/themeMaker/themeConfigTypeGuard.ts` present, `ThemeApplier.tsx` present,
`ThemeDataInitializer.tsx` present, `tailwind.config.ts` **deleted**.

## 4. Debt registered rather than hidden

- **312 lint warnings** in `app/`, `components/`, `lib/`, itemized by rule. The notable ones are
  **31 `react-hooks/set-state-in-effect`** and **14 `react-hooks/refs`** — independent evidence for
  `P1`'s rendering claims and for F-38. ADR-036 explains the two-tier enforcement and states the
  condition for retiring it.
- **109 `no-explicit-any`** in legacy code, against `02-conventions §3`.
- **740 KB** of generated CSS for the `celebration` backdrop (ADR-034). Loads only with that scene;
  the strongest argument for `T6 §6`'s consolidation.
- **`.katex-html`** survives in `globals.css`; `P5 §4` is right that `D2 §2`'s MathML output makes it
  obsolete, and `D2` is not built.

## 5. Reproducing every number in this document

```sh
npm run test:coverage     # 301 tests, coverage against 03-hygiene §1
npm run typecheck         # v11 strict flags over src/ and tools/
npx tsc -p tsconfig.json --noEmit   # legacy tree
npm run lint              # 0 errors, 312 warnings
npm run lint:spelling     # gate S17
npm run lint:css          # 107 stylesheets through lightningcss
npm run themes:check      # gate S5 and T4 C6
npm run themes:verify     # T9 C6 against the v10 palette
npm run themes:migrate    # T9, idempotent
grep -rho "@apply" src app components lib | wc -l   # gate S6
ls interfaces                                        # gate S7
```

`npm run build` is **not** verified. The `[slug]` route layouts fetch from S3 at build time and
S3 egress is blocked in the environment this was built in (`X7 §2.1`).
