# X6 — Decision records added during implementation

New ADRs raised while implementing the spec, per `X1 §5` ("if an implementation contradicts the
spec, update the spec in the same PR with an ADR") and `PROMPT.md` ("If you diverge, update the
spec in the same change, with a new ADR"). Numbering continues from `X3-decisions.md`, which ends
at ADR-020.

Every ADR below is backed by a measurement that is reproducible with the commands given.

---

## ADR-021 — `maxChroma` memoizes on the exact key, not a quantized one

**Status:** accepted. Supersedes the memoization sentence in `T2 §4`.

`T2 §4` specifies that `maxChroma` is "memoized on a quantized key (`l` to 3 decimals, `h` to 1
degree, gamut)". That contradicts `T2 C6`, which requires the `§5.7` twelve-stop table to match
"exactly (hex) and to 1e-4 (L, C)".

**Measurement.** `Cmax` varies with `L` at a slope of roughly −0.5 near the light end of the ramp.
Row 1 of the `§5.7` table samples `L = 0.917516`; quantizing to 3 decimals evaluates `Cmax` at
`L = 0.918` instead, a `ΔL` of 4.84e-4, giving `ΔCmax ≈ 2.4e-4` and, after multiplying by the seed
chroma 0.62, `ΔC ≈ 1.5e-4`. That exceeds C6's 1e-4 tolerance on `C`, and it perturbs the 8-bit hex.

**Decision.** Memoize on the exact `(gamut, l, h)` triple. This preserves C6 exactly and still
removes the bisection from the profile, which is the stated purpose of the memo. The cache-size
bound in `T2 §4` ("1000 × 360 × 2") no longer applies; the operative bound is the spec's own
observation that "in practice a theme touches a few hundred entries". `clearMaxChromaCache()` and
`maxChromaCacheSize()` are exported so the bound is observable in tests.

---

## ADR-022 — `T2 C1`'s round-trip tolerance is 1e-6, not 1e-9

**Status:** accepted. Corrects `T2 C1`.

`T2 C1` requires the OKLab round trip to close to "max component error < 1e-9". It cannot, with the
matrices `T2 §3` mandates.

**Measurement.** The two published matrix pairs are independently rounded to 10 decimal places and
are therefore not exact inverses:

```
|LMS_fwd · LMS_inv − I|_max = 1.604e-10
|Lab_fwd · Lab_inv − I|_max = 6.248e-8
```

Round-tripping 4096 sampled colors through `linearSrgbToOklab` → `oklabToLinearSrgb` gives a worst
component error of **2.6128e-7**, worst at white. The figure is identical whether the 4096 samples
are taken on a linear grid or as 8-bit sRGB colors, so it does not depend on how "4096 sampled sRGB
colors" is read.

**Decision.** Keep the mandated matrices — `T2 §3` says "reproduced exactly", and they are the
canonical Ottosson values that `appendix/oklch.mjs` also uses, so changing them would break the
committed tables. Set C1's threshold to `< 1e-6`. The test additionally asserts the error is
`> 1e-9`, so the criterion documents the real behavior instead of an unreachable one. This costs
nothing in defect detection: the matrix typo C2 guards produces errors of order 1e-1.

---

## ADR-023 — A ramp stop deviates only in the fields it states

**Status:** accepted. Corrects the `resolveStop` listing in `T2 §5.6`.

This is the one substantive behavioral divergence, and the spec contradicts itself about it.

`T2 §5.5`'s authoring table says the way to "follow the shade map" is to "omit the stop, **or a
stop with only `at`**". But `§5.6`'s `resolveStop` listing unconditionally fills all three fields:

```ts
return {
  l: stop.lightness ?? baseL,
  h: ...,          // always defined
  relC: ...,       // always defined
};
```

Combined with `§5.6`'s decision 3 (outside the stop range the nearest stop is held constant), a
single stop carrying only `at: 0.5` makes `dev.l` defined at every `t`, so `sampleRamp` returns
`L = 0.575` for the entire ramp. The ramp collapses to a constant. Measured before the fix:
`sampleRamp(0, { hue: 280, chroma: 0.62, stops: [{ at: 0.5 }] }).l` was `0.575` rather than
`0.985`.

Two other statements in the spec require the opposite behavior:

