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

---

## ADR-040 — `D2-09` stays open; the synthetic measurement straddles its own threshold

**Status:** open. `D2-09` is one of the three decisions `PROMPT.md` assigns to the implementer, and
this records why it cannot be closed yet rather than closing it on inadequate evidence.

`D2 §1` sets a clean rule: if brotli hast ≤ 3× brotli markdown, ship hast to the window reader;
above 3×, ship markdown there and lazily load the parser. It asks for the measurement over the ten
largest existing articles.

Those articles are in S3, which is unreachable from the environment this was built in (`X7 §2.1`),
so the measurement ran over a synthetic corpus instead — and the result depends almost entirely on
the corpus:

| Corpus | brotli md | brotli hast | ratio |
| --- | --- | --- | --- |
| 60 sections, repeated identical paragraphs | 545 B | 8 425 B | **15.46×** |
| 60 sections, varied vocabulary | 3 790 B | 11 473 B | **3.03×** |
| 20 sections, varied vocabulary | 1 543 B | 4 347 B | **2.82×** |
| 5 sections, varied vocabulary | 623 B | 1 515 B | **2.43×** |

Repeated prose compresses to almost nothing, so the *markdown* denominator collapses and the ratio
explodes. Varied prose — which is what an article is — lands the ratio at 2.4× to 3.0×, straddling
the threshold, trending upward with length.

**Decision.** Do not choose a transport on this evidence. `parseDocument` already produces hast and
the renderer and registry are shared across both surfaces, so `D2 §1` is right that this is a
per-surface transport choice rather than a second architecture: the decision can be made later
without rework.

The measurement lives in `render.spec.ts` and asserts the ratio stays inside 2×–4× for its corpus,
so a regression in tree size is still caught while the decision stands open. Re-run it against the
real ten largest articles to close.

**What the number does already establish:** hast is not 4–6× brotli markdown as `D2 §1` estimates
in passing — on realistic prose it is closer to 3×, which is materially better for the hast option
than the spec assumed.

## ADR-041 — The write limiter is a sliding window, not a token bucket

`D3 §7` describes the limiter as "a per-`sub` token bucket held in module state (10 writes / 5 min,
burst 3)", and `D3 C10` requires that it "rejects the 11th write in 5 min with 429 + `Retry-After`".

Those two cannot both be satisfied by a token bucket. A bucket with capacity 10 refilling at
10 tokens per 5 minutes regains a token every 30 seconds, so ten writes spread 20 seconds apart
leave 7.3 tokens in the bucket by the time the eleventh arrives, and it is allowed. The first
implementation here was that bucket, and the C10 test caught it:

```
ten writes at t = 20s, 40s … 200s     → all allowed
eleventh write at t = 220s            → allowed (expected: rejected)
```

Capacity 3 with the same refill — the "burst 3" reading — rejects the *fourth* rapid write, which
also is not what C10 states.

**Decision.** Two sliding windows per subject, both of which must admit a write:

| Policy | Limit | Window |
| --- | --- | --- |
| `sustained` | 10 | 5 min |
| `burst` | 3 | 30 s |

A sliding window states C10 exactly: at most 10 writes in any 300-second span, so the eleventh is
refused however it is spaced. The burst window keeps the spec's stated intent that a rapid run of
writes is capped well below the sustained allowance. `Retry-After` is derived from when the oldest
write in the breached window ages out, which is exact rather than estimated.

Two properties the bucket did not have, both tested:

- **Refused attempts are not recorded.** Hammering a locked-out endpoint does not extend the
  lockout, which a naive counter-per-window does.
- **Memory is bounded by the limit, not by traffic.** At most `max(limit)` timestamps per subject,
  and a subject with nothing inside the longest window is dropped.

`D3 §7`'s framing is otherwise unchanged: this is best-effort per serverless instance, which for a
single-author site is sufficient, and `X5-risks.md` already records the Vercel KV / Upstash upgrade
path.

## ADR-042 — CAS retry attempts must exceed the concurrent writer count, not sit at five

`D4 §3.2` bounds `mutateJson` at "Five attempts with jittered backoff, ~550 ms worst case", and
`D4 C5` requires that "20 parallel `addComment` calls against one thread yield 20 comments".

