# T9 — Theme migration

Migrating the 59 existing themes. The brief calls this optional — *"but if it can be done
right, sure why not."* It can be done right, and the mechanism is **exact lift**: every theme
reproduces pixel-identically, with the option to simplify afterward by hand.

Tool: `tools/migrate-themes.ts`. Runs offline against the source tree; the output is committed
TypeScript, reviewed in a diff.

## 1. Why exact lift rather than refit

The tempting approach is to fit each theme to a pure seed — solve for hue, chroma, and each
role's tone position, and accept a small color shift. Measured, that shift is too large.

Fitting all 58 parseable themes to a 12-rung discrete ramp with roles snapped to the nearest
rung gives per-theme max ΔE_OK:

| p50 | p75 | p90 | max |
| --- | --- | --- | --- |
| 0.034 | 0.038 | 0.043 | 0.092 |

Only **4 of 58** land inside the 0.02 just-noticeable-difference threshold; 45 within 0.04.
The error is dominated by lightness quantization, not by the model.

Continuous tone positions remove the lightness error entirely (`toneLightness` is strictly
monotone, hence invertible — T2 §5.2). But per-role *chroma* and *hue* still deviate from any
single seed. After solving each theme's best seed hue and chroma with a flat envelope, residual
per-role deviation is:

| | p50 | p90 | max |
| --- | --- | --- | --- |
| \|Δ relative chroma\| | 0.147 | 0.349 | 0.490 |
| \|Δ hue\| | 8.6° | 27.8° | 148.6° |

and only **16 of 58** themes fall inside a tight pure-seed tolerance
(`|ΔrelC| ≤ 0.12`, `|Δh| ≤ 10°`).

That residual is **design intent, not noise.** `whiteout` deliberately pairs a desaturated
`text` with a more saturated `panel`; `vibrant` spans 292° of hue on purpose. A schema that
could not represent it would be a worse schema. So the migration stores the deviations, the
theme reproduces exactly, and the schema is validated by having to carry real data.

Reproduce all of the above with `node docs/spec/appendix/oklch.mjs`-based scripts described in
§7.

## 2. Algorithm

For each of the 59 config files:

**Step 1 — Read.** Parse the module with the TypeScript compiler API (not regex) to extract the
`ThemeDataConfig` literal. Regex extraction fails on `penumbra` and the four generated themes,
which wrap every color in `transformRgb(...)`; those five are handled by importing the module
and reading the evaluated object instead. Both paths produce the same in-memory shape.

**Step 2 — Decode.** Convert every `ColorTriplet` and `HexColor` to `Oklch`
(`linearSrgbToOklab`, T2 §3).

**Step 3 — Determine scheme.** `dark` if `L(primary) > L(light)`, else `light`. Measured: 31
dark, 27 light, and this test agrees with human judgment on all 58 (verified by inspection
against the theme picker).

**Step 4 — Solve the seed.**
- `hue` = chroma-weighted circular mean of the four accent hues. Weighting by chroma is
  essential: a near-white role has a numerically unstable hue that would otherwise dominate.
- `chroma` = mean of `C_role / Cmax(L_role, h_role)` across the four roles, clamped to `[0,1]`.
- `torsion` = the least-squares slope of `hueDelta` against `t`, clamped to `[-360, 360]`, kept
  only if it reduces total hue residual by more than 20 %; otherwise 0.
- **`lightest` and `darkest` are derived from every color in the theme**, not from the four
  accents: `lightest = max(L)` and `darkest = min(L)` over all nine roles, every surface
  gradient stop, and every mark stop. Without this the lift clamps at the extremes and loses
  lightness — `marina`, `grass`, and `springField` have roles at `L ≈ 0.996` (above the default
  `L_LIGHTEST` of 0.985), and `plainBlack`'s page gradient is pure black at `L = 0` (far below
  the default `L_DARKEST` of 0.165). See T2 §5.2.
- Achromatic themes (`C < 0.012` on all four roles — **7 of 58**: the four `plain*`, `home`,
  `cubistic`, `gallery`) get `chroma: 0` and `hue: 0`. A further 14 themes have *some* role
  below that threshold; those keep their solved hue, since the chroma weighting already
  discounts the near-neutral role. Counts in `appendix/corpus-analysis.md`.

