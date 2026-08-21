# T8 — Theme Studio

Resolves F-38, F-58 – F-61. Location: `src/features/theme/studio/`.

121 files today. The count is not the problem; the architecture is. Every editor gesture
writes the global settings object, which stringifies 41 fields to `localStorage` and
re-renders 115 subtrees — at pointer-event rate during a color-picker drag.

## 1. The four architectural changes

**1 — A draft store, separate from settings.**
The theme being edited lives in `studioStore`, not in `settings.customThemeData[index]`.
Persistence to settings is debounced (300 ms trailing) and account sync is debounced further
(2 s idle, flushed on `pagehide` via `sendBeacon`). A drag writes to memory only.

**2 — Preview by custom property, not by React.**
The preview path is `resolve → compile → applyProperties` on the preview root, coalesced to one
`requestAnimationFrame` (T4 §5). Scrubbing a gradient stop re-renders **one** component: the
control that owns the value. Gate S4.

**3 — Granular selectors.**
Every control subscribes to exactly the value it edits:
```ts
const at = useStudio(s => s.draft.surfaces.widget.layers[i].stops[j].at);
```
Not `useStudio(s => s.draft)`. The five editor contexts (`ColorPanelContext`,
`GradientDataContext`, `AccentColorContext`, `GradientStopsPositionContext`,
`FaviconEditorContext`) collapse into store slices plus small non-data contexts for
selection state.

**4 — Structural sharing instead of `structuredClone`.**
`immer`'s `produce` inside the store. `GradientDataContext.updateGradientProperty` currently
clones the selected layer *and* the whole layer array on every property change, and four
sibling mutators clone twice more. With `produce`, a stop-position change allocates one stop
object and the spine above it.

## 2. Store shape

```ts
type StudioState = {
  readonly draft: ThemeSource;
  readonly baseline: ThemeSource;        // for dirty-check and revert
  readonly selection: {
    readonly scheme: Scheme;
    readonly role: RoleName | null;
    readonly surface: SurfaceRole;
    readonly layerId: LayerId | null;
    readonly stopIndex: number;
    readonly markRegion: 0 | 1 | 2;
  };
  readonly history: { readonly past: readonly Patch[][]; readonly future: readonly Patch[][] };
};
```

`immer` patches give undo/redo for free — a feature the current editor lacks entirely despite
being a full editor. `history` stores patch arrays, not snapshots, so 200 steps of history cost
kilobytes rather than megabytes.

### 2.1 Index clamping without state

F-38: `GradientDataContext` clamps `layerIndex` and `gradientStopIndex` by calling
`setLayerIndex` **from inside a `useMemo`**. `FaviconEditorContext` does the same. Clamping is
a read-time operation:

```ts
const layer = useStudio(s => {
  const layers = s.draft.surfaces[s.selection.surface]?.layers ?? [];
  return layers.find(l => l.id === s.selection.layerId) ?? layers[0] ?? null;
});
```

Selecting by **id** rather than index removes the whole class of problem: deleting layer 2 does
not require re-deriving anyone's index, and `LayerId` is already in the schema (T3 §3) for
exactly this reason.

## 3. Editing the ramp

This is new UI, and it is the point of the whole exercise. The current editor lets you set four
RGB values. The v11 editor lets you shape a ramp.

### 3.1 The color picker is one popover, invoked — not a panel, embedded

This is the structural change to the editor, and it is worth more than any individual control.

**Today.** The picker is *inline*. `ColorEditorPanel` composes a mode selector plus one of
`AccentPalettePicker` / `ColorShadePicker` / `ColorCodePicker`, and that whole assembly is
duplicated into every place a color is edited — accent roles, gradient stops, favicon stops,
outline color — via four near-identical "panel props generator" components
(`AccentColorPanelPropsGenerator`, `GradientPanelPropsGenerator`,
`FaviconColorPanelPropsGenerator`, `GradientEditorStopsPositionPropsGenerator`). `react-colorful`
appears at five call sites with a shared `colorful-style.css` overriding its internals. Editing a
color means a large permanent region of the sidebar is a color picker, whether or not you are
editing a color.