Under compare-and-swap on a single object, each round of contention produces **exactly one**
winner: every writer reads the same ETag, one write matches, and the rest get 412. So *n*
simultaneous writers need *n* rounds in the worst case. With five attempts, at most five of twenty
comments can land; the other fifteen exhaust their attempts and surface a `conflict`. Five attempts
and C5 cannot both hold.

**Decision.** `CAS_ATTEMPTS = 24` for the comment and reaction paths — above the twenty writers C5
specifies, with headroom. The spec's own reasoning is why this is free: "For this site's traffic a
second attempt will essentially never be needed." A higher ceiling costs nothing when it is never
reached, and it is the difference between C5 passing and a visitor being told to retry because
someone else commented at the same moment.

The bound stays a bound. `mutateJson`'s default is unchanged at five for callers with no contention
story, `attempts` is a parameter, and the failure is still a `conflict` with a user-facing message
rather than an unbounded loop — asserted by a store that refuses one hundred writes in a row.

Two related notes on the implementation:

- **Authorization happens inside the update function**, not before it, so ownership is checked
  against the state the write will actually be conditioned on. Checking first would mean a
  concurrent edit could slip between the check and the successful attempt.
- **Idempotent set-semantics compensate for the rest.** `setCommentLike` and `setEntryReaction`
  return the thread unchanged when the requested state already holds, so a retry storm on a like
  converges instead of oscillating. That is `D3 C8`, and it is the reason `D3 §1.1` replaces v10's
  toggle.

## ADR-043 — Mutations call `updateTag`, not `revalidateTag`

`D3 §6` says "`revalidateTag` is called from the mutating action". In the pinned `next@16.2.12`
that call does not compile as written, and the right function is a different one.

Read off `next/dist/server/web/spec-extension/revalidate.d.ts`:

```ts
export declare function revalidateTag(tag: string, profile: string | CacheLifeConfig): undefined;
export declare function updateTag(tag: string): undefined;
export declare function refresh(): void;
```

Two changes from the Next 15 API the spec was written against:

1. **`revalidateTag` now takes a second argument**, a cache profile. Calling it with one argument is
   a type error, which is how this surfaced.
2. **`updateTag` is new**, and its documented purpose is the case at hand: it "can only be called
   from within a Server Action to enable read-your-own-writes semantics."

**Decision.** The comment, reaction and account mutations call `updateTag`. Read-your-own-writes is
not a nicety here — a visitor who posts a comment and does not see it assumes the post failed and
posts again, which is the behavior `D3 §6.1` is trying to remove by deleting the 10-second poll. A
plain `revalidateTag` expires the entry for *everyone else* on the next request but makes no promise
about the response the actor is currently receiving.

`refresh()` is available for the client-cache case and is not needed yet: the actions return the new
thread directly, so the caller has the post-write state in hand without a second round trip.

`D3 §6`'s table of tags and lifetimes is unchanged, and the tags themselves
(`entries:<section>`, `entry:<section>:<slug>`, `author:<id>`) are implemented and tested. What
changed is only the name of the call that invalidates them.

## ADR-044 — SVG id scoping is derived, not random, so it needs no marker and no state

`prebuild-helper/svg-id-randomizer.js` walked `components/assets`, replaced every `id="x"` with
`x_<10 random bytes>`, and prepended `"id random";` to the file so a second run would skip it. That
marker is a **string-literal expression statement**, and it was inserted at position 0 — above
`"use client";`.

Next 16 fails the build on it:

```
The "use client" directive must be placed before other expressions.
./components/assets/displayFavicon/ConfigFavicon.tsx (4:1)
  2 | import type { ImageIconProps } from "@/src/features/entries/model/entry";
  3 | "id random";
> 4 | "use client";
```

Two causes compounded. The marker was always above the directive, and earlier bundlers tolerated it.
Then `codemod-interfaces` hoisted the migrated `import type` above *both*, which is how two files
ended up with the directive on line 4 rather than line 2.

**Decision.** The suffix is `sha256(relativePath + " " + id).slice(0, 20)` — a pure function of the
file and the original id. That single change removes the reason the marker existed:

- **Idempotent without state.** A second run recomputes the same suffix, so nothing changes. The
  tool detects an already-scoped id by its shape (`_[0-9a-f]{20}$`) and leaves it alone.
