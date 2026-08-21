# P5 — Tailwind v4 migration

Resolves F-62 – F-65. Latest published at time of writing: `tailwindcss@4.3.3`,
`@tailwindcss/postcss@4.3.3`.

The brief: *"we want to migrate the ENTIRE thing to tailwind v4 since it's been around for over a
year and has mostly settled and bring real features. But many things do break. It's not a cheap
one. Like for example I think @apply rule in module css don't work anymore and can break
tailwind's intellisense, etc, so yeah. Check yourself tho."*

The `@apply` concern is well-founded, and §4 resolves it by removing the dependency rather than
accommodating it.

## 1. Build configuration

```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } };
```

Removed: `autoprefixer` (v4 handles vendor prefixing internally via Lightning CSS),
`postcss-each` (F-63: zero `@each` in the repository), `sass` (one `.module.scss`, converted;
v4 does not support preprocessors), and `tailwind.config.ts` (CSS-first configuration).

Added: `@tailwindcss/postcss`.

`baseline-browser-mapping` is in devDependencies and unused by any script. Remove it.

## 2. Browser floor

Tailwind v4 requires **Safari 16.4+, Chrome 111+, Firefox 128+** because its output uses
`@property`, `color-mix()`, and cascade layers.

Everything this spec depends on sits inside that floor, which is why the floor costs nothing here:

| Feature | Available since | Used by |
| --- | --- | --- |
| `oklch()` | Safari 15.4, Chrome 111, Firefox 113 | T2 §6 |
| `color-mix()` | Safari 16.2, Chrome 111, Firefox 113 | alpha modifiers, T4 §6 |
| Cascade layers | Safari 15.4, Chrome 99, Firefox 97 | `layer(theme)`, T4 §4 |
| `@property` | Safari 16.4, Chrome 85, Firefox 128 | v4 internals |
| Container queries | Safari 16, Chrome 105, Firefox 110 | already used — `navbar.module.css` plus four theme-maker modules |
| `:has()` | Safari 15.4, Chrome 105, Firefox 121 | available |
| `@starting-style` | Safari 17.5, Chrome 117, Firefox 129 | P4 §4 |
| `transition-behavior` | Safari 17.4, Chrome 117, Firefox 129 | P4 §4 |
| `mask` unprefixed | Safari 15.4, Chrome 120, Firefox 53 | T5 §7 — lets the `-webkit-mask` duplicate go |
| `scrollend` | Safari 18.2, Chrome 114, Firefox 109 | P3 §1, with a documented fallback |
| View Transitions | Safari 18, Chrome 111, Firefox 2025 | P3 §2, U2 — progressive enhancement |

Only the last two are outside the floor, and both are specified as enhancements with a working
path when absent.

## 3. `globals.css`

```css
@import "tailwindcss";
@import "./surfaces.css";
@import "./themes.generated.css" layer(theme);

@theme {
  --font-sans:    var(--font-main), ui-sans-serif, system-ui, sans-serif;
  --font-mono:    var(--font-roboto-mono), ui-monospace, monospace;
  --font-serif:   var(--font-lora), ui-serif, Georgia, serif;
  --font-tabular: var(--font-open-sans), ui-sans-serif, sans-serif;
  --font-display: var(--font-pacifico), cursive;

  --spacing-13: 3.25rem;
  --spacing-18: 4.5rem;
  --spacing-26: 6.5rem;
  --spacing-38: 9.5rem;

  --border-width-hair:  0.4px;
  --border-width-thin:  0.6px;
  --border-width-fine:  0.8px;
}

@theme inline {
  /* Roles — see T4 §6 for the complete list */
  --color-text: var(--zw-role-text);
  /* … */
  --shadow-2xs: 0 1px 10px 2.3px var(--zw-shadow-tint-05);
  /* … */
  --blur-reading: var(--zw-reading-blur);
}
```

Two blocks, deliberately:
- **`@theme`** for static tokens (fonts, spacing, border widths). Values are literals.
- **`@theme inline`** for anything referencing a runtime custom property. `inline` makes Tailwind
  emit the referenced variable into the utility instead of a copy of its value, so runtime
  overrides propagate. Without it the Studio's live preview cannot work (T1 §7).

