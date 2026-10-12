# Theme engine direction

Design direction accepted October 12, 2026 under the user's instruction to prioritize maintainable, optimal architecture over exact equivalence for every existing theme. **This is the next design/refactor contract, not a description of a completed refactor.** [Current implementation](theme-engine.md) remains authoritative for running behavior. The decision is recorded in ADR-051.

## What “optimal” means here

A theme author should be able to explain the result from its source. A UI component should consume semantic roles/materials without knowing the theme's name. An editor should manipulate the same data that publishing renders. Color changes should affect only the relevant paint; finite interactions should retain their native semantics and interruption ownership. Saved visitor data must remain readable.

Those are observable goals. Minimizing lines, making every theme identical, or enforcing a single mathematical palette at any cost would not meet them. The existing specular-border geometry, shadow spread, concentric corners, deliberate spacing, and interaction choreography are product craft. Their shared implementation is worth preserving even when a particular palette changes.

## Keep the useful core

Keep the pure OKLCh math, a continuous ramp, gamut-bounded output, semantic roles, typed gradient layers, material/lens separation, JSON source validation, CSS compilation, and stable scene runtime handles. Keep single appearances as first-class data. Keep the separation between requested mode and available appearance, draft preview and published paint, and source data and compiled output.

The ramp should remain a convenient palette generator. A tone can refer to it at any continuous position. A role can also be an alias or a deliberate literal. A multicolor identity or scene should not need dozens of fitted corrections just to prove it belongs to a monochrome ramp. Literals that express authored intent are clearer than inverse-fitting those same colors into opaque coordinates.

Do not add named ramps, a new color space, a general animation DSL, or a new persistence version merely to tidy the architecture. Add a capability only when a concrete native theme/editor operation cannot be expressed cleanly with the existing contract. The v2 format already supports most of this cleanup.

## Make appearances explicit

Treat an appearance as a coherent authored unit: its roles, materials, scene palette and identity treatment agree. A theme declares which appearances it has; the application picks one from the user's requested mode. A single-appearance theme is complete, not a failed dual theme.

A paired theme must have two intentional appearances. Mirroring can generate a draft proposal in Studio or an offline authoring tool, but it should not silently manufacture published paint. Review status should distinguish a draft proposal from an intentionally published appearance, with validation preventing contradictory availability flags. Source defaults and inheritance must be understandable before running the site.

The current `schemes`/`surfaceScheme`/`appearance` overlap should normalize into one appearance-resolution stage. The renderer consumes the selected, complete appearance; it does not decide whether to reverse a material based on which migration path produced it. Explicit reference colors remain reference colors. Any approximation should say which authoring operation produced it.

Start by removing runtime publication rewriting rather than immediately changing the serialized schema. Materialize/re-author current counterparts into native sources, with behavior checks where preservation is intended. Then decide whether the remaining authoring awkwardness warrants a versioned source shape. A new shape is justified by clearer semantics, not by the existence of another file to rename.

## What a small native source can look like

This valid v2 example illustrates explicit role intent without fitting machinery. It is an authoring example, not a visually approved production theme. Shared default materials refer to these roles, so they do not need another theme-ID treatment table. Its two maps are deliberately stated rather than synthesized at publication.

```json
{
  "formatVersion": 2,
  "id": "quiet-example",
  "name": "Quiet example",
  "ramp": { "hue": 260, "chroma": 0.35 },
  "schemes": {
    "kind": "dual",
    "mirrorDark": false,
    "light": {
      "text": 0.92, "textMuted": 0.72,
      "line": { "kind": "alias", "of": "textMuted" },
      "fill": 0.16, "panel": 0.05, "edge": 0, "shade": 1,
      "accent": 0.6, "brand": 0.12
    },
    "dark": {
      "text": 0.04, "textMuted": 0.28,
      "line": { "kind": "alias", "of": "textMuted" },
      "fill": 0.82, "panel": 0.96, "edge": 0.65, "shade": 1,
      "accent": 0.42, "brand": 0.86
    }
  }
}
```

The current format also permits a fixed theme to replace that scheme block with `kind: single`, one declared scheme and one role map. Deliberate literals or appearance-specific materials/marks can extend either example. The rule is that the declaration explains the published result; it is not that every theme must stop at this example's capabilities.

## A common system can have distinctive members

| Concern | Shared contract | Legitimate authored difference |
| --- | --- | --- |
| Readable UI | Semantic text and surface roles, reviewed composites | Different hues, chroma, contrast character and material density |
| Scheme support | Declared availability and requested-mode fallback | One appearance, or two independently authored appearances |
| Materials | Layer/alpha/lens and shared perimeter/shadow geometry | Different gradients, tint, opacity, lens settings |
| Identity | Same mark geometry and defined region modes | Outline, multicolor regions, art-directed counterpart, static scene motif |
| Backdrops | Parameter schema, palette contract, quality/resource ownership | Single-palette, multicolor, fixed artwork, differing motion motifs |
| Motion | Clear lifecycle, interruption and reduced-motion destination | Authored timings/paths per interaction or scene |

An unusual theme still satisfies the same interface. Theme-ID switches inside a general resolver are a different matter: they hide behavior from the author and make new themes require edits in unrelated modules. Replace the fixed-appearance blacklist with source declarations; replace mark treatment lookup tables with source-authored treatment.

