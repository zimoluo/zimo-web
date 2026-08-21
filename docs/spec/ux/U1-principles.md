# U1 — Design principles

The site's visual language is good and is not being redesigned. It has, however, never been
written down, which is why it is applied inconsistently — six spellings of "translucent raised
panel" (T5 §2), four blur radii, and two border treatments used interchangeably.

This document states the language so it can be applied by rule. Most of it is a description of
what already exists; the parts that are new are marked **new**.

## 1. The five properties

Taken from the site's own copy on `/design`, which describes the intent accurately:

**Concentricity.** Nested rounded corners share a center of curvature. A child's radius equals its
parent's radius minus the gap between them. Applied today by hand with values like
`rounded-b-[2.75rem]` outside and `rounded-t-3xl` inside; **new**: expressed as a rule, with
`--zw-radius-*` steps and a `radius-inner` utility computing `calc(parent - gap)`.

**Translucency.** Content sits on translucent materials over a rich backdrop. The materials are
the seven surfaces of T5 §2. A surface is never fully opaque unless it is `page`.

**Specular highlighting.** Small elements carry a masked inner highlight along their top and
bottom edges — the `border-reflect` effect. It is what makes the buttons read as glass. Large
elements get a hairline outline instead, for performance. That distinction is currently made by
eye; **new**: it is a rule — `surface-edge` below 320 px on either axis, `outline-hair` above.

**Depth by blur, not by shadow.** Elevation is communicated primarily by `backdrop-filter`
strength and secondarily by shadow. The shadow scale is deliberately shallow and wide
(`0 2px 20px 5.4px`), which is why 90 elements use `shadow-lg`.

**Color by role, not by value.** Nine roles (T1 §5). A color outside the roles is a design
decision requiring a decision, not an ad-hoc value.

## 2. The elevation ladder

**New.** Six levels over the seven surfaces of T5 §2 (`page-reduced` is a variant of level 0 and
`widget` appears at two levels because a window and a card are the same material at different
elevations), each a surface + blur + shadow + edge treatment, so "how do I make this look
raised" has one answer.

| Level | Surface | Blur | Shadow | Edge | Used for |
| --- | --- | --- | --- | --- | --- |
| 0 | `page` | — | — | — | the backdrop |
| 1 | `sunken` | — | inset | hairline | inputs, tracks, wells |
| 2 | `widget` | 12 | `sm` | hairline | cards, readers, article bodies |
| 3 | `raised` | 4 | `lg` | specular | navbar pills, buttons, TOC, search |
| 4 | `widget` | 12 | `xl` | specular | windows |
| 5 | `overlay` | 3 | `2xl` | specular | popups, lightbox, modal chrome |

Levels do not skip: a level-4 window contains level-2 content, which contains level-1 inputs.
Two adjacent elements at the same level are separated by gap, never by a border.

## 3. Typography

| Role | Family | Notes |
| --- | --- | --- |
| UI | Inter (`--font-sans`) | all interface text |
| Long-form body | Lora (`--font-serif`) | blog only, when `reading.serif` |
| Numerals in dense contexts | Open Sans (`--font-tabular`) | dates, version, TOC numbers |
| Code | Roboto Mono (`--font-mono`) | |
| Display | Pacifico (`--font-display`) | rare, decorative |

Five families is a lot, and it is the existing choice; leave it. **New**: `font-tabular` usages
gain `font-variant-numeric: tabular-nums`, which is the reason that family was chosen and is
currently not requested.

Headline scale is `text-5xl`/`text-6xl` for page headers with `leading` tightened — as today.
**New**: header text uses `text-wrap: balance`, which fixes the ragged two-word last line on the
existing page headers at tablet widths, and long-form body uses `text-wrap: pretty`.

## 4. Motion

Full policy in U3. The design-language part:

- **Durations**: 150 ms (state), 200 ms (enter/exit), 300 ms (position), 500 ms (large layout).
  These match what the codebase already uses; they become `--zw-duration-*` tokens.
- **Easing**: `ease-out` for entering, `ease-in` for leaving, and
  `cubic-bezier(0.37, 0.01, 0.11, 0.93)` for repositioning — the curve already used for the
  navbar and window minimize, which is the site's signature motion.
- **Blur is part of transitions.** Elements enter from `blur(6px)` and leave to it. This is
  already the pattern in the navbar, menu, notifications, and window mount; naming it stops it
  being reinvented.
- **Nothing moves more than 24 px** on enter/exit. Larger displacements read as slides, which the
  language does not use except for the side menu.

## 5. Iconography

131 SVG icon components exist. They are consistent in weight and construction and should stay.
**New**, three rules to stop drift:

- One `ui/icons/` directory; one `IconProps` type (`size`, `className`, `strokeWidth`).
- Icons inherit `currentColor`. 40 icons currently take a `color?: HexColor | null` prop and
  several hardcode `#efefef`, which is why icons on dark overlays are the wrong color under some
  themes.
- `aria-hidden="true"` by default; an `aria-label` only when the icon is the sole content of a
  control.

## 6. Density and layout

- Content column: `min(60rem, 100vw - 2rem)` — the existing `TextBox` width, named.
- Reading column: the existing `reading-layout.module.css` sizing, named.
- Gutters: 1 rem mobile, 2 rem tablet, from the spacing scale.
- Breakpoints: Tailwind defaults. The codebase additionally uses container queries in the navbar,
  which is correct and should spread — several `@media` rules in the navbar are really about the
  navbar's own width, not the viewport's.

## 7. What is deliberately not changing

- The color identity of the 59 themes (T9 guarantees exact reproduction). Where a migrated theme
  fails the WCAG AA report, that is a design ticket resolved by eye — never an automated nudge.
  U3 §3.5 states which theme sets the AA gate is enforced against and which are only reported.
- The window system's interaction model.
- The information architecture: the same nine destinations, the same navbar layout, the same side
  menu.
- The playful tone: seasonal themes, the Christmas tree, the spinnable mark, the eep theme.

The one visible change the theme work introduces is the lens model (T5 §4.2), which makes widgets
more translucent and the backdrop more present. That is intentional, it is the fix for the
"same shape" complaint, and it moves the language further in the direction it already points.