`fontFamily.main` → `--font-sans` so that `font-sans` (Tailwind's default) is correct and the
`font-main` *utility* disappears. The underlying CSS variable stays `--font-main`, which is what
`app/layout.tsx:25-27` assigns to the Inter instance — renaming it would mean touching the font
loader for no gain. The site currently applies `font-main` explicitly in ~40 places to
counteract a default it never set.

`width`/`height`/`maxWidth` extensions for `100lvw`/`100svh`/`100dvw` etc. are dropped:
v4 supports arbitrary values natively (`w-[100svw]`), and the 5 `zIndex` extensions
(`60`–`100`) are dropped because v4's `z-*` accepts any integer.

## 4. `@apply` elimination

F-62: 149 occurrences across 48 CSS Modules.

In v4, `@apply` inside a CSS Module requires `@reference "…/globals.css";` at the top of that
module, because each module is compiled in isolation and has no implicit access to the theme.
`@reference` re-parses the referenced stylesheet for every module that uses it, which is a real
build cost at 48 modules, and the Tailwind IntelliSense extension resolves `@apply` targets less
reliably through it.

The v11 answer is **zero `@apply`**. It is cheaper than accommodating it, because the actual usage
is trivial. Measured distribution:

| Category | Count | Treatment |
| --- | --- | --- |
| Pure static utilities (`gap-4`, `hidden`, `pointer-events-none select-none`, `h-full`, `aspect-square`, `rounded-lg`, `flex`, `block`, `sr-only`, …) | ~118 | Write the CSS. `@apply gap-4` → `gap: 1rem`. Mechanical. |
| Transition/duration/easing (`duration-500`, `ease-out`, `duration-200 ease-out`) | ~9 | `transition-duration: 500ms; transition-timing-function: …` |
| Theme colors (`text-saturated`, `bg-pastel bg-opacity-60`, `border-saturated`, `bg-widget-50`) | ~12 | `color: var(--color-text-muted)`, `background: color-mix(…)`, or the surface custom properties |
| Typography scale in `reading-markdown.module.css` (`text-xl my-6 leading-snug font-bold font-main`) | 20 | Keep as CSS; the values come from `@theme` via `var(--text-xl)` etc. |

The 20 `@apply` directives in `lib/reading-markdown.module.css` are the only interesting case, because they
define the article typography scale. They become plain CSS reading `--text-*` and `--spacing-*`
from the theme — which is *more* robust than `@apply`, since the module no longer needs Tailwind's
compiler to resolve them.

**A codemod does the first two categories** (`tools/codemod-unapply.ts`, ~127 of 149), emitting a
report of what it could not resolve. The remaining ~22 are done by hand. Net effect: modules
become ordinary CSS, IntelliSense works normally in markup, `@reference` is never needed, and the
build has 48 fewer stylesheets to cross-reference.

Also removed from `globals.css`:
```css
.second-pov-text { @apply text-saturated; }     /* → a class in the reading stylesheet */
.katex-html { @apply sr-only; }                 /* → obsolete: MathML output, D2 §2 */
```

## 5. Utilities and variants

The two `tailwind.config.ts` plugins move to CSS.

```css
/* was: addUtilities for .bg-widget-10 … .bg-widget-100 (10 generated classes) */
/* now: T5 §7 — one utility plus an alpha modifier */

/* was: the 60-line border-reflect-* plugin with two inline 40-stop mask gradients,
   duplicated for `mask` and `-webkit-mask` */
@utility surface-edge { /* T5 §7 */ }
```

The `border-reflect-*` plugin also used `matchUtilities` with `values: {}` to accept an arbitrary
`--reflect-spread` — a pattern that produced *no* classes (an empty values map) and worked only via
arbitrary-value syntax. In v4:

```css
@utility surface-edge-* { --zw-edge-spread: --value([length]); }
```

Reflect color is currently
`color-mix(in srgb, rgb(var(--color-highlight-primary) / 1.0) 75%, rgb(255 255 255 / 1.0))`
per accent — four variants. Under T1 §5 the specular highlight is the `edge` **role**, so there is
one variant and no `color-mix` at all.

## 6. Renames and semantic changes

The mechanical rewrite list, with counts where they matter. Run `npx @tailwindcss/upgrade` first —
it handles most of this — then verify each row by grep, because the tool is not aware of the two
traps below.

| v3 | v4 |
| --- | --- |
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `shadow-md` / `lg` / `xl` / `2xl` | **unchanged.** v4 renames only `sm`→`xs` and the bare `shadow`→`sm`; the larger steps keep their names. T4 §6's `@theme inline` block is authoritative. |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `flex-shrink-*` / `flex-grow-*` | `shrink-*` / `grow-*` |
| `overflow-ellipsis` | `text-ellipsis` |
| `bg-opacity-NN` (88), `text-opacity-NN` (24), `border-opacity-NN`, `divide-opacity-NN` | `/NN` slash modifier |
| `outline outline-1` (18) | `outline-1` |
| `bg-[--var]` | `bg-(--var)` |
| `ring` (default 3px in v3, 1px in v4) | `ring-3` where 3 px was intended |

**Trap 1 — `shadow-xs` already exists.** F-64: `tailwind.config.ts:48` defines a custom
`boxShadow.xs`, used at 5 sites. After the rename, `shadow-xs` means v3's `shadow-sm`. Those 5
sites must become `shadow-2xs` **before** the automated rename runs, or they silently change
meaning. Task `P5-06`, ordered first in the migration.

**Trap 2 — default border and ring colors changed.** v4's default border color is
`currentColor` (v3: `gray-200`) and the default ring is `1px currentColor` (v3: `3px
blue-500`). Grep for bare `border`, `border-x`, `border-t` etc. without a color class, and for
bare `ring`. Both appear in this codebase.

**`space-x-*` / `space-y-*`** changed selector from
`> :not([hidden]) ~ :not([hidden])` to `:not(:last-child)`. The 14 usages across 9 distinct utilities should become `gap` on a flex/grid
parent regardless — `space-y-0 gap-4` in particular is two mechanisms fighting.

**`theme()`** is deprecated in favour of `var()`. Zero usages currently (verified), so nothing to
do beyond not introducing any.

## 7. Sass

`components/mainPage/backgroundAnimations/celebration/celebration.module.scss` — the only Sass
file. Convert to CSS (it uses nesting, which native CSS now supports, and no Sass-specific
features beyond that), delete `sass` from devDependencies.

## 8. Order of operations

The migration touches every file, so ordering matters to keep the tree working.

1. `P5-06` — rewrite the 5 custom `shadow-xs` → `shadow-2xs` (trap 1).
2. Audit and fix bare `border` / `ring` (trap 2).
3. Install `@tailwindcss/postcss`; run `npx @tailwindcss/upgrade`; review its diff in full.
4. Author `globals.css` (`@theme`, `@theme inline`); delete `tailwind.config.ts`.
5. Port the two plugins to `@utility` (§5).
6. Run `tools/codemod-unapply.ts`; hand-finish the remainder; assert 0 `@apply`.
7. Convert the Sass module; remove `sass`, `autoprefixer`, `postcss-each`,
   `baseline-browser-mapping`.
8. Visual regression across the full theme × route matrix (T9 §5 harness, reused).

Steps 1–2 land as their own PR against the current v3 setup, so they are verifiable
independently. Steps 3–7 land together because the tree does not build between them.

**Sequencing against the theme work:** this migration is *blocked by* T4 (the compiler must emit
`--zw-role-*` before `@theme inline` can reference them) and *blocks* T5's surface utilities.
`exec/X1-workstreams.md` has the full graph.

## 9. Acceptance

| # | Criterion |
| --- | --- |
| C1 | `tailwind.config.ts`, `autoprefixer`, `postcss-each`, `sass`, `baseline-browser-mapping` all removed |
| C2 | 0 occurrences of `@apply` in the repository (gate S6) |
| C3 | 0 occurrences of `@reference` |
| C4 | 0 occurrences of `*-opacity-*` utilities |
| C5 | 0 occurrences of `outline outline-1` |
| C6 | 0 occurrences of `bg-[--`, `text-[--`, etc. (old CSS-variable arbitrary syntax) |
| C7 | The 5 former custom `shadow-xs` sites render identically to the pre-migration build |
| C8 | Every bare `border`/`ring` usage is audited and has an explicit color where v3 supplied one |
| C9 | `npm run build` clean; no PostCSS warnings |
| C10 | Visual regression across 59 themes × 6 routes × 3 viewports passes at the T9 §5 gate |
| C11 | `-webkit-mask` and `-webkit-mask-composite` absent from `src/` |
| C12 | Tailwind IntelliSense resolves classes in markup and in every CSS Module (manual check in VS Code) |
