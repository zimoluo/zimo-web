# T1 — Theme architecture

The theme engine is the centerpiece of v11. This document is the map; T2–T9 are the
territory. Read this first.

## 1. The one-sentence thesis

**A theme is a small perceptual description that generates a palette, a set of surface
materials, a backdrop configuration, and an identity mark — and the only thing that reaches
the DOM is CSS custom properties.**

Everything else in T2–T9 follows from taking that sentence literally.

## 2. Layers

```
                    ┌──────────────────────────────────────────┐
  AUTHORING         │  ThemeSource                             │   T3
                    │  seed · ramp · roles · surfaces ·         │
                    │  backdrop · mark · reading                │
                    └───────────────────┬──────────────────────┘
                                        │  resolve()            T2 + T3
                    ┌───────────────────▼──────────────────────┐
  MODEL             │  ResolvedTheme                           │
                    │  every role an absolute Oklch triple,    │
                    │  every surface a concrete GradientStack  │
                    └───────────────────┬──────────────────────┘
                                        │  compile()            T4
                    ┌───────────────────▼──────────────────────┐
  PRESENTATION      │  CustomPropertyMap                       │
                    │  --zw-role-* --zw-surface-*-image …      │
                    └───────┬───────────────────────┬──────────┘
                            │                       │
              build time ───┘                       └─── runtime
        static theme CSS in styles/themes.css   document.documentElement
        `[data-theme="velvet"] { … }`           .style.setProperty(…)
                            │                       │
                    ┌───────▼───────────────────────▼──────────┐
  CONSUMPTION       │  Tailwind v4 @theme inline + @utility     │   T5, P5
                    │  bg-primary/70 · surface-widget/80 · …    │
                    └──────────────────────────────────────────┘
```

Four hard rules follow:

**R1 — `ThemeSource` never contains a CSS string.** No `"linear-gradient(…)"`, no
`"#ff00aa"` in a field whose meaning is a color (literal overrides use a typed
`ColorLiteral`, T3 §4). No `$opacity` placeholders. This is the direct answer to *"the data
is conflated with what's being injected into CSS — that's the compiler's job, not to make
data less pretty."*

**R2 — `resolve()` and `compile()` are pure functions with no React and no DOM.** They are
importable by the migration CLI, by build scripts, by tests, and by the editor. Located at
`features/theme/model/resolve.ts` and `features/theme/compile/compile.ts`.

**R3 — Theme changes never re-render React.** The runtime host subscribes to the store and
writes custom properties imperatively. React does not observe the theme. Gate S2.

**R4 — Built-in themes are compiled at build time.** Their CSS ships as static bytes.
`compile()` runs in the browser only for the theme currently being edited.

## 3. What each document owns

| Doc | Owns |
| --- | --- |
| **T2** Color engine | OKLCh maths, `Cmax(L,h)` gamut search, the tone ramp as a continuous function, gamut mapping, test vectors |
| **T3** Schema | `ThemeSource`, `ResolvedTheme`, `resolve()`, validation, the registry and derived ids |
| **T4** Compiler | `compile()`, the custom-property contract, build-time emission, runtime application, the Tailwind bridge |
| **T5** Surfaces & gradients | `GradientStack` discriminated union, surface materials, per-use alpha, positional variation (the "same shape" fix) |
| **T6** Backdrops | `BackdropScene` contract, palette requests, shared canvas, GLSL chunk library, quality tiers |
| **T7** Identity mark | Mark modes, gradient specs, SVG generation, the `<meta name="theme-color">` path |
| **T8** Studio | Editor architecture, draft store, live preview without re-render |
| **T9** Migration | Exact lift of the 59 existing themes, per-theme report, optional simplification |

## 4. Vocabulary

Fixed terms. Use these exactly; the old names are retired.

| v11 term | Meaning | Replaces |
| --- | --- | --- |
| **Theme** | A `ThemeSource` document | "theme profile", "theme config" |
| **Seed** | `{ hue, chroma, torsion }` — the generator input | — |
| **Ramp** | The continuous tone function `t ↦ Oklch`, defined by control stops | "shade map" |
| **Tone** | A point on the ramp, addressed by `t ∈ [0, 1]` | "shade", "shade index" |
| **Stop** | An authored control point of the ramp | — |
| **Role** | A named semantic color slot resolved from the ramp | "accent color" |
| **Scheme** | `light` \| `dark` — a presentation of one theme | — (was separate themes) |
| **Surface** | A named material: tint + lens + variation | `bg-widget-*`, `bg-page` |
| **Layer** | One entry in a surface's gradient stack | "gradient layer" ✓ (kept) |
| **Backdrop** | The animated scene behind the page | "animated background" |
| **Mark** | The circular identity glyph | "favicon" (reserved for the browser icon) |
| **Studio** | The theme editor | "Theme Maker" (kept as product name) |

`t = 0` is the **lightest** end of the ramp, `t = 1` the **darkest**. This orientation is
fixed and scheme-independent: a dark theme places its text role near `t = 0` and its page
role near `t = 1`. It matches the existing corpus, in which 57 of 58 themes have monotonic
lightness across their four roles (F-11).

## 5. Roles

Nine roles, replacing four accents plus eight derived `highlight-*`/`darklight-*` variables
plus `siteThemeColor`.