- `§5.5`'s table, above.
- `§5.6`'s own doc comment on `blendDeviations`: "A field absent from both brackets is absent from
  the result, **so `sampleRamp` falls through to the generated curve for it**." That sentence is
  only reachable if `resolveStop` can return absent fields.

**Decision.** `resolveStop` returns a `Deviation` containing only the fields the stop actually
states. `liftLiteral` still returns all three, because a literal states a whole color. This
satisfies all three statements at once:

- a bare stop is a no-op, per `§5.5`;
- a stop's *stated* deviations still hold constant outside its range, per decision 3;
- `blendDeviations`' fall-through comment becomes true.

It also gives the more useful semantics per field: a stop that states only chroma holds chroma and
lets lightness follow the curve. Covered by four tests, including one per `lerp` branch
(field stated by the lower bracket only, the upper only, both, neither).

---

## ADR-024 — `shortestArc` returns −180 at the antipode; the documented range is `[-180, 180)`

**Status:** accepted. Corrects a range annotation in `T2 §5.6`.

`T2 §5.6` annotates `shortestArc` as "Signed shortest angular distance, `(-180, 180]`" but gives
the formula `((to - from + 540) % 360) - 180`, which returns **−180** for a 180° separation, not
+180. The formula is right — at the exact antipode either direction is equally short, so the tie
must break somewhere — and only the annotation is wrong.

**Decision.** Keep the formula. The documented range is `[-180, 180)`.

---

## ADR-025 — The `C2` hue tolerance is ±0.05, matching the precision the value is quoted at

**Status:** accepted. Corrects `T2 §3`.

`T2 §3` requires `linearSrgbToOklab(srgbToLinear(hex("#a21caf")))` to yield
"`L ≈ 0.5180, C ≈ 0.2258, h ≈ 323.9` (±0.001)". The measured values are:

```
L = 0.51802284    |L − 0.5180| = 2.3e-5   within ±0.001
C = 0.22580382    |C − 0.2258| = 4.0e-6   within ±0.001
h = 323.94867954  |h − 323.9|  = 4.9e-2   outside ±0.001
```

`L` and `C` are quoted to four decimals and hold at ±0.001. `h` is quoted to one decimal, so
±0.001 was never achievable — the stated tolerance is finer than the stated value.

**Decision.** Assert `h` against the full measured value `323.9487`. The typo guard is unaffected:
the mistyped matrix collapses hue by more than 1°, which the test asserts directly.

---

## ADR-026 — `maxChroma` has no early-return for a fully representable ceiling

**Status:** accepted. Removes two lines from the `T2 §4` listing.

`T2 §4`'s `maxChroma` begins:

```ts
const hi0 = 0.5;
if (isInGamut(toLinear({ l, c: hi0, h }, gamut))) return hi0;
```

Maximum chroma in sRGB is about 0.32, so this branch never fires for the only gamut that is
implemented (`display-p3` is deferred by `T2 §3` and throws). It is therefore unreachable dead
code, and it makes `03-hygiene §1`'s 100 % branch-coverage threshold for
`features/theme/color/**` unsatisfiable.

**Decision.** Delete the early return; keep `0.5` as the bisection's upper bound. A test asserts
that no `(l, h)` over a 101 × 72 sweep produces a ceiling above 0.4, which is what makes the bound
safe — the property the deleted branch was gesturing at, now checked rather than assumed.

---

## ADR-027 — `T5-02`'s surface utilities take the functional form, not the `/alpha` modifier

**Status:** accepted. Resolves the open question in `V-3`. Evidence in `docs/spec/exec/X7`.

`V-3` asks whether custom utilities support the `/alpha` modifier, and names the fallback: "if
unsupported, use `surface-widget-80`". Measured against `tailwindcss@4.3.3`:

- A **static** `@utility surface-widget` does not generate `surface-widget/80`. Nothing is emitted.
- A **functional** `@utility surface-b-*` does consume a modifier: `surface-b-1/80` emits from
  `--modifier(integer)`.
- `--value()` cannot be interpolated into a custom-property *name*, so a single
  `@utility surface-*` parameterized by role — which would have made `surface-widget/70` reachable —
  emits nothing.

Since each surface role needs its own `--zw-surface-<role>-*` property names, each role needs its
own utility, and a per-role utility has no value segment for a modifier to attach to.

