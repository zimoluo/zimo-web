# Window interaction ownership

Updated October 31, 2026 after the normal-use review. [Window architecture](../architecture/windowing.md) describes the model and persistence. The v10 window source remains the reference for grip placement, widget dimensions, materials and modifier behavior.

## States and transitions

An instance has a committed rectangle, focus order and optional `restoreRect`. A mounted drag or resize owns a temporary element pose. Minimized and closing are presentation states; they cannot keep an active pointer writer. These identities belong to the instance ID, never its position in the stacking list.

| From / event | Result |
| --- | --- |
| Idle / title or resize pointer-down | Focus the existing frame; acquire capture, cancellation scope and one temporary writer |
| Dragging / move | Paint the constrained pose without React or persistence; Shift retains v10's dominant-axis lock and 50px threshold |
| Resizing / move | Solve against the current usable viewport, constraints, edge and current modifiers; paint only the element |
| Held / release after movement | Cancel the pending frame, solve the final pose using current viewport/peers, commit once, release capture and marker |
| Held / release without movement | Reconcile existing geometry; do not snap or invent a resize just because a grip was pressed |
| Held / Escape, pointer cancellation or capture loss | Retire the writer, restore committed geometry fitted to the current viewport; no geometry change or persistence when the viewport is unchanged |
| Held / Tidy, keyboard geometry or maximize/restore | Interrupt the old gesture before applying the new command; later pointer movement/up cannot overwrite it |
| Held / minimize, close, replacement or hydration | Interrupt the old writer before changing visibility, identity or layout |
| Held / browser resize | Keep pointer ownership; the layer skips its ordinary fit for that instance; movement/release/cancellation use fresh bounds |
| Maximized / browser resize | Fit the maximized rectangle to the new viewport while preserving the prior restore rectangle |
| Maximized / real manual geometry commit | Retire the old restore target; a later button cannot jump back to an unrelated earlier pose |
| Maximized / canceled resize | Keep the original maximize/restore state because no manual geometry was committed |
| Focused / close | Return focus to the remaining frontmost frame, or the connected opener |
| Background / close while focus is elsewhere | Preserve the current focus; cleanup must not take it back to an old opener |

`gesture-ownership.ts` is an ephemeral cancellation registry. Each mounted grip subscribes with stable instance ownership and releases that subscription on disposal. Store actions interrupt the relevant owners before replacing geometry or retiring an instance. Normal pointer release already retires its session before its commit reaches those actions. The registry contains no saved state, timers or render loop.

`model.ts` owns maximize/restore. Ordinary `moveWindow` clears a restore target only for a different committed rectangle; viewport fitting preserves it. `chrome.ts` owns the shared reachable-grip and maximized bounds. Restore fits its saved rectangle against the current viewport. The restore target remains transient across reload, matching the preceding persistence contract; saved layout contains the committed rectangle, not an in-progress interaction.

## Rendering and hit areas

All eight edges/corners occupy their actual locations. Corner targets retain 44px touch areas; the authored visible resize mark stays at the lower right. Resize targets paint above content and the overlapping six-pixel part of the drag bar. The content pane isolates its internal stacking so a child toolbar cannot capture another window's chrome. The grip's visible center remains below the frame.

Definitions explicitly assign the material and border owner. A normal frame can own its widget material and quiet outline; Calculator, Notebook, Studio, Note and Blank own their content paint. Studio and Notebook also own their content perimeter. Specular frame borders use the shared rim renderer. Embedded articles use the window's material rather than painting another full card and shadow over it; standalone/overlay readers retain their own material. Generic corners return to v10's 32px default, while Note keeps its authored 4px corner. Widget-specific layout and the engine's outer rectangle must agree.

Calculator returns to its v10 default/minimum/maximum range instead of being fixed-width. Its existing eight-column scientific layout is therefore reachable. Calculator keyboard events require focus within its frame, respect composing/editable targets and already-handled events, and preserve native button activation. A frontmost window is not permission to intercept typing elsewhere in the site.

The floating entry browser keys requests by section, slug and retry attempt. Aborted results cannot publish after replacement. Loading, failure with Retry, and an actual empty list are distinct states. Closing or changing the reader releases its request owner.

## Evidence and limits

The dated [fidelity log](site-fidelity.md) records the test/build/browser evidence. Representative tests do not certify every trackpad/OS/browser cancellation path. Chrome/trackpad intermittent snap-back remains a reported symptom, not a claimed exact reproduction of the user's event sequence. The six earlier executable regressions and native keyboard/hit-area failures demonstrate concrete defects repaired by this pass. Safari, Firefox, OS interruption, a complete touch matrix, finer widget material/animation review and navbar-inset changes independent of browser resizing remain open review targets.


The following contained-content pass adds a `window-pane` size container, small Studio workbench height queries and host-width reader boundaries. See [contained surfaces](contained-surfaces.md); those targeted cases no longer depend on the desktop viewport. Their complete browser/portrait/animation matrix remains open.
