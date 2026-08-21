# T4 — Theme compiler

Resolves F-02, F-06. Location: `src/features/theme/compile/`.

`compile(resolved: ResolvedTheme) → CustomPropertyMap`. One pure function, no React, no DOM.
It is the *only* code in the repository that produces CSS text from theme data.

## 1. The custom-property contract

Every property this app defines is `--zw-`-prefixed, so Tailwind's own `--color-*`,
`--spacing-*`, `--shadow-*` namespaces stay clean and `--zw-` is greppable.

```
--zw-scheme                      light | dark            (for CSS that must branch)

--zw-role-text                   oklch(…)
--zw-role-text-muted             oklch(…)
--zw-role-line                   oklch(…)
--zw-role-fill                   oklch(…)
--zw-role-panel                  oklch(…)
--zw-role-edge                   oklch(…)
--zw-role-shade                  oklch(…)
--zw-role-accent                 oklch(…)
--zw-role-brand                  oklch(…)

--zw-surface-<role>-image        <background-image list>  the alpha-scaled paint
--zw-surface-<role>-base         <background-image list>  the fixed-alpha paint, or `none`
--zw-surface-<role>-alpha        <number>                default alpha for the material
--zw-surface-<role>-blur         <length>                lens blur, 0 ⇒ no backdrop-filter
--zw-surface-<role>-saturate     <number>
--zw-surface-<role>-brightness   <number>

--zw-reading-blur                <length>
--zw-backdrop-<key>              oklch(…)                one per palette request (T6 §3)
```

Two image strings per surface, not ten (F-03) — and, in the overwhelmingly common case,
`--zw-surface-<role>-base` is `none`. `<role>`: `page`, `page-reduced`, `widget`, `raised`,
`sunken`, `overlay`, `nested`. See T5 §2.

### 1.1 How per-use alpha actually works

This mechanism replaces F-03's ten `--bg-widget-N` strings, so it has to be right. The obvious
approach does not work, and the reason is worth stating because it recurs.

**What does not work.** Emitting the alpha as a `var()` *inside* the image string:

```css
/* on <html>, from themes.generated.css — BROKEN */
--zw-surface-widget-image:
  linear-gradient(0deg, oklch(0.74 0.13 316 / calc(1 * var(--zw-surface-widget-alpha, 1))) 25%, …);
```

`calc()` *is* legal in the alpha slot of `oklch()`. The problem is not the maths, it is
substitution timing: the computed value of a custom property is its specified value **with
`var()` already substituted**, resolved on the element where the property is declared. Declared
on `<html>`, the inner `var(--zw-surface-widget-alpha, 1)` resolves against `<html>`, takes the
`, 1` fallback, and every descendant inherits the *already-substituted* string. A utility setting
`--zw-surface-widget-alpha` on the widget element would have no effect, and no error — every
surface would silently render at alpha 1.

This is the same rule that makes Tailwind's `@theme inline` necessary (§6): a theme variable whose
value is `var(--x)` gets substituted at `:root` unless the utility inlines it. `--zw-surface-*`
are not Tailwind theme variables, so `inline` cannot rescue them.

**What works: `opacity` on a paint layer.** `opacity` is a real CSS property, so its `var()` is
substituted on the element being styled, reading the inherited custom property.

```css
@utility surface-widget {
  position: relative;
  isolation: isolate;
  background-image: var(--zw-surface-widget-base, none);   /* fixed-alpha layers */

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background-image: var(--zw-surface-widget-image);      /* alpha-scaled layers */
    opacity: var(--zw-surface-widget-alpha, 1);            /* ← resolved here, per element */
  }
}
```

`surface-widget/70` (or `surface-widget-70`, per V-3) sets `--zw-surface-widget-alpha: 0.7` on
the element; `::before` inherits it and resolves `opacity` against it. Consequences:

- **Any alpha**, not ten multiples of 10 %, and the theme CSS carries the gradient once.
- **`opacity` animates on the compositor.** `surface-widget/70 → /90` is a compositor-only
  change, cheaper than recomputing a gradient's stop alphas. The Studio's opacity slider becomes
  free.
- **Nesting works.** A `surface-nested` panel inside a `surface-widget` card carries its own
  `--zw-surface-nested-alpha`; the names are role-specific so neither clobbers the other.
- `isolation: isolate` keeps `::before`'s opacity from creating a stacking context that traps
  the element's own children.

### 1.2 Fixed vs scaled layers, and why the compiler sometimes splits one layer into two

`alpha: "scaled" | "fixed"` on a layer (T3 §3) decides which of the two paint strings it joins.
`opacity` applies uniformly to a whole paint layer, so a layer cannot be partly scaled.

