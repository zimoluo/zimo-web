# X1 — Workstreams

> **Read `04-execution-mode.md` first.** This program executes **wholesale**: one pass, one final
> shape, no intermediate stages, no scaffolding. The "phases" below are a **topological order for
> writing files**, not release boundaries, and the tree is expected to be broken in the middle of
> the pass. `04` lists which incremental affordances in this document are dropped. The dependency
> graph in §1 still binds, because it encodes real dependencies rather than staging choices.

## 1. Dependency graph

```
                          ┌──────────────────────┐
                          │ P1-01 perf baselines │  ← FIRST. Nothing verifiable without it.
                          └──────────┬───────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
┌───────────────┐           ┌────────────────┐          ┌──────────────────┐
│ F  Foundation │           │ C  Color      │          │ Q  Quick wins    │
│ types→modules │           │ T2 engine      │          │ P3 images (§4)   │
│ src/ layout   │           │ (pure, no deps)│          │ U2-01 scroll     │
│ D5 store      │           └───────┬────────┘          │ P5-06 shadow-xs  │
│ lib/errors    │                   │                   └──────────────────┘
└───────┬───────┘                   │
        │        ┌──────────────────┴───────────────┐
        │        ▼                                  ▼
        │  ┌───────────┐                    ┌──────────────┐
        │  │ T3 schema │                    │ T9 migration │ (needs T2+T3)
        │  └─────┬─────┘                    └──────┬───────┘
        │        ▼                                 │
        │  ┌────────────┐                          │
        │  │ T4 compiler│                          │
        │  └─────┬──────┘                          │
        │        │                                 │
        └────────┼─────────────┬───────────────────┘
                 ▼             ▼
          ┌─────────────┐  ┌──────────┐
          │ P5 Tailwind │  │ T7 mark  │
          │      v4     │  └──────────┘
          └──────┬──────┘
                 ▼
          ┌───────────────┐      ┌────────────┐      ┌────────────┐
          │ T5 surfaces   │─────▶│ T6 backdrop│      │ T8 studio  │
          └───────────────┘      └────────────┘      └─────┬──────┘
                                                            │ needs T3,T4,T6,D5
        ┌───────────────────────────────────────────────────┘
        │
   ┌────┴─────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ D  Data  │   │ P2 window│   │ P4 notif │   │ U  UX    │
   │ D1 model │   │ needs D5 │   │ needs D5 │   │ U1,U2,U3 │
   │ D2 docs  │   └──────────┘   └──────────┘   └──────────┘
   │ D3 api   │
   │ D4 s3    │
   │ D6 tools │
   └──────────┘
```

Hard edges (a → b means a must land first):

| Edge | Reason |
| --- | --- |
| `P1-01` → everything | Perf gates are unverifiable without a pre-refactor baseline |
| `T2` → `T3` | The schema references `RampSpec` |
| `T3` → `T4` | The compiler consumes `ResolvedTheme` |
| `T4` → `P5` | `@theme inline` must reference `--zw-role-*`, which T4 emits |
| `P5` → `T5` | Surface utilities are `@utility`, a v4 construct |
| `T3` + `T2` → `T9` | Migration lifts into the schema using the color engine |
| `D5` → `P2`, `P4`, `T8` | All three own store slices |
| `F` (types) → `D1`, `D2`, `D3` | Domain types must be modules first |
| `D1` → `D2` → `D3` | Content model, then documents, then the API that serves them |
| `D4` → `D3` | Conditional writes underpin the mutation actions |
| `D1` + `D2` + `D4` → `D6` | Migration tooling targets the new shapes |
| `T6` → `T8` | The Studio generates backdrop controls from scene schemas |

Soft edges (better sequenced together, not blocking): `U1` before `T5` (the elevation ladder
informs the surface definitions); `U3` alongside every UI workstream rather than after.

## 2. Order

Seven groups. Under wholesale execution these are **not** release boundaries and do not each end
at a working build (`04 §1`); they are the order in which to write things so that nothing
references code that does not exist yet.

### 0 — Instrument (≈ 2 days) · the one thing that must genuinely precede everything

`P1-01` only. Capture the nine perf baselines, the visual-regression baseline (1 062 screenshots),
and the bundle-size baseline, from `main`. Commit them.

Everything after this is measurable. Doing it first is not optional.

### 1 — Foundation (≈ 1.5 weeks)

- **`H-01` first: test infrastructure.** Vitest, Playwright, fixtures, coverage thresholds.
  Nothing after this is verifiable without it, and tests written after a refactor verify the
  refactor against itself.
- `H-02` CI; `H-05` move page content out of the seven empty-`page.tsx` layouts.
- `src/` layout; move files, no logic changes.
- `interfaces/**` → real modules, colocated by domain.
- `tsconfig` strict flags; fix the fallout (`noUncheckedIndexedAccess` will surface real bugs in
  the six parallel arrays and the `ImagesData` alignment).
- `lib/errors.ts`, `lib/datetime.ts`, `lib/gesture/useDragGesture.ts`.
- Store scaffolding (`D5 §1–2`) with slices created but not yet migrated off contexts.
- `eslint-plugin-import` `no-restricted-paths` for the dependency direction.

Large diff, near-zero behavior change. Land as several PRs, one per directory group.

