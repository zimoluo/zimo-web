# X7 — Platform check results

`X4 §5` lists 16 platform facts to confirm "before the code that depends on them", stated as checks
rather than asserted as facts because network access was unavailable when the spec was written.

**Result: 8 confirmed, 1 partly confirmed, 2 refuted with their fallbacks confirmed, 2 inconclusive,
3 not performed.**
Both of the spec's designated blockers are resolved or triaged: **`V-15` is CONFIRMED, so `T4-01` is
unblocked**; `V-5` is inconclusive for an environment reason stated in §2.1 and must not be read as
a refutation.

Toolchain: `node v26.0.0`, `npm 11.12.1`, `tailwindcss@4.3.3`, `@tailwindcss/cli@4.3.3`,
`unified`/`remark-parse`/`remark-directive`/`remark-gfm`, `@aws-sdk/client-s3@3.1063.0`,
Safari 27.0 (WebKit, platform 27.2) driven over WebDriver via `safaridriver`.

Runnable checks live in `docs/spec/appendix/`:

```sh
( safaridriver -p 4455 & )                        # required by the two browser scripts
node docs/spec/appendix/v15-surface-alpha.mjs     # V-15
node docs/spec/appendix/browser-capabilities.mjs  # V-10, V-11, V-12 and 15 more
node --env-file=.env.local docs/spec/appendix/v5-conditional-writes.mjs   # V-5, V-6, V-7
```

## 1. Results

| # | Claim | Result | Evidence |
| --- | --- | --- | --- |
| **V-1** | v4 CSS-first config: `@import "tailwindcss"`, `@theme`, `@theme inline` | **CONFIRMED** | `@theme inline { --color-x: var(--zw-role-text) }` with `bg-x/50` emits `background-color: color-mix(in oklab, var(--zw-role-text) 50%, transparent)` inlined into the utility, under `@supports (color: color-mix(in lab, red, red))`. The variable is read on the styled element, which is what `T1 §7` needs. |
| **V-2** | `@utility` supports functional values via `--value()` | **CONFIRMED** | `@utility surface-variant-*` with `--value(integer)` and class `surface-variant-7` emits `--zw-surface-variant: 7`. |
| **V-3** | Custom utilities support the `/alpha` modifier, or the functional form is needed | **REFUTED for the slash form; fallback CONFIRMED** | §3. Resolved by **ADR-027**. |
| **V-4** | `@apply` in a CSS Module requires `@reference` in v4 | **NOT PERFORMED** | Informational per `X4 §5`; needs a CSS-Modules build (§2.2). Does not gate anything: `P5 C2` requires zero `@apply` regardless. |
| **V-5** | S3 `PutObject` supports `IfMatch`/`IfNoneMatch` in this bucket and region | **INCONCLUSIVE** | Every request failed at the transport layer, never reaching S3 (§2.1). **`D4-02` stays open.** Not a refutation — do **not** adopt the `D4 §3.3` fallback on this basis. |
| **V-6** | AWS SDK v3 `PutObjectCommand` exposes `IfMatch` | **CONFIRMED (types); live half inconclusive** | `@aws-sdk/client-s3@3.1063.0` declares `IfMatch?: string \| undefined` and `IfNoneMatch?: string \| undefined` on `PutObjectRequest`. The live call is blocked with `V-5`. |
| **V-7** | Bucket versioning state | **INCONCLUSIVE** | Same transport failure (§2.1). |
| **V-8** | `remark-directive` container/leaf/text forms behave as documented | **CONFIRMED** | All three parse with attributes: `containerDirective figure {"src":"/a.png","caption":"Container form"}`, `leafDirective video {"src":"/b.mp4","autoplay":""}`, `textDirective abbr {"title":"HyperText Markup Language"}`. **Caveat for `D2`:** a valueless attribute arrives as `""`, not `true`; attribute coercion must handle that. |
| **V-9** | `hast-util-to-jsx-runtime` bundle size in a client chunk | **NOT PERFORMED** | Needs a built route (§2.2). |
| **V-10** | `scrollend` support on the target Safari; the `IntersectionObserver` fallback path | **CONFIRMED** | Safari 27.0: `"onscrollend" in window` → true, and on an element → true. `IntersectionObserver` present, so `P3-01`'s fallback remains available for older Safari. |
| **V-11** | `document.startViewTransition` in the three target engines | **CONFIRMED in WebKit only (1 of 3)** | Safari 27.0: `document.startViewTransition` is a function and `view-transition-name` is supported. Chromium and Gecko are unavailable here (§2.3), so those two columns are unmeasured. |
| **V-12** | `interpolate-size: allow-keywords` support and the fallback when absent | **REFUTED** | Safari 27.0: `CSS.supports("interpolate-size", "allow-keywords")` → **false**. `U2-03` must degrade to no size animation on WebKit. Recorded as **ADR-029**. |
| **V-13** | Next 16 `use cache` / `cacheLife` / `cacheTag` semantics and the config flag name | **PARTLY CONFIRMED** | The flag name is settled: `cacheComponents` is a **top-level** `NextConfig` boolean in the pinned `next@16.2.12` (`server/config-schema.d.ts:61`), and `experimental.cacheComponents` carries `@deprecated use top-level cacheComponents instead` (`config-shared.d.ts:728`). `experimental.dynamicIO` is gone entirely. Runtime *semantics* remain unmeasured, because `npm run build` does not complete here (§2.2). The flag is therefore not enabled yet: turning it on changes caching for every legacy route still under `src/app`, and that cannot be verified without a build. Cache tags are implemented and tested as data so `revalidateTag` has something to name; the `"use cache"` directives land with the RSC page port. |
| **V-14** | Server Actions' origin/CSRF protections on the deployed version | **NOT PERFORMED** | Needs the deployed app (§2.2). |
| **V-15** | **The surface-alpha mechanism (`T4 §1.1`)** | **CONFIRMED** | §4. **`T4-01` is unblocked.** |
| **V-16** | `tailwindcss@4.x` latest published version, and `@tailwindcss/postcss` matches | **CONFIRMED** | Both `4.3.3`. Matched. |

