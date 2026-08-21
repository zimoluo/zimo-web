# T2 — Color engine

Resolves F-01, F-10, F-11, F-12. Location: `src/features/theme/color/`. Pure, no React, no
DOM, no dependencies.

## 1. Why OKLCh, stated precisely

The existing `generateShadeMap` (F-01) ramps HSL lightness and holds HSL saturation roughly
constant. Two things break.

**Lightness is not lightness.** HSL `L` is `(max + min) / 2` of gamma-encoded sRGB
channels. `hsl(60 100% 50%)` (yellow) and `hsl(240 100% 50%)` (blue) have identical HSL
lightness and OKLab lightness `0.968` and `0.452` respectively — a 2.1× difference in
perceived lightness. A ramp built on HSL `L` produces rungs that are not visually equal
steps, and two themes of different hue produce ladders that do not correspond.

**Saturation is not chroma.** The maximum chroma attainable in sRGB depends jointly on
lightness *and* hue. Measured (`appendix/oklch.mjs`, `cMax`):

| L | h=0 | h=60 | h=120 | h=180 | h=240 | h=270 | h=300 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.30 | 0.1216 | 0.0704 | 0.0712 | 0.0544 | 0.0687 | 0.1966 | 0.1601 |
| 0.50 | 0.2027 | 0.1173 | 0.1187 | 0.0907 | 0.1145 | 0.2812 | 0.2669 |
| 0.70 | 0.2095 | 0.1642 | 0.1662 | 0.1270 | 0.1603 | 0.1564 | 0.1859 |
| 0.85 | 0.0886 | 0.1010 | 0.2018 | 0.1542 | 0.0830 | 0.0736 | 0.0872 |
| 0.95 | 0.0269 | 0.0312 | 0.1711 | 0.0717 | 0.0266 | 0.0236 | 0.0279 |

At `L = 0.85` the ceiling spans 0.0736 → 0.2018 (**2.7×**); at `L = 0.95`, 0.0236 → 0.1711
(**7.2×**). Peak chroma per hue also occurs at wildly different lightnesses: violet
(h=270) peaks at `L = 0.465`, green (h=120) at `L = 0.935`.

Therefore: **chroma must be authored relative to the local gamut ceiling**, not absolutely
and not as HSL saturation. That single decision is what makes "different hues look
consistent in chroma" true rather than aspirational.

## 2. Color types

```ts
/** Oklch. L ∈ [0,1]; C ≥ 0 (unbounded, in practice < 0.4 for sRGB); h ∈ [0,360). */
export type Oklch = { readonly l: number; readonly c: number; readonly h: number };

/** Linear-light sRGB, unclamped. Values outside [0,1] are out of gamut. */
export type LinearSrgb = { readonly r: number; readonly g: number; readonly b: number };

export type Gamut = "srgb" | "display-p3";
```

`Oklch` is the **only** internal color representation. Hex and `rgb()` exist solely at
import/export boundaries (`parseColorLiteral`, `formatHex`).

## 3. Conversions

`color/oklab.ts`. Björn Ottosson's matrices, reproduced exactly. Both directions are
required: the forward direction for output, the reverse for parsing authored literals and
for migration.

```ts
export function oklabToLinearSrgb({ l, a, b }: Oklab): LinearSrgb {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  const L = l_ ** 3, M = m_ ** 3, S = s_ ** 3;
  return {
    r: +4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    g: -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    b: -0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S,
  };
}

export function linearSrgbToOklab({ r, g, b }: LinearSrgb): Oklab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    l: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  };
}
```

> Implementation note, worth a unit test on its own: the `a` row's middle coefficient is
> **−2.4285922050**, not −0.2428592205. The one-order-of-magnitude typo is easy to make and
> produces plausible-looking garbage (chroma values above 1, all hues collapsing near 355°).
> `oklab.spec.ts` must assert `linearSrgbToOklab(srgbToLinear(hex("#a21caf")))` yields
> `L ≈ 0.5180, C ≈ 0.2258, h ≈ 323.9` (±0.001).

