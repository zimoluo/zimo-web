# X5 — Risk register

Each risk has a **trigger** (how you know it is happening), a **mitigation** (what is already in the
design to prevent it), and a **contingency** (what to do if it happens anyway). A risk without a
contingency is not managed.

---

## R-01 · The Tailwind v4 migration breaks appearance in ways nobody notices

**Severity** high · **Likelihood** high · **Phase** 3

Every file is touched. The renames are subtle: `shadow-lg` shifts meaning, the default border color
becomes `currentColor`, `ring` narrows from 3 px to 1 px, and `shadow-xs` already means something
custom in this codebase.

**Trigger** Visual regression reports diffs the reviewer cannot attribute.

**Mitigation** `P5-06` and `P5-07` land against v3 first, so the two traps are neutralized before
the migration. The 1 062-screenshot harness runs on the migration PR. `@tailwindcss/upgrade`'s diff
is reviewed in full, not accepted.

**Contingency** The migration is one phase with no other work in flight (X1 §3), so revert is a
single-branch operation. If specific utilities are unresolvable, keep a v3-compatibility CSS layer
defining the old names explicitly and retire it incrementally.

---

## R-02 · Document migration corrupts prose

**Severity** high · **Likelihood** medium · **Phase** 4

D6 §2 step 5 rewrites inline marks. A naive `String.replace` would corrupt fenced code, inline code,
URLs, and directive attributes. Five years of writing is at stake.

**Trigger** The golden render diff shows changes in text content rather than markup.

**Mitigation** The rewrite operates on a `micromark` inline token stream, not on strings (D6 §2,
D2 C4). Every document is rendered before and after and diffed. `--only` allows one document at a
time. Backups precede every write.

**Contingency** Content is in S3 with a backup and (if versioning is on) version history. Restore is
tested (D6 C6). If the token-stream rewrite proves unreliable, drop the mark migration entirely: keep
the legacy inline grammar behind a `formatVersion: 1` flag on those documents and accept two
grammars until they are hand-migrated. Losing ADR-008's benefit is much cheaper than losing prose.

---

## R-03 · S3 conditional writes are unavailable

**Severity** medium · **Likelihood** low · **Phase** 4

ADR-009 rests on `PutObject` supporting `IfMatch`/`IfNoneMatch`.

**Trigger** `V-5` fails.

**Mitigation** The check is a discrete task (`D4-02`) *before* implementation, and the fallback is
fully specified (D4 §3.3).

**Contingency** Key partitioning: one object per comment. Costs `ListObjectsV2` + N GETs per thread
read instead of 1 GET; eliminates collisions structurally. Gate S9 is met either way.

---

## R-04 · Migrated themes look subtly wrong

**Severity** high · **Likelihood** low · **Phase** 2

59 hand-designed themes are the site's identity. A systematic shift would be a real regression, and
"subtly wrong" is exactly what a screenshot reviewer misses.

**Trigger** `maxDeltaEOk > 0.002` for any theme, or the property-equivalence check (X4 §4.2) fails.

**Mitigation** Exact lift with per-role deviations rather than a refit (T9 §1) — reproduction is
exact by construction, and the ΔE assertion catches any lapse. Property equivalence runs on every
commit, without a browser, so a regression is caught in seconds rather than at review. Missing roles
default to aliases of existing ones (T9 §3), so the four new slots cannot introduce a shift.

**Contingency** A theme that will not lift cleanly is authored with `literal` overrides on every
role — which reduces it to exactly what it is today, at the cost of not tracking its seed. Per
theme, not global.

---

## R-05 · Auto-generated dark schemes are poor

**Severity** low · **Likelihood** high · **Phase** 2

Mirroring gives 27 light themes a dark presentation for free. Free is not the same as good.

**Trigger** A mirrored dark scheme reads flat, low-contrast, or muddy.

**Mitigation** `darkReviewed: false` on every generated scheme, and the picker does not offer it
until a human sets it true (T9 §10). Shipping unreviewed generated output is exactly what this spec
exists to prevent.

**Contingency** None needed — this is the design. Reviewing 27 dark schemes is ordinary design work
that can happen at any pace after the migration, and the contrast gate (U3 §3.5) will flag the worst.

---

## R-06 · The lens model makes the site worse

**Severity** medium · **Likelihood** medium · **Phase** 3

T5 §4.2 deliberately changes appearance: widgets become more translucent, the backdrop more present.
It is the fix for the brief's "same shape" complaint, and it is a judgment call about taste.

**Trigger** Text legibility drops on articulated backdrops; widgets stop reading as distinct
surfaces.

**Mitigation** `T5-05` is an explicit A/B review task across six themes, tuning `widget` alpha and
blur by eye, before it lands. The contrast report (U3 §3.5) covers all 59 themes × 2 schemes on every build, and the AA gate is
enforced on `defaultSurfaces` — which is exactly where the lens-model values live — so a change
that makes the default `widget` illegible fails CI rather than shipping.

**Contingency** Alpha and blur are per-theme surface values, not global constants. Raise `widget`
alpha back toward opacity for the themes where the field is too busy, and keep the variation
mechanism (T5 §4.3) as the fallback answer to sameness. The two fixes are independent by design.

---

## R-07 · Scene consolidation loses fidelity

**Severity** low · **Likelihood** medium · **Phase** 5

36 → 20–22 scenes assumes the merges are behavior-preserving.