### 1.1 Additional capabilities measured while running V-10 to V-12

Free with the same probe, and each one gates a design elsewhere in the spec. Safari 27.0:

| Feature | Supported | Relevant to |
| --- | --- | --- |
| `oklch()` color | yes | `T2 §6`'s choice of `oklch()` output |
| `color-mix(in oklab, …)` | yes | `T5 §5`, and the alpha modifier of `V-1` |
| relative color syntax `oklch(from … l c h)` | yes | not currently used; available |
| container queries | yes | `U1` |
| `:has()` | yes | `U1` |
| `animation-timeline: scroll()` | yes | `U3`, `U2-01`'s scroll-driven replacement |
| `PointerEvent` + `setPointerCapture` | yes | `02-conventions §4`, `P2 §5` |
| `popover` attribute | yes | `P2 §10` overlays |
| `HTMLDialogElement` | yes | `P2 §10` |
| `position-anchor` | yes | `P2 §10` popovers |
| `content-visibility: auto` | yes | `P1` |
| `transition-behavior: allow-discrete` | yes | `U3 §2` |
| `text-wrap: balance` | yes | `U1` |
| `field-sizing: content` | yes | `U2` |
| **`interpolate-size: allow-keywords`** | **no** | **`U2-03` — see ADR-029** |

Everything the spec's platform baseline assumes is present in WebKit except `interpolate-size`.

## 2. What blocked the remaining six

### 2.1 AWS egress is blocked, but the credentials are present

`V-5`, `V-7` and the live half of `V-6` are inconclusive, and the reason changed during this work.
Credentials (`ZIMO_WEB_AWS_KEY_ID` / `ZIMO_WEB_AWS_SECRET_KEY`) are now available and were loaded.
The remaining obstacle is network policy: outbound connections to S3 fail before any HTTP exchange.

```
sub: Error EPERM connect EPERM 3.5.130.160:443 - Local (0.0.0.0:0)
sub: Error EPERM connect EPERM 52.219.110.234:443 - Local (0.0.0.0:0)
  ... eight endpoints, all EPERM
```

`curl https://zimo-web-bucket.s3.us-east-2.amazonaws.com/` returns HTTP `000` (exit 56), so this is
not an SDK problem and cannot be worked around by changing transport. The npm registry is reachable;
`*.amazonaws.com` is not.

**This must not be misread.** `v5-conditional-writes.mjs` distinguishes a transport failure from an
HTTP rejection and exits `2` with an explicit warning, precisely so that an unreachable bucket is
never recorded as evidence against ADR-009.

**To unblock:** allow `*.amazonaws.com:443`, then re-run the script. It writes only under
`test/v11-platform-checks/<uuid>/` and deletes what it writes, per `03-hygiene §2`'s rule against
testing on production content.

### 2.2 The app is not built or deployed here

`V-4`, `V-9`, `V-14`, and the runtime half of `V-13`. Not blocked in principle, only unmeasured.
`npm run build` was attempted and did not complete: the `[slug]` route layouts fetch from S3 at
build time, and §2.1 applies. A later attempt, after `app/` moved to `src/app/`, sat in
"Creating an optimized production build" for over ten minutes with no output and no error, which is
consistent with the same cause. The *static* half of `V-13` — the config flag's name and shape — is
answered from the pinned package's own type declarations, which needs no build.

### 2.3 Only one browser engine

Safari 27.0 is drivable now that "Allow remote automation" is enabled. Chromium and Gecko remain
unavailable — Playwright installs from npm but its browser binaries come from a blocked CDN:

