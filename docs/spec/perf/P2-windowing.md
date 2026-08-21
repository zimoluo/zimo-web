# P2 — Window and overlay layers

Resolves F-39, F-40, F-43 – F-48, F-70 – F-74. Location: `src/features/windows/`,
`src/features/overlays/`.

Two layers, one document, because they were built together and share every idiom: the **window
layer** (non-modal, movable, persistent) and the **overlay layer** (modal, centered, transient).
2 100 lines across `WindowContext.tsx` (675) and `WindowInstance.tsx` (1 446), plus 484 lines of
popup machinery. Neither layer's *behavior* is in question; both are built on
positionally-indexed arrays and React state updated per pointer move.

§1–§9 cover windows. **§10 covers overlays**, and §0 covers what they share.

## 0. One layer model

F-70: six stacking tiers, all hardcoded literals, in six files. `z-[11]` windows, `z-20` side
menu, `z-30` menu button, `z-50` popups *and* their dark overlay, `z-70` popup utility button,
`z-80` notifications. Nothing states the order; you grep for it.

One declaration, in `src/styles/layers.css`, and nothing outside it names a z-index:

```css
@theme {
  --z-backdrop:      0;    /* backdrop scenes sit at negative z within their own stack */
  --z-content:      10;
  --z-window:       20;    /* + instance order, + 1000 per window group (P2 §1) */
  --z-chrome:     2000;    /* navbar, context strip */
  --z-side-menu:  3000;
  --z-overlay:    4000;    /* + instance order (§10) */
  --z-notify:     5000;
  --z-tooltip:    6000;    /* popovers, the color picker (T8 §3.1) */
}
```

Gaps of 1000 so a layer can stack internally without colliding with the next. Windows and overlays
each add their instance order within their band.

Three consequences that answer questions the current code answers only by accident:

- **An overlay covers every window**, deliberately — it is modal.
- **A popover (`--z-tooltip`) covers an overlay**, so the color picker works *inside* a modal.
  Today it would not: the picker is embedded in the flow, and a `z-50` overlay would clip a
  `z-auto` panel.
- **Notifications sit below popovers and above overlays**, so a confirmation is visible over a
  modal but never eats a picker.

Elements in the browser **top layer** — `<dialog showModal()>`, `popover` — are outside the
z-index system entirely and stack by invocation order. That is the point of using them (§10), and
it means the table above governs only the non-top-layer remainder.

## 1. Normalized state

F-40: six arrays — `windows`, `windowStates`, `windowOrder`, `windowRefs`, `windowCleanupData`,
`windowSaveProps` — indexed by position. Every mutation must update all six consistently;
`removeWindowByPredicate` re-maps order values by hand and each setter carries a
`if (prev.length < prevWindows.length) return prev` desync guard.

```ts
export type WindowId = string & { readonly __brand: "WindowId" };

export type WindowInstance = {
  readonly id: WindowId;
  readonly definitionId: WindowDefinitionId;
  /** Serializable props handed to the definition's component. */
  readonly props: Readonly<Record<string, unknown>>;
  readonly rect: Rect;                    // x, y, width, height — the single geometry source
  /** Stacking group. Sticky notes sit in group 1, above everything in group 0. */
  readonly group: number;
  /** Deduplication key: a second window with the same key focuses the first. */
  readonly singletonKey?: string;
};

export type WindowsState = {
  readonly instances: Readonly<Record<WindowId, WindowInstance>>;
  readonly order: readonly WindowId[];     // last = frontmost
  readonly minimized: boolean;
  readonly tidyTarget: Readonly<Record<WindowId, Vec2>> | null;
};
```

One record, one order array. Everything the six arrays encoded is derivable:

| Was | Now |
| --- | --- |
| `windowOrder[i]` | `order.indexOf(id)` — or, for z-index, the index in `order` |
| `windowRefs[i]` | a `Map<WindowId, HTMLElement>` **outside** React state (§3) |
| `windowCleanupData[i]` | `tidyTarget[id]` |
| `windowSaveProps[i]` | `instances[id].props` |
| `windowStates[i]` | `instances[id].rect` |

`removeWindow(id)` is `delete instances[id]` plus `order.filter(x => x !== id)`. No re-mapping,
no desync guards, no possibility of arrays of different lengths.

`group` replaces `layer?: number` and the `zIndex: order + order.length * (layer ?? 0)`
arithmetic at `WindowInstance.tsx:1265`. z-index is
`group * 1000 + order.indexOf(id)`.

