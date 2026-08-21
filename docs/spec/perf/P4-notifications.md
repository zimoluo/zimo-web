# P4 — Notification engine

Resolves F-54 – F-57. Location: `src/features/notifications/`.

Two complete renderers (544 lines total), a queue drained by effect feedback, a dropped-toast bug,
and enter/exit animated through `max-height`.

## 1. One model

```ts
export type Notification = {
  readonly id: NotificationId;
  readonly icon: NotificationIcon;
  readonly title: string;
  readonly body?: string;                 // inline-mark syntax (D2 §5)
  readonly tone: "neutral" | "success" | "warning" | "danger";
  /** ms; null = sticky until dismissed. Default 6000. */
  readonly duration: number | null;
  /** A second notification with the same key replaces the first. */
  readonly dedupeKey?: string;
  readonly action?: { readonly label: string; readonly href: string };
};

export type NotificationsState = {
  readonly queue: readonly Notification[];   // waiting
  readonly active: readonly Notification[];  // visible, length ≤ slots
  readonly slots: number;
};
```

Additions worth naming: `tone` (currently every notification looks identical regardless of whether
it reports success or an error), `dedupeKey` (window-limit and profile-limit warnings currently
stack up identically), and `action` (a notification about a saved theme should be able to link to
it).

## 2. The queue is data, not an effect loop

F-55: `ToastCardColumnManager` runs an effect depending on `[toasts, activeToasts, slotLimit,
removeToast]` which calls `removeToast(0)` and `setActiveToasts` — re-triggering itself.
`deactivateToast` mixes a stale `activeToasts` closure with a mutable `toastsRef` read.

```ts
const promote = (state: NotificationsState): NotificationsState => {
  const room = state.slots - state.active.length;
  if (room <= 0 || state.queue.length === 0) return state;
  return { ...state, active: [...state.active, ...state.queue.slice(0, room)],
                     queue: state.queue.slice(room) };
};
```

`promote` is called synchronously inside `push` and `dismiss`. It is a pure function of state.
There is no effect, no feedback, and no intermediate render where the queue and the active list
disagree.

### 2.1 The dropped-notification bug

F-54:

```ts
setToast([...toast, processedToast]);   // ToastContext.tsx:53
```

`toast` comes from the render closure. Two `appendToast` calls in the same tick — which happens
whenever an action produces two notifications, or when a window-limit warning coincides with a
save confirmation — and the second overwrites the first. `removeGivenToast` (`:72`) has the same
defect.

Zustand actions receive `(set, get)` and `set` takes an updater, so the bug is not expressible:

```ts
push: (input) => set(state => promote(enqueue(state, normalize(input)))),
```

## 3. One presenter

F-56: `ToastDisplayLegacy` (80 lines with its own color maths and its own timers) and the
`ToastBannerReceiver → ToastCardColumnManager → ToastCardColumnMember → ToastCardSwiper →
ToastCard` chain (520 lines), selected by `settings.notificationStyle`. `ToastBannerReceiver`
duplicates its layout twice through `MobileDesktopEntryRenderer`.

```
features/notifications/
  store.ts
  ui/
    NotificationLayer.tsx     one presenter, placement from a CSS custom property
    NotificationCard.tsx      icon + title + body + action
    useAutoDismiss.ts         one timer per active notification, pause on hover/focus
```

Placement is CSS, not two React trees:

```css
.layer { position: fixed; inset-block-start: var(--zw-notification-top); z-index: 80; }
@media (width < 48rem) { .layer { inset-inline-start: 50%; translate: -50% 0; } }
@media (width >= 48rem) { .layer { inset-inline-start: 0; } }
```

`MobileDesktopEntryRenderer` (F-41 — renders **both** branches before hydration) is not used here,
and is deleted repo-wide: its two other uses (`WindowManager`, `ToastBannerReceiver`) both become
CSS or a proper `useMediaQuery` that returns `null` on the first pass.