**Step 5 — Place roles.** For each of the four legacy accents, `t = inverseToneLightness(L)`.
Then map to v11 roles:

| legacy | v11 role |
| --- | --- |
| `primary` | `text` |
| `saturated` | `textMuted` |
| `pastel` | `fill` |
| `light` | `panel` |
| `siteThemeColor` | `brand` |
| *derived*: shade map index 0 of `light` | `edge` — but see §3 |
| *derived*: shade map index 17 of 22 of `light` | `shade` — see §3 |
| *(none)* | `accent`, `line` — see §3 |

**Step 6 — Record deviations.** For each role, `chroma: { delta: relC_actual − relC_curve }` and
`hue: { delta: h_actual − h_curve }`, both omitted when `|delta| < 0.005` / `< 0.5°`. This is
what makes the lift exact.

**Step 7 — Lift surfaces.** Each `page` / `pageMinimal` / `widget` gradient array becomes a
`SurfaceSource`. Layer kind from `type`; geometry from the applicable fields; `isWidgetOpacity`
→ `alpha: "scaled" | "fixed"`; each stop's `ColorTriplet` → **`{ kind: "tone", at }`** by the
same inverse-lightness solve, with chroma/hue deltas, so surfaces recolor with the seed too.
Stops whose deviation exceeds `|ΔrelC| > 0.45` or `|Δh| > 60°` are emitted as
`{ kind: "literal" }` instead, with a note in the report — beyond that magnitude the "tone plus
deviation" framing stops being informative and a literal is the honest representation.

**Step 8 — Lift the mark.** `FaviconConfig` → `MarkSource` per the table in T7 §1. Gradient
stops lift to tone references by the same rule as Step 7.

**Step 9 — Lift the backdrop.** `animatedBackgroundKey` → `{ scenes: [{ id }] }` with the
scene's default params. Where the scene was consolidated (T6 §6), emit the params that
reproduce the original — those are recorded in the consolidation's own migration table, written
when the consolidation is done, not guessed here.

**Step 10 — Synthesize the missing scheme.** For a theme detected as `light`, emit
`schemes: { kind: "dual", light: <lifted>, mirrorDark: true }`. Mirroring gives a dark
presentation for free. **It is not automatically shipped**: the theme is emitted with
`schemes.darkReviewed: false`, and the picker offers the dark scheme only once a human has set
it true. Auto-generated dark modes for 27 hand-designed light themes will not all be good, and
shipping them unreviewed would be exactly the kind of plausible-but-wrong output this spec
exists to prevent.

**Step 11 — Verify.** `resolve(lifted, originalScheme)` must reproduce every original color
within ΔE_OK ≤ 0.002 (rounding tolerance only). A theme that fails is written to the report and
**not** committed until investigated.

**Step 12 — Emit.** Format with Prettier, write to
`src/features/theme/registry/themes/<id>.ts`, append to `registry/index.ts` and `themeOrder`.

## 3. Roles with no legacy source

Four v11 roles have no counterpart in `RawColorPaletteData`.

- **`edge`** — today computed at runtime as `generateShadeMap(accent, 22).shadeMap[0]`, i.e. the
  near-white tone of each accent's hue. Lift to `t = 0`. Exact, because that is what index 0 of
  a 94→6 lightness ramp is.
- **`shade`** — today `--color-darklight-<accent>` is `generateShadeMap(accent, 22).shadeMap[17]`,
  computed **per accent**, in that accent's own hue. So there are four `darklight-*` values, and
  the one that matters is `darklight-light`: it is the only one the shadow scale uses
  (`tailwind.config.ts:48-56`). Lift procedure, in order — the first step that succeeds wins:

  1. Compute the target: `shadeMap[17]` of the `light` accent, decoded to `Oklch`. Call it `S`.
  2. `t_shade = inverseToneLightness(S.l, ramp)` — exact, since `lightest`/`darkest` were derived
     to bracket every color (step 4).
  3. Solve `hue: { delta }` from `S.h − toneHue(t_shade, ramp)`, and
     `chroma: { delta }` from `S.c / Cmax(S.l, S.h) − toneRelativeChroma(t_shade, ramp)`.
  4. Assert `ΔE_OK(resolve(shade), S) ≤ 0.002`. If it fails — only possible if `S` is outside the
     sRGB gamut at that hue, which cannot happen since `S` came *from* sRGB — emit
     `{ kind: "literal", value: S }` and flag it.

  **Both a hue delta and a chroma delta are permitted**, which is what makes this non-circular:
  the earlier draft of this document said "a chroma delta solved so that the emitted color
  matches", and a chroma delta alone cannot reconcile a hue difference between the `light`
  accent's hue and the theme's seed hue plus torsion. Roles carry both deltas (T3 §1.2); use both.

  Shadows are the most visible of the four derived roles — seven `--zw-shadow-tint-*` values
  descend from `shade` (T4 §6) — so this one is solved and asserted rather than assumed.