- **Deterministic across machines.** `crypto.randomBytes` meant the output differed on every run, so
  the tool could never run in CI or on a production build — `git diff --exit-code` would always
  fail. This can, and does.
- **Still collision-free.** Two files may both define `id="gradient"`; the path is in the hash, so
  the scoped ids differ. That was the point of randomizing in the first place.

`tools/randomize-svg-ids.ts` replaces the script, strips the legacy marker wherever it now sits,
gains `--check`, and runs from `prebuild` — so `npm run build` produces it rather than requiring a
local `npm run dev` first. `npm run lint:directives` is the guard for the general case: any
`"use client"` or `"use server"` that is not the first statement fails, across all 843 files.

**Not fixed here.** `prebuild-helper/image-optimizer.js` and
`prebuild-helper/website-favicon-generator.js` remain hand-authored CommonJS and remain
non-deterministic — the favicon PNGs showed as modified in `git status` at the start of this work,
from a `dev` run alone. They are therefore still wired to `predev` only, and `npm run build` does
not produce them. Registered as debt in `X8 §4`.

## ADR-045 — Import v11 history and reconcile the newer main rendering changes

The copied `rewrite/v11` checkout ends at `7f334b18`; main advanced from `1045c28d` to
`0e9f7a81`. The histories are merged, preserving both commit sequences. Main's compact navigation
height, padding and vertical gap, birthday backdrop assets and transforms, and production favicon
source and PNGs are retained. The rewrite's Tailwind v4 dependency graph remains authoritative;
main's lockfile changes add no package manifest changes.

Main's reflective border used both pseudo-elements. v11 already reserves `::before` for the
alpha-scaled surface tint. Combining those utilities on the same element overwrites that tint's
mask and opacity. `surface-edge` therefore paints only `::after`: it carries main's new inset
highlights, mask stops, spread, overlay blend and perceptual edge/ambient colors. Its ambient
background shares the highlight's mask and blend; main's independent multiply-blended ambient
layer cannot coexist on the same two pseudo-elements. This is an explicit material adaptation,
not a claim of pixel-identical reproduction. Surface alpha remains owned by `::before`.

The copied repository's stash is preserved as `refs/archive/aug21-import/stash`, independently of
the receiving repository's existing stash. Private environment and local fixture files are backed
up separately from tracked Git history before the copied checkout and zip are removed.

## ADR-046 — Scene marks use an authored SVG motif and backdrop exports retain CSS stacks

**Status:** accepted implementation decision. Updates `T7 §1.1` and the export detail in `T7 §2`.

The shared backdrop WebGL canvas occupies a page layer below the navigation. A second clipped
WebGL mark would violate `T6 C3`; copying frames out of the page canvas would add a serialization
loop and require coordinating overlapping page and navigation compositing. The primary scene
mark therefore animates the authored first gallery glyph with CSS. The `gallery-3d` variant
uses a small projected extrusion and CSS perspective rotation. It does not claim to reproduce
the gallery GLTF camera frame. A module-level lease grants animation to one primary instance;
all secondary instances are the same deterministic, static SVG motif. Inline secondary SVGs
inherit compiled CSS palette properties, so theme recoloring does not require replacing a
poster image or committing React updates. Motion preferences disable the primary animation.

`tools/build-mark-posters.ts` exports the same first-frame renderer as 256 px SVG and lossless
WebP under `public/mark-poster/<themeId>`. The manifest labels the renderer
`authored-svg-first-frame`, making the distinction from an offscreen GLTF frame explicit.
The generated posters are intended for exports and external consumers; runtime marks use the
inline SVG to preserve CSS inheritance. `MarkScene.dom.spec.tsx` verifies a single animated
lease, static secondary marks and zero runtime canvas elements. `build-mark-posters.spec.ts`
checks both generated formats and their dimensions.

Backdrop-mode mark export keeps the complete literal CSS gradient stack, including conic and
repeating layers, inside a clipped SVG `foreignObject`. This is an explicit export path and
adds no runtime HTML injection. The SVG is intended for browser display; vector importers
without `foreignObject` support should use the PNG export. `rasterizeMarkSvg` uses a temporary,
unmounted export canvas and a self-contained SVG data URL. Chromium taints canvases when a
`foreignObject` image uses a Blob URL, so the data URL is required for PNG encoding. It is not part of the
scene runtime. Standalone exports replace the surface alpha property with literal `1` and
escape XML attributes. These decisions retain the runtime CSS surface renderer without adding
the former bespoke gradient-to-SVG translation math.