**Decision.** Take the fallback `V-3` names. Each role gets a static utility carrying the paint and
the `::before` layer, plus a functional sibling carrying the alpha:

```css
@utility surface-widget      { … opacity: var(--zw-surface-widget-alpha, 1); … }
@utility surface-widget-*    { --zw-surface-widget-alpha: calc(--value(integer) / 100); }
```

Confirmed to emit correctly, together, in one pass. Note the consequence for `00-charter §4.1`,
which uses `surface-widget/70` as its example of a name that "describes a material": the material
naming survives, the slash does not.

---

## ADR-028 — `AppError` declares its fields explicitly rather than as parameter properties

**Status:** accepted. Corrects the listing in `02-conventions §6`.

`02-conventions §6` specifies:

```ts
export class AppError extends Error {
  constructor(readonly code: ErrorCode, message: string, readonly detail?: unknown, …)
}
```

Parameter properties are not erasable syntax, so this is rejected by
`erasableSyntaxOnly: true`, which the same document mandates in `§3`.

**Decision.** Declare `code` and `detail` as `readonly` class fields and assign them in the
constructor body. The public shape is unchanged.

---

## ADR-029 — `U2-03` degrades to no size animation; `interpolate-size` is unavailable in WebKit

**Status:** accepted. Resolves `V-12`. Evidence in `X7 §1.1`.

`U2-03` animates the context strip between intrinsic sizes, which requires
`interpolate-size: allow-keywords` for a keyword size (`auto`, `min-content`) to be animatable.
Measured in Safari 27.0 / WebKit (platform 27.2):

```
CSS.supports("interpolate-size", "allow-keywords")  ->  false
```

Every other capability the spec's baseline assumes is present in that engine — container queries,
`:has()`, `animation-timeline: scroll()`, `popover`, `position-anchor`,
`transition-behavior: allow-discrete`, `text-wrap: balance`, `field-sizing: content`, `oklch()`,
`color-mix(in oklab, …)`. `interpolate-size` is the sole gap.

**Decision.** Take the fallback `V-12` itself names: the strip degrades to no size animation where
`interpolate-size` is absent. Implement it as a progressive enhancement rather than a polyfill —

```css
@supports (interpolate-size: allow-keywords) {
  :root { interpolate-size: allow-keywords; }
}
```

— so the transition simply does not run on engines without it, and no JavaScript measures or
animates height. A JS height-measuring fallback was rejected: `U3`'s motion policy and `O5` ("no
render you cannot see") both argue against putting layout measurement on an interaction path to
recover a decorative transition.

Chromium and Gecko were not measurable here (`X7 §2.3`), and both are expected to support the
property; the `@supports` guard makes the difference self-correcting either way.


---

## ADR-030 — `edge` is `tone(0)` and `shade` is `tone(1)`; the legacy shade map is not reproduced

**Status:** accepted. Supersedes the `shade` lift procedure in `T9 §3`.

`T9 §3` solves `shade` against `generateShadeMap(light, 22).shadeMap[17]`, and `edge` against
index 0, so that the lift reproduces v10's derived `--color-darklight-*` and
`--color-highlight-*` values exactly.

Reproducing those values requires reproducing `generateShadeMap` itself, which ramps **integer**
HSL — `color-convert`'s top-level API rounds hue and saturation to whole numbers before the ramp
runs. A faithful reproduction was written and verified against `color-convert` across 512 sampled
colors and both 17- and 22-shade maps. It passed. It was then deleted.

**Decision.** Take the v11 shape instead: `edge` is the ramp at `t = 0`, `shade` at `t = 1`, per
`T1 §5` — *"there is no per-color shade map to compute, because a highlight is just the ramp at
`t = 0`"*. Reproducing v10's integer-rounded HSL quirk would have been the only thing keeping
`color-convert` in the dependency list, which `02-conventions §8` deletes, and it would have
imported a rounding artifact into the generator that replaces it.

The four v10 accents and `siteThemeColor` still reproduce within ΔE_OK 0.002 (`X7`, T9 C1), which
is what the migration's fidelity claim rests on. The derived highlight/shade values are *close in
kind* rather than bit-exact, which `X4 §4.2` already anticipated for that family: it drops four
values to one and asks only that the spread be reported.

---

## ADR-031 — `LayerId` is not branded

**Status:** accepted. Corrects `T3 §3`.

