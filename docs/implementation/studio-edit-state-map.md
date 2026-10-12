# Studio edit interruption and view ownership

The authoring source is shared by page and window Studio views. Pointer capture, keyboard holds, local input text, popup anchors, and tab scroll positions belong to their individual controls or views. These ephemeral values never enter a theme, profile, workspace, or history record.

## Editing states and transitions

| State | Finish | History/source boundary | Further input |
| --- | --- | --- | --- |
| Idle | No change | Apply command normally | Begin a new edit |
| Text or numeric field focused | Blur settles one edit | Clear local numeric text, settle source first | Native text undo stays in the field; a later edit starts a new group |
| Custom pointer drag held | Release records its painted changes once | Cancel the frame, capture, listeners, and provisional layer movement before applying history | Old pointer movement cannot repaint the restored source |
| Native range pointer held | Release settles once | Settle and suppress the remaining native input sequence | Ignore changes until release/cancellation; a fresh pointerdown starts normally |
| Range/tone key held | Key release settles once | Settle and suppress that held key | Repeats cannot redo the canceled paint; a fresh keydown after keyup starts normally |
| Popup editing | Commit belongs to its anchor's control | The owning Studio handles history; text fields keep native undo | The pointer plane retains focus so interruption reaches its captured element |
| Empty or net-zero edit | No history entry | Existing redo remains valid | The original source identity is retained |
| Divergent pending edit + Redo | Settle first, invalidating the old future | Do not apply a stale future over the new paint | New Undo restores the preceding source |

Undo, Redo, source loading, Revert, and saving must settle controls synchronously before replacing source/history. Changing control owner also retires the preceding interaction, while repeated starts by the same owner retain one transaction. A mounted cancellation subscription belongs to an immutable owner token; its cleanup removes that subscription. Captured DOM listeners stay on the captured element rather than being added to the window for every gesture.

## View ownership

The first Studio view initializes the editing session and profile autosave. A second view joins the existing draft, selection, and history rather than resetting them. Removing one view releases its controls and only its own color popup; the remaining view keeps editing. Removing the last view settles the shared session before detaching autosave. Keyboard history respects the event's existing default prevention and belongs to the root containing the target, or the root containing the active popup's anchor.

## Verification scope

Regression cases must cover custom and native held pointers, held-key repeats, native text undo, numeric text after external history/source changes, divergent and net-zero redo, handover to another control, popup focus/Escape, source replacement, a second view joining, and either view leaving. Browser checks exercise actual native input/capture behavior; model tests alone cannot validate these ownership paths. Tab scroll ownership is a separate continuation item because the scroll owner changes between the editor pane and the whole short-screen frame.
