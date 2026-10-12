# P1 — Rendering architecture

Resolves F-35, F-41, F-66, F-67. Cross-cutting; the other `perf/` documents apply it to specific
engines.

## 1. The rule

**Nothing re-renders for a change it cannot show.** Stated as three obligations:

1. **Continuous visual state is imperative.** Pointer-driven values (drag position, scrub
   position, scroll offset, swipe offset) are written to the DOM inside a
   `requestAnimationFrame`-coalesced writer and committed to a store once, on gesture end.
2. **Cross-cutting values travel as CSS custom properties.** Theme, surface alpha, reading blur,
   backdrop palette. A CSS variable reaches every element at once with no React involvement.
3. **Subscriptions are per-value.** A store selector, never a whole object; a context for stable
   handles, never for data.

Today the codebase violates all three: window drag writes React state per pointer move (F-43),
the theme is an inline `style` object on a wrapper (F-02), and 115 files subscribe to a
40-field settings object (F-35).

## 2. Server/client boundary

236 of 464 components are `"use client"`. Target ≤ 120.

The reductions available, in order of size:

| Change | Files moved to server | Mechanism |
| --- | --- | --- |
| Theme via CSS properties, not context | ~30 | A component that only *reads* theme colors reads them from CSS. No hook, no client boundary. |
| Icons | ~130 → shared | 130 icon components are pure SVG with a `className`. None needs `"use client"`. Several currently have it transitively via `ImageIconProps` living in a client file. |
| Document rendering | ~8 | `DocumentView` is a server component; only interactive directives are client (D2 §3) |
| Settings-derived class names | ~15 | Where a preference only picks a class, mirror it to a `data-` attribute on `<html>` (D5 §6) and select in CSS |
| `Mark` | 1 + all its wrappers | T7 §2 |

The fourth is worth naming because it recurs: `ReadingContentProcessor` is a client component
whose entire job is `settings.disableSerifFont ? "font-main" : "font-serif"` — plus a
`useEffect` that runs `highlight.js` over the DOM. Under D2 highlighting happens at parse time,
and under D5 §6 the serif preference is on `<html data-serif>`, so the component disappears and
its subtree (the whole article body) becomes server-rendered.

Rule for new code: a component gets `"use client"` only for event handlers, browser APIs, or a
store subscription. If it is `"use client"` because its *parent* is, it is in the wrong file.

## 3. Store discipline

Per D5. The lint rule that makes it real:

```js
// eslint.config.js — flat config. The repo has `.eslintrc.json` with eslint 9, which still
// works in compat mode; FN-11 migrates it, because flat config is where plugin support is going.
// no-restricted-syntax
{
  "selector": "CallExpression[callee.name=/^use(Settings|Theme|Windows|Notifications|Workspace)$/][arguments.length=0]",
  "message": "Subscribe with a selector: useSettings(s => s.reading.blur)"
}
```

Plus a `useShallow` requirement for selectors returning objects or arrays, so
`useWindows(s => s.order)` is fine but `useWindows(s => ({ a: s.a, b: s.b }))` must be
`useWindows(useShallow(s => …))`.

## 4. The imperative gesture pattern

One shared primitive, used by windows (P2), the image viewer (P3), notification swipe (P4), and
the Studio's sliders and stop bar (T8).

```ts
// lib/gesture/useDragGesture.ts
export function useDragGesture(opts: {
  /** Called once on pointerdown. Return the gesture's initial context. */
  readonly onStart: (e: PointerEvent) => Ctx | null;
  /** Called at most once per animation frame. Write to the DOM here. Do not setState. */
  readonly onMove: (e: PointerEvent, ctx: Ctx, delta: Vec2) => void;
  /** Called on successful pointerup. Commit to the store here. */
  readonly onEnd: (e: PointerEvent, ctx: Ctx) => void;
  /** Called on interruption. Release temporary resources without committing a drop. */
  readonly onCancel?: (e: PointerEvent, ctx: Ctx) => void;
  readonly axis?: "x" | "y" | "both";
  readonly enabled?: boolean;
}): { readonly onPointerDown: React.PointerEventHandler };
```

