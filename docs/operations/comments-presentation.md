# Authored comment presentation

The comments UI retains the native v11 thread and account actions while restoring the original
site composition from `0e9f7a81`. A comment identity has a 40 pixel avatar, name and account badge
on its first line, and the date below. Replies use 32 pixel avatars and an inline target glyph
and name. The reply list is inset 24 pixels and can be folded with an accessible count/control.
Comment bodies and their right aligned authored like/reply/delete icons are no longer enclosed
in additional nested surface cards. Projects use the authored star reaction; photos use the
heart and ordinary comments use the thumbs up.

The composer preserves the original 164 pixel field, rounded outline and inset upward-arrow
send control. Enter submits; Shift Enter keeps multiline input. IME composition is never sent
as an Enter shortcut. Text remains after a failed request and clears only after success. Signed
out readers see the disabled field with a login glyph opening the existing navigation side menu.
A visually hidden Comments heading avoids repeating the enclosing home title.

Identity avatars keep the original account-subject hash, HSV seed and 32-shade HSL palette:
outline shade 25 and gradient shades 16 and 3. A small immutable controller feeds those colors
to the current public ThemeMark API, retaining the authored signature geometry independently of
the website theme. Golden vectors from the historical color conversion verify those three
colors. Profile photos retain the authored fallback image if their request fails.

The account identity effect reads public account metadata, ignores stale completion after an
identity change, and releases its active flag on unmount. Account moderation retains the native
server action and reports a failed write. The thread effect loads native comments and reactions
and likewise ignores stale results after a route change. No legacy contexts or persistence
adapters are reintroduced.

Focused DOM verification covers avatar/date/badge identity, pressed reaction semantics, reply
folding and target glyphs, retained failed drafts, keyboard submission and the signed-out login
control. Thread mutation tests continue to exercise native optimistic behavior.


The October 11 interaction review restores the original reaction cycles: liking completes a
forward turn with its initial negative tilt; unliking uses the authored alternating tilt sequence.
Each lasts 600 milliseconds with ease-in-out timing. ReactionButton cancels the previous Web
Animation before another cycle and on unmount, and bypasses motion for reduced-motion users.
Reply folding animates the grid track and opacity for 300 milliseconds while collapsed replies
remain inert and inaccessible. Action glyphs retain 32-pixel paint inside 44-pixel targets.