## 2. Definition vs instance

F-47: `WindowData.content: React.ReactNode`, so window *data* holds React elements. Because
instance data is also the persisted shape, `WindowSaveData` must `Omit` the unserializable
fields, and `requireAllDataSaved` / `specificDataKeyToBeSaved` exist to choose which of the
remaining 24 fields to persist. Restoration `cloneElement`s a shared element from
`windowEntryMap`.

```ts
export type WindowDefinition = {
  readonly id: WindowDefinitionId;
  readonly title: string;
  readonly icon: React.ComponentType<IconProps>;   // eager: pickers need it
  readonly load: () => Promise<{ default: React.ComponentType<never> }>;
  readonly geometry: GeometryConstraints;
  readonly chrome: ChromeOptions;
  readonly propsSchema?: z.ZodType<unknown>;
  readonly countsTowardLimit?: boolean;
  readonly group?: number;
  readonly singletonKey?: string;
  readonly settingsTags?: readonly SettingsTag[];   // was `tags: string[]`
};

export type GeometryConstraints = {
  readonly defaultSize: Size;
  readonly minSize?: Size;
  readonly maxSize?: Size;
  readonly aspectRatio?: { readonly min?: number; readonly max?: number };
  readonly fixed?: { readonly width?: boolean; readonly height?: boolean };
  readonly allowFullscreen?: boolean;
};

export type ChromeOptions = {
  readonly cornerRadius?: number;
  readonly blur?: boolean;
  readonly shadow?: boolean;
  readonly edgeHighlight?: boolean;
  readonly overflow?: "hidden" | "visible";
  readonly startAnimation?: "full" | "reduced" | "none";
};
```

Everything static lives in the definition; everything per-instance lives in the instance. The
persisted shape is therefore `{ id, definitionId, props, rect, group }` — five fields, all JSON —
and `requireAllDataSaved`, `specificDataKeyToBeSaved`, and the `Omit` disappear.

Restoration instantiates `<Component {...props} />` from the definition. No `cloneElement`.

`WindowData`'s 29 fields collapse to those five plus the definition's constraints. The
`tags: ["requireEntrySettings", "requireBlogSettings", "requireTableOfContentsSettings"]`
mechanism — strings a window declares so that a settings panel can decide which sections to
show — becomes a typed `settingsTags` enum, checked by the settings panel against the union.

## 3. Refs outside state

`windowRefs` is React state today (`setWindowRefs` on registration), so registering a ref
re-renders every window. It is a lookup table, not state:

```ts
// features/windows/element-registry.ts
const elements = new Map<WindowId, HTMLElement>();
export const registerWindowElement = (id: WindowId, el: HTMLElement | null) =>
  el ? elements.set(id, el) : elements.delete(id);
export const getWindowElement = (id: WindowId) => elements.get(id);
```

Used only for the imperative writer (§4) and focus management. Snapping and tidying do **not**
use it (§5).

## 4. Drag and resize

F-43: `handleDragMove` calls `setWindowState` per pointer move; because `windowStates` is one
array in a shared context, **every** window re-renders on **any** window's drag. An effect then
writes `style.width/height/left/top` imperatively anyway — so the React round-trip is pure
overhead.

```
pointerdown → setPointerCapture, read rect from store into a mutable gesture context
pointermove → (rAF-coalesced) compute the constrained rect, write
              el.style.translate / el.style.width / el.style.height
pointerup   → commit the final rect to the store once; run snap; persist (throttled)
```

Built on `useDragGesture` (P1 §4). During the gesture **zero** React renders occur and **zero**
store writes occur.

Three details:

- **Position is *always* `translate`, never `left`/`top`.** The frame's layout box sits at the
  origin and its position is expressed as `translate: <x>px <y>px`, driven from the store's
  `rect`. The gesture writes the same property directly. Because the committed store value
  produces the identical `translate`, there is nothing to reset on commit and therefore no
  one-frame jump if React's commit lands a frame late. This is also why `left`/`top` must not be
  used: they trigger layout, and mixing the two would reintroduce the reset.
- **Size still uses `width`/`height`**, which does relayout the window's *contents*. That is
  unavoidable and is why resize is the more expensive gesture. Mitigate with
  `contain: layout paint` on the frame so the relayout does not escape it.