Transfer functions (`color/srgb.ts`), standard sRGB EOTF/OETF:
```ts
export const linearToGamma = (x: number) => x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
export const gammaToLinear = (x: number) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
```

`display-p3` requires its own matrix pair; add when the gamut target is widened, not before.

## 4. The gamut ceiling

`color/gamut.ts`.

```ts
const EPS = 1e-5;

export function isInGamut(rgb: LinearSrgb, tolerance = 1e-6): boolean {
  return rgb.r >= -tolerance && rgb.r <= 1 + tolerance
      && rgb.g >= -tolerance && rgb.g <= 1 + tolerance
      && rgb.b >= -tolerance && rgb.b <= 1 + tolerance;
}

/** Maximum chroma representable at (l, h) in the target gamut. Monotone in c, so bisect. */
export function maxChroma(l: number, h: number, gamut: Gamut = "srgb"): number {
  const hi0 = 0.5;
  if (isInGamut(toLinear({ l, c: hi0, h }, gamut))) return hi0;
  let lo = 0, hi = hi0;
  while (hi - lo > EPS) {
    const mid = (lo + hi) / 2;
    if (isInGamut(toLinear({ l, c: mid, h }, gamut))) lo = mid; else hi = mid;
  }
  return lo;
}
```

`maxChroma` is called for every tone sample, so it is **memoized** on a quantized key
(`l` to 3 decimals, `h` to 1 degree, gamut) in a `Map`. Cache size is bounded by
`1000 × 360 × 2`; in practice a theme touches a few hundred entries. Bisection is ~17
iterations at `EPS = 1e-5`; unmemoized cost is ~2 µs, which is acceptable even in the hot
Studio path, but memoization removes it from the profile entirely.

```ts
/** Clamp a color into gamut by reducing chroma only. Preserves L and h exactly. */
export function toGamut(color: Oklch, gamut: Gamut = "srgb"): Oklch {
  const cap = maxChroma(color.l, color.h, gamut);
  return color.c <= cap ? color : { ...color, c: cap };
}
```

**Why chroma-only reduction rather than CSS Color 4's `css-gamut-map`.** The CSS algorithm
also performs local channel clipping plus a ΔE_OK acceptance test, which can shift lightness
slightly to preserve chroma. Here, lightness *is* the ramp's ordering axis — a tone at
`t = 0.4` shifting lighter than the tone at `t = 0.36` would break monotonicity and with it
the entire role model. Chroma-only reduction preserves ordering by construction. This is a
deliberate divergence; it is recorded as ADR-004.

## 5. The ramp

`color/ramp.ts`. This is the object the user described as "six, or ten, lighting steps,
each of which can follow the shade map, use a different lighting curve, or override
entirely".

### 5.1 It is a curve, not an array

The ramp is a **continuous function** `sample(t) → Oklch` for `t ∈ [0, 1]`, defined by a
small number of authored control **stops**. Roles address it at arbitrary `t`.

This is not a stylistic preference; it is required for correctness. Measured: fitting the
existing 58 themes to a ramp of 12 *discrete* rungs and snapping each role to its nearest
rung gives max ΔE_OK per theme of p50 = 0.034, p90 = 0.043, with only 4/58 themes inside the
0.02 just-noticeable-difference threshold. The error is dominated by lightness quantization
(`blog.text` sits at `L = 0.4007`; the nearest rungs are 0.3757 and 0.4533). With continuous
`t`, lightness is reproduced exactly, because `toneL` is strictly monotone and therefore
invertible. Reproduce with `appendix/oklch.mjs`.

### 5.2 Lightness

```ts
export const L_LIGHTEST = 0.985;
export const L_DARKEST  = 0.165;

/** Gentle S-curve: slightly finer resolution at both ends, where UI needs it. */
export const defaultEase = (t: number): number =>
  t - 0.10 * Math.sin(2 * Math.PI * t) / (2 * Math.PI);

export function toneLightness(t: number, ramp: RampSpec): number {
  const ease = ramp.ease ?? defaultEase;
  return ramp.lightest - (ramp.lightest - ramp.darkest) * ease(clamp01(t));
}
```

