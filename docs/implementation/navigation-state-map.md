# Header and sidebar state map

This revision follows the user's October 11 request to reason about each state and each ordered transition before implementing motion. The v10 source remains the material, typography, hover, mask, and sidebar-motion reference. A changing container width cannot also decide layout halfway through its own animation.

## State inputs and targets

`header-layout.ts` chooses targets from viewport width, sidebar state, directional/pinned/hidden navigation, context-strip preference, destination width, and the command's natural content width. Sidebar modality is a separate semantic state: closed, nonmodal, or modal.

| Target | Destinations | Search | Utilities |
| --- | --- | --- | --- |
| Inline | Attached beside the site mark | Immediately left of Windows, with a 16 px material gap | Windows remains beside the global menu control |
| Stacked | Centered in the first row | Full-width second row, bounded by the sidebar when open | Windows remains if its viewport and available space allow it |
| Substituted | Directionally collapsed or suppressed beside a narrow sidebar | First row between the site mark and remaining utilities | Controls retire before their slots are reused |
| Quiet | Retains the navigation preference | Disabled, suppressed for insufficient space, or covered by the modal | Each utility retains its independent visibility rule |

The layout threshold is based on the **destination** available space, never the intermediate width of a moving container. The canvas remains viewport-wide. Destination anchoring, search, and Windows retain the same positioning model in every state. Hover labels reserve their maximum expansion in inline layouts; centered layouts require enough clearance to expand without touching the site mark or Windows.

The five destinations use one stable anchor. Percentage alignment preserves centered expansion while the attached state expands to the right. Search uses natural text measurements rather than the width of a currently truncated or stretching label. Changing search, contextual content, or transition preference does not reset directional scroll intent. Changing the navigation preference or closing the sidebar reveals flexible navigation for orientation.

## Ordered transition rules

| Ordered pair | Path and handoff |
| --- | --- |
| Same row → same row | One native curve moves positions and widths together, keeping the utility gap |
| Inline → stacked, with a horizontal corridor | Search narrows into the clear gap beside destinations, crosses rows, then expands; Windows follows after search clears |
| Stacked → inline, with a corridor | Search narrows and moves into the clear gap, rises, then returns beside Windows |
| Inline → stacked, without a corridor | Search clears the first row vertically before moving across; the account card waits for clearance |
| Stacked → inline, without a corridor | Destinations temporarily retire, search returns through their row, and destinations reappear after clearance |
| Stacked → substituted | Destinations retire before search rises into their place |
| Substituted → stacked | Search moves down before destinations return |
| Utility present → suppressed | It becomes inert immediately and retires before another surface occupies its space |
| Utility suppressed → present | Geometry moves into place before the utility returns; the invisible utility cannot intercept search clicks |
| Nonmodal → modal | The same sidebar content remains mounted; the platform owns focus, body scrolling locks, and main chrome retires as in v10 |
| Modal → nonmodal/closed | Mounted content and control state survive; main chrome returns after the modal begins retiring |
| Any active path → another target | Read the current painted pose, cancel only the owned animation, then continue from that pose |
| Any path → reduced motion | Finish geometry and cancel the owned header/sidebar transitions; retain the target's semantics |
| Moving chrome → keyboard focus | Finish geometry before presenting the focused control; focus never has to chase a moving or faded target |

Geometry uses finite Web Animations with a 300 ms clock. The authored cubic curve is applied once per segment, with a linear outer timeline. Applying it both to the segment and the whole animation caused an unintended slow start followed by sharp acceleration. Opacity and blur are separately coordinated with slot availability. The sidebar keeps v10's upward 32 px movement, 300 ms reposition curve, 180 ms opacity, original masks, and 9 px backdrop blur. The account card's entrance waits for clearance rather than colliding with the moving header. Mobile uses that blur layer once rather than adding a second native-dialog blur.

Focus and visibility are semantic constraints, not animation side effects. Hidden destinations, unavailable Windows, and suppressed search are inert and excluded from the accessibility tree. A returning utility is not pointer-active while invisible. The modal is a native dialog; its close control occupies the same phone position as the global control. The command palette continues to work within it.

## Ownership and cleanup

The shell owns a passive, animation-frame-batched directional observer, viewport and focus listeners, a settings subscription, and a synchronous navigation-UI subscription. Subscribing to sidebar state before React commits establishes the complete target and its timing before the native dialog opens. A ResizeObserver measures header extent for window/palette insets; another watches destination width. A MutationObserver notices contextual text or contribution changes, and the font-ready promise updates natural measurements. Identical targets are not rewritten.

The animation owner keeps a map of finite effects. Retargeting reads live geometry before canceling; completion removes only the effect that still owns its element. Cancellation rejection is handled. Cleanup cancels effects and a pending frame, disconnects observers, removes listeners, unsubscribes stores, and restores previously owned inset/account-delay properties. Late callbacks check that the controller is still connected. None of these paths updates React or durable preferences during scrolling.

## Adjacent craft corrections

Entry search restores v10's muted placeholder/affordance color and exact filled clear-icon path at 24 px. Decorative, faded icons do not intercept clicks, and the empty affordance lets clicks reach the input. Clearing returns focus to typing.

Small-viewport title clearance is fixed by viewport rules, so opening the sidebar does not move page content. The command palette constrains its height, gives results the remaining scrollable space, and omits keyboard hints when vertical space is scarce. Its 32 px outer corner, 8 px inset, 24 px search corner, and 20 px inset result corners follow the site's concentric geometry.

## Evidence scope

The target matrix covers 136 representative states and all 18,496 ordered pairs. It checks bounded controls, utility clearance, exact endpoints, corridor constraints, hover expansion, and mobile handover. Unit tests also cover cancellation ownership and single application of easing.

The browser motion suite samples real animation frames at eleven widths, in both directions, including the 794/793 and 532/531 boundaries. It rejects visible overlaps between destinations, search, Windows, and the account card. It also exercises reversals after 50, 120, and 220 ms, pointer retirement/re-entry, keyboard completion, changing reduced motion during a path, original clear-search interaction, and palette fit at 300, 440, and 844 px heights. Production reports and screenshots stay private under `work/header-*-production*`.

This is a focused navigation and adjacent-control review, not a claim that all v11 surfaces have reached v10's craft. The wider fidelity audit and cross-browser/device release scope remain in `site-fidelity.md`.


## Utility workbench envelope and reduced transitions (2026-10-12)

The full-page Notebook and Studio now share `src/ui/utility-page.module.css`. They reserve 144 pixels below widths of 1176 pixels and 80 pixels above that boundary. The threshold is the header's 780-pixel inline span plus the 396-pixel nonmodal-sidebar reservation. This viewport rule reserves the possible search row before menu opening, so the workbench stays stationary through closed/open pairs, directional collapse, and utility substitution. At widths where a menu suppresses that row, the same conservative envelope remains in place rather than adding another small layout notch.

The two-workbench production matrix checks ten widths including 1176/1175, 794/793, and 780/779, requiring header clearance and unchanged page position in both menu states. It also found that the universal reduced-motion duration created implicit transitions on normally instant margin and height. Reduced transition duration and delay are now zero, preserving exact layout endpoints without a deferred paint. Normal transitions and finite navigation-animation ownership retain their authored behavior.
