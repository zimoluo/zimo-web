# X4 — Verification

How every claim in this spec is checked. §5 is the list of platform facts to confirm before relying
on them — confirm them once, at the start of the relevant workstream, rather than trusting prose.

## 1. Test layers

| Layer | Tool | Scope | Runs |
| --- | --- | --- | --- |
| Unit | Vitest | Pure logic: color, ramp, resolve, compile, solvers, marks, migrations | every commit |
| Property | Vitest + `fast-check` | Invariants: gamut membership, monotonicity, queue conservation, mark round-trips | every commit |
| Compile-fail | `tsd` or `expect-type` | Type-level guarantees (T3 C2, D1 C8) | every commit |
| Golden file | Vitest snapshots | Theme CSS per theme × scheme; document render per document | every commit |
| Contract | Vitest + `next-test-api-route-handler` | One test per `ErrorCode` per endpoint | every commit |
| Integration | Vitest against a scratch S3 prefix | Conditional writes, concurrency, migration idempotency | pre-merge |
| Visual | Playwright + per-pixel ΔE_OK | 59 themes × 6 routes × 3 viewports | on theme/style PRs |
| Perf | Playwright + React profiling build | 9 scenarios | on engine PRs |
| Accessibility | Playwright + axe-core | 9 routes + 3 overlay states | every commit |

Nothing in this list requires infrastructure the project does not already have, except a scratch
S3 prefix for integration tests.

## 2. Charter gate map

| Gate | Checked by |
| --- | --- |
| S1 adding a theme touches one file + one registry line | review; T3 C7 |
| S2 theme switch = 0 React commits | `profile.ts theme-switch`; T4 C8 |
| S3 window drag = 0 React commits | `profile.ts window-drag`; P2 C2 |
| S4 stop scrub re-renders ≤ 1 component | `profile.ts stop-scrub`; T8 C1 |
| S5 theme CSS < 60 KB br | `tools/size-report.ts`; T4 C7 |
| S6 zero `@apply` | `grep -rho "@apply" src/ \| wc -l` = 0; P5 C2 |
| S7 zero ambient globals | no `interfaces/`; `tsc --listFiles` shows no global-only `.d.ts`; FN-04 |
| S8 any backdrop under any theme | 36 × 6 screenshot matrix; T6 C5 |
| S9 concurrent comments lose nothing | integration test; D4 C5 |
| S10 document round-trip | golden render diff; D2 C4, D6 C3 |
| S11 blog route JS ≤ 60 % | bundle analyzer vs `P1-03` baseline |
| S12 reduced motion suppresses non-essential motion | assertion in §4.3; U3 C5 |
| S13 axe-core clean | CI; U3 C3 |
| S14 test infrastructure + coverage | `npm run test:coverage`; thresholds in `03-hygiene §1`; H-01 |
| S15 CI runs the six checks on every PR | `ci.yml` present and green; H-02 |
| S16 error/not-found boundaries; mistyped slug → 404 | integration test per route + manual; H-03 |
| S17 American spelling | `tools/lint-spelling.ts`; FN-13 |

## 3. Perf scenarios

`tools/perf/profile.ts <scenario>` — Playwright driving the React profiling build, recording React
commit count and durations, long tasks, layout count, style recalculations, and `localStorage`
write count.

| Scenario | Script | Primary assertion |
| --- | --- | --- |
| `theme-switch` | switch built-in theme 10× | 0 commits outside the theme host |
| `window-drag` | open 5 windows, drag one 3 s | 0 commits; 0 store writes until release |
| `window-resize` | resize a window 3 s | 0 commits for other windows |
| `stop-scrub` | drag a gradient stop 3 s | ≤ 1 component; ≤ 1 compile/frame; 0 `localStorage` writes |
| `hue-drag` | drag the Studio hue wheel 3 s | palette + surfaces + mark + r3f scene all update; 0 scene commits |
| `image-page` | swipe a 7-image viewer through all pages | 1 commit per settled page |
| `toast-burst` | push 12 notifications in 2 s | none dropped; 0 commits outside the layer |
| `route-nav` | `/` → `/blog` → article → back | no long task > 200 ms |
| `comment-post` | post a comment | 1 optimiztic commit, 1 settle commit, 0 polls |

Baselines from `main` are committed under `tools/perf/baselines/`. CI fails a PR that regresses a
scenario by more than 15 %.

## 4. Specific harnesses

### 4.1 Visual equivalence

`tools/visual/capture.ts` + `tools/visual/compare.ts`. Detailed in T9 §5.

- 59 themes × 6 routes × 3 viewports = 1 062 comparisons.
- Backdrop animation frozen by forcing `prefers-reduced-motion`; fonts preloaded; a fixed date
  injected so seasonal themes and relative timestamps are stable.
- Animated-backdrop pixels are masked out by rendering each build twice and excluding pixels that
  differ between two runs of the *same* build.