The build pipeline now awaits all fifteen browser icon writes, preserves the three raw SVG
sources under `tools/browser-icons`, and runs deterministic SVG optimization, ID scoping, theme
CSS, browser icons, mark posters and celebration CSS for `prebuild` and `predev`. SVG optimization
retains authored coordinate precision, IDs and defs order to avoid cyclic SVGO renaming/sorting;
all five artwork exclusions have an explicit reason and generated mark posters remain owned by
their generator. The former CommonJS prebuild wrappers are removed. Test fixtures are excluded
from SVG component ID scoping.

## ADR-047 — Restore the authored identity geometry

The initial v11 mark used circular pie sectors. The delivered website uses three curved regions inside a 1024-unit disc, with an outline that also traces their boundaries. The native Mark and standalone export now use those authored paths. SVG stop colors remain compiler custom properties, and standalone output resolves literal sRGB colors. Backdrop export inherits the resolved page layers unless an independent mark stack was authored.

## ADR-049 — Layer utilities and documentation replace implicit conventions

Tailwind v4 did not generate z-chrome from the custom --z-chrome token. Explicit z-* utilities now reference the layer table. Route content and footer occupy the content layer while fixed navigation remains outside that stacking context; the viewport backdrop cannot cover the Studio editor. Theme and reading render-cookie writers merge fields and all server-visible fields are validated. The user retained the code-comment ban; effect external-system explanations live in feature documentation instead of source comments.


## ADR-048 — Preserve cookie-driven first paint with explicit public read caches

**Status:** accepted integration decision; updates the framework mechanism in D3 §6.

The pinned framework is Next 16.2.12. RootLayout and generateViewport await validated render preferences from the request cookie. Their result sets the initial html theme, scheme, reading typography, table-of-contents preference, navigation preference and browser theme color. Moving this work behind a streamed boundary would change the initial document's paint; a shared cached root would mix visitor preferences. This integration keeps that first-paint contract and leaves cacheComponents disabled. It does not claim to implement the spec's use-cache/cacheLife streaming strategy.

The native public data layer instead uses unstable_cache with explicit lifetimes and the same invalidation tags: summaries and RSS are one hour under entries:<section>; parsed documents are one week under entry:<section>:<slug>; public author projections are one day under author:<id>. React cache deduplicates calls within a server render. Sign-in profile updates, moderation and account deletion expire the author tag. Comments, reactions, viewer identity, full account records and settings remain outside shared caches. The public author cache stores only sub, name, profilePic and state; it never stores the account's synced theme, settings or notebook.

read-cache.spec.ts verifies identity partitioning, public-only projections, read reuse, author modification/deletion invalidation, error recovery, RSS unlisted filtering and mark stripping, and the exact configured tags/lifetimes. Framework cache-components streaming remains a deliberate difference from D3, requiring a separate design for request-specific html attributes and viewport metadata before it can be enabled.

## ADR-050 — One document renderer leases its live canvas to the focused Studio

**Status:** accepted. Clarifies `T6 §4` shared canvas ownership and `T6 C3` across multiple hosts.

A page backdrop and the Studio's contained preview originally mounted separate r3f canvases.
That satisfied one canvas per stack, but violated the document-wide resource bound when both
used WebGL. A fixed canvas with scissored Views alone also cannot occupy two CSS stacking planes:
the page backdrop sits below main content, whereas a preview must sit above its own opaque
surface and below its text. Windows can add further stacking contexts.

The chosen compositor keeps one document-level React/r3f renderer outlet and physically moves
the same canvas into the host holding an exclusive lease. New hosts are warmed once, in order,
to obtain a truthful first-frame snapshot. Then the focused or most recently mounted contained
Studio host holds the live renderer. The page and other previews show their most recent captured
frame while inactive; closing or changing focus transfers the renderer without creating another
context. Palette and numeric controls still update stable active uniforms imperatively.