Implementation requirements:

- **Pointer Events only.** `pointerdown` → `element.setPointerCapture(e.pointerId)` →
  `pointermove` / `pointerup` / `pointercancel` **on the element**. No `window` listeners, no
  `mousedown`+`touchstart` pairs, no `touchIdentifier` bookkeeping.
  `setPointerCapture` is what makes this work: the element keeps receiving events even when the
  pointer leaves it, which is the entire reason the current code attaches to `window`.
- **`touch-action`** set on the element so the browser does not also scroll. `touch-action: none`
  for both-axis drags, `pan-y` for horizontal-only.
- **One `onMove` per frame.** Coalesce with `requestAnimationFrame`; keep only the latest event.
  `e.getCoalescedEvents()` is available for high-frequency pointers where sub-frame precision
  matters (it does not here).
- **Modifier keys read from the event.** `e.shiftKey`, `e.altKey`. F-45's four window-level
  `keydown`/`keyup` listeners per window exist only because the current handlers could not see
  the pointer event. For the case where a modifier changes *during* a drag without pointer
  movement, one shared `keydown`/`keyup` listener updates a module-level ref and requests a
  recompute — one listener for the whole app, not four per window.
- **`enabled: false`** releases capture and detaches.

The October 12 interruption audit separates successful release from cancellation. Consumers may supply `onCancel` to settle or discard their own temporary resources without committing a drop. Native pointer cancellation, lost capture, element Escape, disabling, unmount, and failed capture share that idempotent release path. Continuous color controls retain their last paint and settle one owned edit; layer reorder and audio seek discard the interrupted operation. A private Studio transaction owner prevents a late field blur from ending its successor.

This single hook replaces `lib/helperHooks.ts:331-419`'s `useDragAndTouch` (89 lines, with a
`dependencies: any[]` escape hatch for its stale closures) and `useSwipe` (82 lines, four
listeners per subject).

## 5. Where React re-renders are still correct

The rule is not "never re-render". Discrete state changes should re-render:

- opening/closing a window, popup, or menu;
- changing page;
- a comment arriving;
- selecting a different gradient layer;
- toggling a preference.

The distinction: **discrete → React, continuous → DOM.** A 60 Hz stream of values is continuous;
a click is discrete.

## 6. Layout, not layout thrash

Three patterns to eliminate, all present:

**Reading geometry from the DOM when it is already in the store.**
`snapToClosestWindow` calls `getBoundingClientRect()` on every window and
`getComputedStyle().zIndex` inside nested loops (F-46), while `windowStates` holds exact
geometry and `windowOrder` holds exact z-order. Compute from state; touch the DOM never.

**Forced reflow as a synchronization device.**
`ImageViewer.tsx:316` — `container.offsetHeight;` with the comment *"Browser hack to force
update the set layout. Seems to be more robust than setTimeOut 0."* It is robust because it
synchronously flushes layout. The correct primitive is to not fight the transition system: use
Web Animations (`element.animate()`), which has explicit `finished` promises, or View
Transitions, which handle the before/after snapshot itself.

**Animating layout-affecting properties.**
`ToastCardColumnMember` transitions `max-height` (F-57), which relayouts every frame.
`@starting-style` + `transition-behavior: allow-discrete` animate entry/exit without touching
layout; `interpolate-size: allow-keywords` handles genuine `auto`-height transitions where they
are required.

## 6a. One stacking model

Six hardcoded z-index tiers across six files (F-70) become one `@theme` block in
`styles/layers.css`, and nothing outside it names a z-index. P2 §0 owns the table. It is a
rendering-architecture concern rather than a styling one because it is what decides whether a
popover can open inside a modal — which today it cannot, and which the theme Studio's color picker
requires (T8 §3.1).

Where the platform's top layer applies — `<dialog showModal()>`, `popover` — use it, and let
invocation order do the stacking. The z-index table governs only the remainder.

## 7. Bundle boundaries

