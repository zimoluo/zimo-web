# Contained surfaces and interaction ownership

Updated November 5, 2026. This pass extends the [window state map](window-interaction-state-map.md) across embedded readers, Studio, sharing, comments and Design. It repairs existing surfaces without replacing their theme, material or content models.

## Dimensions belong to the host

A floating window's content pane is a named size container, `window-pane`. Its flex allocation determines the usable width and height; its outside grips remain outside that container. Studio's workbench is also a size container because both dimensions are definite in its page and window hosts. The shared `.studio` class alone remains an inline-size container: the intrinsic-height color popup uses it and must not collapse into size containment.

Narrow, short workbenches switch to one scrolling frame from their own dimensions. Their tabs and panel/disclosure memory retain one logical editing position while the scroll owner changes. Browser viewport queries cannot describe a small desktop window. Wide editors retain independent editor/preview scrolling.

Embedded articles have a named inline-size boundary, `entry-reader`. Compact photo and project readers stack within that boundary, use a sharing disclosure, and keep their width within the host. Project image controls and sharing have different owners: image controls stay over media, while sharing belongs to the text header. Portrait project media uses contained fitting and a height derived from the window pane, rather than the desktop viewport. Grid browsing retains its natural content flow. Standalone article composition remains separately governed by its page layout.

The before-build Chrome probe found a 1,140px album inside a 520px window, desktop sharing rails in narrow readers, and no short-workbench frame scrolling. The production probe checks these boundaries using real resize input, actual painted content and popup dimensions.

## Small menus retire before their hosts

Article sharing uses native disclosure semantics. Escape from its contents closes that disclosure, returns focus to its summary and stops propagation before a window can interpret Escape as Close. Outside pointer input and focus leaving the disclosure dismiss it without taking focus away from the new target. The document pointer listener is released on disposal. Sharing links and the full-size rail retain their existing actions.

## Motion preference has one meaning

[`settings/motion.ts`](../../src/features/settings/motion.ts) combines the site's transition preference and the platform reduced-motion query. The observer owns a settings subscription and a media-query listener and releases both. This is separate from backdrop quality/motion preferences.

Image navigation and grid transitions use that combined preference. An active view transition is skipped when motion becomes reduced or the view is disposed. A reaction button similarly cancels only its own finite effect. The restored Design identity samples retain v10's 600ms charge/spin curve and 300ms swap; a reduced-motion change settles the swap once, and disposal removes the timer and animation. Busy samples retain their focusable button identity. No continuous frame loop or durable preference write is added.

## Async work must not erase newer intent

A comment composer owns one in-flight submission. A synchronous guard rejects duplicate sends before a render can disable the button. Successful completion clears only the submitted draft revision; newer editing remains. Unexpected rejection preserves the draft and releases the guard for Retry. Enter respects composition, modifiers and held-key repeat. Disposed composers do not publish completion state.

Initial comment reads are keyed by resource and retry attempt. Retired responses cannot replace the current result. Disabled comments do not initiate reads. A failed read offers a local Retry rather than requiring a page reload. These changes do not alter server mutation, authorization, revision or bucket contracts. Browser recovery verification intercepts an initial read response; it does not submit a comment.

## Server and client must describe the same initial surface

A deferred `ThemeMark` hydrates from a stable server snapshot. Its subscribed structural snapshot includes source identity and mark topology, while color-only changes continue to paint without a React commit. The preceding implementation read current live source data while hydrating server geometry; the new regression reproduces and prevents that mismatch.

The site's English date/reading-time defaults are explicit, including UTC calendar formatting, instead of depending on different server and browser locales. Explicit locale arguments remain supported. A browser context using `en-GB` checks the production surface without a hydration error.

Design's live article example uses the same `EntryCard` as entry lists, including canonical summary metadata and navigation. It has a localized loading/unavailable boundary. The favicon gallery reuses `ThemeMark` and the original eight sample families; it changes the sample, not the visitor's selected site theme. Saved profiles are shown through the same source model.

## Remaining review

This is not completion of the whole-site craft matrix. Remaining items include full animation-phase and appearance review, navigation-inset changes independent of browser resize, broader portrait/gallery combinations, finer reader/comment focus and animation behavior, explicit language selection, and Safari/Firefox/physical-device checks. The [fidelity log](site-fidelity.md) records the dated evidence and limits.