**v11: one picker, one instance, summoned to a swatch.** The model is macOS's color panel —
a single system-wide picker that attaches to whatever asked for it.

```ts
// features/theme/studio/color/useColorPicker.ts
export type ColorTarget = {
  /** Where the picker anchors. */
  readonly anchor: React.RefObject<HTMLElement>;
  /** Current value, in the vocabulary the target actually speaks. */
  readonly value: ColorRef;
  /** Which authoring modes make sense here. A ramp stop may reference a tone; a
   *  favicon stop may not. */
  readonly allow: readonly ColorMode[];
  readonly onChange: (next: ColorRef) => void;
  /** Called once on commit, for history coalescing (§2). */
  readonly onCommit?: () => void;
  readonly label: string;                 // for the popover's accessible name
};

export type ColorMode = "tone" | "role" | "oklch" | "hex" | "palette" | "eyedropper";

/** Opens the single picker against this target. Returns a stable handle. */
export function useColorPicker(target: ColorTarget): { readonly open: () => void };
```

A call site becomes a **swatch button** and nothing else:

```tsx
const ref = useRef<HTMLButtonElement>(null);
const { open } = useColorPicker({ anchor: ref, value: stop.color, allow: ["tone", "oklch", "hex"],
                                  onChange: setStopColor, label: `Stop ${i + 1} color` });
return <ColorSwatch ref={ref} value={stop.color} onClick={open} />;
```

`ColorSwatch` is ~30 lines. The four "panel props generator" components and the mode-selector
plumbing are deleted — roughly 20 files.

**Mechanics.**

- **One mounted instance**, rendered by `StudioRoot`, driven by `colorPickerStore`
  (`{ target: ColorTarget | null }`). Opening a second target retargets the same popover, which is
  what makes it feel like the macOS panel rather than a menu.
- **Native `popover` + CSS anchor positioning.** `popover="auto"` gives light-dismiss, `Escape`,
  top-layer stacking, and focus restoration from the platform; `position-anchor` /
  `position-area` tether it to the swatch with automatic flipping near a viewport edge. Where
  anchor positioning is unavailable it falls back to a fixed offset from
  `anchor.getBoundingClientRect()` — one branch, measured once on open, not on scroll.
- **It sits at `--z-tooltip`** (P2 §0), above overlays, so the picker works when the Studio is
  itself inside a modal or a window. Today it could not: an embedded panel is clipped by its
  scroll container, which is why the current editor has to reserve permanent space for it.
- **Mode is a property of the target, not of the picker.** `allow` decides which tabs appear, so a
  ramp stop offers `tone` (stay on the ladder) while a favicon stop offers only `oklch`/`hex`
  (SVG cannot reference a tone). The current global `colorPickerMode` in `ColorPanelContext` —
  one mode shared by every picker on the page — disappears.
- **Live preview during drag, one history entry on close.** The picker writes through `onChange`
  at pointer rate into the draft store; `onCommit` fires once, so a hue drag is one undo step
  (§2), not two hundred.

**The picker's own controls** replace `react-colorful`, which cannot express the v11 model: it
offers RGB/HSL/HSV, and its saturation axis is HSV saturation — the quantity T2 §1 exists to stop
using.

- **Hue wheel** — a conic-gradient ring, pointer-driven, painted
  `oklch(0.65 <Cmax(0.65,h)> h)` around its circumference, so the ring shows achievable color
  rather than sRGB primaries.
- **Lightness × relative-chroma pad** — a 2D field whose *right* edge is `relC = 1`, the gamut
  boundary at that lightness and hue. The pad therefore has **no unreachable corner**, which no
  off-the-shelf picker provides and which is the whole reason to write one: out-of-gamut is not
  representable, so there is nothing to clamp and no surprise.
- **Tone rail** — when `allow` includes `tone`, a rail showing the current theme's ramp with the
  value's `t` marked. Dragging it keeps the color *on the ladder*; leaving the rail converts to
  an explicit deviation. This is the control that makes T2's model authorable rather than
  theoretical.