Snapshots are taken immediately after a painted frame only during warmup or handoff. They are
not serialized each animation frame, and no additional canvas is mounted. Lazy renderer/GLTF
content must signal readiness before capture. If WebGL is unavailable, a CSS fallback is used
and is not labeled as captured authored artwork. When no WebGL hosts remain, the context is lost
and disposed. This pauses page animation while editing a WebGL preview; it does not flatten the
preview's animation or alter DOM scene stacking. The previously recorded mixed DOM/WebGL stack
ordering boundary remains unchanged.

`renderer-lease.spec.ts` exercises first-frame warmup, focused-window transfers, release back to
the page, stale-frame rejection and structural refresh. The Chromium lease smoke verifies a
page Studio and a Studio window share one created WebGL context, a maximum of one DOM canvas,
and the same canvas object across focus transfers and SPA navigation. A hue edit recolors the
live preview; the paused page keeps its last frame. Screenshot diagnostics live under
`work/backdrop-lease-smoke`, with the reproducible browser tool under `tools/perf`.

## ADR-051 — Native theme contracts take priority over historical palette equivalence

**Status:** Historical design proposal, October 12, 2026; broader scope superseded by ADR-052 after user clarification. Refactor not implemented. **Authority:** the user's explicit instruction that maintainability is part of polish, and that optimal theme architecture can take priority over making every original theme appear identical. **Scope:** theme authoring/publication/runtime boundaries, with continuing respect for the site's shared material and interaction craft.

**Context.** The October 12 source audit found 59 authored single-scheme built-ins, 38 of which are transformed into dual-scheme published sources by `reviewedSchemes`. Generated appearance paint and ID-specific mark treatments make the runtime result differ from a file's authored declaration. Of 760 authored tone references, 758 carry hue/chroma deviations; this largely reflects legacy fitting rather than concise native authoring. The color kernel itself remains small and reusable. Historical corpus fitting is useful preservation evidence, but it should not permanently set the authoring model and publication policy.

**Decision.** Preserve pure OKLCh/ramp/gamut resolution, semantic roles, typed materials, CSS compilation, scene-resource ownership, and validated saved-data import boundaries. Make published appearance availability explicit in each source. Single schemes and deliberately multicolor palettes are valid native themes. Mirroring/fitting can produce authoring drafts or imported representations; they do not silently author published counterparts. Remove ID-dependent publication/mark transformations as native sources become explicit. Normalize appearance resolution, preserve shared rim/shadow geometry, and scope compatibility artwork/reflection behavior to its real consumers. Improve snapshot/cache/profile-identity ownership with measured evidence and versioned migrations where persistent meaning changes.

**Alternatives declined.** Retaining every fitted value as a mandatory native-theme acceptance target keeps the identified opacity. Replacing the core with another framework/color system adds migration cost without solving source ownership. Forcing all themes onto one palette or two appearances removes valid art direction. Deleting saved-data import/adaptation code immediately would discard existing visitor data and artwork still using it.

**Consequences.** Native themes may intentionally differ in palette details from v10; their shared interaction/material craft remains a separate requirement. Old equivalence fixtures remain import-preservation tests, not universal native-authoring constraints. Do not mark this refactor complete because this ADR exists. [Theme direction](../../architecture/theme-direction.md) defines the ordered work and observable completion criteria; [theme engine today](../../architecture/theme-engine.md) records the implemented state.


## ADR-052 — Preserve theme expressiveness and repair porting and execution

**Status:** Accepted, October 12, 2026. Supersedes ADR-051's broad refactor scope. **Authority:** the user clarified “less radical,” emphasized the merits of the current v11 engine, and directed continued work primarily on care and execution of the v10 theme port.

**Decision.** Retain the existing ramp/deviation/mirroring, scheme/appearance, material/layer, mark and scene authoring capabilities. Treat fitted data and generated counterparts as review targets rather than inherent defects. Do not mandate removing counterpart helpers, replacing deviations with literals, duplicating every appearance, or changing the serialized format. Make focused repairs with concrete source/rendered evidence, preserve detailed native craft and existing profiles, and improve resource/state ownership without reducing authoring power.

**Execution.** Correct individual port treatments and actual precedence/binding defects, bound exact-coordinate memoization without quantizing colors, complete interrupted interaction cleanup, and continue the existing fidelity audit. The [theme direction guide](../../architecture/theme-direction.md) is rewritten to this narrower scope. Current-engine documentation and historical inventories remain useful factual references; they do not authorize wholesale simplification.
