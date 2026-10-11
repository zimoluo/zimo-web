# U2 — The context strip

The brief: *"On wide screen there's a space between the navigation area and the utility buttons.
In the middle I originally had some Dynamic Island concept that shows relevant info expressively
based on the current content, like maybe the title of the blog, etc. But there just aren't many
things to show and it needs fluid animation to feel immersive which is virtually impossible with
bare html/css. So yeah just think about it."*

Two objections. One was correct at the time and is no longer. The other is correct as stated and
is answered by changing what the space is *for*.

## 1. Objection 1: fluid animation is impossible

This was true when the idea was formed. It is no longer, and the specific things that made it
impossible have all shipped:

| Blocker | Resolution |
| --- | --- |
| Cannot animate `width`/`height` to or from `auto` | `interpolate-size: allow-keywords` (Chrome 129+), and `calc-size()` for intrinsic targets |
| Cannot animate an element in or out of `display: none` | `transition-behavior: allow-discrete` + `@starting-style` (Baseline: Chrome 117, Safari 17.4/17.5, Firefox 129) |
| Cannot morph one element into another across a state change | View Transitions API + `view-transition-name` (Chrome 111+, Safari 18+, Firefox 2025) |
| Popovers require manual positioning and focus handling | Popover API + CSS anchor positioning |
| Scroll-linked behavior requires a JS scroll listener | `animation-timeline: scroll()` / `view()` |

The last one matters even if the strip is never built: `MenuControlContext` currently runs a
`scroll` listener with a `requestAnimationFrame` guard that calls `setIsNavbarExpanded` — a React
state change on the scroll path, feeding a context consumed by the navbar and the window layer.
Replacing it with a scroll-driven CSS animation removes React from scrolling entirely. That is
task `U2-01` and it is worth doing independently.

So: an expressive, morphing, spring-feeling strip is now buildable in CSS with a few dozen lines.
The objection is retired.

## 2. Objection 2: there is nothing to show

This one is correct — *for a status display*. A strip that shows the current article's title is
redundant (the title is on screen) and empty on eight of nine routes.

The answer is not to find more status. It is to make the space a **command surface** that also
carries status when there is status worth carrying. That inverts the value proposition: the space
earns its keep by being useful on every route, and expresses personality when the route has
something to express.

### 2.1 What it does

**Resting state** — a pill showing the current context and an affordance:

```
┌──────────────────────────────────────────┐
│  ◈  Zimo Web                       ⌘K    │
└──────────────────────────────────────────┘
```

**Contextual state** — a route or subsystem contributes content:

```
│  ▤  State and Flow of Mind      ▓▓▓▓░░ 62%  │   reading an article
│  ♪  Local Forecast — Elevator      ⏸  0:42  │   music player active
│  ▢  3 windows · Calculator            ⌃     │   windows open
│  ◐  Velvet · editing                  ⌘S    │   in the Studio
│  ✓  Theme saved                             │   transient, 2 s
```

**Expanded state** — `⌘K`, or click: the pill grows into a command palette.

```
┌──────────────────────────────────────────┐
│  ⌕  velv                                 │
├──────────────────────────────────────────┤
│  ◐  Apply theme · Velvet                 │
│  ◐  Apply theme · Velvet (light)         │
│  ▤  Blog · On Velvet and Vitreous        │
│  ▢  Open window · Theme Maker            │
└──────────────────────────────────────────┘
```

### 2.2 Why a command palette is the right occupant

Because this site has an unusual amount to command, and currently no way to reach it:

- **59 themes** and up to 16 profiles, currently reachable only via `/design` or the side menu's
  settings section.
- **16 window widgets**, reachable only through the navbar's window button → picker.
- **9 destinations**, reachable via the navbar or the menu.
- **Per-section search** exists on `/blog`, `/management`, and inside window readers — four
  separate `SearchBar` instances with four `FilterSearchProvider`s, and no global search at all.
- **Settings** — 24 preferences behind a side-menu accordion.

A palette unifies all of it. That is a genuine capability gain, not a decoration, and it is the
thing that makes the empty space worth filling.

## 3. The contribution protocol

The strip does not know about routes. Content is contributed and prioritized.

```ts
export type StripContribution = {
  readonly id: string;
  readonly priority: number;          // higher wins; ties broken by registration order
  readonly icon: React.ComponentType<IconProps>;
  readonly label: string;             // inline-mark syntax
  readonly detail?: React.ReactNode;  // progress bar, transport controls, count
  readonly action?: () => void;
  /** Auto-retracts after this many ms. Omit for persistent. */
  readonly ttl?: number;
};

/** Registers for the lifetime of the calling component. */
export function useStripContribution(c: StripContribution | null): void;
```

Priorities, fixed:

| Priority | Source |
| --- | --- |
| 100 | Transient confirmations (`ttl: 2000`) — theme saved, comment posted, link copied |
| 80 | Active media (music player) |
| 60 | Studio editing state |
| 40 | Reading progress on a long document |
| 20 | Window count, when > 0 |
| 0 | The resting identity pill |

The strip renders the highest-priority contribution. Nothing else about it is stateful.

### 3.1 The strip absorbs desktop notifications

Priority 100 is doing real work: it means a confirmation appears **in the strip**, where the user's
attention already is, instead of as a toast in the top-left corner. That resolves a live problem —
the site currently has two notification engines (P4) and the desktop banner occupies the top-left,
overlapping the navbar.