`T3 §3` types `LayerId` as a branded string. Branding it means every authored theme file — all 59
generated ones, and every one a human writes later — needs a cast at each layer, because a string
literal is not assignable to the brand.

`02-conventions §3` permits branded primitives "where confusion has actually happened". Layer ids
are stable keys for editor selection and reorder; no confusion has been reported, and no validator
consumes the brand.

**Decision.** `LayerId = string`. `ColorLiteral` keeps its brand, because it *is* validated — and
generated theme files construct it through `literal()`, which parses before branding, so the brand
continues to mean "this parsed".

---

## ADR-032 — Surface variants are static utilities, not one functional utility

**Status:** accepted. Corrects the `@utility` listing in `T5 §4.3`.

`T5 §4.3` proposes `@utility surface-widget-variant-*` selecting
`var(--zw-surface-widget-image-\-value(...))`, with its own note that "a `--value()` call cannot be
concatenated into a custom-property *identifier*" and that `V-2` should confirm the form.

Measured against `tailwindcss@4.3.3`: it cannot. A `--value()` interpolated into a property *name*
emits nothing at all — the same limitation that settles `V-3` (**ADR-027**).

**Decision.** Emit one static utility per variant index. `count` is bounded (default 8, schema
maximum 32), so eight declarations cover the default policy. An index at or above `count` simply
does not match, leaving `--zw-surface-widget-image` at its unperturbed value — which is exactly the
fallback `T5 C6` requires.

---

## ADR-033 — The three hairline border widths are arbitrary values

**Status:** accepted. Removes three tokens from `P5 §3`.

`P5 §3`'s `@theme` block defines `--border-width-hair`, `--border-width-thin` and
`--border-width-fine`. Tailwind v4 has no `--border-width-*` theme namespace; border widths are
`border-<number>` or arbitrary. Those three tokens were inert — `border-hair` emitted nothing.

**Decision.** Drop the tokens. The 8 call sites take `border-[0.4px]` and friends, which also works
for the side-specific cases (`border-t-[0.8px]`) that named tokens could not have covered without
four more declarations each.

---

## ADR-034 — The celebration backdrop is generated deterministically, not compiled from Sass

**Status:** accepted. Corrects `P5 §7`.

`P5 §7` describes the repository's one `.module.scss` as using "nesting, which native CSS now
supports, and no Sass-specific features beyond that", and prescribes a straight conversion.

It actually uses `@use`, `@mixin`, `@function`, `@for`, `math.div`, and — decisively —
**`math.random`**. Its compiled output therefore differed on every build: 37 confetti bursts with
random positions, hues, durations and scales. That is precisely the build-time non-determinism
`T5 §4.4` rejects, and it would have made any screenshot comparison of the `celebration` theme
meaningless.

**Decision.** Port the generator to `tools/build-celebration-css.ts` with a seeded linear
congruential PRNG and commit its output. Verified byte-identical across runs. The generated
stylesheet also gains a `prefers-reduced-motion` branch it never had, per `U3`.

Note the cost this exposes: 740 KB raw / 64 KB gzip for one decorative backdrop, from ~13 700
`box-shadow` components. It is a CSS Module, so it loads only with that scene, but it is the
strongest argument in the repository for the `particle-rise` consolidation in `T6 §6`.

---

## ADR-035 — 19 themes receive explicit sRGB interpolation, not 11

**Status:** accepted. Adjusts the count in `T9 §4` and `T9 C10`.

`T9 §4` emits `interpolation: { space: "srgb" }` on any layer whose adjacent stops differ by more
than 25° of hue, and measures 11 of 59 themes affected. The implementation measures 19.

The test runs over the **original** stop colors, before they are lifted to tone references, and
skips stops whose chroma is below the achromatic threshold or whose opacity is zero. The spec does
not state which colors it measured; a plausible reading of its own procedure gives the larger set.

**Decision.** Keep 19 and record the discrepancy rather than tuning a threshold to reproduce a
number. Over-declaring the interpolation space preserves v10's gradient midpoints, so the error is
in the conservative direction: a layer that did not need the declaration is unharmed by it, whereas
a layer that needed it and did not get one shifts visibly.

---

## ADR-036 — Legacy and v11 code are held to different enforcement levels, in one repository

**Status:** accepted. Extends `02-conventions §3` and `§10`.