**Registries that instantiate their contents are the problem.** Four exist:

| Registry | Cost today |
| --- | --- |
| `windowEntryMap` (F-48) | 16 widgets as JSX at module scope: blog reader → markdown pipeline; three.js favicon; calculator; two iframes. Anything importing `useWindow` pulls all of it. |
| `backgroundAnimationMap` (F-15) | 36 scenes as JSX at module scope, including all 5 three.js scenes. Every visitor downloads three.js. |
| `commonComponentsMap` (F-23) | 6 theme-editor components. Importing the markdown parser pulls in the theme editor. |
| Popup `content: ReactNode` (F-71) | Twelve call sites construct their overlay content eagerly as a prop, so a route pays for an overlay nobody opened. Becomes `{ kind, props }` against a lazy registry (P2 §10.1). |

All four become **lazy descriptor registries**: the registry holds metadata plus a
`() => import(...)` loader, resolved with `React.lazy` inside `Suspense`. Metadata (title, icon,
default geometry, schema) must be statically available for pickers, so it stays eager; the
component does not.

```ts
export const windowDefinitions = {
  blog: {
    title: "Blog Article",
    icon: BlogIcon,                        // small, eager
    geometry: { … },
    load: () => import("./blog/BlogWindow"),   // lazy
  },
  // …
} satisfies Record<string, WindowDefinition>;
```

Measured target: a blog article route's client JS ≤ 60 % of current (gate S11).

## 8. Repository layout

F-66 and F-67 are rendering-architecture problems, not tidiness problems.

**Ambient global types** (`interfaces/**`, 20 files, no imports or exports) mean ~90 type names
are in scope everywhere. There is no module graph, so there is nothing to tell you that a client
component depends on a type declared next to server-only code — and nothing to prevent the
reverse. Conversion to real modules (`02-conventions §3`) makes the dependency direction visible
and enforceable by `eslint-plugin-import`'s `no-restricted-paths`.

**121 non-route files in `app/design/theme-maker/`** mean route-level code splitting cannot
distinguish the Studio from the design page. Moving them to `features/theme/studio` and leaving
`app/` as routes only lets Next split on the boundary that actually matters.

## 9. Measurement

The gates are meaningless without a way to check them, so this is part of the workstream, not an
afterthought.

```
tools/perf/profile.ts <scenario>
```

Scenarios, each scripted with Playwright + the React DevTools profiling build:
`theme-switch`, `window-drag`, `window-resize`, `stop-scrub`, `hue-drag`, `image-page`,
`toast-burst`, `route-nav`, `comment-post`.

Each records: React commit count, commit durations, long tasks, layout count, style
recalculations, and `localStorage` write count. Output is a JSON baseline committed under
`tools/perf/baselines/`, and CI fails a PR that regresses a scenario by more than 15 %.

Capture baselines **from the current `main`** before any refactor begins — that is task `P1-01`,
and it is the first task in the whole program after the audit, because without it every "no
re-render" claim is unverifiable.

## 10. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `"use client"` files ≤ 120 |
| C2 | Lint rule rejects selector-less store hooks; 0 violations |
| C3 | `useDragAndTouch` and `useSwipe` deleted; all dragging uses `useDragGesture` |
| C4 | 0 `mousedown`/`touchstart` pairs for the same interaction; 0 `touchIdentifier` bookkeeping |
| C5 | 0 `getBoundingClientRect` calls in the window engine |
| C6 | 0 forced-reflow reads (`offsetHeight`/`offsetWidth` used as a flush) in `src/` |
| C6a | Every z-index originates in `styles/layers.css` (P2 C13) |
| C7 | `interfaces/` deleted; `no-restricted-paths` enforces `app → features → ui → lib` |
| C8 | `app/` contains only route files |
| C9 | All four registries lazy-load their components; three.js absent from the initial bundle for a DOM-only theme; the album route does not load the entry reader until a tile is clicked |
| C10 | All nine perf scenarios have committed baselines and pass their gates |
| C11 | Blog article route client JS ≤ 60 % of the pre-migration baseline |
