# features/theme

The theme engine. Specified across `docs/spec/theme/T1`–`T9`; `T1-architecture.md` is the map.

## Status

The color/model/compiler, 59-theme registry, runtime hosts, profiles, identity marks and Theme Studio are implemented and mounted. `src/features/backdrop` owns the 36 parameterized scenes and shared Canvas coordinator. The root mounts ThemeRuntime, SchemeHost and ThemeHost; built-ins paint from generated CSS and user profiles are applied imperatively after hydration.

`src/styles/themes.generated.css` is deterministic committed output: 90 theme/scheme blocks, 25.2 KB Brotli against the 60 KB budget. Regenerate with `npm run themes:css`; CI asserts freshness. The original palette and shadow values survive only as a small JSON reference fixture in `test/fixtures/theme-reference.json`. Saved-data import remains at the migration boundary; there is no second theme implementation.

Read [current program evidence](../../../docs/spec/exec/X8-status.md) and [Studio runtime](../../../docs/implementation/theme-studio.md) for behavior, effect rationale and remaining release checks.

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
