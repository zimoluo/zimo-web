# Zimo Web v11 — Specification

This is the original specification and decision history. For the running implementation and its current maintenance direction, start with [the documentation index](../README.md). Historical “today” inventories and verification counts below may predate the implementation; ADR-051 records the October 12 theme-direction change.

This folder is the complete design specification for the v11 rebuild of Zimo Web. It is
written to be executed by coding agents: every document states *what to build*, *why that
shape*, and *how to know it is correct*.

## Starting an implementation

`PROMPT.md` is the brief for the implementing agent. Hand it over verbatim; it names the reading
order, the execution mode, the blocking platform checks, and the definition of done.

## How to use this spec

1. Read `00-charter.md`, `02-conventions.md`, and `04-execution-mode.md`. Non-negotiable.
   `04` overrides the staged framing in `X1` — this program ships in one pass, to one final shape.
2. Read `03-hygiene.md`. It lists seven things the repository lacks entirely — starting with any
   test infrastructure at all — and `H-01` blocks the acceptance criteria of every other task.
3. Read `01-audit.md` for the defect catalog. Every finding has a `file:line` anchor and
   a resolving document. Do not re-derive it.
4. Pick a workstream from `exec/X1-workstreams.md`. It gives the dependency order.
5. Work the tasks in `exec/X2-task-ledger.md`. Each task has an ID, inputs, acceptance
   criteria, and a verification command.
6. Before deviating from a design, read `exec/X3-decisions.md`. Alternatives that look
   attractive were already considered and rejected there, with reasons. If your reason is
   not listed, add an ADR; do not silently diverge.

## Document map

| Path | Subject |
| --- | --- |
| `PROMPT.md` | The implementation brief — hand this to the implementing agent |
| `00-charter.md` | Goals, non-goals, scope boundaries, success criteria |
| `01-audit.md` | Current-state inventory and defect catalog |
| `02-conventions.md` | Naming, file layout, TypeScript, CSS, commit conventions |
| `03-hygiene.md` | Tests, CI, route boundaries, sitemap, and four other structural gaps |
| `04-execution-mode.md` | **Wholesale execution.** Overrides every incremental affordance elsewhere. |
| **`theme/`** | **The centerpiece: the theme engine** |
| `theme/T1-architecture.md` | Layer model and data flow, end to end |
| `theme/T2-color-engine.md` | OKLCh tone engine, gamut mapping, formulas, test vectors |
| `theme/T3-schema.md` | `ThemeSource` and `ResolvedTheme` types, complete |
| `theme/T4-compiler.md` | Theme → CSS custom properties; build-time and runtime paths |
| `theme/T5-surfaces-and-gradients.md` | Gradient data model, surface materials, variation |
| `theme/T6-backdrops.md` | Animated backdrop scene contract, shared canvas, GLSL library |
| `theme/T7-identity-mark.md` | Favicon / identity mark spec |
| `theme/T8-theme-studio.md` | Theme editor rearchitecture |
| `theme/T9-theme-migration.md` | Mechanical lift of the 59 existing themes |
| **`data/`** | **Content, API, state** |
| `data/D1-content-model.md` | Entry model for blog / album / projects / management |
| `data/D2-document-format.md` | Document pipeline that replaces `&&{}{}&&` |
| `data/D3-api.md` | HTTP surface, Server Actions, errors, caching |
| `data/D4-storage-and-concurrency.md` | S3 layout and conditional writes |
| `data/D5-state-and-settings.md` | Store architecture, settings schema and versioning |
| `data/D6-migrations.md` | Migration CLI spec |
| `data/D7-notebook.md` | Notebook span model (the one widget with bespoke rich text) |
| **`perf/`** | **Optimization** |
| `perf/P1-rendering-architecture.md` | RSC boundary, store selectors, render budget |
| `perf/P2-windowing.md` | Window engine rebuild |
| `perf/P3-image-viewer.md` | Image viewer rebuild |
| `perf/P4-notifications.md` | Notification engine rebuild |
| `perf/P5-tailwind-v4.md` | Tailwind v4 migration |
| **`ux/`** | **Experience** |
| `ux/U1-principles.md` | Design language, stated explicitly for the first time |
| `ux/U2-context-strip.md` | The navigation-bar center region |
| `ux/U3-motion-a11y.md` | Motion policy, accessibility contract |
| **`exec/`** | **Execution** |
| `exec/X1-workstreams.md` | Phases, dependency graph, parallelization |
| `exec/X2-task-ledger.md` | Atomic tasks with acceptance criteria |
| `exec/X3-decisions.md` | Architecture decision records, including rejections |
| `exec/X4-verification.md` | Test strategy, budgets, gates |
| `exec/X5-risks.md` | Risk register with triggers and mitigations |
| `appendix/` | Executable references (color math, corpus analysis) |

## Status of the numbers in this spec

Every quantitative claim about the *existing* codebase was measured against the working
tree at commit `99bc5793`. Every quantitative claim about *color* was computed by
the scripts in `appendix/`, which are committed and runnable with plain `node`. Re-run them
before disputing a number — see `appendix/README.md`.

Platform-capability claims (Tailwind v4 directives, S3 conditional writes, CSS features)
are listed in `exec/X4-verification.md §5` with a one-line confirmation command each.
Confirm them once at the start of the relevant workstream rather than trusting prose.