`ToastDisplayLegacy`'s appearance is retained as a **style variant** (`notifications.style:
"inline"`), rendered by the same presenter with a different card component. Its 24-step shade map
(`ToastDisplayLegacy.tsx:19`) is replaced by the `overlay` surface and the `text` role — which is
what the shade map was manually approximating.

## 4. Enter and exit without layout animation

F-57: `maxHeight` transitioned `0px` → `${scrollHeight}px`, with dismissal driven by an
`onTransitionEnd` on the same element that also fires for descendant transitions, and a
`toastMounted` flag threaded into `ToastCardSwiper` to sequence the two animations.

```css
.card {
  transition: opacity var(--zw-duration-transition) var(--zw-ease-enter),
              translate var(--zw-duration-transition) var(--zw-ease-enter),
              filter var(--zw-duration-transition) var(--zw-ease-enter),
              display var(--zw-duration-transition) allow-discrete;
  opacity: 1; translate: 0 0; filter: blur(0);
}
@starting-style {
  .card { opacity: 0; translate: -20% 0; filter: blur(6px); }
}
.card[data-exiting] { opacity: 0; translate: -20% 0; filter: blur(6px); display: none; }
```

- `@starting-style` supplies the pre-insertion state, so entry animates without a mounted flag.
- `transition-behavior: allow-discrete` on `display` lets the element animate out before being
  removed, so exit needs no `transitionend` bookkeeping.
- Nothing animates layout. Stacking uses `gap` in a flex column; a removed card's siblings move
  via their own `translate` transition, not via a height animation.

Both features are Baseline (`@starting-style`: Chrome 117, Safari 17.5, Firefox 129;
`transition-behavior`: Chrome 117, Safari 17.4, Firefox 129) — inside the Tailwind v4 floor
(P5 §2). Where they are unavailable the card appears and disappears without animation, which is
acceptable.

Removal timing is owned by the store: `dismiss(id)` sets `exiting`, and a `setTimeout(220)`
removes it. One timer, in one place, cancellable.

## 5. Swipe to dismiss

`ToastCardSwiper` is 268 lines: a mutable `state` object in a ref, four listeners attached
manually with mixed `passive` flags, its own `wheel`-based dismissal path, its own timer, and a
`useSwipe` on top of all of it.

Replaced by `useDragGesture` (P1 §4) with `axis: "x"`:

```
pointermove → el.style.translate = `${dx}px 0`; el.style.opacity = fade(dx)
pointerup   → past threshold ? dismiss(id) : animate back with el.animate()
```

~40 lines. The `wheel`-to-dismiss path is dropped: horizontal wheel on a notification is not a
gesture users perform, and its handler is the second-largest source of `preventDefault` on
`wheel` in the codebase.

`useAutoDismiss` pauses on `pointerenter` and on focus-within — currently a notification dismisses
itself after 6 s even while the pointer is over it, which is the classic toast defect.

## 6. Accessibility

Currently: no `aria-live`, no `role`, dismissal only by swipe or by a `hidden md:block` close
button, so on mobile a sticky notification cannot be dismissed by keyboard at all.

- Container: `role="region"`, `aria-label="Notifications"`, `aria-live="polite"`,
  `aria-relevant="additions"`.
- `tone: "danger"` uses `aria-live="assertive"`.
- Every card has a visible, focusable close button at every viewport size.
- Cards are reachable in DOM order; focusing one pauses its timer.
- `prefers-reduced-motion` ⇒ no translate/blur, opacity only.

## 7. Acceptance

| # | Criterion |
| --- | --- |
| C1 | Two `push` calls in one tick produce two notifications |
| C2 | `promote` is pure; property-tested for `active.length ≤ slots` and no loss or duplication |
| C3 | 0 effects in the notification store; queue drained synchronously |
| C4 | One presenter; `ToastDisplayLegacy`, `ToastCardColumnManager`, `ToastCardColumnMember`, `ToastCardSwiper` deleted |
| C5 | `MobileDesktopEntryRenderer` deleted; no component renders both responsive branches |
| C6 | No `max-height` transition; no `onTransitionEnd`-driven state |
| C7 | 12 notifications in 2 s: no dropped notification, no more than `slots` visible, all eventually shown |
| C8 | Hovering a notification pauses its dismissal |
| C9 | `dedupeKey` collapses repeats: 5 window-limit warnings yield 1 notification |
| C10 | Keyboard-dismissible at 390 px width; axe-core clean; `aria-live` announces additions |
| C11 | A notification burst produces 0 React commits outside the notification layer |