Notifications that are not confirmations (errors, warnings, anything with an action) still use the
notification layer. The rule: `tone: "neutral"` with no `action` and `duration ≤ 3000` routes to
the strip; everything else does not. One function, `shouldRouteToStrip(n)`, so the decision is in
one place.

## 4. Animation

```css
.strip {
  interpolate-size: allow-keywords;
  transition: width var(--zw-duration-move) var(--zw-ease-reposition),
              height var(--zw-duration-move) var(--zw-ease-reposition),
              opacity var(--zw-duration-state) var(--zw-ease-enter),
              filter var(--zw-duration-state) var(--zw-ease-enter);
  view-transition-name: context-strip;
}
```

- **Resting ↔ contextual**: the label changes; `width: auto` animates via `interpolate-size`.
  Content crossfades with `@starting-style` + `allow-discrete`.
- **Contextual ↔ expanded**: `document.startViewTransition`, so the pill morphs into the palette
  and the icon travels to its new position. Where View Transitions are unavailable, the palette
  fades in over the pill — acceptable, and the check is one `if`.
- **Reading progress**: `animation-timeline: view()` on the article element drives the bar's
  `scaleX`. No JS, no scroll listener, and it is frame-perfect because it runs off the compositor.
- **Reduced motion**: no width/height animation, no view transition; content swaps with a 100 ms
  opacity fade.

The strip is `popover="auto"` in its expanded state, which gives light-dismiss, top-layer
rendering, and `Escape` handling from the platform, plus focus restoration on close.

## 5. Layout

Where the space is, in the existing navbar (`components/mainPage/NavbarContent.tsx`):

```
[ mark ]  [ nav pills ]  ←──── flex-grow spacer ────→  [ window ]  [ menu ]
                              ↑ the strip goes here
```

The spacer is currently `<div className="flex-grow select-none pointer-events-none" />`.

Responsive behavior, driven by the container query the navbar already establishes
(`navbar.module.css` `container-type: inline-size`):

| Available width | Strip |
| --- | --- |
| ≥ 900 px | full: icon + label + detail |
| 780–900 px | compact: icon + label, no detail |
| < 780 px | full-width second row; moves into the destinations’ row when they collapse |

`settings.navigation.contextStrip` (D5 §3) allows disabling it. Default on.

### 5.1 `MenuControlContext` shrinks

Currently it owns `isNavbarExpanded`, `isSideMenuExpanded`, a scroll listener, and a
`matchMedia` query, and is consumed by the navbar, the window layer, and the menu. After U2-01
the store holds one boolean (`sideMenuOpen`). A shell-owned passive scroll observer tracks directional intent outside React; CSS animates the resulting state. This preserves upward reveal away from the page top.

## 6. Scope and staging

The strip is the most speculative item in this spec and it is the least load-bearing. It is
therefore staged so that value lands before risk.

| Stage | Deliverable | Independent value |
| --- | --- | --- |
| U2-01 | Track directional scroll intent outside React and animate its state in CSS; shrink `MenuControlContext` | Removes React and preference writes from the scroll path while preserving flexible navigation. |
| U2-02 | Command palette, opened by `⌘K` from anywhere, no strip | Global search + theme/window/settings commands. The largest single UX gain in this spec. Ship regardless. |
| U2-03 | The resting + contextual strip, with the contribution protocol | Fills the space; hosts reading progress and window count |
| U2-04 | Pill ↔ palette morph via View Transitions | The expressive quality the original idea was reaching for |
| U2-05 | Route confirmations into the strip | Removes the top-left toast overlap |

If U2-03 through U2-05 are cut, U2-01 and U2-02 still stand on their own. **Do not build the
strip before the palette** — the palette is what makes the strip worth having, and building the
container before the content is how this idea stalled the first time.

## 7. Acceptance

| # | Criterion |
| --- | --- |
| C1 | The shell owns one passive, animation-frame-batched directional observer; navigation scrolling performs no React updates or preference writes |
| C2 | Scrolling the blog index produces 0 React commits |
| C3 | `⌘K` / `Ctrl+K` opens the palette from every route, including inside a window |
| C4 | The palette searches: themes, profiles, window widgets, destinations, settings, and blog entries by title |
| C5 | Palette is fully keyboard-operable; `role="combobox"` + `aria-activedescendant`; axe-core clean |
| C6 | The strip renders the highest-priority contribution; a 100-priority confirmation pre-empts and retracts after its `ttl` |
| C7 | Reading progress uses `animation-timeline: view()`; no JS scroll handling |
| C8 | Compact header morph uses CSS position/inset transitions on one persistent command element, with stable focus |
| C9 | `prefers-reduced-motion` ⇒ no size animation, no view transition |
| C10 | At 390 px width the strip spans a second row and moves between the home and menu controls when destinations collapse; the palette is horizontally centered below the header and remains keyboard-operable |
| C11 | Disabling `navigation.contextStrip` removes the strip and leaves the palette working |


## 8. Fidelity revision · October 11, 2026

The user's request to restore directional navigation and keep mobile search visible supersedes the original absolute-scroll collapse and mobile strip omission. Sections 5–7 reflect this revision. The purpose of the earlier zero-listener decision was to remove React work from scrolling; that performance contract remains. Absolute scroll progress cannot represent an upward reveal far down a page or the eight-pixel direction deadband. The tiny shell controller writes presentation attributes when intent changes, observes header dimensions for window insets, and leaves interpolation to CSS. Reading progress remains a CSS scroll timeline. Implementation and effect cleanup are documented in `docs/implementation/site-fidelity.md`.
