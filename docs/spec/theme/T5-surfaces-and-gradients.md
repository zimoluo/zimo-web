# T5 — Surfaces and gradients

Resolves F-03, F-04, F-08. Location: `src/features/theme/model/surface.ts`,
`src/features/theme/compile/surface.ts`, `src/styles/surfaces.css`.

The layered gradient system is the best thing in the current codebase and survives intact.
This document fixes the three things wrong around it: the ten-fold property duplication, the
opacity flag stored on data, and — the visible one — the fact that every widget on the site
renders an identical gradient.

## 1. What a surface is

A **surface** is a named material. It has:

- a **tint**: a stack of gradient layers, usually translucent;
- a **lens**: an optional `backdrop-filter` (blur, saturate, brightness);
- a **base alpha**, multiplied by the per-use `--zw-surface-*-alpha`;
- a **variation policy**: how the tint changes with the element's position and size (§4).

```ts
export type SurfaceSource = {
  readonly layers: readonly GradientLayer[];
  readonly alpha?: number;                     // default 1
  readonly lens?: LensSource;
  readonly variation?: SurfaceVariation;
};

export type LensSource = {
  readonly blur?: number;        // px, 0 ⇒ no backdrop-filter emitted at all
  readonly saturate?: number;    // 1 = neutral
  readonly brightness?: number;  // 1 = neutral
};
```

A lens with `blur: 0` and neutral saturate/brightness emits **no** `backdrop-filter`. This
matters: `backdrop-filter` forces a compositing layer per element, and today
`backdrop-blur-sm` appears at 21 sites and `backdrop-blur-[6px]` at 10 more, several of them
on elements that do not need it.

## 2. The named surfaces

Today the site has two named surfaces (`page`, `widget`) and a long tail of hand-written
ad-hoc ones. Counted:

| Ad-hoc pattern | Occurrences |
| --- | --- |
| `bg-light/65` | 31 |
| `bg-light bg-opacity-80` | 28 |
| `bg-widget-90` | 14 |
| `bg-widget-80` | 12 |
| `bg-widget-60` | 6 |
| `bg-widget-70` | 5 |
| `bg-pastel bg-opacity-40` | 4 |
| `bg-widget-50` | 1 |
| `bg-pastel/35` | 1 |

Plus, applied inconsistently alongside them: `outline outline-1 outline-highlight-light/15`
(15), `border border-highlight-light border-opacity-15` (12), `border-reflect-light` (26),
`border-reflect-pastel` (8), `shadow-lg` (90), `shadow-xl` (18), and four different blur
radii. The same visual object — "a translucent raised panel" — is spelled six different ways
across the codebase. That is the shortcut the charter's principle 1 forbids.

v11 defines **seven** surfaces. Every translucent container in the product uses one.

| Surface | Meaning | Replaces | Default lens |
| --- | --- | --- | --- |
| `page` | Full-viewport backdrop paint | `bg-page` | none |
| `page-reduced` | Simplified `page` for `backgroundRichness: minimal` | `bg-page-minimal` | none |
| `widget` | The primary content material: cards, readers, windows | `bg-widget-*` | blur **12**, saturate 1.15 |
| `raised` | Floating chrome above content: navbar pills, buttons, search, TOC | `bg-light/65` | blur 4 |
| `sunken` | Recessed areas: inputs, tracks, wells | `bg-light bg-opacity-80` | none |
| `overlay` | Modal scrims and popup chrome | `bg-neutral-600/30`, `DarkOverlay` | blur 3 |
| `nested` | Editor panels nested inside a widget | `bg-pastel bg-opacity-40` | blur 12 |

Each also carries the border/outline and shadow treatment that currently has to be
hand-applied, so `surface-raised` means "translucent, blurred, specular-edged, shadowed
floating chrome" as one decision rather than five classes that a developer may get wrong.

`defaultSurfaces` (`model/defaults.ts`) defines all seven in terms of `{ kind: "role" }` and
`{ kind: "tone" }` references, so **every theme gets all seven for free** and overrides only
what it cares about. Today a theme must author `page`, `widget`, and optionally
`pageMinimal`; there is no way to say "this theme's inputs should be tinted differently".

## 3. Alpha belongs to the material

F-08: today a gradient *stop* carries `isWidgetOpacity?: boolean`, and the `custom` gradient
kind carries a raw CSS string containing the literal token `$opacity`, string-replaced at
compile time.

In v11 the *layer* declares its relationship to the surface's alpha:

```ts
alpha?: "scaled" | "fixed"     // on LayerBase, default "scaled"
```

- `"scaled"` — the layer joins the surface's **alpha-scaled paint**, whose `opacity` is the
  per-use surface alpha. This is what `isWidgetOpacity: true` meant. 50 of 57 existing widget
  surfaces are entirely this case.
- `"fixed"` — the layer joins the surface's **base paint**, at opacity 1 regardless of the
  surface's alpha. This is what `isWidgetOpacity: false` meant, and it is used for the inner
  glow layers that several themes place beneath the main tint.

The two paints are two custom properties and two painted boxes: `--zw-surface-<role>-base` on
the element itself and `--zw-surface-<role>-image` on its `::before`, which carries
`opacity: var(--zw-surface-<role>-alpha, 1)`. **The alpha is never a `var()` inside the image
string** — T4 §1.1 explains why that cannot work in CSS and what happens if you try. A layer with
mixed per-stop binding is split across both paints by the compiler (T4 §1.2); two themes need
that.

`RawLayer.css` may write `var(--zw-surface-alpha)`; the compiler rewrites the token to the
role-specific name. The `$opacity` templating disappears with nothing lost.

Nothing about opacity is stored on a color stop. A stop has a color and an alpha; how that
alpha composes is the material's business.

## 4. Positional identity — the "same shape" fix

### 4.1 The defect, precisely

`bg-widget-*` sets `background-image` with `background-size: cover; background-position:
center` on every element that uses it (`tailwind.config.ts:92-106`). A `background-image`
gradient is resolved in the element's own box, so a 40 px button and a 900 px article render
the *same relative slice* of the same gradient. The 45° highlight falls across the top-left of
both, at the same relative position, at the same relative scale. The site therefore reads as a
set of scaled copies of one object — which is the "really ugly" the brief names.

Two fixes, and they compose. Both are required.

### 4.2 Primary fix: the lens model

Reframe `widget` from *"an opaque gradient copied into each element"* to *"a translucent tint
over a shared field seen through a lens."*

The mechanism is already half-present: widgets carry `bg-widget-N` **and**
`backdrop-blur-[6px]`. The page backdrop is a fixed, full-viewport paint. So a widget's
appearance is already partly determined by what is behind it at its position — but the tint is
opaque enough, and the blur weak enough, that the shared field is not doing visual work.

The change is in the **default surface definitions**, not in a new mechanism:

- `widget` tint drops to `alpha: 0.68` with **one or two** gradient stops instead of a full
  articulated gradient. Its job is to tint and to lift contrast, not to be the picture.
- Lens blur rises from 6 px to **12 px** with `saturate(1.15)`, so the backdrop behind reads as
  *material* rather than as a blurry photograph. 12 is the single number `defaultSurfaces` uses;
  `T5-05` may retune it per theme by eye, and if it does, it updates the §2 table too.
- Articulation moves to the `page` surface, where it belongs — that surface *is*
  viewport-sized, so a gradient placed on it has real spatial extent.

Result: two widgets at different positions genuinely differ, because they are lenses onto
different parts of one field. Zero JavaScript, zero per-callsite configuration, and it makes
the existing multi-layer `page` gradients (`vitreous` has 5 layers, `penumbra` has 11) do
visible work instead of being hidden behind opaque widgets.

This is also the direction the visual language already points: the design page's own copy
describes "translucency" and "a vivid, glass-like aesthetic" (`app/design/page.tsx`). The lens
model is that description, implemented.

> **Rejected: `background-attachment: fixed`.** It would make each element's gradient a window
> onto one viewport-space gradient directly, which sounds ideal. It is not usable here: iOS
> Safari has never implemented it reliably, it interacts badly with `border-radius` +
> `overflow: hidden`, and it defeats compositing on scroll. ADR-006.

### 4.3 Secondary fix: declared variation

The lens model fixes *sameness*. It does not give the author a dial. For that, a surface
declares how its tint may be perturbed, and a call site picks a variation index.

```ts
export type SurfaceVariation = {
  /** Which surface's image this variation indexes. Set by the compiler, not authored. */
  /** Degrees added to linear/conic angles per variation step. */
  readonly rotate?: number;
  /** Percentage points added to stop positions per step. */
  readonly shift?: number;
  /** Percentage points added to radial/conic center per step. */
  readonly nudge?: number;
  /** Number of distinct variations. Default 8. */
  readonly count?: number;
};

/** Per-layer opt-out / override. */
export type LayerVariation = SurfaceVariation | false;
```