`defaultEase` is strictly increasing on `[0,1]` (its derivative
`1 − 0.10·cos(2πt)` has minimum `0.90 > 0`), so `toneLightness` is strictly decreasing and
invertible. `inverseToneLightness(L, ramp)` is 60 bisection steps — used by migration (T9)
and by the Studio's eyedropper.

**The endpoints are per-theme, and they must bracket every color the theme uses.**
`L_LIGHTEST` and `L_DARKEST` are *defaults*, not limits. The corpus exceeds them at both ends:
`marina`, `grass`, and `springField` place a role at `L ≈ 0.996`; `plainBlack` places one at
`L = 0.226` and its page gradient is pure black at `L = 0`. If a theme's endpoints do not
bracket its colors, `inverseToneLightness` clamps and the lift silently loses lightness —
`L = 0.996` against `lightest = 0.985` is a ΔL of 0.011, an order of magnitude above the
ΔE_OK ≤ 0.002 tolerance T9 requires.

Therefore:
- `resolve()` asserts `darkest ≤ toneLightness(t) ≤ lightest` for every sampled tone in
  development builds, and
- T9 §2 derives `lightest = max(L)` and `darkest = min(L)` over **every** color in the theme —
  all nine roles, every surface gradient stop, and every mark stop — not just the four legacy
  accents.

Reference values for the **default** endpoints (`ramp.spec.ts` asserts these to 1e-6):

| t | L | t | L |
| --- | --- | --- | --- |
| 0.00 | 0.985000 | 0.60 | 0.485329 |
| 0.10 | 0.910671 | 0.70 | 0.398588 |
| 0.20 | 0.833412 | 0.75 | 0.356949 |
| 0.25 | 0.793051 | 0.80 | 0.316588 |
| 0.30 | 0.751412 | 0.90 | 0.239329 |
| 0.40 | 0.664671 | 1.00 | 0.165000 |
| 0.50 | 0.575000 | | |

### 5.3 Chroma — the envelope is flat, and this was measured

```ts
/** Relative chroma ∈ [0,1]: a fraction of the local gamut ceiling. */
export function toneRelativeChroma(t: number, ramp: RampSpec): number {
  return clamp01(ramp.chroma * (ramp.envelope?.(t) ?? 1));
}
```

The default envelope is **1** — constant. Three candidates were fitted against all 58
existing themes; residual `|Δ relative chroma|` after solving for each theme's best seed
chroma:

| envelope | p50 | p90 | max |
| --- | --- | --- | --- |
| **flat**, `1` | **0.147** | **0.349** | 0.490 |
| gentle, `0.80 + 0.20·(1 − \|2t−1\|^1.6)` | 0.194 | 0.422 | 0.477 |
| strong, `0.35 + 0.65·(1 − \|2t−1\|^1.6)` | 0.485 | 0.650 | 0.651 |

The strong taper is 3.3× worse than flat. Reproduce with `node appendix/fit-envelope-all.mjs`. The reason is visible in the data: light themes
push their near-white roles to ≥ 0.95 *relative* chroma, which is correct — at `L = 0.977`
the ceiling is only `C = 0.017`, so relative-1.0 is a barely-perceptible tint, exactly the
desired "white with a breath of the hue in it". A taper would force those to gray.

**`Cmax(L, h)` is the envelope.** It already tapers absolute chroma to zero at both ends of
the ramp, for the right reason, hue by hue. Stacking a second envelope on top fights both
the physics and the corpus. `envelope` remains available as a per-theme escape for
deliberately dusty palettes; it defaults to absent.

### 5.4 Hue torsion

```ts
export function toneHue(t: number, ramp: RampSpec): number {
  return mod360(ramp.hue + (ramp.torsion ?? 0) * (t - 0.5));
}
```

Torsion rotates hue linearly across the ramp, centerd at `t = 0.5` so that changing torsion
does not move the mid-tone. It is what makes a palette read as designed rather than
mechanical — shadows drift one way, highlights the other. Measured in the corpus: hue spread
across the four roles has median 11.8°, p75 20.0°, p90 35.5°, over the 37 fully chromatic
themes (`appendix/corpus-analysis.md`).

