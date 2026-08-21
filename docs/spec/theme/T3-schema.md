# T3 — Theme schema

Resolves F-05, F-07, F-09. Location: `src/features/theme/model/`.

Two types matter: `ThemeSource` (authored, serialized, versioned, user-editable) and
`ResolvedTheme` (every value absolute, ready for the compiler). `resolve()` is the only
bridge.

## 1. `ThemeSource`

```ts
export type ThemeSource = {
  readonly formatVersion: 2;
  readonly id: ThemeId;
  readonly name: string;
  /** Author-facing note. Not rendered anywhere in the product. */
  readonly note?: string;

  /** How the ramp is generated. T2 §5. */
  readonly ramp: RampSpec;

  /**
   * Which schemes this theme presents. A theme with both is one theme with two
   * role mappings — this is the "light/dark mode support within one theme" requirement.
   */
  readonly schemes: SchemeSet;

  /** Named materials. Absent keys inherit from `defaultSurfaces`. */
  readonly surfaces?: Partial<Record<SurfaceRole, SurfaceSource>>;

  readonly backdrop?: BackdropSource;
  readonly mark?: MarkSource;
  readonly reading?: ReadingSource;
};
```

`formatVersion` is `2`; version `1` is the legacy `ThemeDataConfig`. The migration reads 1
and writes 2 (T9); the runtime loader accepts both and lifts 1 on read, forever, because
users have v1 profiles in `localStorage` and in synced account settings.

### 1.1 Schemes

```ts
export type Scheme = "light" | "dark";

export type SchemeSet =
  /** One presentation. `roles` describes it. */
  | { readonly kind: "single"; readonly scheme: Scheme; readonly roles: RoleMap }
  /**
   * Two presentations from one ramp. `dark` defaults to `mirror(light)`:
   * every role's `t` reflected as `1 - t`. Override individual roles as needed.
   */
  | { readonly kind: "dual";
      readonly light: RoleMap;
      readonly dark?: Partial<RoleMap>;
      /** false ⇒ the non-mirrored scheme must be complete. Default true. */
      readonly mirrorDark?: boolean;
      /**
       * A generated (mirrored) scheme is not offered in the picker until a human has
       * looked at it. T9 §2 step 10; R-05.
       */
      readonly darkReviewed?: boolean };
```

**Mirroring is the mechanism that makes dual-scheme cheap.** The measured corpus supports it:
27 light themes place `text` near `t = 0.70` and `panel` near `t = 0.01`; 31 dark themes
place `text` near `t = 0.05` and `panel` near `t = 0.75`. Reflection through
`t ↦ 1 − t` maps one onto the other. Where the reflection is wrong — and it will be, for
themes whose light presentation is deliberately low-contrast — the `dark` partial fixes just
the roles that need it.

`mirror` also reflects surfaces (T5 §6): a surface layer referencing `tone(0.05)` becomes
`tone(0.95)`. Literal colors in surfaces are **not** mirrored, since a literal is an
explicit statement; the compiler warns when a dual-scheme theme has literal surface colors
so the author knows the dark scheme needs an override.

### 1.2 Roles

```ts
export type RoleName =
  | "text" | "textMuted" | "line" | "fill" | "panel"
  | "edge" | "shade" | "accent" | "brand";

export type RoleMap = Readonly<Record<RoleName, RoleValue>>;

export type RoleValue =
  /** Shorthand for { kind: "tone", at: n }. */
  | number
  | { readonly kind: "tone";
      readonly at: number;                          // [0,1]
      readonly chroma?: { readonly delta: number } | { readonly value: number };
      readonly hue?: { readonly delta: number } | { readonly value: number };
    }
  | { readonly kind: "literal"; readonly value: ColorLiteral }
  /** Alias another role. Resolved before use; cycles are a validation error. */
  | { readonly kind: "alias"; readonly of: RoleName };
```

`number` shorthand keeps the common case readable:

```ts
roles: { text: 0.70, textMuted: 0.58, line: 0.30, fill: 0.15,
         panel: 0.05, edge: 0, shade: 1, accent: 0.50, brand: 0.20 }
```

Defaults live in `model/defaults.ts` as `defaultLightRoles`; a theme may spread and override.

