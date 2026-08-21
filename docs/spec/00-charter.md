# 00 — Charter

## 1. What this rebuild is

Zimo Web is a personal site whose distinguishing feature is that its *appearance is a
first-class artifact*: 59 authored themes, a layered gradient engine, 36 animated
backdrops, a user-facing theme editor, and a desktop-class window system. That ambition is
intact. The implementation has accreted for five years and now fights it.

v11 rebuilds the foundations under the ambition. It is not a rewrite of the product.

## 2. Objectives, in priority order

**O1 — A theme engine that is a generator, not a spreadsheet.**
A theme is authored as a small perceptual seed (hue, chroma, a lightness curve, and
deliberate deviations from it) and *generates* its palette in OKLCh. One theme yields both
light and dark presentation. Authoring verbatim RGB triplets becomes an override, not the
mechanism.

**O2 — Data that is data.**
Theme data, entry data, and settings describe intent. Strings destined for CSS, S3 keys,
and React elements are produced by compilers at the edge, never stored in the model.

**O3 — Gradients with positional identity.**
The layered gradient system survives intact. Its failure mode — every widget rendering an
identical scaled copy of one gradient — is fixed structurally, not decorated around.

**O4 — Backdrops that are parameterized and theme-agnostic.**
Any backdrop works with any theme, is configurable, and does not carry a hard-coded
palette.

**O5 — No render you cannot see.**
Interaction that changes only pixels changes only pixels. Theme changes, window drags,
gradient-stop scrubs, and notification animations must not re-render React trees.

**O6 — A durable document format.**
The hand-rolled `&&{Component}{props}&&` markdown extension is replaced by a specified,
maintained syntax with a single parse pipeline and a single component registry.

**O7 — Modern platform baseline.**
Tailwind v4, React 19 idioms, Next 16 caching semantics, OKLCh color, Pointer Events,
View Transitions, scroll-driven animation. Not for novelty — each replaces hand-rolled
machinery this codebase currently carries.

## 3. Scope

### In scope

- The theme engine end to end: color, schema, compiler, surfaces, gradients, backdrops,
  identity mark, editor.
- Entry data model for blog, album, projects, management; the document format; the inline
  mark grammar.
- The HTTP/action API surface and its conventions.
- S3 storage layout and write concurrency.
- Settings schema, persistence, versioning, migration.
- Rendering architecture: store, selectors, client/server boundary.
- Window engine, image viewer, notification engine, theme editor performance.
- Tailwind v3 → v4 migration.
- Navigation bar center region; motion and accessibility policy.
- Migration tooling for existing content and existing themes.

### Explicitly out of scope

- **S3 remains the datastore.** No database. All concurrency work must be achievable with
  S3 primitives. This is a cost decision and it is final.
- Changing the hosting model, the auth providers, or the domain.
- Redesigning the visual language. v11 refines and systematises what exists; it does not
  restyle the site.
- Internationalization.
- Removing product features. The window system, notebook, calculator, signal generator,
  sticky notes, Christmas tree, and every listed theme survive.

### Optional

- Reducing migrated themes from an exact lift to a hand-tuned pure seed. `theme/T9`
  specifies the exact lift as mandatory and the simplification as opportunistic, per
  theme, by eye.

## 4. Principles

1. **Semantics over shortcuts.** A name earns its place by describing the concept, not the
   implementation. `bg-widget-70` describes a CSS variable; `surface-widget/70` describes a
   material. Prefer the latter even when it costs more work.
2. **One representation per concept.** Today a color is a hex string, an RGB triplet, a
   space-separated CSS channel list, and a shade-map index. v11 has one internal color
   type and one serialization.
3. **Compilers at the boundary.** Data → CSS, data → React, data → S3 keys are
   transformations performed once, at a named boundary, by a named function.
4. **Derive, do not duplicate.** Adding a theme must touch one file. Adding a backdrop must
   touch one file. Union types are derived from registries with `satisfies`, never
   hand-maintained alongside them.
5. **The platform first.** If CSS or the DOM does it, do not do it in React. Scroll
   position, snap paging, enter/exit transitions, and element morphing are platform
   features now.
6. **Escape hatches stay, and stay explicit.** Raw CSS gradients, literal color overrides,
   and bespoke backdrops remain possible. They are tagged as escapes so they are visible in
   review rather than indistinguishable from the model.
7. **Reversibility.** Every migration is idempotent, dry-runnable, and produces a backup
   plus a machine-readable report.

## 5. Success criteria

These are gates, not aspirations. `exec/X4-verification.md` defines how each is measured.

| # | Criterion | Target |
| --- | --- | --- |
| S1 | Adding a theme touches exactly one new file plus one registry line | verified by review |
| S2 | Switching between two built-in themes performs zero React re-renders outside the theme host | React Profiler commit count = 0 |
| S3 | Dragging a window re-renders zero React components | Profiler commit count = 0 during drag |
| S4 | Scrubbing a gradient stop in the editor re-renders only the editor control that owns it | ≤ 1 component |
| S5 | Theme CSS payload for all built-in themes | < 60 KB br, down from 10 gradient strings × 59 themes generated at runtime |
| S6 | `@apply` occurrences in the repository | 0 (from 149) |
| S7 | Ambient global types | 0 (from 17 files) |
| S8 | Any backdrop renders correctly under any theme | manual matrix, 36 × 6 sample themes |
| S9 | Comment write under concurrent load loses no comment | conditional-write test, `data/D4` |
| S10 | Blog document round-trips through migration with zero rendered-output diff | golden-file snapshot |
| S11 | Client JS for a blog article route | ≤ 60 % of current |
| S12 | `prefers-reduced-motion: reduce` suppresses all non-essential motion | audit checklist |
| S13 | Every route passes axe-core with zero serious/critical violations | CI |
| S14 | Test infrastructure exists; coverage thresholds in `03-hygiene §1` met | CI |
| S15 | CI runs lint, typecheck, test, build, size, axe on every PR | CI |
| S16 | Every route has an error and not-found boundary; a mistyped slug yields 404, not 500 | manual + test |
| S17 | American spelling throughout: prose, identifiers, paths, strings | `tools/lint-spelling.ts` in CI |

## 6. Definition of done for the whole program

- All gates in §5 pass.
- `01-audit.md` findings each map to a closed task or a documented deliberate deferral in
  `exec/X5-risks.md`.
- No file in the repository imports from `interfaces/` (deleted).
- `npm run build` clean; `npm run lint` clean; typecheck clean with `strict` plus the
  additional flags in `02-conventions.md §4`.
