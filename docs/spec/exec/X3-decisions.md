# X3 — Decision records

Decisions that were genuinely contested, with the reasoning and the rejected alternatives. Read
the relevant ADR before deviating; if your objection is not listed, add an ADR rather than
diverging silently.

---

## ADR-001 — OKLCh with gamut-relative chroma as the color model

**Status** Accepted · **Drives** T2

**Context.** The existing shade map ramps HSL lightness with roughly constant HSL saturation. The
brief asks for "more perceptual spaces (like okLab/oklch) so different hues look more consistent
in chroma."

**Decision.** OKLCh internally and in CSS output. Chroma is authored as a fraction of
`Cmax(L, h)` — the maximum chroma representable at that lightness and hue in the target gamut,
found by bisection.

**Why the relative part matters more than the space.** Simply switching to OKLCh with *absolute*
chroma does not achieve the goal: at `L = 0.85` the sRGB ceiling ranges from 0.0736 (h=270) to
0.2018 (h=120), so an absolute `C = 0.15` is unreachable for violet and unremarkable for green.
Relative chroma is what makes hues comparable. Measured tables: T2 §1, `appendix/gamut-table.md`.

**Alternatives rejected.**
- *CIELAB/LCh* — hue linearity is markedly worse than Oklab, especially in blues; the well-known
  blue-shifts-to-purple problem in gradients.
- *HSLuv* — solves lightness uniformity but its chroma normalization discards the gamut shape,
  producing flat, desaturated palettes.
- *Material 3 HCT* — close in spirit, but tied to a tonal-palette model with fixed tone stops and
  its own contrast-forcing behavior, which conflicts with T1 §8.
- *Keep HSL, add a per-hue correction table* — a lookup table approximating what bisection
  computes exactly, with no benefit.

---

## ADR-002 — The ramp is a continuous curve, not a fixed set of rungs

**Status** Accepted · **Drives** T2 §5, T3 §1.2, T9

**Context.** The brief describes "six, or ten, lighting steps". Implemented literally that means
roles snap to integer rungs.

**Decision.** The ramp is `sample(t)` for `t ∈ [0,1]`, defined by a small number of authored
control stops. Roles address it at arbitrary `t`.

**Why.** Measured: fitting the 58 parseable themes to 12 discrete rungs gives per-theme max ΔE_OK
of p50 0.034 / p90 0.043, with only 4/58 inside the 0.02 JND. The error is lightness quantization
(`blog.text` at `L = 0.4007`; nearest rungs 0.3757 and 0.4533). Continuous `t` removes it entirely
because `toneLightness` is strictly monotone and invertible.

The authored "steps" survive as the curve's control stops, which is what the brief actually
described functionally — a small number of places where you can intervene.

---

## ADR-003 — The default chroma envelope is flat

**Status** Accepted · **Drives** T2 §5.3

**Context.** Design systems commonly taper relative chroma toward the ends of a tonal ramp.

**Decision.** Default envelope is `1`. `Cmax(L, h)` is the envelope.

**Why.** Measured against all 58 themes, residual `|Δ relative chroma|` after fitting seed chroma:
flat p50 0.147, gentle taper 0.194, strong taper 0.485. The strong taper is 3.3× worse. The corpus
pushes near-white roles to ≥ 0.95 relative chroma, and it is right to: at `L = 0.977` the ceiling
is `C = 0.017`, so relative-1.0 is a barely-tinted white — the intended "white with a breath of
hue". A taper would gray those out.

`envelope` remains available per theme for deliberately dusty palettes.

---

## ADR-004 — Gamut mapping reduces chroma only

**Status** Accepted · **Drives** T2 §4

**Context.** CSS Color 4 specifies `css-gamut-map`, which combines chroma reduction with local
channel clipping and a ΔE_OK acceptance test, and may shift lightness slightly.

**Decision.** Reduce chroma; hold `L` and `h` exactly.

**Why.** Lightness is the ramp's ordering axis. A tone at `t = 0.40` shifting lighter than the tone
at `t = 0.36` breaks monotonicity, and monotonicity is what the entire role model rests on. This is
a deliberate divergence from the CSS algorithm and is correct for this use.

---

## ADR-005 — Gradient variation is authored, not seeded randomly

**Status** Accepted · **Drives** T5 §4.3, §4.4

**Context.** The brief floated "procedurally generated gradients with a seed unique to each call
site (using a tailwind plugin, for example, to generate a seed, or any postcss scripts). That might
be too crazy."

**Decision.** A surface declares a variation policy; the compiler emits `count` indexed variants;
a call site selects one with `surface-variant-N`.

