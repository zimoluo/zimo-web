# U3 — Motion and accessibility

Resolves F-18. This is the largest untouched quality gap in the codebase: `prefers-reduced-motion`
appears **zero** times across 36 animated backdrops, window mount choreography, notification
sequencing, image-viewer transitions, and menu slides.

## 1. Motion tokens

Declared in a plain `:root` block, **not** in `@theme`: these are app variables, and
`02-conventions §5` keeps the `--zw-` and Tailwind token namespaces separate. Tailwind's own
`--ease-*` and duration scales are untouched.

```css
:root {
  --zw-duration-state:      150ms;   /* hover, press, toggle */
  --zw-duration-transition: 200ms;   /* enter, exit */
  --zw-duration-move:       300ms;   /* reposition, snap */
  --zw-duration-layout:     500ms;   /* large layout change, minimize */

  --zw-ease-enter:      cubic-bezier(0, 0, 0.2, 1);
  --zw-ease-exit:       cubic-bezier(0.4, 0, 1, 1);
  --zw-ease-reposition: cubic-bezier(0.37, 0.01, 0.11, 0.93);
  --zw-ease-spring:     cubic-bezier(0.34, 1.3, 0.64, 1);
}
```

The four durations and `--zw-ease-reposition` are extracted from what the codebase already uses,
so adopting them changes nothing visually. `--zw-ease-spring` is new, for the context strip.

## 2. The reduced-motion contract