- Gate: no screenshot exceeds 0.5 % of pixels above ΔE_OK 0.02, and no pixel above 0.05.
- Intentional changes (the lens model, T5 §4.2) are excluded **by name** in the tool's config, so
  "we turned the check off" is visible in a diff.

### 4.2 Theme property equivalence

Stronger than pixels and much faster, so it runs on every commit. For each theme × scheme, compare
`compile(resolve(lifted))` against the **current build's** computed custom properties for that
theme. T4 C5, T9 C6. This is the primary guard during Phase 2, before anything is switched over,
and it needs no browser.

The two namespaces do not correspond one-to-one, so the comparison runs off an explicit map.
`tools/verify-theme-properties.ts` owns it.

| v10 property | v11 property | Comparison |
| --- | --- | --- |
| `--color-primary` (`"R G B"`) | `--zw-role-text` (`oklch()`) | parse both to `Oklch`; ΔE_OK ≤ 0.002 |
| `--color-saturated` | `--zw-role-text-muted` | same |
| `--color-pastel` | `--zw-role-fill` | same |
| `--color-light` | `--zw-role-panel` | same |
| `--color-highlight-light` | `--zw-role-edge` | same |
| `--color-darklight-light` | `--zw-role-shade` | same (T9 §3 asserts this one directly) |
| `--color-highlight-{primary,saturated,pastel}` | *(none)* | **dropped by design.** v11 has one `edge`, not four. Assert only that each v10 value is within ΔE_OK 0.06 of `--zw-role-edge` — they were all near-white tones of the same hue family — and report the spread. |
| `--color-darklight-{primary,saturated,pastel}` | *(none)* | same, against `--zw-role-shade` |
| `siteThemeColor` (config field) | `--zw-role-brand` | ΔE_OK ≤ 0.002 |
| `--bg-page` | `--zw-surface-page-image` + `-base` | render both to a 256×256 offscreen canvas in jsdom-with-canvas, compare per pixel within 1/255. String comparison is useless — the syntaxes differ legitimately. |
| `--bg-page-minimal` | `--zw-surface-page-reduced-image` | same |
| `--bg-widget-10 … -100` (10 properties) | `--zw-surface-widget-image` + `-base` + `-alpha` | for each `N`, set `--zw-surface-widget-alpha: N/100`, composite `-base` under `-image`-at-that-opacity, compare against `--bg-widget-N` per pixel within 1/255. This is the assertion that the §1.1 mechanism is equivalent to the ten strings it replaces. |
| `--reading-blur` | `--zw-reading-blur` | exact |
| *(none)* | `--zw-role-line`, `--zw-role-accent` | **new.** Both default to an alias of `textMuted` (T9 §3), so assert they equal `--color-saturated` — a non-match means the lift invented a color. |
| *(none)* | `--zw-backdrop-*` | new; no v10 counterpart. Not compared. |

Two rows deserve emphasiz. The `--bg-widget-*` row is the only mechanical proof that the
`opacity`-on-a-paint-layer design (T4 §1.1) reproduces the ten precompiled strings — without it,
gate S5's byte saving could be bought with a visual regression nobody notices. And the
`highlight-*`/`darklight-*` rows are where v11 deliberately loses information (four values become
one); stating the tolerance and reporting the spread is how that stays a decision rather than a
surprise.

### 4.3 Reduced motion

```ts
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(route);
await page.waitForTimeout(600);
const long = await page.evaluate(() =>
  document.getAnimations().filter(a =>
    (a.effect?.getComputedTiming().duration as number ?? 0) > 50).length);
expect(long).toBe(0);
```
Plus a `requestAnimationFrame` stub asserting no callback after settle, run per route and with each
backdrop scene active.

### 4.4 Concurrency

Against a scratch prefix (`test/<uuid>/`):
- 20 parallel `addComment` → 20 comments, all distinct ids.
- 20 parallel `setEntryReaction` from 20 subjects → 20 entries.
- 5 forced 412s → `mutateJson` succeeds within its retry budget.
- 6 forced 412s → throws `conflict` with a user-facing message.
- `update` purity: called twice with the same input, identical output (no new uuid, no new
  timestamp).

### 4.5 Migration

- **Idempotency**: run each step twice; second run reports 0 changes.
- **Restore**: migrate a copied prefix, restore from backup, assert byte-identical.
- **Coverage**: `migrateSettings` covers all 41 legacy fields — the test fails if a field lacks a
  row.
- **Document fidelity**: for every document, render pre-migration source through the old pipeline
  and post-migration source through the new one, normalize (sorted attributes, collapsed
  whitespace, ids stripped), diff. Every non-empty diff must match an entry in
  `tools/migrate/documents/expected-diffs.ts`.

## 5. Platform facts to confirm

Confirm each once, at the start of the workstream that depends on it. Record the result in the
task's PR. These exist so no implementer has to trust prose about a moving platform.