**Why not the seed.**
1. Tailwind utilities receive only a class name. There is no call-site identity available to hash.
2. Build-time randomness is not reproducible: two builds differ, server HTML and client CSS can
   disagree, and screenshot tests become useless.
3. Random rotation per widget produces noise, not rhythm. Eight authored variants give the same
   variety under design control.

A PostCSS plugin *could* hash source position if it processed JSX rather than CSS — that means a
Babel/SWC transform, another source-map layer, and a bespoke build step every future contributor
must understand. The cost is not proportionate.

---

## ADR-006 — The "same shape" defect is fixed by the lens model

**Status** Accepted · **Drives** T5 §4.2

**Context.** `bg-widget-*` resolves its gradient in each element's own box, so every widget shows
the same relative slice of the same gradient at the same relative scale. The brief: *"every widget
that uses it occupies the SAME SHAPE, which makes it really ugly."*

**Decision.** Move articulation to the viewport-sized `page` surface; make `widget` a translucent
tint plus a stronger lens. Widget appearance then depends on position, because it is a window onto
one shared field.

**Alternatives rejected.**
- *`background-attachment: fixed`* — would do this directly, and is unusable: iOS Safari has never
  implemented it reliably, it breaks with `border-radius` + `overflow: hidden`, and it defeats
  compositing on scroll.
- *JS-measured background offset per element* — a `ResizeObserver` plus scroll handler writing a
  `background-position` per widget. Correct, and exactly the kind of thing P1 exists to eliminate.
- *Accept it and only add variation* — variation alone gives 8 shapes instead of 1. Better, not
  fixed.

The lens model is also where the visual language already points (the `/design` copy describes
"translucency" and "a vivid, glass-like aesthetic"), and it makes the existing multi-layer `page`
gradients — `vitreous` has 5 layers, `penumbra` has 11 — do visible work instead of hiding behind
opaque widgets.

---

## ADR-007 — Documents: Markdown + `remark-directive`, transported as hast

**Status** Accepted · **Drives** D2

**Context.** The brief offers two options — "json-ized" blocks or MDX — and doubts MDX fits because
"that one is usually compiled time as an alternative to jsx."

**Decision.** Author in Markdown extended with `remark-directive`. Parse once on the server with
`unified`. Transport the resulting `hast` as JSON. Render with `hast-util-to-jsx-runtime` on either
side.

**Why not MDX.** Content lives in S3 and is fetched at revalidation time *and* by the browser for
the window readers. MDX forces one of: shipping the compiler to the client (~200 KB+), a server
round-trip per document returning a compiled RSC payload, or deleting client-side document
rendering. It also makes content non-statically-analysable, so mechanical migration and linting of
five years of documents become impossible. The brief's doubt is correct.

**Why not JSON blocks.** They solve durability and validation but cost the authoring experience
(Markdown inside escaped JSON string literals) and do not address the inline case at all — an
inline glyph or `:kbd[⌘K]` inside a paragraph cannot be a block.

**Why hast on the wire.** One parse, cached; the client ships ~20–25 KB min (`hast-util-to-jsx-runtime`
plus its `property-information` data table — measured by V-9, not the 5 KB the package page
suggests) instead of a full parser plus `highlight.js` plus KaTeX; the RSC path and the client path share one renderer and one registry;
TOC, reading time, and plain-text extraction become tree walks instead of regexes.

---

## ADR-008 — Inline marks adopt real Markdown syntax, breaking existing content

**Status** Accepted · **Drives** D2 §5, D6 §2

**Context.** The current inline grammar has `*x*` = strong and `_x_` = emphasiz — inverted from
Markdown — plus `|x|` for mark and `~~{t}{u}~~` for links (where `~~` means strikethrough in GFM).

**Decision.** Use Markdown: `*x*`/`_x_` emphasiz, `**x**` strong, `==x==` mark, `[t](u)` links,
`~~x~~` strikethrough. Migrate existing content mechanically.

**Why accept a breaking content change.** The inversion is a five-year-old trap that will keep
producing authoring mistakes. `restoreDisplayText`'s regex inverse of the current grammar cannot
handle escaping or nesting and is used to build `<meta name="description">`, so descriptions
containing `*` are already broken in search results. The migration is mechanical and verifiable.

---

## ADR-009 — S3 conditional writes for concurrency

**Status** Accepted, pending verification (V-5) · **Drives** D4 §3

**Context.** The brief notes S3 "is probably not safe for concurrent stuff like commenting" and
rules out a database. Read-modify-write on a single object loses updates.

