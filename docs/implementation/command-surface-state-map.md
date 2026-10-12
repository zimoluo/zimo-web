# Command surface continuity

The command strip and palette are two states of one search surface. This is a v11 addition; v10's field, native menu materials, specular perimeter, and navigation curve are the craft references, rather than a separate popup design. `main` at `68eb8d9c2e7ce62dc0cfc8051c216823709d4167` and the live Blog page were inspected for this pass.

## Placement and semantics

A visible strip supplies the expanded sheet's top edge, right edge, and search-row height. The desktop sheet grows left and down while keeping its place beside Windows. On phones its width and position already match the full-width strip below navigation, including the substituted first-row state. Its search icon, 14px type, 12px leading inset, and 8px gap match the strip. The expanded sheet has one widget lens and one perimeter rim, a half-row-height outer corner, and an 8px inset around 18px result corners on desktop and 16px on phones. Results scroll within the sheet; the search row remains fixed. Keyboard hints retire below 440px height.

The native auto-popover remains responsible for Escape, light dismissal, top-layer ordering, and toggle semantics. Its combobox/listbox keeps result selection separate from text focus. The source strip is covered and inert while the palette owns the visual surface. Geometry animates directly rather than scaling the text and icons.

An active modal supplies a portal destination. Its palette uses bounded viewport placement and does not borrow the inert document header. Hidden or unavailable strips also use bounded fallback placement. Visual-viewport offsets and available height constrain the sheet when the keyboard or viewport changes.

## States and ordered transitions

The owner has closed, opening, open, and closing phases. Opening and closing have the same public keyboard semantics as their respective destinations; hidden/closing content is inert immediately.

| Current state | Request | Behavior |
| --- | --- | --- |
| Closed | Open | Snapshot a visible source, cover it, open the native popover, measure the natural sheet, and expand over 300ms |
| Opening | Close | Read the painted pose, cancel owned effects, hide semantically, and return toward the source over 280ms |
| Opening | Viewport/header change | Read the painted pose and retarget to bounded geometry over 180ms |
| Opening | Results change | Keep the entrance intact, then reconcile the resulting natural height |
| Open | Query/results change | Reconcile natural height over 180ms; rapid changes start at the painted height |
| Open | Close | Become inert immediately and return toward the current source; fallback sheets fade and move up 8px |
| Closing | Open | Cancel the old close and continue from its current pose; stale completion cannot uncover the source or release a new session |
| Closing | Header/viewport changes | Complete retirement and release the source rather than chasing a moving destination |
| Any visible state | Reduced motion | Cancel owned effects and settle at the semantic destination immediately |
| Any state | Dispose/portal replacement | Cancel effects, disconnect listeners/observers/subscriptions, release the source, and remove the native popover |

The curve is `cubic-bezier(.37,.01,.11,.93)`, shared with authored repositioning. Expanded details enter with a short 6px upward offset and delayed opacity. Display and top-layer overlay transitions retain the native sheet for its closing visual; these do not delay its inert state or public dismissal.

## Input and focus ownership

Each new search session resets its query and selection. Held Cmd/Ctrl-K repeats do not toggle repeatedly. Native `beforetoggle` updates public dismissal synchronously, so Escape followed immediately by Cmd/Ctrl-K cannot be undone by an older queued toggle. Closing from `beforetoggle` must not call `hidePopover` recursively.

Dismissal restores the opener only if focus has fallen to the document or remains inside the retiring sheet. A click into another field retains its new focus. Reopening during retirement retains the original opener when native dismissal has temporarily moved focus to the body; a deliberate external focus change supplies a new opener. Command execution may focus another window, and completion respects that focus. The modal portal is retained through retirement and released only if its session is still closed and still owns that container.

## External systems and cleanup

`command-surface.ts` owns finite Web Animations, native before-toggle, viewport and visual-viewport listeners, the OS motion query, the transition preference subscription, and a header attribute observer. Animation completions check identity and connection; cancellation rejection is handled. Cleanup removes every owned listener/observer/subscription, cancels root/detail effects, restores source availability, and closes the native popover. No continuous animation samples update React or durable preferences. Query and result index live in the transient navigation store so portal replacement preserves the current session.

The palette component separately owns its keyboard listener, modal close listener, abortable summary fetch, focus/selection layout effects, and result reconciliation. Summary cancellation prevents a dismissed session from publishing stale results; the existing completed summary cache is retained.

## Verification scope

Unit checks cover source/fallback placement, close/reopen completion ownership, native nonrecursive dismissal, painted-height retargeting, reduced-motion cleanup, and fresh-session query/selection. The production native smoke samples intermediate opening geometry and exercises desktop, stacked navigation, phone, short viewport, and reduced-motion states; it also checks rapid close/reopen, held keys, outside focus, opener retention, and active-modal/parent-modal close handling. Existing design-system and navigation checks cover the neighboring header and utilities. Headless Chrome verification does not establish Safari/Firefox, physical keyboard/viewport behavior, or complete-site fidelity.

The final production design-system sequence also checks fixed-appearance preference toggling in both directions and the shared window activation correction. Focus changes use stacking order while frame mount order remains stable, so a background-window button keeps its native pointer target through activation. This correction is documented in `site-fidelity.md`.