| Role | Purpose | Typical `t` (light scheme) | Replaces |
| --- | --- | --- | --- |
| `text` | Body copy, icons | 0.70 | `primary` |
| `textMuted` | Secondary copy, captions, placeholders | 0.58 | `saturated` |
| `line` | Rules, outlines, dividers | 0.30 | ad-hoc `border-saturated` |
| `fill` | Neutral filled areas, chips, tracks | 0.15 | `pastel` |
| `panel` | Panels, cards, bars | 0.05 | `light` |
| `edge` | Specular highlight for `border-reflect` | 0.00 | `highlight-*` |
| `shade` | Shadow tint | 1.00 | `darklight-*` |
| `accent` | Interactive emphasiz, focus ring, links | 0.50 | (none — new) |
| `brand` | Browser theme-color, mark stroke default | 0.20 | `siteThemeColor` |

Notes:
- `edge` and `shade` being *roles* rather than per-accent derivatives is what deletes F-02
  entirely: there is no per-color shade map to compute, because a highlight is just the
  ramp at `t = 0`.
- `accent` is new. The corpus currently overloads `saturated` for both muted text and
  interactive emphasiz, which is why link and focus styling is inconsistent across the site.
- The `t` column is the **default** for the light scheme; every role is individually
  overridable, and the dark scheme uses a separate mapping (T3 §5).
- **Role names describe function, not lightness.** `panel` is the panel/chrome tint; it is
  *not* named `panel`, because "raised" implies "lighter" and that inverts under scheme
  mirroring. In the measured corpus the legacy `light` role is the background-most color in
  both schemes — lightest in the 27 light themes, darkest in the 31 dark ones. A name that
  encodes lightness would be wrong for half the corpus. The same reasoning applies to the
  `nested` surface (T5 §2), which is a nested elevated panel and would be misread as recessed
  under a name like `inset`.

## 6. Data flow, concretely

**Build time** (`tools/build-theme-css.ts`, run from `prebuild`):
```
for each ThemeSource in registry:
    for each scheme in [light, dark]:
        resolved = resolve(source, scheme)
        props    = compile(resolved)
        emit     `[data-theme="<id>"][data-scheme="<scheme>"] { …props }`
→ src/styles/themes.generated.css
```

**Request time** (server):
The active theme id and scheme are read from the request (cookie for the persisted
preference; `prefers-color-scheme` is a client concern) and set as
`<html data-theme data-scheme>`. Built-in themes therefore render correct on first paint
with **zero** client JS. This is a functional improvement: today the theme is applied by a
client component wrapping the whole tree, so first paint is unthemed.

**Runtime** (client, only when the theme is not a built-in id):
`ThemeHost` subscribes to `themeStore`. On change it runs `resolve` + `compile` and applies
the result with `setProperty` on `document.documentElement`, coalesced into one
`requestAnimationFrame`. It renders `null`.

**Studio** (client):
Writes to a draft slice. The preview path is the same `resolve` + `compile` +
`setProperty`, scoped to the preview root element instead of `:root`. No React re-render.

## 7. Relationship to Tailwind

`src/styles/globals.css`:
```css
@import "tailwindcss";
@import "./themes.generated.css" layer(theme);

@theme inline {
  --color-text:        var(--zw-role-text);
  --color-text-muted:  var(--zw-role-text-muted);
  --color-line:        var(--zw-role-line);
  --color-fill:        var(--zw-role-fill);
  --color-panel: var(--zw-role-panel);
  --color-edge:        var(--zw-role-edge);
  --color-shade:       var(--zw-role-shade);
  --color-accent:      var(--zw-role-accent);
  --color-brand:       var(--zw-role-brand);
}
```

`@theme inline` is load-bearing. Without it, Tailwind declares `--color-text: var(--zw-role-text)`
at `:root` and utilities reference `var(--color-text)`. Because a custom property's computed value
is its specified value **with `var()` already substituted, resolved on the declaring element**,
that indirection collapses at `:root` — so a `:root`-level override of `--zw-role-text` still
propagates, but a *scoped* override does not. The Studio previews a draft theme by writing
properties on a preview root, not on `:root` (T8 §1), and that is the case `inline` fixes: it
emits `background-color: color-mix(in oklab, var(--zw-role-text) 70%, transparent)` directly into
the utility, so the variable is read on the element being styled.

The same substitution rule is why surface alpha cannot travel inside the image string. T4 §1.1
works through it in full; it is the single most important CSS fact in this spec.

This also deletes the `<alpha-value>` channel-triplet convention (F-65) and with it
`ColorTriplet`, `color-convert`, and 112 `*-opacity-*` utilities.

## 8. Non-goals for the theme engine

- **Not a general design-token system.** Nine roles and a fixed surface set. If a component
  needs a color outside the roles, that is a design decision to be made, not a token to be
  invented.
- **Not automatic contrast enforcement.** The engine exposes `contrastRatio()` and the
  Studio *reports* WCAG ratios (T8 §6), but it does not silently adjust authored colors.
  Themes are expressive; the author decides.
- **Not P3-first.** Output is sRGB-gamut-mapped `oklch()`. A `display-p3` target is a
  one-line change to the gamut predicate (T2 §6) and is deliberately deferred: half the
  corpus sits at ≥ 0.85 relative chroma in sRGB and would shift visibly.
