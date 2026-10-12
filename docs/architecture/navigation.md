# Navigation, sidebar, and search

Implemented at `91d20ccf`; reviewed October 12, 2026. [Runtime guide](application-runtime.md).

## One coordinated header

The page shell owns the physical header/sidebar composition; `features/navigation` owns contextual contributions, commands, transient state and announcements. They are separate modules but one interaction system. Destinations, search and Windows should not independently guess where they belong.

[`header-layout.ts`](../../src/features/shell/ui/header-layout.ts) derives bounded target rectangles and availability from viewport width, sidebar state, directional expansion, destination width and measured command content. Its motion planner describes clearance paths between targets. [`navigation-behavior.ts`](../../src/features/shell/ui/navigation-behavior.ts) measures DOM inputs, applies targets, mirrors visibility/inert state, and updates window inset/account entrance delay. [`header-motion.ts`](../../src/features/shell/ui/header-motion.ts) owns finite effects and current-pose retargeting.

The state vocabulary includes inline, stacked, substituted, suppressed, and modal/nonmodal sidebar conditions. Phones place search below destinations at full width; collapse can substitute it into the first row. Desktop search sits immediately before Windows. The sidebar and destinations reserve corridors rather than jumping between unrelated layout templates. `scroll-intent.ts` supplies directional intent; pinned/hidden/auto settings and keyboard focus constrain the derived state.

A native dialog owns phone-sidebar modality. Mounted sidebar controls survive transitions, while the owner handles body scroll, chrome availability, dismissal and focus. Hidden controls become inert immediately. Conservative utility-page header clearance prevents menu opening from moving Notebook or Studio content.

The detailed pair map, measurement boundaries and cleanup are in [navigation-state-map](../implementation/navigation-state-map.md). Do not add independent breakpoint logic to a child to compensate for a planner defect.

## Context is registered, not hard-coded into the bar

[`contributions.tsx`](../../src/features/navigation/contributions.tsx) registers contextual labels/details/actions with priority and stable registration ordering. Reading, media, Studio, windows and short neutral confirmations can contribute. Cleanup removes only the registration still owning that ID; a stale cleanup cannot remove a newer replacement. A confirmation can have a finite TTL. The bar itself displays the winning contribution and remains the search entry point.

This is transient presentation state. Contribution changes do not constitute saved preferences, and a timer for a short confirmation is not data-layer polling.

## The command bar expands into the search sheet

[`command-surface.ts`](../../src/features/navigation/command-surface.ts) owns closed/opening/open/closing phases. A visible bar supplies the top/right edge and row height; the sheet expands left/down with actual geometry rather than scaling type. The shared outer material/rim contains a fixed search row and independently scrolling results. An unavailable strip or active native modal uses bounded viewport placement; modal search is portaled inside that dialog.

Native auto-popover semantics own light dismissal and Escape. Synchronous before-toggle dismissal prevents stale queued toggles from closing an immediate reopen. New sessions reset query/selection; held shortcut repeats do not alternate the state. Retirement makes content inert immediately, releases the source only on completion, and restores the opener only when a deliberate external focus change has not taken over. A new window opened by a command keeps its own focus.

Commands currently combine destinations, built-ins, profiles, window definitions, settings actions, and fetched entry summaries in `CommandPalette.tsx`. Search summaries are abortable and completed reads are retained for the mounted palette; they are not a live polling subscription. At larger command/provider scope, split provider construction behind this same command contract rather than growing unrelated search UIs.

The full state/resource contract is in [command-surface-state-map](../implementation/command-surface-state-map.md).

## Ownership and change checklist

The header owner releases passive scroll/resize/focus listeners, font completion work, observers, settings/navigation subscriptions, pending frames and finite animations. It restores owned inset/delay properties. The command owner separately releases its viewport/motion/header listeners, animations, source coverage and native popover. Pure geometry/planning functions do not attach resources.

For a navigation change, update the pure target/pair tests and inspect normal/reduced motion, rapid reversal, pointer retirement, keyboard focus, phone modality, contextual width changes, short-screen search and source-to-sheet alignment. Measure related rectangles atomically in browser tests; separate reads during motion can manufacture a false gap. See `tools/perf/navigation-motion-smoke.mjs`, `command-surface-smoke.mjs`, and `design-system-smoke.mjs`.

Future cleanup can formalize the shell/navigation measurement boundary and extract command providers. It should retain one geometry authority and explicit focus/availability semantics, not introduce another shared store of per-frame rectangles.
