# 04 — Execution mode: wholesale

This program is executed **wholesale**, in one pass, to one final shape. This document overrides
every incremental affordance elsewhere in the spec. Read it before `exec/X1-workstreams.md`.

## 1. What wholesale means

**One final shape.** Every file that will exist at the end is written in its final form. Nothing is
built to be replaced.

**No intermediate stages.** There is no "phase 2 leaves the old rendering path in place". There is
no cut-over. The old theme engine and the new theme engine do not coexist at any commit.

**No scaffolding.** If a thing exists only to be deleted later, it is not written at all:

| Elsewhere in the spec | Wholesale ruling |
| --- | --- |
| `X5 R-08`: a `useSettings()` compatibility shim so 115 files can be ported in batches | **Not written.** Every consumer is written against a selector from the start. |
| `D6 §4`: legacy S3 prefixes retained for one release, with a 404 fallback in `object.ts` | **No fallback code.** The migration runs once, is verified, and the new keys are the only keys the reader knows. Backups still exist (§4). |
| `X1 §2`: "at the end of Phase 2 the site still uses the old rendering path" | **No.** The old path is deleted in the same change that adds the new one. |
| `P5 §8`: `P5-06`/`P5-07` land "as their own PR against v3" | **One pass.** The two traps (`shadow-xs`, bare `border`/`ring`) are handled correctly inside the single Tailwind v4 change, not in a preparatory commit against v3. |
| `D2 §4.1`: `@@keyword@@` accepted with a `deprecated` issue so content can migrate incrementally | **Keep — this is not scaffolding.** It is a permanent tolerance for content that lives on S3 and may be edited by hand later. Distinguish "temporary bridge" from "durable input tolerance". |
| `T9 §8`: runtime lift of `formatVersion: 1` theme profiles | **Keep.** Users have v1 profiles in `localStorage` on machines this migration cannot reach. Permanent, by design. |
| `T9 §2` step 10: `darkReviewed: false` on generated schemes | **Keep.** A real feature flag with a stated purpose, not a staging device. |

The distinction that matters: **scaffolding serves the migration; tolerance serves the user.** Drop
the first, keep the second.

## 2. What is still done first

Two things precede the implementation, and neither is scaffolding — both are references the work is
measured against and cannot be reconstructed afterward:

1. **`P1-01` … `P1-03` — baselines.** Perf traces, 1 062 visual-regression screenshots, and
   per-route bundle sizes, captured from the current `main`. Once the old code is gone, the
   reference is gone. Capture, commit, then start.
2. **`H-01` — test infrastructure.** Vitest, Playwright, fixtures, coverage thresholds. Tests
   written after the implementation verify the implementation against itself.

Everything else is one body of work.

## 3. Ordering inside the single pass

Wholesale does not mean unordered. The dependency graph in `X1 §1` still holds, because
`T3` genuinely cannot be written before `T2` — the schema references `RampSpec`. What changes is
that the phases are **not release boundaries**. They are a topological order for writing files in a
single change, and the tree is expected to be broken in the middle of it.

Recommended order, condensed from `X1`:

```
baselines + tests
  → foundation (src/ layout, real type modules, strict flags, errors, datetime, gesture, stores)
  → color engine → theme schema → theme compiler → theme migration (all 59)
  → Tailwind v4 + surfaces + mark
  → content model → document pipeline → storage/concurrency → API → settings
  → migration tooling, then run it
  → windows + overlays, image viewer, notifications, backdrops, studio
  → design tokens, context strip, motion + accessibility
  → deletions, gates, final review
```

## 4. Safety, since there is no incremental rollback

Wholesale removes the ability to stop halfway, so the safety must come from elsewhere:

- **Content is backed up before any write** (`D6 §1`), and the restore path is *tested*
  (`D6 C6`) before the migration runs with `--commit`. This is not optional under wholesale; it is
  the only rollback that exists.
- **`--dry-run` against production is run repeatedly and early**, long before `--commit`, to surface
  content that will not migrate cleanly (`X1 §2`, Phase 4 note).
- **Theme property equivalence** (`X4 §4.2`) runs from the moment the compiler exists, comparing
  against the *pre-migration* build's computed custom properties. It needs no browser, so it is the
  cheap continuous guard while everything else is in motion.
- **The visual regression** (`X4 §4.1`) runs at the end, against the Phase 0 screenshots.
- **The 16 platform checks** (`X4 §5`) are performed *before* the code that depends on them.
  `V-15` blocks the surface-alpha mechanism; `V-5` blocks the concurrency design. Do these first;
  they are minutes of work each and they gate large designs.

## 5. Review, not iteration

Because there is no staged delivery, the quality gate is a single rigorous review at the end rather
than incremental feedback. That review is specified: the 17 charter gates (`00-charter §5`), every
document's acceptance table (roughly 190 criteria), and the manual checklist in `X4 §6`.

Treat the acceptance tables as the definition of done, not as suggestions. A criterion that is
inconvenient is the one most likely to be load-bearing — `C13` in `P2` (every z-index from one
file) and `C2` in `P5` (zero `@apply`) both look like housekeeping and both exist because the
alternative is a class of defect that recurs forever.

## 6. What does not change

- The dependency graph (`X1 §1`).
- Every design decision, acceptance criterion, and ADR.
- The measurement obligations. Wholesale is not a license to skip `V-15` and hope.
- `X5`'s risk register, minus `R-12` (stalling mid-program), which wholesale replaces with a
  different risk: a single large change that is hard to review. Mitigate by committing along the
  topological order above with real messages, so the final diff is readable as a sequence even
  though it ships as one.