Four themes exceed torsion's linear model (`vibrant` 292°, `autumnal` 135°, `verdant` 87°,
`dusk` 56°). They are genuinely multi-hue and use per-stop hue overrides (§5.5), which is
the correct outcome — a deliberately polychrome theme should look like one in its source.

### 5.5 Stops: following, deviating, or overriding

```ts
export type RampStop = {
  /** Position on the ramp. Must be strictly increasing across the stops array. */
  readonly at: number;                    // [0,1]
  /** Absolute lightness override; otherwise toneLightness(at). */
  readonly lightness?: number;
  /** Additive delta to relative chroma, or an absolute value. */
  readonly chroma?: { readonly delta: number } | { readonly value: number };
  /** Additive hue delta in degrees, or an absolute hue. */
  readonly hue?: { readonly delta: number } | { readonly value: number };
  /** Total override. When present, all of the above are ignored for this stop. */
  readonly literal?: ColorLiteral;
};

export type RampSpec = {
  readonly hue: number;                   // [0,360)
  readonly chroma: number;                // [0,1] relative to gamut ceiling
  readonly torsion?: number;              // degrees across the whole ramp
  readonly lightest?: number;             // default L_LIGHTEST
  readonly darkest?: number;              // default L_DARKEST
  readonly ease?: (t: number) => number;  // default defaultEase
  readonly envelope?: (t: number) => number;
  /** Sorted by `at`. Empty ⇒ pure generated ramp. */
  readonly stops?: readonly RampStop[];
};
```

The three authoring modes named in the brief map exactly onto this:

| Brief | Mechanism |
| --- | --- |
| "follow the shade map" | omit the stop, or a stop with only `at` |
| "use a different lighting curve to get more creative lighting" | `ease`, `torsion`, `envelope`, or per-stop `lightness` |
| "override entirely (like how theme colors are made today)" | `literal` |

### 5.6 Sampling

```ts
export function sampleRamp(t: number, ramp: RampSpec, gamut: Gamut = "srgb"): Oklch {
  const u = clamp01(t);
  const [lo, hi, f] = locate(ramp.stops ?? [], u);   // bracketing stops + local fraction

  // A literal at an exact stop position wins outright.
  if (lo && lo.at === u && lo.literal) return toGamut(parseColorLiteral(lo.literal), gamut);

  const base: Oklch = {
    l: toneLightness(u, ramp),
    c: 0,                                   // filled below
    h: toneHue(u, ramp),
  };

  // Deviations are interpolated between bracketing stops, so a stop influences its
  // neighborhood smoothly rather than producing a discontinuity.
  const dev = blendDeviations(lo, hi, f, ramp);      // { l?, relC, hDelta }

  const l = dev.l ?? base.l;
  const h = dev.h ?? base.h;
  const relC = dev.relC ?? toneRelativeChroma(u, ramp);
  const c = clamp01(relC) * maxChroma(l, h, gamut);

  return toGamut({ l, c, h }, gamut);
}
```

#### `locate` and `blendDeviations`, defined

These two are the heart of the ramp, so they are specified rather than described. Everything
below is required by `T2-04`.