**Role-level `chroma`/`hue` deviations exist and are load-bearing.** Measured: after fitting
each existing theme's best seed hue and chroma, residual per-role `|Δ relative chroma|` has
p50 0.147 and p90 0.349, and only 16 of 58 themes fall inside a tight
(`|ΔrelC| ≤ 0.12`, `|Δh| ≤ 10°`) pure-seed tolerance. The corpus genuinely encodes per-role
chromatic character — `whiteout` deliberately pairs a desaturated `text` with a more
saturated `panel` — and that is design intent, not noise. A schema without per-role
deviation could not represent the existing themes, which is why T9's migration is an exact
lift rather than a refit.

### 1.3 Reading

```ts
export type ReadingSource = {
  /** Backdrop blur behind long-form reading surfaces, px. Default 24. */
  readonly blur?: number;
  /** Serif body text for long-form. Default inherits the user setting. */
  readonly serif?: boolean;
};
```

Replaces `ThemeMiscOptions`. "Misc" is not a category; if a future field has no home, it gets
a named group, not a bag.

## 2. `brand` replaces `siteThemeColor`

F-07: `siteThemeColor` was a sibling of `palette` while `AccentColors` included `"site"`,
forcing every consumer to special-case it (`updateSiteThemeColor`, two index maps in
`colorHelper.ts`, a branch in `getHexOutlineColor`). It is a role. Consumers become:

| Consumer | Before | After |
| --- | --- | --- |
| `<meta name="theme-color">` | `themeConfig.siteThemeColor` | `resolved.roles.brand` |
| Mark stroke default | `outline === "site"` branch | `{ kind: "role", role: "brand" }` |
| Backdrop base color | `style={{ backgroundColor: siteThemeColor }}` ×3 | `--zw-role-brand` in CSS |
| Studio accent pill | separate editor mode | one more role in the role list |

## 3. Gradients are a discriminated union

F-05: the current `ColorGradient` is an intersection of five `Partial<>`s, so every gradient
carries every field of every kind and nothing is checked. Replacement:

```ts
export type GradientLayer =
  | LinearLayer | RadialLayer | ConicLayer | RawLayer;

type LayerBase = {
  readonly id: LayerId;                     // stable, for editor selection & reorder
  readonly enabled?: boolean;               // default true
  readonly interpolation?: Interpolation;
  /** Participation in the surface alpha multiplier. Default "scaled". */
  readonly alpha?: "scaled" | "fixed";
  readonly variation?: LayerVariation;      // T5 §4
};

export type LinearLayer = LayerBase & {
  readonly kind: "linear";
  readonly repeating?: boolean;
  readonly direction:
    | { readonly kind: "angle"; readonly deg: number }
    | { readonly kind: "corner"; readonly x: "left" | "right"; readonly y: "top" | "bottom" }
    | { readonly kind: "side"; readonly to: "top" | "right" | "bottom" | "left" };
  readonly stops: readonly GradientStop[];
};

export type RadialLayer = LayerBase & {
  readonly kind: "radial";
  readonly repeating?: boolean;
  readonly at: Position;                    // percentages
  readonly extent:
    | { readonly kind: "ellipse"; readonly x: number; readonly y: number }   // %
    | { readonly kind: "circle";  readonly size: RadialSizeKeyword };
  readonly stops: readonly GradientStop[];
};

export type ConicLayer = LayerBase & {
  readonly kind: "conic";
  readonly repeating?: boolean;
  readonly from: number;                    // deg
  readonly at: Position;
  readonly stops: readonly GradientStop[];
};

/**
 * Escape hatch. Verbatim CSS for one `background-image` entry.
 * `var(--zw-surface-alpha)` is in scope. No string templating, no `$opacity`.
 */
export type RawLayer = LayerBase & { readonly kind: "raw"; readonly css: string };

export type GradientStop = {
  readonly at: number;                      // %, may exceed [0,100] when extended range is on
  readonly color: ColorRef;
  readonly alpha?: number;                  // [0,1], default 1
};

export type Position = { readonly x: number; readonly y: number };
export type RadialSizeKeyword =
  "closest-side" | "closest-corner" | "farthest-side" | "farthest-corner";

export type Interpolation = {
  readonly space: GradientColorSpace;       // default omitted ⇒ browser default
  readonly hue?: "shorter" | "longer" | "increasing" | "decreasing";
};
```

