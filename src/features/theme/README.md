# features/theme

The theme engine. Specified across `docs/spec/theme/T1`–`T9`; `T1-architecture.md` is the map.

## Status

The color engine is complete. The model layer has its types; the compiler has its gradient
serializer. Nothing else exists yet.

| Directory | Spec | State |
| --- | --- | --- |
| `color/` | `T2-color-engine.md` | **complete**, 100 % statement and branch coverage |
| `model/types.ts`, `model/resolved.ts` | `T3 §1`–`§5` | **types complete** — `ThemeSource`, roles, the `GradientLayer` union, `ColorRef`, and the resolved counterparts |
| `model/` rest | `T3 §5`–`§7` | **not written** — no `resolve()`, no zod schema, no `mirror()`, no `loadThemeSource()` |
| `compile/gradient.ts` | `T4 §3`, `T4 §1.2` | **complete** — `layerToCss`, stop serialization, the fixed/scaled layer split |
| `compile/` rest | `T4 §2`, `§4`, `§5` | **not written** — no `compile()`, no `compileToCss()`, no `applyProperties()` |
| `registry/` | `T3 §6`, `T9-theme-migration.md` | not written — none of the 59 themes are lifted |
| `runtime/` | `T4 §5` | not written |
| `studio/` | `T8-theme-studio.md` | not written |
| `backdrop/` | `T6-backdrops.md` | not written (own feature) |

`V-15` is confirmed (`X7 §4`), so `T4 §1.1`'s surface-alpha mechanism is validated and `T4-01` may
proceed. `compile/gradient.ts` is written against it: per-use alpha never enters the image string,
only the `-image` / `-base` split does.

The v10 theme engine (`components/theme/`, `lib/colorPaletteParser.ts`, `lib/themeMaker/`) is still
in place and still the one the site uses. `04 §1` requires that the two never coexist; they do,
because the replacement is incomplete. Nothing here is wired into the running app, so there is no
runtime ambiguity about which engine is live — it is the old one.

## What `color/` owns

OKLCh color arithmetic, and nothing else. It is pure: no React, no DOM, no third-party dependency,
and its only import outside itself is `lib/errors`. A test asserts that boundary (`T2 C10`).

| Module | Owns |
| --- | --- |
| `types.ts` | `Oklch`, `Oklab`, `LinearSrgb`, `Gamut`, `CssColor`, `ColorLiteral`, `clamp01`, `mod360` |
| `oklab.ts` | The Ottosson matrices, both directions, and polar/rectangular conversion |
| `srgb.ts` | sRGB transfer functions; hex parsing and serialization |
| `gamut.ts` | `isInGamut`, `maxChroma` (memoized, exact-keyed — ADR-021), `toGamut` |
| `ramp.ts` | `RampSpec`/`RampStop`, the tone curve, and `sampleRamp` |
| `format.ts` | `oklch()` and hex output, literal parsing |
| `contrast.ts` | WCAG 2.x ratio, APCA Lc, ΔE_OK — reporting only, never auto-adjustment |

`Oklch` is the only internal color representation. Hex and `oklch()` strings exist at the
import/export boundary only.

## What `color/` does not own

- **Theme structure.** Roles, schemes, surfaces, and mirroring are `model/` (`T3`).
- **CSS emission.** `formatOklch` produces one color; assembling custom properties and gradient
  strings is `compile/` (`T4`). `T4 C10` requires that no file outside `compile/` contains
  `gradient(` in a template literal.
- **Contrast enforcement.** `contrast.ts` reports. `T1 §8`: the engine never silently adjusts an
  authored color.
- **Wide gamut.** Output is sRGB. `toLinear` throws on `display-p3` rather than silently
  substituting sRGB; widening it is a deliberate future change (`T2 §3`, `T1 §8`).

## Verification

`src/features/theme/color/*.spec.ts`. The contract is `T2 §5.7` — the twelve-stop table, the
chroma-consistency table across six hues, and the torsion table are asserted to the exact 8-bit hex.
`appendix/oklch.mjs` computes the same values independently; if a change makes the ramp disagree
with that table, the ramp is wrong.

Divergences from the spec's listings are recorded as ADR-021 through ADR-028 in
`docs/spec/exec/X6-implementation-decisions.md`. Read that before assuming a difference is a bug.