New UI uses the same materials and controls as the site. Theme data does not own component padding, focus behavior, layout breakpoints, or every animation curve. Otherwise “themeability” becomes a second application framework and the editing surface becomes unmaintainable.

## Color, material, and artwork cleanup

For ordinary themes, prefer a small seed/ramp, readable role positions, a shared material recipe, and explicit counterpart differences. The flagship route themes are a good first native authoring set. Do not preserve seven or eight decimal places solely to satisfy historical equivalence tests. Use deviations when they express an intentional color adjustment; use a literal when it expresses a separate authored color more honestly.

Preserve the specular border's drawing rules and the shadow geometry. Move historical HSL reflection derivation behind an explicitly named compatibility/import recipe, then author or derive native reflection colors through the same documented color/material contract. Keep any output conversion needed by CSS drawing separate from core color decisions. Changing that derivation needs a reviewed rendered comparison of the actual rim and composites, not just matching isolated swatches.

A scene should declare palette slots it actually uses and, where needed, an authored reference palette/artwork mapping. Native renderers should not reach into the entire theme registry to obtain their base reference colors. Fixed art should declare that capability instead of accepting controls that cannot faithfully work. A multicolor scene may retain its color relationships; that is different from silently ignoring the selected palette.

Move legacy SVG/raster adaptation behind scene/artwork adapters. Keep it for saved themes and preserved artwork that need it. New palette-native SVG/shader work should bind directly to declared slots. Do not erase detailed art merely to remove an adapter; retire adapters as their actual consumers are replaced.

## Motion stays a resource system

Keep animation decisions outside the tonal ramp. Color `ease` remains a tone distribution curve. Interface motion belongs to state transitions; scene motion belongs to the scene contract. User/OS preferences constrain both. Every reduced-motion branch should identify the meaningful still destination rather than generically freezing a random frame or removing the main motif.

Keep one live WebGL renderer until measurement shows a concrete need for a different compositor. Its focused-preview lease is an explicit tradeoff, not a palette compromise. Continue to distinguish captured frames from fallbacks and keep DOM/WebGL stacking limitations documented. A theme rewrite must not casually undo these resource constraints.

## Reduce hidden runtime cost

The current gamut cache uses unbounded exact-coordinate keys. Bound or scope its lifetime; do not round inputs arbitrarily without testing color error. Use a shared immutable resolved snapshot for a source/appearance, and reuse compiled maps where consumers truly share it. A source-object/appearance cache can have weak ownership; it needs invalidation and mutation tests, not a global stringified archive of every slider state.

Measure resolution/compilation calls and allocations during a representative Studio edit with page/window previews and marks. Structural scene keys should be based on declared parameter behavior, rather than a growing central list of parameter names exempt from remounting. Narrow broad store subscriptions when their consumers cannot display the change.

Separate transient route/current-system mode from durable profile choices/revisions when evolving preference storage. Move profile references to stable saved-profile identities through a versioned preferences migration; preserve old index-based selections on import. A saved-profile identity must be distinct from an imported source's ID: two imported copies can declare the same source ID. These are state-model improvements, not reasons to change ThemeSource's color format prematurely.

## Implementation order and completion evidence

1. Establish explicit appearance semantics and representative fixtures: a normal paired route theme, a fixed seasonal theme, an achromatic theme, a multicolor identity, and an imported saved profile. Record intended invariants and permitted palette changes before re-authoring.
2. Make the authored registry the published source of truth. Remove `reviewedSchemes`/`reviewedMark` rewriting as each source is made explicit. Preserve saved-data imports at the boundary. Verify generated CSS freshness, availability, marks, scene palettes and profile exports.
3. Re-author the ordinary route-theme family with small native recipes. Review page, menu, search, fields, reading content and Studio in each appearance. Retain distinctive themes as clear data, not scattered resolver exceptions.
4. Normalize appearance resolution and native material reflection. Retire redundant orientation/mirroring logic only after imported profiles have a defined normalization path. Verify actual layered paint and original perimeter geometry.
5. Move authored scene references into scene-owned assets/contracts; replace adapters only where native palette bindings are ready. Exercise rich/reduced/still, speed, route/contained bounds, colors and renderer handoff.
6. Consolidate snapshot/compile ownership and bound caches with measured edit traces. Migrate durable profile references only with round-trip/selection tests. Keep ordinary appearance validation separate from compatibility golden fixtures.

Publication validation should diagnose unknown scene IDs, unsupported palette slots and invalid parameters instead of silently omitting or defaulting them; runtime fallback can remain tolerant for an imported representation.

Success means a new ordinary theme is understandable from one source plus a shared recipe; publishing has no ID-dependent transformation; single themes are not forced to acquire a counterpart; changing one appearance does not unintentionally edit another; Studio/export/site agree; palette changes do not remount unrelated scenes; and an edit session has bounded cache/resource growth.

Historical ΔE/pixel matching remains an import-preservation check. Native authoring acceptance uses semantic invariants, contrast/composite review, source simplicity, resource behavior, and visual craft. The existing wider browser/device/backdrop audit still applies. This direction gives freedom over theme color decisions while raising the standard for their explanation and implementation.