**Trigger** An A/B screenshot for a retired scene's originating theme fails.

**Mitigation** ADR-015 writes the abandonment condition into the decision: a merge that cannot
reproduce its originals is abandoned and both scenes kept. Each merge is verified individually
(T6 C10).

**Contingency** Keep the scene. The contract, palette injection, shared canvas, and quality
resolver — the parts that deliver O4 — are independent of consolidation.

---

## R-08 · Store migration destabilises everything at once

**Severity** high · **Likelihood** medium · **Phase** 4

`D5-03` ports 115 files off `useSettings`. It is the widest single change in the program and it can
produce stale-state bugs that only appear in interaction.

**Trigger** State-related bugs after the port; components not updating when they should.

**Mitigation** `D5-03` is explicitly split per feature directory (X2, XL table). During the
transition a compatibility shim exposes `useSettings()` reading from the store, so files can be
ported in batches while the tree stays working. The shim is removed by `D5-05` and its removal is
gated by the lint rule (FN-11).

**Contingency** The shim can persist longer than planned without blocking anything else; it costs
one over-subscribing hook, which is where the codebase already is.

---

## R-09 · The context strip absorbs effort and ships nothing

**Severity** low · **Likelihood** medium · **Phase** 6

The most speculative item, and the least load-bearing. It has stalled once already.

**Trigger** U2-03 or U2-04 running long.

**Mitigation** Staged so `U2-01` (scroll listener → CSS) and `U2-02` (command palette) each stand
alone and ship independently. The spec explicitly says not to build the strip before the palette.

**Contingency** Cut U2-03 through U2-05. The two items with the most value are the two that do not
depend on the strip existing.

---

## R-10 · Rate limiting is per-instance and therefore weak

**Severity** low · **Likelihood** certain · **Phase** 4 · **Accepted**

D3 §7 uses module-state token buckets. Vercel serverless instances are not shared, so the limit is
per-instance.

**Trigger** Abuse from a distributed source.

**Mitigation** None available without infrastructure, which is out of scope.

**Contingency** Vercel KV or Upstash Redis for a shared counter — one adapter swap behind the same
interface. Deliberately deferred: for a single-author site with occasional visitors, best-effort
per-instance limiting is infinitely better than the current zero, and the upgrade path is one file.

---

## R-11 · Image derivative generation is slow or expensive

**Severity** low · **Likelihood** medium · **Phase** 4

~1 200 images × 4 widths × 2 formats.

**Trigger** Generation takes hours, or S3 storage cost rises noticeably.

**Mitigation** `P3-02` decides on measured cost before generation. `D6-03` is resumable and
concurrent. Derivatives are generated during the migration, which is already reading every image for
dimensions.

**Contingency** Reduce to 2 widths × WebP only, or generate on demand and cache. Even the reduced
version captures most of the win, because the current state is full-resolution originals with
`priority` on every one.

---

## R-12 · The program stalls mid-way, leaving the codebase worse than either endpoint

**Severity** high · **Likelihood** medium · **Ongoing**

12 weeks of work with several phases that touch everything. A half-migrated codebase with two theme
engines and two document formats would be worse than the current one.

**Trigger** A phase stalls for more than two weeks.

**Mitigation** Every phase ends at a buildable, working state (X1 §2). Phase 2 deliberately does not
switch anything over — it verifies against the current build instead — so it can sit complete and
unused indefinitely. X1 §4 lists five items shippable independently.

**Contingency** Stop at a phase boundary. In descending order of standalone value if the program
halts:
1. Phase 1 (foundation) — strictly better regardless; nothing depends on the rest.
2. `P3 §3` image delivery + `U2-02` palette + `U2-01` scroll + `D3 §6.1` polling — four independent
   user-visible wins.
3. Phase 2 (color + schema + compiler + migration) — complete and verified, dormant.
4. Phase 4 data work without Phase 3's Tailwind migration — possible but awkward, since surfaces
   depend on v4; prefer to keep 3 and 4 together.

The one thing not to do is start Phase 3 and stop inside it.

---

## R-13 · The spec drifts from the code

**Severity** medium · **Likelihood** high · **Ongoing**

162 tasks across seven phases, potentially several agents. A spec that no longer describes the code
is worse than no spec, because it is trusted.

**Trigger** A reviewer finds an implementation contradicting a spec document.

**Mitigation** `X1 §5`: a PR that diverges from the spec **updates the spec in the same PR**, with
an ADR. `X-05` reconciles the audit at the close.

**Contingency** Treat the code as truth and rewrite the affected document. Do not leave both.

---

## R-14 · Accessibility work is deferred into nonexistence

**Severity** medium · **Likelihood** medium · **Phase** 6

Phase 6 is last, and last phases get cut.

**Trigger** Phase 6 compressed or dropped.

**Mitigation** Accessibility obligations are embedded in each engine's own acceptance criteria
(P2 C11, P3 C11, P4 C10, T8 C8) rather than deferred wholesale, and axe-core runs in CI from Phase 1.
Phase 6 is the *sweep*, not the whole of it.

**Contingency** If Phase 6 is cut, gate S13 (axe-core clean) still holds from CI, and the per-engine
criteria still hold. What is lost is the global sweep: focus styles, announcements, forced-colors.
Of those, global `:focus-visible` (`U3-01`, size S) is the one to keep at any cost — it is one CSS
rule and the site currently has none.