**Declared once, at the point of definition** (`02-conventions §5`), not at call sites.

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --zw-duration-state:      1ms;
    --zw-duration-transition: 1ms;
    --zw-duration-move:       1ms;
    --zw-duration-layout:     1ms;
  }
}
```

`1ms` rather than `0` so `transitionend` still fires and any code depending on it does not stall.

That covers everything driven by a token — which is why **every** transition in this spec's CSS
reads `var(--zw-duration-*)` and `var(--zw-ease-*)` rather than a literal. A hardcoded `200ms`
silently opts out of the reduced-motion override; `U3-01` greps for literal `ms` values in
`src/styles/**` and CSS Modules and fails on any that are not inside a token definition.

Three categories need explicit handling beyond tokens:

**Continuous animation** (backdrops). Not suppressed — frozen. The backdrop is part of a theme's
identity and removing it entirely is a worse experience than a still frame. Handled by
`resolveQuality` returning `"still"` (T6 §4), which every scene must honour by rendering a
composed static frame.

**Parallax and scroll-driven motion.** Suppressed. `animation-timeline` rules are wrapped in
`@media (prefers-reduced-motion: no-preference)`.

**Programmatic scrolling and view transitions.** Guarded in JS:

```ts
// lib/motion.ts
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollBehavior = (): ScrollBehavior =>
  prefersReducedMotion() ? "instant" : "smooth";

export const withViewTransition = (update: () => void): void => {
  if (prefersReducedMotion() || !document.startViewTransition) { update(); return; }
  document.startViewTransition(update);
};
```

`withViewTransition` is the **only** place `startViewTransition` is called. P3 §2 and U2 §4 both
go through it, so the reduced-motion guard cannot be forgotten.

`settings.motion.transitions: "auto" | "reduced"` (D5 §3) lets a user opt into reduced motion
without an OS-level setting, applied as `<html data-motion="reduced">` with the same custom-property
overrides.

## 3. Accessibility contract

Per-surface obligations. Each is a task in the ledger, not a wish.

### 3.1 Focus

- A visible focus indicator on every interactive element:
  `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px }`. Currently there
  is no global focus style, and no component sets `outline-none` (so there is nothing to migrate there — `P5 §6`'s rename row is a no-op for this repo).
- The `accent` role exists partly for this (T1 §5): a focus ring needs a color that is legible
  against every surface, and `textMuted` (currently used for everything) is not.
- Focus order follows DOM order. No `tabindex > 0`.
- Focus is restored on close for every dismissible surface: windows, popups, the side menu, the
  palette, the lightbox.

### 3.2 Overlays

- **Every modal overlay** — the lightbox, album and project entry popups, the Christmas-tree
  dialogs, the Studio's preset and settings panels — becomes `<dialog>` + `showModal()`: focus
  trap, `Escape`, `::backdrop`, and inertness of the rest of the page, all from the platform.
  P2 §10 specifies the layer; this is the accessibility half of it. It replaces `PopUpDisplay`'s
  manual `Escape` listener, `DarkOverlay`'s `MutationObserver`, and the total absence of focus
  management (F-72, F-74).
- The command palette uses `popover="auto"`: light-dismiss, top layer, `Escape`, focus restoration.
- The side menu (`MenuSlideWrapper`) currently sets `aria-hidden={!isSideMenuExpanded}` on an
  element whose children remain focusable — so a screen-reader user tabs into hidden content.
  Use `inert` alongside `aria-hidden`, or `hidden="until-found"`.
- Non-modal windows are `role="dialog"` `aria-modal="false"` (P2 §8) and do **not** trap focus.

### 3.3 Announcements

- Notifications: `aria-live="polite"`, `assertive` for `tone: "danger"` (P4 §6).
- Image viewer page changes: a visually-hidden `aria-live="polite"` status (P3 §5).
- Comment posted / deleted: announced via the notification path.
- Theme changed: announced. This is currently silent, so a screen-reader user has no feedback that
  the action succeeded.
- Route changes: Next handles the document title; add a visually-hidden `aria-live` region
  announcing the new page name, which App Router does not do automatically.

### 3.4 Semantics

- The window drag bar is a `<button>` with `aria-label`, not a `div` (P2 §8).
- Icons are `aria-hidden` unless they are a control's only content (U1 §5).
- `ColorBlock` on `/design` reveals its label only on hover
  (`opacity-0 group-hover:opacity-100`) — the label must be present for assistive technology and
  for keyboard users; use `focus-within` as well and never rely on hover alone.
- Every form control has a programmatic label. The Studio's ~40 numeric inputs currently rely on
  adjacent text.
- `<figure>`/`<figcaption>` for images with captions; `alt` from `ImageAsset.alt` (D1 §3).

### 3.5 Color and contrast

- The Studio reports WCAG 2.x and APCA for six text-on-surface pairs (T8 §3). Reported, not
  enforced — themes are expressive, and this is the author's own site.
- **The AA gate applies to `defaultSurfaces` and to newly authored themes, not retroactively to
  the 59 migrated ones.** This is a deliberate resolution of a real collision: T9 guarantees the
  migrated themes are reproduced exactly (ΔE_OK ≤ 0.002) and `U1 §7` lists their color identity
  under "what is deliberately not changing". Nudging a role's `t` to reach AA would break both.
  So:

  | Theme set | AA for `text` on `widget` and on `page` |
  | --- | --- |
  | `defaultSurfaces` + `defaultLightRoles` | **enforced** in CI |
  | Any theme authored after v11 | **enforced** in CI |
  | The 59 migrated themes, in their authored scheme | **reported**, not enforced. A failure is a design ticket, fixed by eye, one theme at a time. |
  | The 59 migrated themes, in a *mirrored* scheme | **enforced** — a mirrored scheme is generated, not authored, so there is no identity to preserve. A mirrored scheme that fails AA does not get `darkReviewed: true` (T9 §2 step 10). |

  `tools/contrast-report.ts` emits the full 59 × 2 × 6-pair matrix on every build. The CI gate
  reads it and fails only on the enforced rows. That way the information is always visible and the
  gate is never in tension with the migration.
- No information is conveyed by color alone. `tone` on notifications carries an icon as well as a
  color (P4 §1).

### 3.6 Input

- Everything reachable by keyboard: windows (open, move, resize, close), image viewer, palette,
  Studio controls, notifications.
- Touch targets ≥ 44 × 44 px. The window close button is currently `0.95rem` (15 px) growing to
  32 px on hover — on touch there is no hover, so it is a 15 px target. Its *hit area* must be
  44 px even if its *visual* stays small.
- Gestures always have a non-gesture equivalent: swipe-to-dismiss has a close button, pinch-to-grid
  has a grid button, drag-to-page has arrows.
- `settings.motion.gestures: false` disables gesture handling without disabling the equivalents.

## 4. Verification

Automated, in CI:
- `axe-core` via Playwright on all nine routes, plus one route with a window open, one with the
  palette open, and one with the lightbox open. Zero serious/critical violations (gate S13).
- Contrast gate over the theme registry (§3.5).
- A reduced-motion assertion: with `prefers-reduced-motion: reduce` forced, no `Animation` object
  with `duration > 50ms` is running 500 ms after load, and no `requestAnimationFrame` loop is
  active (stub `rAF` and assert no callback after settle).

Manual, per release, with a written checklist in `docs/spec/exec/X4-verification.md §6`:
- Keyboard-only traversal of every route.
- VoiceOver on macOS/iOS and NVDA on Windows for: reading an article, posting a comment, opening
  and moving a window, changing a theme.
- 200 % browser zoom and 320 px viewport.
- Forced-colors mode (`@media (forced-colors: active)`) — currently untested, and the site's
  reliance on translucency makes it likely to need explicit handling.

## 5. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `prefers-reduced-motion` handled globally by token override; ≥ 1 explicit rule per §2 category |
| C2 | `startViewTransition` is called only from `withViewTransition` |
| C3 | All nine routes + 3 overlay states pass axe-core with 0 serious/critical (gate S13) |
| C4 | `defaultSurfaces`, `defaultLightRoles`, and every *mirrored* scheme meet AA for `text` on `widget` and on `page`; the 59 authored schemes are reported, and every failure has a design ticket |
| C5 | Reduced-motion assertion passes: no long animation, no live rAF loop after settle |
| C6 | Keyboard traversal completes every documented task without a mouse |
| C7 | Lightbox is `<dialog>` + `showModal`; palette is `popover`; side menu uses `inert` |
| C8 | All touch targets ≥ 44 px hit area; verified by a Playwright bounding-box audit |
| C9 | A visible `:focus-visible` indicator exists on every interactive element; 0 `outline-none` without a replacement |
| C10 | Theme change, page change, and comment post are announced |
| C11 | Forced-colors mode renders legible; documented findings and fixes |