The compiler emits **`count` variants** of the surface image, indexed:

```css
--zw-surface-widget-image-0: linear-gradient(0deg,   … 25%,  … 100%);
--zw-surface-widget-image-1: linear-gradient(24deg,  … 37%,  … 100%);
--zw-surface-widget-image-2: linear-gradient(48deg,  … 49%,  … 100%);
/* … */
--zw-surface-widget-image: var(--zw-surface-widget-image-0);
```

and a Tailwind v4 functional utility selects one:

```css
/* One per surface that declares a variation policy. `--value(--surface-variant-*)` resolves
   against `@theme` keys, which is v4's functional-utility mechanism — a `--value()` call
   cannot be concatenated into a custom-property *identifier*. Confirm the exact form with
   V-2 before implementing. */
@theme {
  --surface-variant-0: 0;
  --surface-variant-1: 1;
  /* … up to count-1 */
}
@utility surface-widget-variant-* {
  --zw-surface-widget-image: var(--zw-surface-widget-image-\-value(--surface-variant-*));
}
```

Usage: `class="surface-widget surface-widget-variant-3"`. The utility is named per surface
rather than generically, because a generic `surface-variant-3` would have to hard-code which
surface it perturbs and would silently target the wrong one next to `surface-raised`.

Properties:
- **Deterministic.** The same markup produces the same CSS in every build, so there is no
  hydration mismatch and no visual churn between deploys.
- **Authorable.** A designer chooses which cards differ and by how much. Variation is a
  design decision, not a dice roll.
- **Bounded cost.** `count: 8` on the `widget` surface only. `page` is one element; `raised`
  and `sunken` are small and blurred. Estimated addition: ~3 KB br across all themes.
- **Reviewable.** `surface-variant-3` in a diff is a visible, intentional change.

Applied in practice: an article list where consecutive cards cycle variants; a window whose
variant derives from its z-order; the notebook's pages.

### 4.4 Why not a random per-callsite seed

The brief floated "using a tailwind plugin to generate a seed, or any postcss scripts" and
suspected it "might be too crazy". It is, for three concrete reasons, and the reasons matter
because they are not aesthetic:

1. **Tailwind cannot see the call site.** A v4 utility receives only the class name. It has no
   access to the file, line, or element that used it. There is no identity to hash.
2. **Randomness at build time is not stable.** Two builds produce two visual results.
   Server-rendered HTML and client-hydrated CSS could disagree. Screenshot tests become
   useless.
3. **Randomness is not design.** An arbitrary rotation per widget produces noise, not
   rhythm. The 8-variant palette gives the same variety under authorial control.

A PostCSS plugin *could* hash the source position if it processed the JSX rather than the CSS —
which means a Babel/SWC transform, a second source-map layer, and a bespoke build step that
every future contributor must understand. Rejected as ADR-005.

## 5. Interpolation

`Interpolation` (T3 §3) is retained verbatim from the current system — it is genuinely good,
and `eep`'s `hsl longer hue` widget gradient is a real use of it. Two changes:

- The default is **omitted**, not the string `"default"`. `colorInterpolation: { colorSpace:
  "default" }` currently exists as a sentinel meaning "emit nothing", which the optimizer then
  has to delete (`profileOptimizeTool.ts:113-115`). Absent means absent.
- Because stops are now emitted as `oklch()`, the browser's *unspecified* default
  interpolation (sRGB) applies to `oklch()` endpoints. Where a theme relied on the visual
  result of interpolating `rgb()` endpoints, the migration records
  `interpolation: { space: "srgb" }` explicitly so nothing shifts. T9 §4 covers this; it
  affects gradients whose endpoints differ in hue by more than ~30°, which is 11 of 59 themes.

## 6. Mirroring under dual schemes

When `resolve()` mirrors a dual-scheme theme (T3 §1.1):

- `{ kind: "tone", at }` in any stop → `{ kind: "tone", at: 1 - at }`.
- `{ kind: "role", role }` → unchanged; the role itself was already mirrored.
- `{ kind: "literal" }` → **unchanged**, and `resolve()` emits a development warning naming
  the surface and layer, because a literal in a mirrored surface almost always needs a
  scheme-specific override.
- `alpha`, geometry, and `variation` → unchanged.

Surfaces whose dark presentation needs more than mirroring override it under
`schemes.dark` — the same `Partial<>` mechanism as roles.

## 7. The CSS side

`src/styles/surfaces.css`, imported by `globals.css`. One utility per surface plus the alpha
and variant modifiers.