- **Modifier keys come from the pointer event** (P1 §4), replacing the four window-level
  `keydown`/`keyup` listeners per window that are currently re-registered on every pointer move
  (F-45).

### 4.1 Constraint solver

`handleResizeMove` is ~250 lines of interleaved constraint logic (min/max size, viewport edges,
aspect ratio, center-vs-corner resizing, and an "adaptive" mode that projects a candidate result
to decide whether to switch anchor). It is correct — the behavior is good — and it is
untestable in its current form because it is fused with event handling and `setState`.

Extract verbatim, as a pure function:

```ts
// features/windows/geometry/solve-resize.ts
export function solveResize(input: {
  readonly start: Rect;
  readonly delta: Vec2;
  readonly constraints: GeometryConstraints;
  readonly viewport: Viewport;             // includes insets
  readonly anchor: "corner" | "center" | "adaptive";
  readonly lockAspect: boolean;            // shift
}): Rect;
```

Same algorithm, no events, no state, no DOM. Then unit-test it: the adaptive mode's
double-projection logic (`WindowInstance.tsx:368-431`) has four interacting branches and no
tests, which is why it is the part of the window system most likely to have latent bugs.
`solve-resize.spec.ts` covers: each constraint in isolation, each pair, aspect-ratio clamping
against min and max simultaneously, and the adaptive anchor flip in both axes.

`solveDrag` likewise, including the drag-bar-visibility clamp that keeps a window's drag handle
reachable (`WindowInstance.tsx:552-577`).

## 5. Snapping and tidying, without the DOM

F-46: `snapToClosestWindow` calls `getBoundingClientRect()` on every window, and
`isUnobstructed` calls `getComputedStyle(...).zIndex` inside a loop over all windows — itself
inside a loop over candidate sides, inside a loop over windows. `initiateWindowCleanup` has the
same shape.

Every value they need is already authoritative in the store: `rect` and `order`.

```ts
// features/windows/geometry/snap.ts
export function solveSnap(input: {
  readonly subject: { readonly id: WindowId; readonly rect: Rect };
  readonly others: readonly { readonly id: WindowId; readonly rect: Rect; readonly z: number }[];
  readonly viewport: Viewport;
  readonly options: { readonly toWindows: boolean; readonly toViewport: boolean };
}): Rect | null;
```

Pure geometry. The "shoulder" secondary snapping and the obstruction test (a candidate snap edge
is rejected if a higher-z window covers it) are preserved exactly — they are good behavior —
but expressed as rectangle intersection over `others`, which is what `getComputedStyle` was
approximating.

`solveTidy` likewise for the bin-packing broom, replacing the `getMinWidth(data, ref)` that falls
back to `ref.current?.offsetWidth` when width adjustment is disabled. Under the new model,
`fixed.width` windows have their `defaultSize.width` in the definition, so no DOM read is needed.

`viewport` carries **insets** rather than the four module constants
(`windowSoftTopBorder = 72`, etc.) that duplicate the navbar's height as a magic number. Insets
are derived from the actual chrome height, exposed as a CSS variable and read once.

## 6. Persistence

F-39: `saveWindows` nests four `setState` updaters to read four pieces of current state, writes
into a fifth state (`windowSaveDataBuffer`), and an effect drains that into `updateSettings`.
It is called on drag end, resize end, activation, mount, and tidy.

With a store, reading current state is `windowStore.getState()`. Persistence is
`zustand/persist` with a 500 ms throttled storage (D5 §4) into its own key `zw.windows`, so a
window drag no longer rewrites 16 theme profiles.

Restore-on-load scales the persisted viewport to the current one — keep that, it is good — but
drops any instance whose `definitionId` is unknown, and validates `props` against
`propsSchema`. Today an unknown `saveComponentKey` is filtered
(`WindowContext.tsx:548-552`) but `initialProps` are spread unvalidated into `cloneElement`.

## 7. Component structure

```
features/windows/
  store.ts                       WindowsState + actions
  element-registry.ts
  definitions/
    index.ts                     lazy descriptor registry (P1 §7)
    blog.ts  photos.ts  …
  geometry/
    solve-drag.ts  solve-resize.ts  solve-snap.ts  solve-tidy.ts  + specs
  ui/
    WindowLayer.tsx              positions every window; subscribes to `order` only
    WindowFrame.tsx              chrome; subscribes to its own instance only
    WindowContent.tsx            Suspense + lazy definition component
    WindowDragBar.tsx  WindowResizeHandle.tsx  WindowCloseButton.tsx
    WindowPicker.tsx
```