**Decision.** `PutObject` with `IfMatch: <etag>` for updates and `IfNoneMatch: "*"` for creates,
wrapped in `mutateJson` with bounded jittered retry. Every mutation goes through it.

**Why this works.** It is optimiztic concurrency control. A concurrent writer's precondition fails
with 412, it re-reads, and it re-applies its pure `update` against the winner's state. Combined with
id-addressed mutations (ADR-010) it eliminates lost updates without any coordination service.

**Fallback if unavailable.** Key partitioning — one object per comment — which makes collisions
structurally impossible at the cost of `ListObjectsV2` + N GETs per thread read. Specified in
D4 §3.3 so the design is not blocked on the platform check. Decide in `D4-02`.

---

## ADR-010 — Comments get UUID v7 identities

**Status** Accepted · **Drives** D1 §5

**Context.** Comments are addressed by array index and guarded by comparing author/content/date.
Under concurrency the index is wrong and the guard produces "please refresh the page".

**Decision.** Every comment and reply carries a UUID v7 `id`. All mutations address ids.
`Reply.to` (a display *name*) becomes `toId`.

**Why v7 over v4.** v7 is lexicographically time-ordered, so the thread sorts by id and a new
comment appends. `uuid@14` provides it and is already a dependency.

---

## ADR-011 — Server Actions for mutations, Route Handlers for client reads

**Status** Accepted · **Drives** D3 §1

**Context.** 21 route handlers with ~500 lines of client `fetch` wrappers. The brief asks about
"which protocol to use".

**Decision.** RSC direct calls for server reads; Server Actions for mutations; `/api/v1/*` Route
Handlers only for reads the client needs and for third-party consumers.

**Why not tRPC or GraphQL.** One client, one server, one repository. A typed direct function call
is strictly better than a schema layer over HTTP for that topology. GraphQL's value is
client-specified shapes across many clients; there is one. tRPC's value is type safety across a
network boundary; Server Actions provide that natively in this framework.

**What this buys.** Deletion of the client data layer; `sub` disappears from every signature
because the session is the identity; `revalidateTag` in the same function as the mutation;
progressive enhancement.

---

## ADR-012 — Zustand for state

**Status** Accepted · **Drives** D5 §1

**Context.** One 40-field settings object in React context, consumed by 115 files. Any change
re-renders all of them.

**Decision.** Zustand v5 with `subscribeWithSelector`, `persist`, `immer`. Six slices.

**Why not `useSyncExternalStore` by hand.** Genuinely viable and dependency-free. Rejected because
`persist`'s versioned `migrate` is exactly the settings-migration mechanism this spec needs (D6 §5),
and re-implementing it correctly — with throttled writes, partialization, and cross-tab
consistency — is more code than the 4 KB dependency.

**Why not split contexts.** A context still re-renders every consumer when its value changes, so
`windows` would still re-render every window on any window's change.

**Why not Redux Toolkit / Jotai.** RTK's ceremony buys nothing at this scale. Jotai's atom
granularity fits, but settings must be persisted and migrated as a unit, which atoms make awkward.

---

## ADR-013 — The navbar center becomes a command surface, not a status display

**Status** Accepted · **Drives** U2

**Context.** The brief describes a Dynamic Island concept and two objections: not enough to show,
and fluid animation "virtually impossible with bare html/css."

**Decision.** Build a command palette first (`⌘K`), then a context strip that hosts it and carries
contextual status by priority. Stage it so the palette ships independently.

**Why.** The animation objection is retired by platform features that have since shipped:
`interpolate-size`, `transition-behavior: allow-discrete` + `@starting-style`, View Transitions,
Popover API, anchor positioning, scroll-driven animation (U2 §1). The "nothing to show" objection is
correct for a status display and is answered by changing the occupant: this site has 59 themes, 16
window widgets, 9 destinations, 4 disjoint search boxes, and 24 settings, none of which are
globally reachable. A palette unifies them, which is a capability gain rather than a decoration.

**Explicitly staged** so that if the strip is cut, the palette and the scroll-listener removal still
land.

---

## ADR-014 — Backdrop scenes declare palette requests; six scenes stay fixed

**Status** Accepted · **Drives** T6 §3, §3.1

**Context.** No backdrop reads the theme; every one embeds its palette as literals, in GLSL, CSS, or
SVG assets. The brief: "animated backgrounds are designed with a specific color scheme in mind,
making reusing them much harder."

**Decision.** A scene declares named color requests; the theme binds them to `ColorRef`s. For SVG
assets, prefer inlining (fills reference custom properties) or `mask-image` (the asset becomes a
stencil). Six pictorial scenes — `birthday20`, `projects`, `photos`, and three others — are declared
`themeable: false`.

