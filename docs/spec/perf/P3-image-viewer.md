# P3 — Image viewer

Resolves F-49 – F-53, F-68. Location: `src/features/media/`.

787 lines, 17 `useState` hooks, one leaked event listener per wheel event, and a carousel
implemented with manual translate arithmetic. Almost all of it is now a platform feature.

## 1. Paging is CSS scroll snap

F-51: the current carousel maintains `horizontalTranslation`, `containerTransition`,
`touchInitialX`, `touchInitialShift`, `canPerformGestureFlip`, `wasPreviouslyScrolling`,
`hasScrollingHitBoundary`, `initialScrollDeltaY`, and `initialPinchDistance` in React state,
plus a `wheel` handler that integrates `deltaX` into a translate percentage and a
`setTimeout`-based "did the user stop scrolling" heuristic.

```css
.track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.slide { scroll-snap-align: center; }
```

That is the whole paging mechanism. It brings, for free and correctly:

- native touch momentum and rubber-banding, per platform;
- trackpad two-finger swipe, including the "keep scrolling to continue" behavior the
  `wasPreviouslyScrolling` heuristic approximates;
- keyboard `Home`/`End`/arrow scrolling on a focused scroller;
- correct behavior when the viewer is inside another scroller (`overscroll-behavior-x: contain`),
  which the current implementation gets wrong — its `wheel` handler calls `preventDefault()`
  whenever `deltaX !== 0`, so a horizontal trackpad gesture over a viewer inside a scrollable
  window is swallowed;
- accessibility: a scroll container is focusable and announced.

Page index comes from `scrollend`:

```ts
const onScrollEnd = () => setPage(Math.round(track.scrollLeft / track.clientWidth));
```

`scrollend` is Baseline 2024 (Chrome 114, Firefox 109, Safari 18.2). Fallback for older Safari:
an `IntersectionObserver` at `threshold: 0.6` over the slides, which is a five-line
`useScrollSnapIndex` hook with the same output. Feature-detect with `"onscrollend" in window`.

Programmatic navigation is `track.scrollTo({ left: i * w, behavior: "smooth" })` — and honours
`prefers-reduced-motion` by passing `behavior: "instant"`, which the current 0.2 s transform
transition does not.

**Deleted:** `handleScroll` (79 lines), `handleFlipStart`/`handleFlipMove`/`handleFlipEnd`
(78 lines), `goToPage`'s `transitionend` orchestration, `setButtonVisibility`,
`containerTransition`, `horizontalTranslation`, and the five gesture-state hooks.

### 1.1 The leaked listener

F-49, quoted because it is the clearest single defect in the codebase:

```ts
// inside the wheel handler
const clearPageWindow = () => { if (!hasScrollingHitBoundary) clearTimeout(timeoutId); };
imageContainerRef.current?.addEventListener("wheel", clearPageWindow);
```

Added on every wheel event, never removed. Scrolling through a gallery for a few seconds attaches
hundreds of permanent listeners, each capturing a stale `timeoutId` and a stale
`hasScrollingHitBoundary`. It goes away with the handler.

## 2. Grid view is a View Transition