The legacy model was finer-grained: `isWidgetOpacity` is a *per-stop* flag. Measured across the
57 parseable widget surfaces:

| | count |
| --- | --- |
| every meaningful stop scaled (or alpha 0, where the flag is moot) | **50** |
| every stop fixed | 5 |
| genuinely mixed *within one layer* | **2** (`cherry`, `pixelland`) |

So the two-string model is exact for 55 of 57 surfaces with no special handling. For a layer with
mixed per-stop binding the compiler **splits it into two layers**, one per string, each carrying
the full stop list with the other binding's stops set to alpha 0:

```
authored:  linear-gradient(90deg, A/1 scaled 10%, B/1 fixed 60%)

emitted:   --zw-surface-widget-image: linear-gradient(90deg, A/1 10%, B/0 60%)   → ::before, opacity α
           --zw-surface-widget-base:  linear-gradient(90deg, A/0 10%, B/1 60%)   → element, opacity 1
```

At each authored stop position the result is exact. Between them, two premultiplied layers
composite slightly differently from one gradient with an interpolated alpha — identical where the
two stop colors match (`cherry`), a sub-perceptual difference where they differ (`pixelland`).
Both are covered by the visual-equivalence harness (T9 §5) and named in its report.

`RawLayer.css` may reference `var(--zw-surface-alpha)`; the compiler rewrites that token to the
role-specific name when it emits the layer. That whole-token rewrite is the only string
substitution the compiler performs — it is not a template — and it replaces the `$opacity`
placeholder of `colorPaletteParser.ts:164-166`.

## 2. Signature

```ts
export type CustomPropertyMap = ReadonlyMap<`--zw-${string}`, string>;

export function compile(theme: ResolvedTheme): CustomPropertyMap;

/** For build-time emission. */
export function compileToCss(
  theme: ResolvedTheme,
  selector: string,
): string;

/** For runtime application. Diff-aware; see §5. */
export function applyProperties(
  target: HTMLElement,
  next: CustomPropertyMap,
  previous?: CustomPropertyMap,
): CustomPropertyMap;
```

A `Map` rather than an object: insertion order is stable and meaningful for CSS output, and
diffing in `applyProperties` is O(n) without key enumeration surprises.

## 3. Gradient serialization

F-06 replaces the two-regex string-template interpreter with one exhaustive `switch`.

```ts
function layerToCss(layer: ResolvedLayer, mask: AlphaMask): string {
  switch (layer.kind) {
    case "linear":
      return `${layer.repeating ? "repeating-" : ""}linear-gradient(` +
        `${linearDirection(layer.direction)}${interpolation(layer.interpolation)}, ` +
        `${stops(layer, mask)})`;

    case "radial":
      return `${layer.repeating ? "repeating-" : ""}radial-gradient(` +
        `${radialExtent(layer.extent)} at ${pct(layer.at.x)} ${pct(layer.at.y)}` +
        `${interpolation(layer.interpolation)}, ${stops(layer, mask)})`;

    case "conic":
      return `${layer.repeating ? "repeating-" : ""}conic-gradient(` +
        `from ${deg(layer.from)} at ${pct(layer.at.x)} ${pct(layer.at.y)}` +
        `${interpolation(layer.interpolation)}, ${stops(layer, mask)})`;

    case "raw":
      return layer.css;

    default: {
      const never: never = layer;
      throw new UnreachableError(never);
    }
  }
}

const linearDirection = (d: LinearLayer["direction"]): string =>
  d.kind === "angle" ? deg(d.deg)
  : d.kind === "side" ? `to ${d.to}`
  : `to ${d.x} ${d.y}`;

const radialExtent = (e: RadialLayer["extent"]): string =>
  e.kind === "circle" ? `circle ${e.size}` : `${pct(e.x)} ${pct(e.y)}`;

const interpolation = (i?: Interpolation): string =>
  !i ? "" : ` in ${i.space}${POLAR_SPACES.has(i.space) ? ` ${i.hue ?? "shorter"} hue` : ""}`;
```

Each helper is total, typed, and independently testable. The three behavioral bugs the old
interpreter carried disappear with it:
- `if (!gradient.stops) return ")"` (`colorPaletteParser.ts:98-100`) emitted a bare `)` into
  the property value, silently corrupting the whole `background-image` list.
- The same for an unknown `type` (`:102-105`).
- `evaluateGradientRuleValue` coerced the string `"NaN"` to a number via `parseFloat`, so a
  malformed `angle` produced `0deg` rather than an error.

The compiler instead throws `AppError("internal")` on an impossible resolved layer, because
`resolve()` already validated the source; reaching the compiler with bad data is a bug, not
input.

Stop serialization, ordering, and alpha:

```ts
/**
 * Stops carry their authored alpha verbatim. The surface's per-use alpha is applied by
 * `opacity` on the paint layer (§1.1), never inside the image string.
 * `mask` selects which binding's stops are audible: the other binding's stops emit alpha 0,
 * which is what makes the layer split of §1.2 exact at every authored stop position.
 */
type AlphaMask = "scaled" | "fixed" | "all";

function stops(layer: ResolvedLayer, mask: AlphaMask): string {
  return [...layer.stops]
    .sort((a, b) => a.at - b.at)                 // CSS requires ascending; sort once, here
    .map((s) => {
      const audible = mask === "all" || (s.binding ?? layer.alpha ?? "scaled") === mask;
      return `${formatOklchWithAlpha(s.color, audible ? (s.alpha ?? 1) : 0)} ${pct(s.at)}`;
    })
    .join(", ");
}
```

`formatOklchWithAlpha(color, alpha)` lives in `color/format.ts` (T2 §6) so no call site
splices strings.

Sorting happens **in the compiler, not in the data**. The Studio may hold stops in authoring
order; `optimizeExportedProfile`'s in-place `stops.sort()` (which mutated user data as a side
effect of exporting) is removed.

Disabled layers are dropped by `resolve()`. If a surface resolves to zero layers, the compiler
emits `none` — not the current `emptyLayer` sentinel, which was a fully-populated
transparent gradient object existing only to keep the string non-empty.

## 4. Build-time path

`tools/build-theme-css.ts`, invoked from `prebuild` and from `build`:

```ts
const out: string[] = [];
for (const id of themeIds) {
  const source = getTheme(id);
  for (const scheme of schemesOf(source)) {
    const css = compileToCss(resolve(source, scheme),
      `[data-theme="${id}"][data-scheme="${scheme}"]`);
    out.push(css);
  }
}
write("src/styles/themes.generated.css", out.join("\n"));
```

`themes.generated.css` is imported into `layer(theme)` so built-in theme properties lose to
any `:root`-level runtime override (used by the Studio) without needing `!important`.

- **Committed to git.** It is deterministic output of committed input; committing it means CI
  can assert it is up to date (`git diff --exit-code` after regeneration) and that a reviewer
  sees color changes in the diff.
- **Size.** 59 themes × up to 2 schemes × ~30 properties. Estimated 45–55 KB raw, ~8 KB
  brotli, against a gate of < 60 KB br (S5). Measure at T4 completion; if a theme's `page`
  surface has many layers (`vitreous` has 5, `penumbra` has 11) the estimate rises, and the
  fallback is to emit only the default theme statically and lazily fetch
  `themes/<id>.css` on switch. Decide with data, not in advance.

**What this buys beyond bytes**: the active built-in theme is correct at first paint, from
`<html data-theme data-scheme>` set on the server. Today `ThemeApplier` is a client component
wrapping the entire tree, so first paint is unthemed and the theme arrives after hydration.

## 5. Runtime path

`features/theme/runtime/ThemeHost.tsx` — a client component that renders `null`.

```tsx
"use client";
export function ThemeHost() {
  const previous = useRef<CustomPropertyMap>();
  const pending  = useRef<number>();

  useEffect(() =>
    // external system: document.documentElement inline style
    themeStore.subscribe((s) => s.activeSource, (source) => {
      if (source.builtIn) { previous.current = clearOverrides(previous.current); return; }
      cancelAnimationFrame(pending.current!);
      pending.current = requestAnimationFrame(() => {
        const next = compile(resolve(source.theme, themeStore.getState().scheme));
        previous.current = applyProperties(document.documentElement, next, previous.current);
      });
    }, { fireImmediately: true }), []);

  return null;
}
```

Properties of this design:
- **Zero React re-renders on theme change** (gate S2). `ThemeHost` returns `null`; nothing
  else observes the theme.
- **Built-in themes take the zero-JS path.** Switching to a built-in id flips
  `data-theme`/`data-scheme` and clears any inline overrides. No compile at all.
- **Coalesced.** A Studio drag producing 60 store writes per second performs at most one
  compile per frame.
- **Diffed.** `applyProperties` compares against the previous map and calls `setProperty` only
  for changed keys, `removeProperty` for dropped ones. A color-picker drag touches 1–2
  properties, not 30.

`applyProperties` returns the map it applied so the caller can retain it as `previous` without
a second render pass.

### 5.1 Scheme selection

```
server:  <html data-theme={id} data-scheme={cookieScheme ?? sourceDefault}>
client:  if the user has no explicit preference, a tiny inline script in <head> reads
         matchMedia("(prefers-color-scheme: dark)") and sets data-scheme before paint.
```