| # | Claim | Check | Needed by |
| --- | --- | --- | --- |
| **V-1** | v4 CSS-first config: `@import "tailwindcss"`, `@theme`, `@theme inline` | Minimal repro: define `--color-x: var(--y)` in `@theme inline`, assert `bg-x/50` emits `color-mix(...var(--y)...)` and tracks a runtime `--y` change | P5-02 |
| **V-2** | `@utility` supports functional values via `--value()` | Minimal repro for `surface-variant-*` with `--value(integer)` | T5-02 |
| **V-3** | Custom utilities support the `/alpha` modifier, or the functional form is needed instead | Try `surface-widget/80`; if unsupported, use `surface-widget-80` | T5-02 |
| **V-4** | `@apply` in a CSS Module requires `@reference` in v4 | Confirm the failure mode, to justify elimination rather than accommodation | P5-04 (informational) |
| **V-5** | S3 `PutObject` supports `IfMatch` / `IfNoneMatch` in this bucket and region | `aws s3api put-object --if-none-match '*'` twice; expect 412 on the second. Then `--if-match <wrong-etag>`; expect 412 | D4-02 |
| **V-6** | AWS SDK v3 `PutObjectCommand` exposes `IfMatch` | Type check + a live call | D4-02 |
| **V-7** | Bucket versioning state | `aws s3api get-bucket-versioning` | D4-05 |
| **V-8** | `remark-directive` container/leaf/text forms behave as documented for our three shapes | Fixture parse of the three forms with attributes | D2-01 |
| **V-9** | `hast-util-to-jsx-runtime` bundle size in a client chunk | Bundle analyzer on a window-reader route | D2-04 |
| **V-10** | `scrollend` support on the target Safari version; the `IntersectionObserver` fallback path is exercised | `"onscrollend" in window` in Playwright's WebKit | P3-01 |
| **V-11** | `document.startViewTransition` in the three target engines | Feature-detect in Playwright's three browsers | P3-04, U2-04 |
| **V-12** | `interpolate-size: allow-keywords` support and the fallback when absent | Minimal repro; confirm the strip degrades to no size animation | U2-03 |
| **V-13** | Next 16 `use cache` + `cacheLife` + `cacheTag` + `revalidateTag` semantics, **and the exact name of the config flag that enables them** (`cacheComponents` vs `experimental.dynamicIO`) | Set the flag, add a route with `cacheTag`, invalidate, observe | D3-05 |
| **V-14** | Server Actions' origin/CSRF protections on the deployed version | Read the framework docs for the pinned version; attempt a cross-origin POST | D3-03 |
| **V-15** | **The surface-alpha mechanism (T4 §1.1).** Setting `--zw-surface-widget-alpha` on an element changes its rendered alpha, and the same value declared inside an image string on `<html>` does **not**. | 10-line HTML repro, both forms, screenshot or `getComputedStyle` on the `::before` | T4-01 — **blocks it** |
| **V-16** | `tailwindcss@4.x` latest published version and that `@tailwindcss/postcss` matches it | `npm view tailwindcss version` | P5-01 |

**V-5 and V-6 gate ADR-009.** If they fail, take the key-partitioning fallback (D4 §3.3) — the
design is specified for both and neither is a blocker.

## 6. Manual checklist, per release

Automated tests do not cover these. Run them before shipping each phase.

**Accessibility**
- [ ] Keyboard-only: navigate every route; open, move, resize, close a window; page an image viewer;
      open and use the palette; post a comment; change a theme.
- [ ] VoiceOver (macOS + iOS): read an article; post a comment; open a window; change a theme.
- [ ] NVDA (Windows): the same four tasks.
- [ ] 200 % browser zoom, and 320 px viewport width.
- [ ] `forced-colors: active` — every route legible.
- [ ] All focus indicators visible against every surface on 6 sample themes.

**Theme**
- [ ] Six themes × light and dark: read an article, open the Studio, open three windows.
- [ ] Studio: drag hue through 360° and confirm palette, surfaces, mark, and backdrop all track.
- [ ] Import a v1 profile exported from the current production site; confirm it renders identically.
- [ ] Switch theme with a running r3f backdrop; confirm no remount and no flash.

**Content**
- [ ] Spot-check 10 migrated articles against production, side by side.
- [ ] Every directive type renders in at least one migrated document.
- [ ] RSS feed validates and its item links resolve.

**Cross-browser**
- [ ] Safari (macOS + iOS), Chrome, Firefox: home, blog article, album, Studio.
- [ ] iOS specifically: window system absent (correct), image viewer swipe, side menu, notifications.

## 7. CI pipeline

```
lint → typecheck → unit + property + compile-fail + golden + contract → build
  → bundle size gate → axe-core → perf scenarios (engine PRs)
  → visual regression (theme/style PRs) → integration (pre-merge)
```

Fail conditions: any test failure; bundle regression > 10 % on any route; perf regression > 15 % on
any scenario; any serious/critical axe violation; `themes.generated.css` not byte-identical after
regeneration; visual regression outside the §4.1 gate.