Three properties this buys:
1. `posX` on a linear layer is a **compile error**.
2. `initializeGradientDataProperties` (backfilling fields the type could not guarantee) and
   `optimizeColorGradients`' 80 lines of field-stripping both become unnecessary — the union
   carries exactly the fields its kind needs.
3. The compiler is one exhaustive `switch`, and `noFallthroughCasesInSwitch` plus the `never`
   default make adding a layer kind a compile error at the compiler.

`RawLayer` is tagged `kind: "raw"` so escapes are greppable and reviewable, unlike the current
`type: "custom"` which is indistinguishable from a real gradient kind at a glance.

## 4. `ColorRef` — the one place a color can come from

```ts
export type ColorRef =
  | { readonly kind: "role"; readonly role: RoleName }
  | { readonly kind: "tone"; readonly at: number;
      readonly chroma?: { readonly delta: number } | { readonly value: number };
      readonly hue?: { readonly delta: number } | { readonly value: number } }
  | { readonly kind: "literal"; readonly value: ColorLiteral };

/** `#rgb`, `#rrggbb`, `#rrggbbaa`, or `oklch(L C H)`. Validated on parse. */
export type ColorLiteral = string & { readonly __brand: "ColorLiteral" };
```

Gradient stops referencing `{ kind: "tone", at }` are what makes a theme *coherent*: change
the seed hue and the page gradient follows. Today every gradient stop is a verbatim RGB
triplet, which is why `generatePenumbraConfig` has to call `transformRgb` on 40 literals by
hand (F-10). `{ kind: "role" }` is for surfaces that should track a semantic slot;
`{ kind: "literal" }` is the escape.

## 5. `ResolvedTheme`

```ts
export type ResolvedTheme = {
  readonly id: ThemeId;
  readonly name: string;
  readonly scheme: Scheme;
  readonly roles: Readonly<Record<RoleName, Oklch>>;
  /** Convenience ladder for consumers that want tones directly (mark, backdrop). */
  readonly tone: (t: number) => Oklch;
  readonly surfaces: Readonly<Record<SurfaceRole, ResolvedSurface>>;
  readonly backdrop: ResolvedBackdrop | null;
  readonly mark: ResolvedMark;
  readonly reading: Required<ReadingSource>;
};
```

Every color is an `Oklch`. No strings, no refs, nothing left to look up. `compile()` (T4)
takes only this.

```ts
export function resolve(source: ThemeSource, scheme: Scheme): ResolvedTheme;
```

`resolve` order of operations:
1. Normalize `RampSpec`; sort and validate `stops` (strictly increasing `at`).
2. Lift every `ColorLiteral` appearing in `ramp.stops` into `{ l, relC, hΔ }` so it
   participates in interpolation (T2 §5.6).
3. Select the `RoleMap` for `scheme`; if `kind: "dual"` and `scheme === "dark"`, start from
   `mirror(light)` and apply the `dark` partial.
4. Resolve `alias` roles (topological; a cycle throws `invalid-request`).
5. Sample every role.
6. Merge `surfaces` over `defaultSurfaces`; resolve every `ColorRef` in every layer.
7. Resolve backdrop palette requests (T6 §3) and the mark (T7).
8. Fill `reading` from `defaultReading`.

`resolve` is deterministic and referentially transparent: same input, same output, no clock,
no randomness. Tests snapshot it.

## 6. The registry — one file per theme, one line to register

F-09: a theme currently requires edits to a 55-member union, a key map, and a display-order
list, and those three are already inconsistent.

```
features/theme/registry/
  index.ts
  themes/
    velvet.ts        export default { … } satisfies ThemeSource
    whiteout.ts
    …
```

```ts
// registry/index.ts
import velvet from "./themes/velvet";
import whiteout from "./themes/whiteout";
// …

const registry = { velvet, whiteout /* … */ } satisfies Record<string, ThemeSource>;

export type ThemeId = keyof typeof registry;
export const themeIds = Object.keys(registry) as readonly ThemeId[];
export const getTheme = (id: ThemeId): ThemeSource => registry[id];

/**
 * Presentation order in pickers. Every registry key must appear exactly once;
 * enforced by a type-level exhaustiveness check plus a unit test, so the
 * `allListedThemes` drift of F-09 cannot recur.
 */