The inline script is ~120 bytes and is the standard no-flash pattern. It replaces
`MainPageEffect`'s current post-hydration `matchMedia` check that swaps the entire
`pageTheme` map (`MainPageEffect.tsx:167-178`) — which causes a visible theme flash on every
cold load in dark mode.

## 6. The Tailwind bridge

`src/styles/globals.css`. See `perf/P5-tailwind-v4.md` for the full file; the theme-relevant
part:

```css
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

  --shadow-2xs: 0 1px 10px 2.3px var(--zw-shadow-tint-05);
  --shadow-xs:  0 1.5px 15px 3.3px var(--zw-shadow-tint-07);
  --shadow-sm:  0 1.6px 17.6px 4.2px var(--zw-shadow-tint-085);
  --shadow-md:  0 1.76px 19.2px 4.7px var(--zw-shadow-tint-095);
  --shadow-lg:  0 2px 20px 5.4px var(--zw-shadow-tint-10);
  --shadow-xl:  0 2.4px 25.6px 6.4px var(--zw-shadow-tint-115);
  --shadow-2xl: 0 3.2px 32px 8.6px var(--zw-shadow-tint-13);

  --blur-reading: var(--zw-reading-blur);
}
```

`--zw-shadow-tint-*` are compiled from the `shade` role at fixed alphas, replacing the seven
`rgb(var(--color-darklight-light) / 0.05)` expressions in `tailwind.config.ts:48-56` — and
with them the entire `darklight-*` family and the shade map that produced it (F-02).

Note the shadow scale is shifted one step: v3's `shadow-sm` becomes v4's `shadow-xs`. The
codebase's existing custom `shadow-xs` (5 sites, F-64) must be rewritten to `shadow-2xs`
during migration or it silently changes meaning. Tracked as a discrete task, `P5-06`.

## 7. What gets deleted

| File | Reason |
| --- | --- |
| `lib/colorPaletteParser.ts` | Replaced entirely by `compile/` |
| `lib/themeMaker/colorHelper.ts` | Shade map, index maps, hex/rgba helpers → `color/` |
| `lib/themeMiscParser.ts` | One property; folded into `compile` |
| `lib/themeMaker/layerHelper.ts` | `emptyLayer`/`emptyStops`/`initializeGradientDataProperties` unnecessary under the union |
| `lib/themeMaker/profileOptimizeTool.ts` | Field-stripping unnecessary; export is `JSON.stringify(source)` |
| `lib/themeMaker/themeConfigTypeGuard.ts` | → `model/schema.ts` |
| `components/theme/util/ThemeApplier.tsx` | → `runtime/ThemeHost.tsx` |
| `components/theme/util/ThemeDataInitializer.tsx` | Provider indirection; store replaces it |
| `tailwind.config.ts` | CSS-first configuration |

Nine files, ~1 100 lines, removed. `optimizeExportedProfile` deserves a note: its entire
purpose was to shrink exported profiles by deleting fields that did not apply to a layer's
type and fields equal to their defaults. Under a discriminated union with no defaults to
strip, `JSON.stringify(source)` is already minimal, and the `optimizeProfileExport` user
setting is removed.

## 8. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `compile` is pure; 200 resolved themes give identical repeat output |
| C2 | Every emitted `background-image` and `-base` value parses: assert via `CSSStyleDeclaration.setProperty` in jsdom + `getPropertyValue() !== ""` for all 59 themes × 2 schemes |
| C3 | `layerToCss` has 100 % branch coverage including the `never` default |
| C4 | Golden-file test: each of the 59 lifted themes compiles to a committed snapshot; a diff is a reviewable color change |
| C5 | `surface-widget/70` renders the same composited pixels as the current `bg-widget-70` for all 59 themes, within 1/255 per channel (visual-equivalence harness, T9 §5) |
| C5a | **Browser repro (V-15) passes**: setting `--zw-surface-widget-alpha` on an element changes its rendered alpha. This is the mechanism of §1.1 and must be confirmed before T4-01 |
| C5b | A layer with mixed per-stop alpha binding splits into `-image` + `-base` and is exact at every authored stop; `cherry` and `pixelland` are the only two affected and both appear in the migration report |
| C6 | `themes.generated.css` is byte-identical after regeneration in CI |
| C7 | Brotli size of `themes.generated.css` < 60 KB |
| C8 | Switching between two built-in themes triggers 0 React commits (Profiler) |
| C9 | A Studio drag of 60 store writes triggers ≤ 1 `compile` per animation frame and ≤ 3 `setProperty` calls per frame |
| C9a | Changing only a surface alpha triggers **0** `compile` calls — it is a single `opacity` write |
| C10 | No file outside `features/theme/compile/` contains the substring `gradient(` in a template literal |
