# Implementation prompt

Hand this, verbatim, to the implementing agent. It is written to be the entire brief.

---

You are implementing the v11 rebuild of Zimo Web, a Next.js 16 / React 19 personal website at
`/Users/zimoluo/zimo-web`. The complete specification is in `docs/spec/`. It is not a sketch: 39
documents, ~74k words, 74 catalogued defects with file anchors, 163 tasks, 20 decision records,
190-odd acceptance criteria, and five runnable scripts that reproduce every quantitative claim it
makes about color.

**This is a one-shot task. Build the final shape. There is no second pass.**

## Read first, in this order

1. `docs/spec/README.md` — the map.
2. `docs/spec/00-charter.md` — objectives, scope, and the 17 gates that define done.
3. `docs/spec/02-conventions.md` — binding. Naming, layout, TypeScript, CSS, errors, dependencies.
4. `docs/spec/04-execution-mode.md` — **the most important document for you.** It overrides every
   staged, incremental, and compatibility-shim affordance elsewhere in the spec.
5. `docs/spec/03-hygiene.md` — seven things the repository does not have at all, starting with any
   test infrastructure.
6. `docs/spec/01-audit.md` — the defect catalog. Every finding has a `file:line` anchor and names
   the document that resolves it. **Do not re-derive it.** It was measured against the current tree.
7. `docs/spec/exec/X1-workstreams.md` — the dependency graph. The graph binds; the phase boundaries
   do not.
8. Then the design documents in dependency order: `theme/T1`–`T9`, `data/D1`–`D7`, `perf/P1`–`P5`,
   `ux/U1`–`U3`.
9. `docs/spec/exec/X2-task-ledger.md` as your work list, `X3-decisions.md` before you disagree with
   anything, `X4-verification.md` for how to prove it, `X5-risks.md` for what goes wrong.

## Do it wholesale

Every file that exists at the end is written once, in its final form.

- **No intermediate stages.** The old theme engine and the new one do not coexist at any commit.
  There is no cut-over, no feature flag bridging two implementations, no "leave the old path for
  now".
- **No scaffolding.** If a thing exists only to be deleted later, do not write it. Specifically:
  no `useSettings()` compatibility shim (the spec's own `X5 R-08` offers one — `04 §1` withdraws
  it); no legacy-S3-key 404 fallback; no preparatory commit against Tailwind v3.
- **Delete in the same change that replaces.** `T4 §7`, `D5 §7`, `P4 C4`, `T6-07` enumerate the
  files that must be gone. `interfaces/` is deleted. `tailwind.config.ts` is deleted.
- **Distinguish scaffolding from tolerance.** `04 §1` has the table. Runtime lifting of
  `formatVersion: 1` theme profiles is permanent — users have them on machines you cannot reach.
  `@@glyph@@` tolerance in documents is permanent. `darkReviewed: false` is a real feature flag.
  Keep all three. Drop the bridges.

Two things genuinely precede the work, because they are references you cannot reconstruct once the
old code is gone:

1. **Baselines** (`P1-01`…`P1-03`): perf traces, the 1 062-screenshot visual reference, per-route
   bundle sizes — captured from the current `main`, committed.
2. **Test infrastructure** (`H-01`): Vitest, Playwright, fixtures, coverage thresholds. Tests
   written afterward verify the implementation against itself.

## Verify the platform before you build on it

`X4 §5` lists 16 platform facts with a one-line check each. Network access was unavailable when the
spec was written, so these are stated as checks rather than asserted as facts. **Perform them before
the code that depends on them.** Two are blocking:

- **`V-15` blocks `T4-01`.** The surface-alpha mechanism (`T4 §1.1`) rests on a CSS
  custom-property substitution rule. A 10-line browser repro settles it. If it fails, `T4 §1.1`
  names the alternatives — pick one and record an ADR.
- **`V-5`/`V-6` block `D4-02`.** S3 conditional writes (`IfMatch` on `PutObject`) are what make
  comments concurrency-safe without a database. If unavailable, `D4 §3.3` fully specifies the
  key-partitioning fallback. Decide on evidence.

The rest (`V-1`…`V-4`, `V-7`…`V-14`, `V-16`) are minutes each and gate large designs. Do not skip
them and hope.

## Three open decisions are yours to close, on evidence

They are deliberately open, each with a stated owner and a decision procedure. Close them with a
measurement and an ADR, not a preference:

- **`P3-02` / ADR-020** — image delivery. Pre-generated derivatives in S3 vs `next/image`. Turns on
  measured storage cost across ~1 200 images.
- **`D2-09`** — hast vs markdown on the wire for the client document path. Explicit 3× brotli
  threshold in `D2 §1`.