```
Failed to download Chrome for Testing 151.0.7922.34 (playwright chromium v1234)
Failed to download Chrome Headless Shell 151.0.7922.34
```

This is why `V-11` is confirmed for one engine of three, and why the multi-engine gates remain
unmeasured: `P1-01`'s 1 062-screenshot visual baseline and nine perf traces, `X4 §4.1` visual
equivalence, and `S13`'s axe-core run. **To unblock:** allow `https://cdn.playwright.dev` and the
Chrome-for-Testing storage host.

Note that `safaridriver` will not bind when spawned as a child process, and node cannot open
loopback sockets in this sandbox either. Both browser scripts therefore expect an
already-running driver and use `curl` as their WebDriver transport.

## 3. V-3 in detail

Four forms compiled against `tailwindcss@4.3.3`:

| Form | Class | Emitted? |
| --- | --- | --- |
| static `@utility surface-widget` | `surface-widget` | yes |
| static `@utility surface-widget` + modifier | `surface-widget/80` | **no** |
| functional `@utility surface-b-*` with `--modifier(integer)` | `surface-b-1/80` | yes |
| functional `@utility surface-*` with `--value([*])` in a property *name* | `surface-widget/70` | **no** |

The modifier works, but only on a utility with a value segment for it to attach to, and the role
name cannot become that segment because `--value()` does not interpolate into a custom property's
name. Since each role needs its own `--zw-surface-<role>-*` names, each role needs its own utility,
which leaves nothing for `/70` to bind to. Confirmed working shape:

```css
@utility surface-widget {
  position: relative;
  isolation: isolate;
  background-image: var(--zw-surface-widget-base, none);
  &::before {
    content: "";
    position: absolute; inset: 0; z-index: -1;
    border-radius: inherit; pointer-events: none;
    background-image: var(--zw-surface-widget-image);
    opacity: var(--zw-surface-widget-alpha, 1);
  }
}

@utility surface-widget-* {
  --zw-surface-widget-alpha: calc(--value(integer) / 100);
}
```

Both emit together and the nested `&::before` survives compilation. Recorded as **ADR-027**.

## 4. V-15 — confirmed, with the measurement

`T4 §1.1` claims two things: that declaring the alpha as a `var()` *inside* an image string on
`<html>` does **not** respond to an element-level override, and that `opacity` on a paint layer
does. Both hold in WebKit.

`v15-surface-alpha.html` paints three 200×100 probes over white: FORM 1 (the broken form), FORM 2
(`opacity` on a `::before`), and an alpha-1 reference. Both probes author
`--zw-surface-widget-alpha: 0.25`.

```
screenshot 1000x1096, scale 2
patch 21px square averaged per probe

alpha=1 reference paint                     : [141.2, 45.9, 173.3]
FORM 1  var() inside image string on <html> : [141.2, 45.9, 173.3]
FORM 2  opacity on a ::before paint layer   : [229.1, 204.9, 236.0]

capture noise floor |FORM 1 − reference|_max : 0.03      tolerance budget 3.00

predicted if the element alpha is honored    : [226.5, 202.7, 234.6]
predicted if the element alpha is ignored    : [141.2, 45.9, 173.3]

FORM 1 vs ignored : 0.03        FORM 1 vs honored : 156.86
FORM 2 vs honored : 2.56        FORM 2 vs ignored : 159.02
```

The decisive evidence is not the pixels but the computed value. On FORM 1 the element carries
`--zw-surface-widget-alpha: 0.25`, and its computed `background-image` is:

```
linear-gradient(0deg, oklch(0.5 0.2 316) 0%, oklch(0.5 0.2 316) 100%)
```

The `calc(1 * var(--zw-surface-widget-alpha, 1))` in the alpha slot is **gone** — resolved to the
`, 1` fallback at `<html>`, where the property was declared, and inherited already-substituted. The
element-level override cannot reach it, and no error is raised. That is exactly the failure mode
`T4 §1.1` warns about, observed directly.

FORM 2's `::before` computes `opacity: 0.25` exactly and renders accordingly.

**Two honest notes on the method.** First, the naive prediction model composites in 8-bit encoded
space, whereas the engine composites `opacity` in a linear/premultiplied space; that is why FORM 2
lands 2.56 off its prediction (inferred alpha 0.2334 rather than 0.2500) instead of ~0. The
separation between the two hypotheses is 62×, so the verdict is not sensitive to the model. Second,
a first pass sampled single pixels and read a noise floor of ±2/255 from Retina subsampling at the
probe edges, which put FORM 2 marginally outside a ±0.02 tolerance and produced a spurious FAIL.
Averaging a 21px patch dropped the noise floor to 0.03. The script now derives its tolerance from
that measured floor rather than from a guess.

**Consequence:** `T4 §1.1`'s mechanism is sound and `T4-01` may proceed as specified.