`WindowInstance.tsx`'s 1 446 lines become: `WindowFrame` ~120, `WindowDragBar` ~60,
`WindowResizeHandle` ~50, `WindowCloseButton` ~50, plus four pure solvers totalling ~400 with
tests. The inline SVGs for the close button — two 500-character path strings selected by
`isCloseButtonActive`, where the "inactive" variant is a *degenerate* path with all control
points collapsed so it morphs — move to a component with a CSS-driven morph.

`WindowLayer` subscribes to `order` **only**. Adding a window re-renders `WindowLayer` and mounts
one `WindowFrame`; it does not re-render existing frames. Each `WindowFrame` subscribes to
`instances[id]`.

## 8. Accessibility

Currently: a window is a `div` with an `onMouseDown`; the drag bar is a `div`; the close button
is a `button` with no accessible name; there is no focus management, no keyboard move/resize, and
no announcement when a window opens.

Minimum for v11:

- `role="dialog"` with `aria-label={title}` on the frame; `aria-modal="false"` (these are
  non-modal windows).
- The close button gets `aria-label={`Close ${title}`}`.
- Focus moves into a newly opened window; `Escape` closes the frontmost focused window.
- The drag bar is a `<button>` with `aria-label={`Move ${title}`}` supporting arrow keys
  (1 px, 10 px with shift) and `Alt`+arrows for resize. This is ~30 lines on top of the solvers,
  which already accept a delta.
- z-order changes are not announced (they are not content changes).
- `WindowPicker` entries are already buttons; they gain `aria-describedby` for the title.

## 10. The overlay layer

`src/features/overlays/`. The modal peer of the window layer. Same store shape, same
id-addressing, and — because a modal is exactly what the platform's top layer is for — far less
code than windows need.

### 10.1 Store

```ts
export type OverlayId = string & { readonly __brand: "OverlayId" };

export type Overlay = {
  readonly id: OverlayId;
  readonly kind: OverlayKind;
  readonly props: Readonly<Record<string, unknown>>;
  /** Deduplication: a second overlay with the same key focuses the first. */
  readonly singletonKey?: string;
  /** Scrim behind this overlay. `none` for overlays that are their own surface. */
  readonly scrim: "none" | "dim" | "dim-blur";
  /** A link to the full-page equivalent, rendered in the utility cluster. */
  readonly expandTo?: string;
  /** Closed automatically below 768 px. Was `desktopOnly`. */
  readonly desktopOnly?: boolean;
};

export type OverlaysState = {
  readonly instances: Readonly<Record<OverlayId, Overlay>>;
  readonly order: readonly OverlayId[];   // last = topmost
};
```

F-71 dissolves the same way F-40 did: `index === popUps.length - 1` becomes
`order.at(-1) === id`, and `removeAllPopUpsFrom(index)` becomes `dismissAbove(id)`.

`kind` indexes a **lazy registry** exactly like `windowDefinitions` (P1 §7), so the twelve current
call sites stop passing `content: ReactNode` and start passing `{ kind, props }` — which is what
makes an overlay serializable, `props`-validatable, and out of the render tree until opened.

### 10.2 Rendering: `<dialog>`, not a fixed div

```tsx
<dialog ref={ref} className="overlay" onClose={() => dismiss(id)}>
  <Suspense fallback={<OverlaySkeleton />}><Component {...props} /></Suspense>
</dialog>
```
with `ref.current.showModal()` on mount. The platform then supplies, for free, everything
`PopUpDisplay` + `PopUpManager` + `DarkOverlay` currently hand-roll:

| Hand-rolled today | Replaced by |
| --- | --- |
| `Escape` via a window `keydown` listener re-registered on every `popUps` change | `<dialog>`'s own cancel behavior |
| `DarkOverlay`'s `fixed -inset-1/2` + `backdrop-blur-[24px]` | `::backdrop` with the `overlay` surface (T5 §2) |
| `document.body.style.overflow = "hidden"` + a `MutationObserver` re-asserting it (F-72) | `showModal()` makes the rest of the document inert and non-scrollable |
| No focus trap, no restoration (F-74) | both, from the platform |
| No `role`/`aria-modal` | implicit on `<dialog>` |
| Light-dismiss on scrim click, absent today | one `onClick` comparing `e.target === dialogRef.current` |