- **`D4-02`** — conditional writes vs key partitioning, per `V-5` above.

## Hard rules

- **American spelling only** — prose, identifiers, paths, comments, strings. `color`, `normalize`,
  `behavior`, `center`, `gray`, `analyze`, `judgment`. `02-conventions §2` is binding and
  `tools/lint-spelling.ts` enforces it (gate S17).
- **No `@apply`.** Zero occurrences, down from 149 (gate S6).
- **No ambient global types.** `interfaces/` is deleted; every type is a module (gate S7).
- **Every z-index comes from `styles/layers.css`** (`P2 §0`, `P2 C13`). Six hardcoded tiers in six
  files is the current state and it is why a popover cannot open inside a modal.
- **Selectors, never whole-object subscriptions.** A lint rule enforces it (`P1 §3`).
- **No render you cannot see.** Theme switches, window drags, gradient-stop scrubs, and
  notification animations perform zero React commits (gates S2, S3, S4). This is the central
  performance objective; do not treat it as aspirational.
- **S3 stays.** No database. Final.
- **Do not redesign the visual language.** The 59 themes reproduce exactly (ΔE_OK ≤ 0.002). The one
  intended appearance change is the lens model (`T5 §4.2`), and `T5-05` is an explicit review task
  for it.

## When the spec and reality disagree

The spec was measured against commit `99bc5793`. If you find it wrong:

1. **Verify against the tree, not against memory.** The audit's counts and anchors were checked
   twice, and corrected once after an independent review; they are likely right.
2. **Read `X3-decisions.md` before diverging.** Twenty ADRs record what was considered and
   rejected, with reasons — including the two you are most likely to reach for (MDX for documents,
   a random per-callsite gradient seed). If your objection is not listed, it is worth raising.
3. **If you diverge, update the spec in the same change**, with a new ADR. A spec that drifts from
   the code is worse than no spec, because it is trusted.

## Definition of done

Not "the site works". All of:

- **The 17 charter gates** (`00-charter §5`), each measured the way `X4 §2` says.
- **Every acceptance criterion** in every design document — roughly 190 of them. They are the
  definition of done, not suggestions. The inconvenient ones are load-bearing: `P2 C13` (one z-index
  source) and `P5 C2` (zero `@apply`) look like housekeeping and exist because the alternative is a
  class of defect that recurs forever.
- **The manual checklist** in `X4 §6`: keyboard-only traversal, VoiceOver and NVDA on four tasks,
  200 % zoom, 320 px width, forced-colors, the theme matrix, ten migrated articles side by side.
- **`01-audit.md` reconciled** (`X-05`): every one of the 74 findings closed, or deferred with an
  entry in `X5`.
- **Clean** `npm run build`, `lint`, `typecheck` under the strict flags of `02-conventions §3`, and
  `test` at the coverage thresholds of `03-hygiene §1`.

## Then review it rigorously

There is no staged delivery, so the quality gate is one review at the end. Do it properly:

1. **Re-run every automated gate** and paste the numbers, not a summary.
2. **Walk the acceptance tables document by document.** A criterion is checkable without reading the
   code that satisfies it — that is why they are written that way.
3. **Adversarially review your own output** the way the spec was reviewed: check the factual claims
   in your commit messages against the tree; look for the mechanism you specified but did not wire
   up; look for the acceptance criterion you satisfied in letter and not in substance.
4. **Report faithfully.** If a gate fails, say so with the output. If you skipped a manual check,
   say which. If a design turned out wrong mid-implementation, say what you did instead and why. A
   truthful report of 90 % is worth more than a confident report of 100 %.

## Working notes

- Commit along the topological order of `X1 §2` with real messages. The change touches every file;
  a readable sequence is the only thing that makes it reviewable (`X5 R-12`).
- The three color-math scripts in `docs/spec/appendix/` are runnable with plain `node` and
  regenerate their committed tables byte-identically. The test vectors in `T2 §5.7` are the contract
  between them and your implementation. If your ramp does not reproduce that table exactly, your
  ramp is wrong.
- `T2 §3` has a note about a one-order-of-magnitude typo in the OKLab matrix that produces
  plausible-looking garbage. Write that unit test first.
- The largest single item is the document pipeline (`D2`, task `D2-01`). Its verification — render
  every existing document through the old and new pipelines and diff — is what makes it safe. Build
  the harness before the pipeline.
- The migration runs against production S3. Back up first, test the restore path first
  (`D6 C6`), dry-run repeatedly, and only then `--commit`. Under wholesale execution that backup is
  the only rollback that exists.

Work autonomously. Do not stop to ask which of two specified options to take — the spec names an
owner and a procedure for every genuinely open decision, and everything else is decided. Where you
must choose, choose, record it, and continue.