### 2 — Color and theme core (≈ 2 weeks)

`T2` → `T3` → `T4`, then `T9`.

Deliverables: a working color engine with test vectors passing; the schema and validator; the
compiler with build-time emission; all 59 themes lifted and reproducing within ΔE_OK 0.002.

Under wholesale execution the old rendering path is deleted in the same change that adds the new
one (`04 §1`). What survives from the staged plan is the *verification*: `T9`'s lifted themes are
verified by comparing `compile()` output against the current build's computed custom properties
(T9 C6), not by switching over. That keeps Phase 2 low-risk and gives Phase 3 a verified input.

### 3 — Tailwind v4 and surfaces (≈ 2 weeks)

`P5-06` and the bare-`border`/`ring` audit first, as their own PR against v3. Then the v4
migration, then `T5`, then `T7`.

This is the highest-risk phase: it touches every file and the tree does not build mid-way. It is
also the phase where the visual-regression harness earns its cost.

`ThemeHost` replaces `ThemeApplier`, `data-theme`/`data-scheme` goes on `<html>`, and
`themes.generated.css` ships — in one change, with `ThemeApplier` and `colorPaletteParser.ts`
deleted in the same commit.

### 4 — Data (≈ 3 weeks)

`D1` → `D2` → `D4` → `D3`, then `D6`, then run the migrations. Also `H-03` (route boundaries),
`H-04` (sitemap), `H-06` (notebook model), `H-07` (search consolidation) — all four depend on the
content model landing first.

Ordering note: build the tooling (`D6`) and run it against a **copy** of the bucket before
touching production. `tools/migrate/cli.ts --dry-run` against production is safe and should be run
early and often to surface content that will not migrate cleanly.

`D2` is the largest single item in the program. Its verification (golden-file render diff over
every document) is what makes it safe.

### 5 — Engines (≈ 2 weeks, parallelizable)

`P2`, `P3`, `P4`, `T6`, `T8` — four of the five are independent of each other once `D5` and `T3`
are done. `T8` depends on `T6`.

Suitable for parallel work by separate agents: each owns a disjoint directory and a disjoint store
slice.

### 6 — Experience (≈ 1.5 weeks)

`U1` (tokens and the elevation ladder, applied), `U3` (motion and accessibility, applied),
`U2-02` through `U2-05`.

`U3` is deliberately last for *application* and first for *specification*: individual workstreams
implement their own accessibility obligations as they go (P2 §8, P3 §5, P4 §6), and Phase 6 is the
sweep that closes what they missed plus the global items (focus styles, announcements,
forced-colors).

### 7 — Close (≈ 3 days)

- All gates from `00-charter §5`.
- Delete the dead files enumerated in T4 §7, D5 §7, P4 C4.
- `git diff --exit-code` on regenerated artifacts.
- Final visual regression and perf comparison against the Phase 0 baseline.
- Update `README.md` and write `CLAUDE.md` for future agents.

**Total: ≈ 12 weeks of single-track work.** Phases 2–3 are strictly serial; Phase 5 parallelizes
about 3:1; Phase 4's migration steps parallelize across content types.

## 3. Parallelization

Safe to run concurrently, because the file sets are disjoint:

| Group | Workstreams | Owns |
| --- | --- | --- |
| A | `T2`, `T3`, `T4`, `T9` | `features/theme/{color,model,compile,registry}`, `tools/migrate-themes.ts` |
| B | `D1`, `D2` | `features/entries`, `features/document` |
| C | `D4`, `D3` | `server/storage`, `app/api`, `features/*/actions.ts` |
| D | `P2` | `features/windows` |
| E | `P3` | `features/media` |
| F | `P4` | `features/notifications` |
| G | `T6` | `features/backdrop` |

Group A must finish before `P5`/`T5`; groups B–G can start once Phase 1 lands and their
dependencies are met.

**Not parallelizable:** `P5` (Tailwind v4) touches every file. Freeze other work during it, or
accept large merge conflicts. Budget it as a solo phase.

## 4. If the program were staged instead

Retained for the case where wholesale is abandoned. Under wholesale, ignore this section.

### What would ship first for value

If the program must produce visible value early, this is the order:

1. **`P3 §3` image delivery** — pre-generated derivatives, correct `priority`, real dimensions.
   Independent of everything, and it is the single largest performance win on the site.
2. **`U2-02` command palette** — the largest UX gain, and it depends only on Phase 1.
3. **`U2-01`** scroll listener → CSS. One afternoon, removes React from the scroll path.
4. **`D3 §6.1`** polling → focus refetch. One afternoon, removes three permanent timers.
5. **`P5-06`** the `shadow-xs` rename. Must happen before v4 anyway.

All five are shippable against the current codebase without waiting for the theme work.

## 5. Rules of engagement for parallel agents

- One task ID per branch, one task per PR (`02-conventions §10`).
- A PR may not touch files outside its workstream's owned paths. If it must, that is a signal the
  task boundary is wrong — raise it rather than widening the PR.
- A PR states its ledger acceptance criteria and how each was verified.
- Perf-gated tasks attach the `tools/perf/profile.ts` output for the relevant scenario.
- If an implementation contradicts the spec, **update the spec in the same PR** with an ADR in
  `X3-decisions.md`. A spec that drifts from the code is worse than no spec.