**Why the exception is honest.** Those six are illustration, not palette application. Recoloring a
multi-hue illustration produces worse output than leaving it. The Studio shows them as "fixed
palette" rather than offering controls that do nothing.

---

## ADR-015 — 36 scenes consolidate to ~20, verified individually

**Status** Accepted · **Drives** T6 §6

**Context.** Three r3f scenes are byte-identical shaders differing in two `vec3` constants; several
DOM scene groups share structure.

**Decision.** Consolidate along the T6 §6 table, targeting 20–22 scenes (T6 C10 gates at ≤ 22). Every merge is A/B screenshot-verified against the
pre-migration build at the theme that used it. **A merge that cannot reproduce its originals within
tolerance is abandoned and both scenes kept.**

**Why the escape clause is in the decision.** Consolidation is opportunistic; visual fidelity is
not. Writing the abandonment condition into the ADR prevents a later implementer from forcing a
merge to hit a file-count target.

---

## ADR-016 — Built-in themes ship as static CSS; only edited themes compile at runtime

**Status** Accepted · **Drives** T4 §4, §5

**Context.** The theme is currently computed in a client component wrapping the entire tree, so
first paint is unthemed and every settings change recomputes four shade maps and ten gradient
strings.

**Decision.** Compile all 59 themes × schemes at build time into `themes.generated.css`, selected
by `<html data-theme data-scheme>` set on the server. Runtime `compile()` runs only for a
non-built-in (user or draft) theme.

**Why.** Correct first paint with zero client JS; theme switching becomes one attribute flip;
`compile()` stays on the hot path only where it is genuinely needed (the Studio). Estimated cost
~8 KB brotli, against a 60 KB gate.

**Escape.** If the payload exceeds the gate, emit only the default theme statically and lazily fetch
`themes/<id>.css` on switch. Decide with the measurement, not in advance.

---

## ADR-017 — `themes.generated.css` is committed

**Status** Accepted · **Drives** T4 §4

**Decision.** Commit the generated CSS.

**Why.** It is deterministic output of committed input, so CI can assert freshness with
`git diff --exit-code`, and — more importantly — a reviewer sees color changes in the PR diff. A
generated artifact that nobody reviews is where theme regressions hide.

---

## ADR-018 — kebab-case paths, camelCase JSON

**Status** Accepted · **Drives** 02-conventions §2, D3 §2.1

**Context.** The brief: "camelCase are usually not preferred in modern apis."

**Decision.** Path segments kebab-case; JSON field names camelCase.

**Why the split.** Paths are read by humans, appear in logs, and benefit from
case-insensitivity-safety — kebab-case is the convention. JSON fields are consumed by TypeScript,
and camelCase means the wire type and the domain type are structurally identical: no mapper, no
drift. This matches Google's API Improvement Proposals. snake_case JSON is a Rails/Python
convention with no benefit in a TypeScript-only stack; adopting it would add a serialization layer
to satisfy a convention borrowed from another ecosystem.

---

## ADR-019 — `interfaces/` global ambient types are deleted

**Status** Accepted · **Drives** 02-conventions §3, P1 §8

**Context.** 17 files with no imports or exports put ~90 type names in global scope.

**Decision.** Convert to modules, colocated by domain, exported explicitly.

**Why it is an architecture issue, not tidiness.** With no module graph there is nothing to tell you
that a client component depends on a type declared beside server-only code, and nothing to prevent
the reverse. Conversion is what makes `no-restricted-paths` enforceable, which is what makes the
client/server boundary real. It also makes rename-safety and go-to-definition work.

---

## ADR-020 — The image-delivery decision is deferred to measurement

**Status** Open, owner `P3-02` · **Drives** P3 §3.1

**Context.** `images.unoptimized: true` with the comment "turning this on for now since limit
reached". Every image is served at full original resolution.

**Options.** (1) Pre-generate 4 widths × AVIF + WebP into S3, serve via `srcset` or a custom
`next/image` loader. (2) Same derivatives, plain `<img srcset>`, no `next/image`. (3) Re-enable
Vercel optimization with a lower cap.

**Why deferred.** The choice turns on measured storage cost across ~1 200 images and on whether
`next/image`'s remaining features (lazy loading, `placeholder`) justify the abstraction once
`srcset` is pre-generated. Both (1) and (2) require the same generation step, which is added to the
migration regardless. Decide with numbers.

**Not deferred:** that this is the largest performance win available on the site, and that it is
independent of everything else in this spec.