export const themeOrder: readonly ThemeId[] = [ /* … */ ];
```

`themeOrder` completeness is a unit test (`registry.spec.ts`), not a convention. Themes
deliberately hidden from pickers carry `hidden: true` in their own file and are excluded by a
derived `listedThemeIds`; they are still *in* `themeOrder`'s domain so nothing can be
silently forgotten.

Seasonal and generated theme sets (`darkModeThemes`, the birthday family) become
**derivations** in `registry/derived.ts`:
```ts
export const seasonalThemeFor = (date: Date): ThemeId | null => { … };
```
replacing the eleven `generatePenumbraConfig(...)` calls in `lib/constants/defaultSettings.ts`
with, in the dual-scheme world, nothing at all — dark mode is a scheme, not a theme set.

## 7. Validation

`model/schema.ts`, Zod. Replaces the 300-line hand-written `isValidThemeDataConfig`.

```ts
export const themeSourceSchema: z.ZodType<ThemeSource> = z.object({ … });
export const legacyThemeConfigSchema: z.ZodType<LegacyThemeDataConfig> = z.object({ … });

export type LoadResult =
  | { readonly ok: true; readonly theme: ThemeSource; readonly lifted: boolean }
  | { readonly ok: false; readonly issues: readonly string[] };

/** Accepts v1 or v2. Lifts v1. Used by import, localStorage read, account sync. */
export function loadThemeSource(input: unknown): LoadResult;
```

Constraints the schema enforces beyond shape:
- `ramp.stops` strictly increasing by `at`, each in `[0,1]`.
- `RoleValue.at` and `ColorRef.at` in `[0,1]`; `GradientStop.at` in
  `[-300, 400]` (the existing extended range) with the narrower `[0,100]` when
  `allowExtendedGradientStops` is off.
- `hue` in `[0,360)`, `chroma` in `[0,1]`, `torsion` in `[-360,360]`.
- No `alias` cycles.
- `ColorLiteral` matches `/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i` or a parseable
  `oklch(...)`.
- `RawLayer.css` is rejected if it contains `;` or `}` (it must be a single
  `background-image` component, and this prevents a pasted profile injecting arbitrary
  declarations).
- `schemes.kind === "single"` ⇒ `roles` complete. `"dual"` with `mirrorDark: false` ⇒ `dark`
  complete.

`ease` and `envelope` are functions and therefore **not serializable**. In a serialized
`ThemeSource` they are absent; built-in themes that need a bespoke curve declare it as a named
preset:
```ts
readonly ease?: "default" | "linear" | "contrast" | "soft";
readonly envelope?: "flat" | "dusty" | "vivid";
```
resolved through `model/curves.ts`. This keeps user-authored themes JSON-safe and prevents
arbitrary code arriving in an imported profile. Built-in themes may not smuggle raw functions
either — one representation per concept (`02-conventions §1`).

## 8. Worked example

`registry/themes/velvet.ts`, reproducing the existing velvet theme. Measured source values:
seed hue 316, relative chroma 0.35 → 0.57 rising as it darkens; `t` positions 0.09 / 0.25 /
0.52 / 0.73 for text / textMuted / fill / panel.

```ts
import type { ThemeSource } from "../../model/types";

// Values are the measured lift of the shipped v10 velvet theme.
// appendix/corpus-analysis.md: seed hue 316, per-role relC 0.35 / 0.42 / 0.52 / 0.57,
// t positions 0.091 / 0.252 / 0.518 / 0.734. The per-role chroma deltas below are what
// make this an exact lift rather than a refit (T9 §1) — a single seed chroma cannot
// express a relC that rises from 0.35 to 0.57 across the ladder.

