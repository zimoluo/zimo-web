# Windowing and overlays

Reviewed October 12, 2026, including the focused execution repairs following `91d20ccf`. [Runtime guide](application-runtime.md).

## Model, definition, view, and gesture

[`definitions.ts`](../../src/features/windows/definitions.ts) declares each widget's loader, props schema, default/minimum size, aspect/fullscreen constraints, optional singleton identity, and chrome. [`model.ts`](../../src/features/windows/model.ts) contains immutable instance/order/layout operations. [`store.ts`](../../src/features/windows/store.ts) provides actions and persistence. [`WindowLayer`](../../src/features/windows/ui/WindowLayer.tsx) mounts stable frames; [`WindowFrame`](../../src/features/windows/ui/WindowFrame.tsx) owns controls/content and connects gestures to the model.

A WindowId is an instance identity; a definition ID is a widget kind; order is focus/stacking. Multiple instances can share a definition unless its singleton policy says otherwise. Props are validated at creation/restore and can be committed by the widget through `useWindowInstance`. A widget does not reach into a positional array to find its own identity.

Frames retain stable DOM mount order while focus order supplies z-index and snapping order. Physically reordering keyed frames on pointer-down can cancel the eventual native click or disturb capture/composition. Bringing a window forward therefore changes its stacking, not its parent/position in the DOM. Focusing an already-frontmost or unknown window is a true no-op and does not schedule persistence.

## Continuous pose and durable rectangle

Pure solvers under [`geometry/`](../../src/features/windows/geometry/solve-resize.ts) handle drag bounds, resize anchors, aspect constraints, snap candidates and tidy targets. The shared pointer primitive is [`use-drag-gesture.ts`](../../src/lib/gesture/use-drag-gesture.ts), with a frame-coalesced session owner and pointer capture.

At gesture start, the window reads a stable starting rectangle, viewport and peers. Movement writes its DOM rectangle through [`element-registry.ts`](../../src/features/windows/element-registry.ts); it does not persist each pointer event. Release solves the final snap and commits once. Cancellation restores the current committed DOM rectangle, clears the gesture marker, and releases capture/listeners without committing geometry. Windows provide the frame as the keyboard-cancellation scope, so Escape from a focused descendant cancels resize rather than closing the window. Starting a gesture with focus outside the frame gives the frame keyboard ownership without adding eight resize-handle tab stops. Keyboard movement/resizing uses the same geometry contract as a discrete action.

Window chrome is part of the viewport constraint. `chrome.ts` defines a 44px bar and its 38px overhang; resize bounds reserve space for it, and drag bounds preserve a usable grab area. Navigation supplies the measured top inset. Do not substitute an arbitrary content-only viewport that strands controls off screen.

Close retires the frame through finite animation completion. Minimize targets the actual Windows control and makes content inert. Maximize/restore keeps the previous rectangle locally; persistence stores the committed layout rather than an animation's temporary transform. Tidy uses model targets. Global settings select snapping and resize behavior without requiring broad subscriptions inside every widget.

## Persistence and reusable content

`zw.windows` saves validated instance props, rectangles, order and the viewport used for restoration. Writes coalesce at 500ms. Restore validates positive finite rectangles, unique instance IDs, known definitions and props, then scales rectangles from the saved viewport. New-window creation enforces widget limits/constraints separately; restoration does not pass through every creation check. Centralizing post-restore size/limit normalization is a review item. Legacy conversion remains an import boundary. Workspace data such as notebook pages belongs to `zw.workspace`, not to every window instance.

[`WindowIdentityProvider`](../../src/features/windows/window-identity.tsx) gives content its stable instance and scroll/content handle. Readers reuse the entry/document view rather than maintaining a second parser. Studio page and window views share one editing session; their inspection positions remain local to the view. See [Studio edit state](../implementation/studio-edit-state-map.md).

Reading overlays/lightboxes are not floating-window instances merely because they appear above the page. Native dialogs and `features/overlays` own modality, scroll locking, focus restoration and viewport controls. Canonical entry links still work as full-page routes. Search/color popovers opened inside a native modal must retain that modal ownership.

## Maintaining the engine

A definition should add only widget-specific constraints/props/chrome; general drag/focus behavior belongs to the engine. Preserve instance identity through focus, resize, props changes, minimize and restoration. On cleanup remove the registered element, captured pointer/session, observer/listener and owned finite effect. Late completion must not commit to a removed instance.

Verify first-click behavior when bringing a background frame forward, held drag/resize and interruption, keyboard constraints, snap/tidy/maximize/restore, persistence, shortened viewports, and modal overlays. Geometry/property tests cover invariants; native smoke checks the real click/capture sequence. `interaction-performance-smoke.mjs` checks held movement causes no sampled React commits or storage writes and persists once on release.

Remaining architectural work includes explicit height/container adaptation for small Studio frames on large screens, deeper cross-browser capture/focus testing, and separating more widget presentation from the large definition file as it grows. Container geometry should drive contained layout; viewport media rules alone cannot describe a small window on a large viewport.