```ts
/** A stop's influence, expressed in absolute terms. Absent field ⇒ use the generated curve. */
type Deviation = {
  readonly l?: number;      // absolute lightness
  readonly relC?: number;   // absolute relative chroma, [0,1]
  readonly h?: number;      // absolute hue, degrees
};

/**
 * Resolve one stop into absolute terms at its own position.
 * `{ delta }` applies to the generated curve at `stop.at`; `{ value }` replaces it;
 * a `literal` is decomposed. By the time anything blends, every stop speaks the same
 * absolute vocabulary — which is what makes mixing the two forms across neighboring
 * stops well defined.
 */
function resolveStop(stop: RampStop, ramp: RampSpec, gamut: Gamut): Deviation {
  if (stop.literal) return liftLiteral(parseColorLiteral(stop.literal), ramp, gamut);

  const baseL = toneLightness(stop.at, ramp);
  const baseH = toneHue(stop.at, ramp);
  const baseRelC = toneRelativeChroma(stop.at, ramp);

  return {
    l: stop.lightness ?? baseL,
    h: stop.hue === undefined ? baseH
     : "value" in stop.hue ? mod360(stop.hue.value)
     : mod360(baseH + stop.hue.delta),
    relC: stop.chroma === undefined ? baseRelC
        : "value" in stop.chroma ? clamp01(stop.chroma.value)
        : clamp01(baseRelC + stop.chroma.delta),
  };
}

/** Decompose an absolute color into ramp-space. Shared with T9's lift. */
function liftLiteral(c: Oklch, ramp: RampSpec, gamut: Gamut): Deviation {
  return { l: c.l, relC: c.c / Math.max(maxChroma(c.l, c.h, gamut), 1e-9), h: c.h };
}

/**
 * Bracket `u` among stops sorted by `at`.
 * Outside the stop range the nearest stop is held constant — it does **not** decay back to
 * the generated curve. A stop is a statement about the ramp's character in its
 * neighborhood; fading it out would make a one-stop ramp behave unlike a zero-stop ramp
 * for no reason the author asked for.
 */
function locate(stops: readonly RampStop[], u: number):
  { lo: RampStop | null; hi: RampStop | null; f: number } {
  if (stops.length === 0) return { lo: null, hi: null, f: 0 };
  const first = stops[0]!, last = stops[stops.length - 1]!;
  if (u <= first.at) return { lo: first, hi: first, f: 0 };
  if (u >= last.at)  return { lo: last,  hi: last,  f: 0 };
  let i = 0;
  while (i < stops.length - 1 && stops[i + 1]!.at <= u) i++;
  const lo = stops[i]!, hi = stops[i + 1]!;
  const span = hi.at - lo.at;
  return { lo, hi, f: span === 0 ? 0 : (u - lo.at) / span };
}

/**
 * Blend two resolved stops. Linear in `u`, **not** in eased space: the ease already shapes
 * lightness inside `toneLightness`, and easing the blend too would compound it.
 * Hue takes the short way around the circle.
 * A field absent from both brackets is absent from the result, so `sampleRamp` falls
 * through to the generated curve for it.
 */
function blendDeviations(
  lo: RampStop | null, hi: RampStop | null, f: number, ramp: RampSpec, gamut: Gamut,
): Deviation {
  if (!lo || !hi) return {};
  const a = resolveStop(lo, ramp, gamut);
  const b = resolveStop(hi, ramp, gamut);
  const lerp = (x?: number, y?: number) =>
    x === undefined ? y : y === undefined ? x : x + (y - x) * f;
  return {
    l: lerp(a.l, b.l),
    relC: lerp(a.relC, b.relC),
    h: a.h === undefined ? b.h
     : b.h === undefined ? a.h
     : mod360(a.h + shortestArc(a.h, b.h) * f),
  };
}

/** Signed shortest angular distance, (-180, 180]. */
const shortestArc = (from: number, to: number) => ((to - from + 540) % 360) - 180;
```

Four decisions are embedded above that an implementer would otherwise have to invent:

1. **Mixing `{ delta }` and `{ value }` across neighboring stops is well defined**, because
   `resolveStop` converts both to absolutes before anything blends.
2. **A `literal` participates in interpolation** rather than punching a discontinuity, and is
   still exact at its own `at` (at `f = 0` the blend returns `a` unchanged). T9's exact lift
   depends on both halves of that sentence.
3. **Outside the stop range the nearest stop holds.** A single stop at `at: 0.5` shifts the whole
   ramp's character; a theme wanting a localized bump authors neighboring stops that return to
   the curve.
4. **Blending is linear in `u`**, and hue takes the short arc.

`sampleRamp`'s `dev.l ?? base.l` / `dev.h ?? base.h` / `dev.relC ?? toneRelativeChroma(u, ramp)`
reads directly off this `Deviation` shape.