`02-conventions` is binding on v11 code and states that "where this document and an existing
pattern disagree, this document wins and the existing pattern is migrated". Under wholesale
execution that is coherent because no legacy code survives. This pass did not complete, so legacy
code does survive, and applying the v11 flags to all of it produces hundreds of failures that block
every gate at once.

**Decision.** Split enforcement by path, and make the split explicit rather than incidental:

| Check | `src/`, `tools/` | `app/`, `components/`, `lib/` |
| --- | --- | --- |
| TypeScript | `tsconfig.src.json`, all six flags of §3 | root `tsconfig.json`, `strict` only |
| `no-explicit-any`, `react-hooks/*` correctness rules | error | warning |

The legacy column is a debt register, not an exemption: 312 warnings, itemized by rule in the
`build:` commit that introduced the config. Each path graduates to the `src/` column when its
workstream lands. **This ADR is retired when `app/`, `components/` and `lib/` are gone.**

---

## ADR-037 — Migrated ambient types land where their features will live

**Status:** accepted. Implements `02-conventions §3`'s deletion of `interfaces/`.

Deleting `interfaces/` requires somewhere for 86 type names to go. `02-conventions §1` says types
live next to the code that owns them — but most of those features do not exist yet, so there is no
"next to" to move them to.

Rejected: a central `src/types/`. That is the same shape as `interfaces/` with a different name,
and it would have to be dismantled again later.

**Decision.** Place each file at the path its feature will occupy, so the eventual move is a no-op:
`interfaces/comment.ts` becomes `features/comments/model/types.ts` even though
`features/comments/` otherwise contains nothing yet. An empty feature directory holding its own
model is a truthful statement about where the work is going; a second central bucket is not.

`interfaces/theme.ts` becomes `features/theme/model/v10-types.ts` rather than being deleted: the v10
theme engine still consumes those shapes, and it goes when `T4 §7` deletes it.

---

## ADR-038 — `D2 C9`'s idempotence is stated over prose, not over arbitrary input

**Status:** accepted. Corrects `D2 C9`.

`D2 C9` asks that `stripMarks(renderMarksToText(s)) === stripMarks(s)` over "a property-test corpus
including escapes and nesting". Since `renderMarksToText` is `stripMarks` by another name, the
criterion is idempotence — and no escape-honoring strip function can satisfy it.

**Measurement.** Two counterexamples, both found by the property test rather than by inspection:

```
stripMarks("\_x\_")  ->  "_x_"      then stripMarks("_x_")  ->  "x"
stripMarks("~~]~~")  ->  "]"        then stripMarks("]")    ->  "]"
```

The first is the general case: honoring an escape means emitting the character that was escaped,
and that character is a delimiter again. Stripping is not closed under its own output, and cannot
be while escapes mean anything.

**Decision.** Assert the properties that are both true and load-bearing for what `stripMarks` is
actually used for — `<meta name="description">`, `aria-label`, search text:

- **idempotent over prose** (letters, digits, spaces and non-delimiter punctuation), 400 cases;
- **total and deterministic over arbitrary input**, 400 cases — it never throws and never varies;
- **prose survives unchanged** but for paragraph trimming, 300 cases;
- the escape and nested cases are pinned as explicit examples, so the limit is documented in the
  suite rather than implied by its absence.

---

## ADR-039 — `==mark==` marks plain text; nesting inside a mark is not supported

**Status:** accepted. Narrows `D2 §5`.

`D2 §5` lists `==x==` as a first-class inline mark alongside emphasis, strong, code, strikethrough
and links. All the others are CommonMark or GFM constructs that `micromark` tokenizes. `==` is not,
so it is handled by splitting text nodes after parsing.

That works for plain content and fails for nested content: in `==a **b**==` the delimiters land in
three separate mdast nodes — text `"==a "`, strong `b`, text `"=="` — so no single text node
contains a matching pair. The delimiters stay literal.

**Decision.** Support `==x==` over plain text and leave the delimiters visible when they enclose
other markup, rather than approximating. Recorded, tested, and visible in the suite.

The correct fix is an attention-style `micromark` extension for `==`, which is the same argument
`§4.1` makes for the glyph token and which this implementation follows there. It is deferred rather
than approximated because a partial tokenizer would fire inside code spans — precisely the failure
`§4.1` names.