```css
@utility surface-page {
  background-color: var(--zw-role-brand);
  background-image: var(--zw-surface-page-image);
  background-size: cover;
  background-position: center;
}

@utility surface-widget {
  position: relative;
  isolation: isolate;
  background-image: var(--zw-surface-widget-base, none);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background-image: var(--zw-surface-widget-image);
    background-size: cover;
    background-position: center;
    opacity: var(--zw-surface-widget-alpha, 1);
  }
}

/* Alpha modifier — one per surface, role-specific so nested surfaces do not clobber
   each other (T4 §1.1). */
@utility surface-widget-* {
  --zw-surface-widget-alpha: --value(percentage);
}
```

Note the nesting: `@utility` takes a utility *name*, so a pseudo-element goes inside the block
with `&::before`. `@utility surface-widget::before { … }` is not a legal prelude.

The specific form of the alpha modifier — whether `surface-widget/80` via a modifier or
`surface-widget-80` via a functional utility — depends on Tailwind v4's modifier support for
custom utilities. **Confirm before implementing** (`exec/X4 §5`, check V-3) and use whichever
the installed version supports; the data model is unaffected either way.

The specular edge (`border-reflect-*`, currently a 60-line plugin in `tailwind.config.ts`
with two inline 40-stop mask gradients duplicated for `mask` and `-webkit-mask`) becomes:

```css
@utility surface-edge {
  position: relative;
}
@utility surface-edge::after { /* … single mask, --zw-role-edge … */ }
```

with the mask gradient extracted to `--zw-edge-mask` defined once in `surfaces.css`. The
`-webkit-` duplicate is dropped: `mask` and `mask-composite` are unprefixed in Safari 15.4+,
inside the v4 baseline.

## 8. Migration of call sites

Mechanical, with a codemod (`tools/codemod-surfaces.ts`) plus review:

| From | To |
| --- | --- |
| `bg-widget-90` | `surface-widget/90` |
| `bg-light/65 backdrop-blur-sm border-reflect-light shadow-lg` | `surface-raised` |
| `bg-light bg-opacity-80` | `surface-sunken` |
| `bg-pastel bg-opacity-40 backdrop-blur-lg border border-highlight-pastel/15` | `surface-nested` |
| `bg-page` / `bg-page-minimal` | `surface-page` / `surface-page-reduced` |
| `outline outline-1 outline-highlight-light/15` | folded into the surface utility |
| `border-reflect-light` | `surface-edge` |

The codemod handles the exact-match cases (the four patterns above cover 78 of ~100 sites);
the remainder are listed in its report for manual classification. A site that genuinely needs
something outside the seven surfaces is a design question, escalated rather than special-cased.

## 9. Acceptance

| # | Criterion |
| --- | --- |
| C1 | All seven surfaces are defined in `defaultSurfaces` and every registry theme resolves all seven |
| C2 | Zero occurrences of `bg-widget-`, `bg-light/`, `bg-light bg-opacity-`, `bg-pastel bg-opacity-` in `src/` |
| C3 | Exactly one `--zw-surface-<role>-image` and one `-base` per surface per theme (plus `-N` variants where `variation` is declared); `-base` is `none` for at least 50 of 57 migrated widget surfaces |
| C4 | `--zw-surface-widget-alpha: 0.7` reproduces the current `bg-widget-70` computed value within 1/255 per channel for all 59 themes (T9 §5 harness) |
| C5 | A layer with `alpha: "fixed"` joins `-base`; `"scaled"` joins `-image`; a mixed layer splits across both and is exact at every authored stop |
| C6 | `surface-<role>-variant-N` for `N ∈ [0, count)` yields `count` visually distinct images; `N ≥ count` falls back to variant 0 without an invalid value |
| C7 | Two `surface-widget` elements at different viewport positions have visibly different rendered appearance under the lens model — screenshot diff > 2 % on a 6-theme sample |
| C8 | `mirror` of a surface stack round-trips: `mirror(mirror(s)) === s` |
| C9 | No `-webkit-mask` in `src/styles/` |
| C10 | Added brotli weight of variation variants across all themes < 5 KB |

## Main integration: reflective edge paint ownership

ADR-045 ports the newer main highlight treatment to `surface-edge`. The edge owns `::after` only;
`::before` remains the surface tint. Edge and shade use the v11 roles, with 85% edge mixed with white
and 80% shade mixed with black in OKLab. The ambient paint shares the highlight's mask and overlay
blend. This preserves the surface-alpha contract when both utilities are applied to one element.