### 5.7 Test vectors

`ramp.spec.ts` asserts the following for `{ hue: 280, chroma: 0.62 }`, no torsion, no stops,
sampled at `t = i/11`. Hex is sRGB, rounded, `#rrggbb`.

| i | t | L | Cmax | C | hex |
| --- | --- | --- | --- | --- | --- |
| 0 | 0.0000 | 0.9850 | 0.0071 | 0.0044 | `#f9fafd` |
| 1 | 0.0909 | 0.9175 | 0.0403 | 0.0250 | `#e0e2f5` |
| 2 | 0.1818 | 0.8478 | 0.0765 | 0.0475 | `#c6caec` |
| 3 | 0.2727 | 0.7743 | 0.1170 | 0.0725 | `#acb1e4` |
| 4 | 0.3636 | 0.6967 | 0.1622 | 0.1005 | `#9196db` |
| 5 | 0.4545 | 0.6159 | 0.2120 | 0.1314 | `#767ad2` |
| 6 | 0.5455 | 0.5341 | 0.2654 | 0.1646 | `#5e5cc9` |
| 7 | 0.6364 | 0.4533 | 0.2742 | 0.1700 | `#4942b1` |
| 8 | 0.7273 | 0.3757 | 0.2273 | 0.1409 | `#373189` |
| 9 | 0.8182 | 0.3022 | 0.1828 | 0.1134 | `#262265` |
| 10 | 0.9091 | 0.2325 | 0.1407 | 0.0872 | `#181545` |
| 11 | 1.0000 | 0.1650 | 0.0998 | 0.0619 | `#0b0928` |

**Chroma consistency across hue** — the property this engine exists to provide. Same `t`,
same `chroma: 0.62`, six hues:

| t | h=0 | h=60 | h=120 | h=180 | h=240 | h=300 |
| --- | --- | --- | --- | --- | --- | --- |
| 0.0 | `#fdf9fa` | `#fdf9f6` | `#f7fdea` | `#f2fdfa` | `#f7fbfd` | `#faf9fd` |
| 0.2 | `#ecb8c7` | `#ebbe9b` | `#bed476` | `#7fddcb` | `#a7ceeb` | `#cec0eb` |
| 0.4 | `#dc6790` | `#bf8554` | `#8c9d55` | `#5ca395` | `#5a9bc8` | `#a080d7` |
| 0.5 | `#ba4e75` | `#9d6d44` | `#728045` | `#4b867a` | `#497fa4` | `#8a5bcd` |
| 0.6 | `#943d5c` | `#7d5534` | `#5a6535` | `#3a6960` | `#386482` | `#6f43ab` |
| 0.8 | `#511e30` | `#432c19` | `#2f3519` | `#1c3833` | `#1b3547` | `#3b215e` |
| 1.0 | `#1c060e` | `#160c04` | `#0d1005` | `#05110f` | `#051017` | `#120722` |

Read the `t = 0.4` row: rose, tan, olive, teal, steel, violet — six hues that read as
equally colored and equally light. The HSL equivalent at constant saturation would give a
glaring yellow and a near-black blue on the same row. **`t = 0.4` across all hues is the
regression test for F-01.**

**Torsion** — `{ hue: 210, chroma: 0.55, torsion: -40 }`:

| t | h | hex |
| --- | --- | --- |
| 0.00 | 230.0 | `#f7fbfd` |
| 0.25 | 220.0 | `#7fc8df` |
| 0.50 | 210.0 | `#51828b` |
| 0.75 | 200.0 | `#264243` |
| 1.00 | 190.0 | `#061110` |

## 6. Output formatting

`color/format.ts`.

```ts
/** CSS output. Precision chosen so round-tripping through the string is lossless at 8-bit. */
export function formatOklch({ l, c, h }: Oklch): CssColor {
  return `oklch(${round(l, 5)} ${round(c, 5)} ${round(h, 2)})` as CssColor;
}
export function formatHex(color: Oklch, gamut?: Gamut): string;   // export / mark SVG / meta tag
export function parseColorLiteral(literal: ColorLiteral): Oklch;   // import / migration
```