- **`line`** — currently ad-hoc: `border-saturated`, `border-t-saturated`,
  `border-highlight-light/15`, `outline-highlight-light/15` all appear. Default to
  `alias: "textMuted"` so nothing changes visually, and flag it in the report so the author can
  differentiate later.
- **`accent`** — no counterpart at all. Default to `alias: "textMuted"`, which reproduces
  current behavior (links and focus rings use `saturated` today). Flagged in the report as the
  one genuinely new expressive slot per theme.

Defaulting to aliases means the lift is visually exact for all nine roles, and the two new
slots become opportunities rather than migration risk.

## 4. Gradient interpolation fidelity

Stops are now emitted as `oklch()` rather than `rgb()` (T2 §6). Where a gradient's endpoints
differ substantially in hue, the browser's default sRGB interpolation of `oklch()`-specified
endpoints is not identical to its interpolation of `rgb()`-specified ones — the endpoint values
match, the midpoints can differ.

The migration therefore emits `interpolation: { space: "srgb" }` explicitly on any layer whose
adjacent stops differ by more than 25° of hue **and** which did not already declare an
interpolation. Measured: 11 of 59 themes contain at least one such layer. `eep`'s
`hsl longer hue` widget layer and the other explicit declarations pass through unchanged.

Themes with `type: "custom"` raw CSS layers (checked: 0 in the current registry, but the type
allows it and user profiles may contain them) lift to `RawLayer` with `$opacity` replaced by
`var(--zw-surface-<role>-alpha)`.

## 5. Visual-equivalence harness

`tools/verify-theme-migration.ts`. This is the actual proof, and it also serves T4 C5 and
T5 C4.

1. Build `main` (pre-migration) and the migration branch.
2. For each of 59 themes × each of 6 canonical routes (`/`, `/blog`, `/blog/<fixture>`,
   `/photos`, `/design`, `/design/theme-maker`), at 3 viewports (390, 834, 1440):
   screenshot both builds with backdrop animation frozen (`prefers-reduced-motion` forced) and
   fonts preloaded.
3. Compare with a perceptual metric, per-pixel ΔE_OK, and report:
   - **max ΔE_OK** per screenshot,
   - **fraction of pixels** with ΔE_OK > 0.02.
4. Gate: no screenshot may exceed 0.5 % of pixels above ΔE_OK 0.02, and no pixel above 0.05,
   *excluding* pixels covered by an animated backdrop (masked out by rendering each build
   twice and excluding pixels that differ between the two runs of the same build).

That is 59 × 6 × 3 = 1 062 comparisons. It runs in CI on the migration PR only, not per commit.

Where the gate fails legitimately — the lens-model change to the `widget` surface (T5 §4.2)
*intends* to change appearance — the affected surface is excluded by name and the change is
reviewed by eye instead. Exclusions are listed explicitly in the tool's config so that "we
turned off the check" is visible.

## 6. Report

`tools/migrate-themes.ts --report=out/theme-migration.json` emits, per theme:

```jsonc
{
  "id": "velvet",
  "scheme": "dark",
  "seed": { "hue": 316.4, "chroma": 0.46, "torsion": -6.2 },
  "roles": {
    "text": { "t": 0.0912, "chromaDelta": -0.11, "hueDelta": 3.2 },
    "…": {}
  },
  "purity": 0.71,              // 1 = pure seed; 1 - normalized deviation magnitude
  "literalStops": 0,           // surface stops emitted as literals
  "maxDeltaEOk": 0.0004,       // step 11 verification
  "flags": ["accent-defaulted", "line-defaulted", "dark-unreviewed"]
}
```