`DarkOverlay.tsx` is deleted, and with it the `MutationObserver` that fights
`MenuSlideWrapper`'s own `body.style.overflow` write. Nothing in v11 writes
`document.body.style.overflow`; the side menu becomes a `<dialog>` too when it is modal (below
480 px, where it already locks scroll) and a plain aside above that.

Nested overlays work because `showModal()` stacks in the top layer by invocation order. `scrim`
governs whether *this* overlay paints a `::backdrop`; a stack of three shows one scrim if only the
first requests it.

### 10.3 What stays

- **The utility cluster** (close, and "expand to page") — currently `PopUpDisplay`'s `z-70`
  absolutely-positioned cluster. Keep the affordance; it moves inside the `<dialog>` so it stacks
  with its owner instead of needing a tier.
- **`expandTo`** (was `linkToPage`) with the existing behavior: navigating clears the whole stack.
- **`desktopOnly`.** `PopUpManager`'s resize handler (`:43-75`) that closes desktop-only popups
  below 768 px is correct behavior; it becomes one `useMediaQuery` in the layer, not a `resize`
  listener that re-registers on every `popUps` change.
- **`singletonKey`** (was `contextKey`), and `appendOverlay`'s updater-form correctness — which
  `PopUpContext` already got right, unlike its toast twin (F-54).

### 10.4 Migration of the twelve call sites

| Call site | Becomes |
| --- | --- |
| `ImageViewer` → `ExpandedImagePopUp` | `kind: "lightbox"` (P3 §5 already specifies `<dialog>`; this is that) |
| `PhotosTileWrapper`, `PhotosGalleryWrapper` | `kind: "album-entry"` |
| `ProjectsTileWrapper`, `ProjectsTileGridWrapper` | `kind: "project-entry"` |
| 5 × `app/christmas-tree/*` | `kind: "tree-message"`, `"tree-confirm"`, `"tree-info"` |
| `PresetConfigButton`, `PresetConfigPopUp`, `ThemeMakerSettingsButton` | `kind: "studio-presets"`, `"studio-settings"` |

Seven kinds, all lazy. Today all twelve construct their content eagerly as a `ReactNode` prop, so
opening the album page's tile wrapper pulls the entry reader into that route's bundle whether or
not anyone clicks.

## 11. Acceptance

| # | Criterion |
| --- | --- |
| C1 | One normalized store per layer; no parallel arrays |
| C2 | Dragging a window for 3 s produces **0** React commits (gate S3) and 0 store writes until release |
| C3 | Resizing produces 0 React commits for windows other than the one being resized |
| C4 | 0 `getBoundingClientRect` and 0 `getComputedStyle` calls in `features/windows` |
| C5 | `solve-resize.spec.ts` covers each constraint in isolation, all pairs, simultaneous aspect min+max, and adaptive flip in both axes |
| C6 | `solveSnap` reproduces current snapping behavior on a 24-case fixture set derived from manual observation of the current build |
| C7 | Persisted window shape is 5 JSON fields; `requireAllDataSaved` and `specificDataKeyToBeSaved` are gone |
| C8 | Restoring a save with an unknown `definitionId` or invalid `props` drops that window and logs, without throwing |
| C9 | No `cloneElement` in `features/windows` |
| C10 | Opening a window loads only that definition's chunk (network panel) |
| C11 | A window is fully operable by keyboard: open, focus, move, resize, close |
| C12 | Window drag holds 60 fps on a 4×-throttled CPU with 5 windows open |
| C13 | Every z-index in `src/` comes from `styles/layers.css`; grep for a numeric `z-index` or `z-[` outside it returns 0 |
| C14 | Overlays are `<dialog showModal()>`: focus trapped, focus restored on close, `Escape` works with no JS listener, scrim is `::backdrop` |
| C15 | `DarkOverlay.tsx` deleted; **0** writes to `document.body.style.overflow` in `src/`; **0** `MutationObserver` on `document.body` |
| C16 | Three nested overlays show one scrim, stack correctly, and dismiss in LIFO order |
| C17 | A color-picker popover opened inside an overlay is visible and interactive (the F-70 case that fails today) |
| C18 | Opening the album route does not load the entry-reader chunk until a tile is clicked |
| C19 | Overlay `props` are validated against the kind's schema on open; an invalid overlay logs and does not open |