CSS output is **`oklch()`**, not hex. Justification:
- Tailwind v4's own baseline is Safari 16.4+ / Chrome 111+ / Firefox 128+. `oklch()` shipped
  in Safari 15.4, Chrome 111, Firefox 113 — strictly inside that floor, so it costs nothing.
- `color-mix(in oklab, …)`, which `@theme inline` alpha modifiers compile to, interpolates
  correctly on an `oklch()` input and produces muddy midpoints on `rgb()` inputs. Gradient
  interpolation (T5 §5) benefits identically.
- It keeps the authored model and the emitted CSS in the same space, so a value in DevTools is
  the value in the theme source. This is a real debugging affordance.

Hex output survives only for: mark SVG `stop-color` (SVG 1.1 has no `oklch()`),
`<meta name="theme-color">` (`brand` role; browser support for `oklch()` there is not
uniform), and profile export/import interchange.

## 7. Contrast

`color/contrast.ts`. Reporting only — the engine never auto-adjusts (T1 §8).

```ts
export function relativeLuminance(color: Oklch): number;      // WCAG 2.x, via linear sRGB
export function contrastRatio(a: Oklch, b: Oklch): number;      // WCAG 2.x
export function apcaLc(text: Oklch, background: Oklch): number; // APCA Lc, reported alongside
export function deltaEOk(a: Oklch, b: Oklch): number;           // Euclidean in Oklab
```

WCAG 2.x is what conformance is measured against, so it is primary. APCA is reported because
it is markedly better behaved for the light-text-on-mid-tone cases this corpus is full of, and
the Studio surfaces both so the author can see when they disagree. `deltaEOk` is used by the
migration report (T9) and by the theme-similarity check that replaces
`isShadeMapRoughlyTheSame`.

## 8. Module surface

```
features/theme/color/
  index.ts          re-exports the public surface below
  types.ts          Oklch, Oklab, LinearSrgb, Gamut, CssColor
  oklab.ts          oklabToLinearSrgb, linearSrgbToOklab, oklchToOklab, oklabToOklch
  srgb.ts           linearToGamma, gammaToLinear, hexToLinearSrgb, linearSrgbToHex
  gamut.ts          isInGamut, maxChroma (memoized), toGamut
  ramp.ts           RampSpec, RampStop, toneLightness, inverseToneLightness,
                    toneRelativeChroma, toneHue, sampleRamp, defaultEase
  format.ts         formatOklch, formatHex, parseColorLiteral
  contrast.ts       relativeLuminance, contrastRatio, apcaLc, deltaEOk
  *.spec.ts         one spec file per module
```

No other module in the repository performs color arithmetic. `lib/themeMaker/colorHelper.ts`
is deleted; `color-convert` is removed from `package.json`.

## 9. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `oklab.spec.ts` round-trips 4096 sampled sRGB colors through `linearSrgbToOklab` → `oklabToLinearSrgb` with max component error < 1e-9 |
| C2 | The `#a21caf` assertion in §3 passes (guards the matrix typo) |
| C3 | `maxChroma(l, h)` returns a value whose color is in gamut and `maxChroma + 2e-5` is not, for 500 random `(l, h)` |
| C4 | `toneLightness` is strictly decreasing over 10 000 samples of `t` for the default and for 20 random monotone `ease` functions |
| C5 | `inverseToneLightness(toneLightness(t)) ≈ t` within 1e-6 for 1000 samples |
| C6 | The §5.7 twelve-stop table matches exactly (hex) and to 1e-4 (L, C) |
| C7 | The §5.7 chroma-consistency table matches exactly |
| C8 | Every sampled tone is in gamut: `isInGamut(toLinear(sampleRamp(t, r)))` for 200 random ramps × 100 `t` |
| C9 | `deltaEOk` between adjacent tones of a 12-stop ramp is monotone-free-of-inversions (no rung is closer to `t=0` than its predecessor) |
| C10 | `features/theme/color` has zero imports outside itself and `lib/` |