`purity` is the tool for the optional simplification pass: sort the report by it, and the
high-purity themes are the ones where deleting the deviations by hand costs nothing visible.
Expect ~16 themes to be trivially simplifiable and ~10 (`vibrant`, `autumnal`, `verdant`,
`dusk`, `springField`, `bewitched`, `halloween`, `marina`, `memories`, `bubbles`) to be
legitimately bespoke.

Simplification is **per theme, by eye, optional, and never automated.** The tool reports; a
human decides.

## 7. Reproducing the measurements

The numbers in §1 come from committed, runnable scripts in `docs/spec/appendix/`. No install:

```sh
cd docs/spec/appendix
node corpus.mjs        # → corpus-analysis.md: scheme, hue, torsion, per-role L and relative chroma (F-11)
node fit-discrete.mjs  # → the ΔE_OK distribution for a 12-rung discrete fit (§1, first table)
node fit-envelope-all.mjs  # → residuals under three candidate envelopes (F-12, §1 second table)
node gamut-table.mjs   # → gamut-table.md: the sRGB chroma ceiling (ADR-001)
```

All share `appendix/oklch.mjs`. `corpus.mjs` and `gamut-table.mjs` regenerate their committed `.md`
byte-identically, so CI can assert freshness. The ΔE figures in §1 are quoted to 3 decimals where
the scripts print 4 (`0.034` for `0.0341`); the script output is authoritative.

> `fit-discrete.mjs` measures under the **taper** envelope that ADR-003 later rejected, because
> that is the envelope the original discrete-fit measurement used. Its own "ramp" tables are
> therefore *not* the canonical test vectors — T2 §5.7 is. The script prints this warning itself.
> The discrete-fit conclusion is unaffected: the error it measures is lightness quantization, which
> the envelope does not touch.

## 8. Legacy profile support at runtime

Independent of the build-time migration: users have v1 profiles in `localStorage` and in synced
account settings, and those cannot be migrated by a tool because they are on other people's
machines. `loadThemeSource` (T3 §7) accepts `formatVersion: 1` and lifts it with the same
algorithm, **forever**. The lift function is therefore shared between the CLI and the runtime:
`features/theme/model/lift-v1.ts`, imported by both.

Runtime lifting must not import the TypeScript compiler API. Step 1's parsing is CLI-only; the
runtime path receives an already-parsed object.

## 9. Acceptance

| # | Criterion |
| --- | --- |
| C1 | All 59 themes migrate with `maxDeltaEOk ≤ 0.002` at step 11 |
| C2 | The visual-equivalence harness passes at the §5 gate, with any exclusion named in config |
| C3 | `themeOrder` contains all 59 ids; no id is lost |
| C4 | Every emitted file passes `themeSourceSchema` |
| C5 | `lift-v1.ts` is imported by both the CLI and the runtime loader and has no CLI-only imports |
| C6 | Round-trip: `lift(legacy)` → `resolve` → compare against the *current build's* computed CSS custom properties for that theme, per property, within 1/255 per channel |
| C7 | The migration is idempotent: running it twice produces identical output |
| C8 | The report is emitted and every theme has `purity`, `maxDeltaEOk`, and `flags` populated |
| C9 | No theme ships a dark scheme with `darkReviewed: false` visible in the picker |
| C10 | 11 themes receive an explicit `interpolation: { space: "srgb" }`; the list is in the report |
| C11 | No task in this workstream alters an authored role position. The contrast report (U3 §3.5) records failures; it does not fix them. C1 and C2 take precedence over the AA gate for authored schemes. |

## Implementation evidence — 2026-10-09

Synced users now carry independently versioned ThemePreferences. Legacy user migration invokes the pure migrateThemePreferences and validates the resulting account envelope; runtime migration shares parent-owned pure theme lifting. The image palette integration uses the parent-owned ThemeSource helper and is documented in docs/architecture.md; this is separate from the authored built-in migration/equivalence gates above.