F-52: `enableGridView`/`turnOffGridView` iterate `container.childNodes`, assign `node.style.*`
including `zIndex`, force a reflow with `container.offsetHeight;` (commented *"Browser hack…
Seems to be more robust than setTimeOut 0"*), and sequence the animation through nested
`transitionend` listeners.

```tsx
const toggleGrid = () => {
  if (!document.startViewTransition) { setGrid(g => !g); return; }
  document.startViewTransition(() => { setGrid(g => !g); });
};
```

Each slide carries `style={{ viewTransitionName: `slide-${i}` }}`. The browser snapshots
before and after and morphs each named element between its carousel position and its grid cell.
This is exactly the effect the 100 lines of imperative code approximate, with correct
interruption handling and no reflow hacks.

`document.startViewTransition` is Chrome 111+ and Safari 18+; Firefox shipped same-document view
transitions in 2025. The guard above is the entire fallback: without it the state flips and CSS
transitions handle the crossfade. Progressive enhancement, no polyfill.

Grid layout is `grid-template-columns: repeat(auto-fit, minmax(0, 1fr))` with
`aspect-ratio` on the cells — replacing `calculateGridViewTransformStyle`, which computes a
translate-and-scale per item with a `compensation = scale0 / scale` correction factor.

Pinch-to-zoom-out into grid (currently `wheel` + `ctrlKey` delta integration, plus two-finger
touch distance tracking) becomes: `wheel` with `ctrlKey` and negative `deltaY` past a threshold,
and a two-pointer pinch via `useDragGesture`'s multi-pointer mode. Both are enhancements over the
button, which remains the primary affordance.

## 3. Images

F-53 and F-68 compound into the largest byte-weight problem on the site.

```tsx
<Image src={src} priority={true}
       height={Math.min(2500, Math.round((2500 / widthRatio) * heightRatio))}
       width={Math.min(2500, Math.round((2500 / heightRatio) * widthRatio))} />
```

- `priority={true}` on **every** image in **every** viewer means every image gets
  `fetchpriority="high"` and a `<link rel="preload">`. An album page renders one viewer per entry.
- `next.config.ts` has `images.unoptimized: true` with the comment *"turning this on for now since
  limit reached"*, so those are full-resolution originals.
- Dimensions are guesses derived from one shared aspect-ratio string (F-25).

Fixes:

| Problem | Fix |
| --- | --- |
| Guessed dimensions | `ImageAsset.width`/`height` (D1 §3), real values |
| Everything preloaded | `priority` only on the first slide of the first viewer above the fold; `loading="lazy"` elsewhere; `fetchPriority="low"` for off-screen slides |
| Full-resolution originals | see §3.1 |
| No placeholder | `placeholder="blur"` with the migrated LQIP |
| Wrong `sizes` | explicit `sizes` per context (full-width reading, album masonry column, window) |

### 3.1 Image delivery

`unoptimized: true` exists because Vercel's image-optimization quota was exhausted. The options,
with costs:

1. **Pre-generate responsive derivatives at migration time** and store them in S3 alongside the
   originals: 4 widths (640, 1080, 1920, 2560) × AVIF + WebP. Serve with a plain `<img srcset>`
   or `next/image` with a custom `loader`. Cost: one-time compute plus ~6× storage on ~1 200
   images. At S3's $0.023/GB-month, and with the album's current footprint, this is a few cents a
   month. **Recommended.**
2. Keep `unoptimized` and rely on `srcset` over the pre-generated derivatives without
   `next/image`. Equivalent outcome, one fewer abstraction.
3. Re-enable Vercel optimization with a lower cap. Reintroduces the quota problem.

Option 1 or 2 — decide in task `P3-02` on measured storage cost. Both require the same
derivative-generation step, which is added to `tools/migrate/entries` (D6 §3) since it is already
`HEAD`-ing and reading every image to get dimensions.

This is the single largest performance win available on the site and it is independent of
everything else in this spec.

## 4. Component structure

```
features/media/
  ImageViewer.tsx        the carousel; ~150 lines
  ImageGrid.tsx          grid mode; ~60
  ImageSlide.tsx         one image + caption; ~50
  PageIndicator.tsx      existing, retained
  Lightbox.tsx           was ExpandedImagePopUp
  useScrollSnapIndex.ts  scrollend + IntersectionObserver fallback; ~40
```

787 → ~360 lines, with the gesture arithmetic, the transition orchestration, and the alignment
padding (`imageViewerTextParser`) all gone.

State after the rewrite: `page` (from `scrollend`), `grid` (boolean), `captionHidden` (boolean).
Three, from seventeen.

## 5. Keyboard and accessibility

Current `handleKeyDown` is attached to a `<figure>` — which is not focusable, so it never fires
unless focus happens to be inside. It handles `1`–`9`, arrows, `s`, `g`, `p`.

- The track is the focus target (`tabindex="0"`), with `role="group"` and
  `aria-roledescription="carousel"`.
- Arrow keys are handled natively by the scroller. `Home`/`End` too.
- `1`–`9` jump to a slide; `g` toggles grid; `s` toggles caption; `Enter`/`p` opens the lightbox.
  Each also has a visible control — the keyboard shortcut is never the only route.
- Each slide is `role="group"` with `aria-label="Image 3 of 7"`.
- `aria-live="polite"` on a visually-hidden status element announcing the page change.
- The lightbox uses `<dialog>` with `showModal()`, which gives focus trapping, `Escape`, and
  `::backdrop` for free — replacing `PopUpDisplay`'s manual `Escape` listener and the
  `DarkOverlay` component.
- Captions currently render `text-neutral-50` on `bg-neutral-800/50` — a hardcoded palette that
  ignores the theme. They move to the `overlay` surface (T5 §2).

## 6. Acceptance

| # | Criterion |
| --- | --- |
| C1 | 0 `addEventListener` calls inside an event handler (lint rule + review) |
| C2 | Paging performs 0 `wheel` `preventDefault`; a horizontal trackpad gesture over a viewer inside a scrollable window scrolls the window when the viewer is at its boundary |
| C3 | ≤ 4 `useState` in `ImageViewer` |
| C4 | 0 `offsetHeight`-as-flush reads; 0 `node.style.zIndex` assignments |
| C5 | Grid toggle uses `startViewTransition` when available and degrades without it |
| C6 | `prefers-reduced-motion` ⇒ `behavior: "instant"` and no view transition |
| C7 | Exactly one image on a blog article route has `fetchpriority="high"` |
| C8 | Every `<img>` has correct intrinsic `width`/`height` and a `sizes` attribute |
| C9 | Album route LCP improves ≥ 40 % against baseline on Slow 4G |
| C10 | Album route transferred image bytes reduce ≥ 60 % against baseline |
| C11 | Fully operable by keyboard; axe-core clean; slide changes announced |
| C12 | 7-image viewer: 0 React commits while swiping (index commits once per settled page) |