- **Numeric fields** — L, C, h, plus hex and `oklch()` in and out, through the existing
  `useInputParser`.
- **Eyedropper** — `EyeDropper` API where available (Chromium), hidden where not.

`react-colorful` and `colorful-style.css` are removed. Sized into `T8-04`.

**The seed panel.** Hue wheel, chroma slider (0–1, *relative*, so 1.0 means "as saturated as
this hue and lightness allow"), torsion slider. Three controls that restyle the entire theme
coherently — palette, surfaces, backdrop, and mark together, because all of them reference
tones (T3 §4, T5 §6, T6 §3, T7 §1).

**The ramp editor.** A horizontal strip showing the sampled ramp, with the nine role markers
positioned along it at their `t`. Dragging a role marker changes its `t`. Right-click adds a
control stop. Selecting a stop reveals lightness / chroma-delta / hue-delta / literal
controls — the three authoring modes of T2 §5.5, presented as three tabs on one stop rather
than as three separate concepts.

**The curve editor.** `ease` and `envelope` as named presets in a dropdown (`default`,
`linear`, `contrast`, `soft` / `flat`, `dusty`, `vivid`), plus `lightest`/`darkest` endpoints.
Custom curves are not user-authorable — they are functions, and T3 §7 forbids functions in
serialized sources for security and portability reasons. A preset list covers the intent.

**Contrast reporting.** For each of the six text-on-surface pairs that actually occur in the
product, show WCAG 2.x ratio and APCA Lc, with the AA/AAA thresholds marked. Reported, never
enforced (T1 §8). This is the first time the Studio will tell an author that their theme is
unreadable, which is a meaningful gap today.

## 4. Layer and stop editing

The gradient editor is good and survives. Changes:

- **Layer list keyed by `LayerId`** with drag-reorder, duplicate, and enable toggle. Today
  `disabled?: boolean` on the layer plus a filter at compile; keep that, but the toggle is now
  a store patch rather than a settings write.
- **Kind switching is a conversion, not a mutation.** Changing a layer from `linear` to
  `radial` builds a new layer of the target kind, carrying over stops and interpolation and
  filling geometry from the kind's defaults. Under the discriminated union there is no other
  option, which is an improvement: today switching type leaves stale `posX`/`angle` on the
  object, and `profileOptimizeTool` exists partly to clean up after it.
- **Stops in authoring order.** Sorting happens in the compiler (T4 §3). Today
  `optimizeExportedProfile` sorts stops in place as a side effect of exporting, silently
  reordering the user's list.
- **Extended stop range** (`allowExtendedGradientStopsRange`, −300 to 400) retained. The
  dynamic-bounds logic in `GradientStopsPositionContext` (`adjustDynamicValue` walking in steps
  of 50 to find a bound) is replaced by
  `bounds = niceRange(min(stops.at), max(stops.at), 50)` — one pure function, tested.

## 5. Generated controls for backdrops

Because a scene declares a Zod `schema` (T6 §2), the Studio can generate its controls:

```ts
// studio/controls/fromSchema.tsx
export function ControlsFromSchema<P>({ schema, value, onChange }: …): ReactNode;
```

Supported leaves: `number` (slider, from `.min()`/`.max()`/`.step()` metadata), `boolean`
(switch), `enum` (segmented control), `ColorRef` (the color panel), and `object` (a group).
A scene that needs a bespoke control exports an optional `Controls` component and the generator
defers to it.

This is what makes O4's "no configuration within each" actually solved rather than merely
possible: a scene author adds a parameter to the schema and the editor grows a control.

## 5.1 Theme-from-image

`lib/themeMaker/imageColorAnalysisTool.ts` uses `node-vibrant` to return two RGB triplets
(`Vibrant`, `DarkVibrant`), which `intelligentlyGenerateThemeConfig` then turns into a full
`ThemeDataConfig` via two shade maps. The endpoint survives (`POST /api/v1/tools/image-palette`,
D3 §2) but its **output contract changes**, and this is easy to miss because the endpoint's path
does not:

```ts
// was: { vibrant: ColorTriplet, alternate: ColorTriplet }
// now:
export type ImagePaletteResult = {
  readonly seed: { readonly hue: number; readonly chroma: number; readonly torsion: number };
  readonly scheme: Scheme;
  /** Suggested role positions, so the Studio can offer a complete theme rather than two colors. */
  readonly roles: Partial<RoleMap>;
  /** For display: the extracted swatches, so the user can see what it read. */
  readonly swatches: readonly Oklch[];
};
```

Derivation, server-side: decode `node-vibrant`'s swatches to `Oklch`; `hue` is the
chroma-weighted circular mean; `chroma` is the mean relative chroma; `scheme` is `dark` if the
dominant swatch has `L < 0.5`; role positions come from `defaultLightRoles` (or its mirror),
nudged so that `accent` lands on the most chromatic swatch. That is the same arithmetic as T9 §2
steps 4–5, so it shares `model/lift-v1.ts`'s helpers rather than reimplementing them.

`node-vibrant` is **retained** — it does k-means on the image, which nothing here replaces.
`intelligentlyGenerateThemeConfig` and its two `generateShadeMap` calls are deleted.

## 6. What the Studio does not do

- **It does not host the editor UI through the markdown pipeline.** F-61: today
  `lib/markdownParser.tsx` registers `themeAccent`, `themeGradient`, `themeProfile`,
  `themeFavicon`, `themeMisc`, `themeSidebar` so that S3-hosted markdown can embed the editor,
  `app/design/theme-maker/page.tsx` is an empty function, and the real UI lives in `layout.tsx`.
  In v11 the Studio is a route (`app/design/theme-maker/page.tsx`) composed from
  `features/theme/studio`. The document pipeline's component registry (D2 §4) keeps only
  content components — no editor internals — which also stops the markdown parser from pulling
  the theme editor into every bundle that touches it.
- **It does not own persistence.** It reads and writes `settings.themeProfiles` through the
  settings store's API (D5 §3). Profile add/remove/reorder/import/export live there, so the
  same operations work from the settings panel and from the window widget.
- **It does not have a second implementation for the window widget.**
  `ThemeMakerWindowToolset` becomes the same component tree at a different size.

## 7. Acceptance

| # | Criterion |
| --- | --- |
| C1 | Scrubbing a gradient stop for 3 s re-renders exactly 1 component (Profiler), and performs ≤ 1 `compile` per frame |
| C2 | Scrubbing for 3 s performs 0 `localStorage` writes; exactly 1 after 300 ms of idle |
| C3 | Dragging the hue wheel visibly recolors palette, all surfaces, the mark, and a running r3f backdrop |
| C4 | Undo/redo across 100 mixed operations returns the draft to a deep-equal earlier state |
| C5 | No `structuredClone` in `features/theme/studio` |
| C6 | Deleting a layer preserves the selection of an unrelated layer (id-based selection) |
| C7 | `ControlsFromSchema` renders working controls for every registry scene's schema |
| C8 | Contrast panel shows WCAG + APCA for six pairs and updates within one frame of a change |
| C9 | The Studio route's client JS excludes `features/theme/registry` scene modules not in use |
| C10 | Switching a layer's kind preserves stops and interpolation and leaves no field of the previous kind on the object |
| C11 | `react-colorful` is absent from `package.json`; the picker's chroma axis is relative, and its pad has no unreachable region at any hue or lightness |
| C12 | Exactly **one** picker instance is mounted regardless of how many swatches exist; opening a second swatch retargets it (assert one `[popover]` node) |
| C13 | The picker is operable when the Studio is inside a window and inside a modal overlay — the F-70 case |
| C14 | A hue drag produces one undo entry, not one per frame |
| C15 | `allow: ["oklch","hex"]` on a favicon stop offers no tone tab; `allow` including `tone` shows the tone rail |
| C16 | The four `*PanelPropsGenerator` components and `ColorPanelContext` are deleted |