export default {
  formatVersion: 2,
  id: "velvet",
  name: "Velvet",

  ramp: {
    hue: 316,
    chroma: 0.46,        // mean relC; per-role deltas carry the rest
    torsion: -6,
    lightest: 0.9115,    // = L(text); derived from every color in the theme (T9 §2 step 4)
    darkest: 0.3670,     // = L(panel)
  },

  schemes: {
    kind: "dual",
    // The authored v10 appearance is the dark scheme. `light` is its mirror, unreviewed.
    dark: {
      text:      { kind: "tone", at: 0.091, chroma: { delta: -0.11 } },
      textMuted: { kind: "tone", at: 0.252, chroma: { delta: -0.04 } },
      line:      { kind: "alias", of: "textMuted" },
      fill:      { kind: "tone", at: 0.518, chroma: { delta: +0.06 } },
      panel:     { kind: "tone", at: 0.734, chroma: { delta: +0.11 } },
      edge:      0,
      shade:     { kind: "tone", at: 1, chroma: { delta: +0.08 }, hue: { delta: 4 } },
      accent:    { kind: "tone", at: 0.45, chroma: { delta: +0.12 } },
      brand:     { kind: "tone", at: 0.79 },
    },
    light: mirrorOf("dark"),   // see note below
    mirrorDark: false,
    darkReviewed: true,        // this scheme is the authored one
  },

  surfaces: {
    page: { layers: [{
      id: "page-base", kind: "radial",
      at: { x: 50, y: 100 },
      extent: { kind: "circle", size: "farthest-side" },
      stops: [
        { at: 15, color: { kind: "tone", at: 0.66 } },
        { at: 90, color: { kind: "tone", at: 0.80 } },
      ],
    }] },
    widget: { alpha: 0.68, lens: { blur: 12, saturate: 1.15 }, layers: [{
      id: "widget-base", kind: "linear",
      direction: { kind: "angle", deg: 0 },
      stops: [
        { at: 25,  color: { kind: "tone", at: 0.74 } },
        { at: 100, color: { kind: "tone", at: 0.78 }, alpha: 0.8 },
      ],
      variation: { rotate: 24, shift: 12, count: 8 },
    }] },
  },

  backdrop: {
    scenes: [{
      id: "displaced-field",
      params: { noiseFrequency: 1.2, noiseAmplitude: 0.25, timeScale: 0.06, tilt: 0.4545 },
      palette: { base: { kind: "tone", at: 0.80 }, highlight: { kind: "tone", at: 0.56 } },
    }],
  },

  mark: {
    mode: "split",
    gradients: [{ stops: [
      { offset: 0, color: { kind: "tone", at: 0.70 } },
      { offset: 1, color: { kind: "tone", at: 0.45 } },
    ] }],
  },
} satisfies ThemeSource;
```

Two things this example is showing deliberately:

- **All nine roles are present in the authored scheme.** `RoleMap` is
  `Record<RoleName, RoleValue>` — every role required — and §7 states that
  `mirrorDark: false` obliges the non-mirrored scheme to be complete. `edge`, `shade`, and
  `line` are easy to forget; `line` uses an `alias` because velvet has no distinct line color
  today (T9 §3).
- **`mirrorOf("dark")` is notation, not API.** In a real registry file the mirrored scheme is
  simply omitted and `mirrorDark: true` set on a `light`-authored theme. Velvet is authored dark,
  so the shape inverts: the tool emits the authored scheme under `dark`, sets
  `mirrorDark: false`, and writes the mirrored `light` map out in full — because mirroring is a
  `resolve()`-time operation on the *light* map only (T3 §1.1), and a dark-authored theme has to
  materialize its light mirror. `T9-02` does this expansion; the notation above stands in for
  ~10 lines of generated values.

Compare with the current `components/theme/config/velvet.ts`: 14 verbatim RGB triplets, one
hex `siteThemeColor`, a `backgroundKey` string with no configuration, and no dark/light
relationship. The v11 file has one hue and one chroma, with everything else expressed as a
position on that theme's own ladder plus a small deliberate deviation — so changing
`hue: 316` to `hue: 150` yields a coherent green velvet, backdrop and mark included, while
the per-role deltas preserve the chromatic character that made velvet velvet.

## 9. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `resolve` is pure: 1000 random sources × both schemes give byte-identical repeat output |
| C2 | `noUncheckedIndexedAccess` + the union make `posX` on a linear layer a type error (compile-fail fixture) |
| C3 | `themeOrder` covers every registry key exactly once (unit test) |
| C4 | `loadThemeSource` accepts all 59 lifted v1 profiles and every v2 registry theme |
| C5 | `loadThemeSource` rejects: `at` out of range, non-monotone stops, alias cycle, `;` in `RawLayer.css`, unknown `kind` — with a specific issue string each |
| C6 | `mirror(mirror(roles)) === roles` |
| C7 | Adding a theme requires exactly two edits: one new file, one line in `registry/index.ts` (+ one in `themeOrder`) — verified by review |
| C8 | `ThemeSource` is JSON round-trippable: `loadThemeSource(JSON.parse(JSON.stringify(t)))` equals `t` for every registry theme |
