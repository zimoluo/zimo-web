# 02 — Conventions

Binding for all v11 code. Where this document and an existing pattern disagree, this
document wins and the existing pattern is migrated.

## 1. Repository layout

```
src/
  app/                      Next routes ONLY: page.tsx, layout.tsx, route.ts,
                            error.tsx, loading.tsx, not-found.tsx, metadata.
                            No component may live here.
  features/
    theme/                  the theme engine (T1–T9)
      color/                OKLCh math, gamut, ramp         (pure, no React)
      model/                ThemeSource / ResolvedTheme types + validators
      compile/              theme → CSS                     (pure, no React)
      registry/             built-in theme manifests + index
      runtime/              React host, store binding, CSS application
      studio/               the editor
    backdrop/               scene contract, registry, shared canvas, glsl/
    document/               document pipeline, marks, component registry
    entries/                blog | album | projects | management domain
    comments/
    windows/                 window layer          (P2 §1–9)
    overlays/                modal overlay layer   (P2 §10)
    notifications/
    search/                  query grammar + index (03-hygiene §7)
    account/
    notebook/  calculator/  signal/  sticky-notes/  christmas-tree/
  ui/                      cross-feature presentational primitives, no domain
                           knowledge (Surface, Icon, Field, Popover, …)
  lib/                     leaf utilities. No imports from features/.
  server/                  server-only: S3 adapters, auth, data access
  styles/                  globals.css, theme layers, generated theme CSS
tools/                     migration + codegen CLIs (node, not bundled)
docs/spec/                 this specification
```

Rules:
- **`src/app` contains no components.** A route file composes from `features/`.
- **Dependency direction:** `app → features → ui → lib`. `features/*` may not import from a
  sibling feature except through that sibling's `index.ts` public surface. `lib` imports
  nothing from `src` except other `lib`.
- **`server/` is fenced** with `import "server-only"` and may not be imported by anything
  under a `"use client"` boundary.
- **Colocation:** a component's CSS Module, tests, and stories sit beside it.

## 2. Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Directories | `kebab-case` | `features/theme/color` |
| React components (files + symbols) | `PascalCase` | `SurfaceCard.tsx` |
| Everything else (files) | `kebab-case` | `tone-ramp.ts`, `compile-theme.ts` |
| Functions, variables | `camelCase` | `resolveTone` |
| Types, interfaces | `PascalCase`, no `I` prefix | `ThemeSource` |
| Type unions of string literals | `PascalCase` singular | `SurfaceRole` |
| Constants | `SCREAMING_SNAKE` only for true compile-time constants | `TONE_STOP_COUNT` |
| CSS custom properties | `--zw-<domain>-<name>` | `--zw-role-primary` |
| CSS Module classes | `camelCase` | `.dragBar` |
| Tailwind theme keys | `--color-*`, `--shadow-*`, … per v4 | `--color-primary` |
| URL path segments | `kebab-case`, plural nouns | `/api/v1/entries/blog` |
| JSON wire fields | `camelCase` | `{ "lastEditedAt": … }` |
| S3 keys | `kebab-case` segments, lowercase | `blog/documents/my-post.md` |
| Registry ids (themes, backdrops, widgets) | `kebab-case` | `"theme-maker-toolset"` |

**Why camelCase JSON with kebab-case paths.** Path segments are read by humans and appear
in logs, so kebab-case is conventional and case-insensitivity-safe. JSON field names are
consumed by TypeScript, and camelCase means the wire type and the domain type are
structurally identical — no serialization layer, no mapper, no drift. This matches Google's
API Improvement Proposals (kebab-case paths, camelCase JSON fields). snake_case JSON is a
Rails/Python convention with no benefit in a TypeScript-only stack; do not adopt it.

**Spelling: American English only.** Prose, identifiers, file names, directory names, comments,
commit messages, and user-facing strings. `color`, `normalize`, `serialize`, `behavior`, `center`,
`optimize`, `memoize`, `gray`, `analyze`, `catalog`, `license`, `judgment`. No `colour`, no <!-- spelling-ignore -->
`-ise`/`-isation`, no `behaviour`, no `centre`. <!-- spelling-ignore -->

This is a hard rule, not a preference: the platform APIs are American (`color`, `backgroundColor`,
`normalize()`, `textAlign: "center"`), so mixing forms means every identifier is a coin flip and
every grep needs two patterns. CI enforces it — `tools/lint-spelling.ts` fails on a word list, and
that list is the one above plus anything a reviewer adds.

## 3. TypeScript

- **No ambient global types.** Every type is declared in a module and imported. `interfaces/`
  is deleted. Types live next to the code that owns them, re-exported from the feature's
  `index.ts` if part of its public surface.
- `type` for unions, aliases, and object shapes; `interface` only when declaration merging
  or `implements` is genuinely needed. Prefer `type`.
- **No `any`.** `unknown` at boundaries, narrowed by a validator. The existing
  `catch (error: any)` pattern is replaced per `data/D3-api.md §5`.
- **No non-null assertions (`!`)** outside test files. Narrow instead.
- Discriminated unions over optional-field bags. If two shapes differ, they are two members
  of a union with a `kind` discriminant, never one type with `Partial<>` intersections.
- **Derive unions from registries**, never maintain both:
  ```ts
  export const themes = { velvet: velvetTheme, blog: blogTheme } satisfies Record<string, ThemeSource>;
  export type ThemeId = keyof typeof themes;
  ```
- Exhaustiveness is enforced: every `switch` over a union ends with
  `default: { const _x: never = value; throw new UnreachableError(value); }`.
- `readonly` on all model types. Mutation happens in a builder or via `immer`'s `produce`,
  never by assignment into shared state (cf. F-37).
- Branded primitives where confusion has actually happened:
  ```ts
  export type Slug = string & { readonly __brand: "Slug" };
  export type CssColor = string & { readonly __brand: "CssColor" };
  ```

`tsconfig.json` gains, beyond `strict`:
```json
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true,
"noImplicitOverride": true,
"noFallthroughCasesInSwitch": true,
"verbatimModuleSyntax": true,
"erasableSyntaxOnly": true
```
`noUncheckedIndexedAccess` is the one that matters most here: it makes the six parallel
arrays of F-40 and the `ImagesData` alignment of F-25 into compile errors.

## 4. React

- **Server Components by default.** `"use client"` is a deliberate act requiring one of:
  event handlers, browser APIs, or store subscription. Target: reduce from 236 files to
  under 120 (`exec/X4 §3`).
- A client component subscribes to state through a **selector**, never to a whole object:
  ```ts
  const blur = useSettings((s) => s.reading.blur);      // ✔
  const { settings } = useSettings();                   // ✘ forbidden
  ```
- **Context carries only stable identities**: the store handle, a ref, a dispatch. Never
  changing data. Contexts that today carry data become store slices.
- Derived values are computed, not stored. Clamping an index is `Math.min(…)` at the read
  site, not a `useMemo` that calls a setter (F-38).
- `useEffect` is for **synchronization with something outside React**. It is not for deriving
  state, sequencing animations, or draining queues. Each remaining effect must name its
  external system in the feature documentation. Code comments remain banned by CI (user decision, October 9, 2026).
- **Imperative for continuous gestures.** Pointer-driven visual updates write to
  `ref.current.style` inside a `requestAnimationFrame`-coalesced writer and commit to the
  store once, on gesture end. See `perf/P2 §5`.
- Pointer Events (`pointerdown` + `setPointerCapture`) for all dragging. No `mousedown` +
  `touchstart` pairs, no touch-identifier bookkeeping.
- Keys are stable domain ids. `key={index}` is forbidden for anything reorderable.

## 5. CSS

- **No `@apply`.** Zero occurrences. Utilities in markup; everything else is real CSS
  referring to custom properties.
- Tailwind v4 CSS-first configuration. Design tokens in `@theme`, custom utilities via
  `@utility`, custom variants via `@custom-variant`. No `tailwind.config.ts`.
- Theme values are read as `var(--color-primary)`, never via `theme()`.
- Alpha via the slash syntax (`bg-primary/70`), never `bg-opacity-*`.
- **No Sass.** The single `.module.scss` is converted; `sass` is removed.
- Custom-property namespacing: `--zw-` prefix for everything this app defines, so Tailwind's
  own `--color-*`/`--spacing-*` namespace stays clean and greppable.
- Animations declare `prefers-reduced-motion` behavior at the point of definition
  (`ux/U3 §2`), not at call sites.
- Logical properties (`inline-start`, `margin-inline`) where the physical equivalent has no
  reason to be physical.

## 6. Errors

- One error taxonomy in `lib/errors.ts`:
  ```ts
  export class AppError extends Error {
    constructor(readonly code: ErrorCode, message: string, readonly detail?: unknown,
                options?: { cause?: unknown }) { super(message, options); }
  }
  export type ErrorCode =
    | "invalid-request" | "unauthenticated" | "forbidden" | "not-found"
    | "conflict" | "precondition-failed" | "payload-too-large"
    | "rate-limited" | "upstream-failure" | "internal";
  ```
- `ErrorCode` maps to HTTP status and to an RFC 9457 `type` URI in one table
  (`data/D3 §5`). Handlers throw; a single wrapper serializes. No `try/catch` per route.
- Client-facing messages are authored strings keyed by `ErrorCode`. Internal messages are
  logged, never returned.

## 7. Validation

- One schema library at the boundary: **Zod v4** (`zod/mini` where bundle size is measured).
  Schemas are the source of truth; TS types are `z.infer`.
- Validate: every route/action input, every S3 read, every `localStorage` read, every
  imported theme profile. Never validate internal function arguments — types cover that.
- The existing 300-line hand-written `isValidThemeDataConfig` (`lib/themeMaker/themeConfigTypeGuard.ts`)
  is replaced by a schema (`theme/T3 §7`).

## 8. Dependencies

Removed: `color-convert`, `dayjs`, `date-fns`, `lodash`, `sass`, `postcss-each`,
`autoprefixer`, `marked`, `marked-katex-extension`, `html-escaper`, `react-masonry-css`,
`react-colorful` (cannot express relative chroma — T8 §3.1), `baseline-browser-mapping` (unused).

Added: `@tailwindcss/postcss`, `zustand`, `immer`, `zod`, `unified` + `remark-parse`,
`remark-gfm`, `remark-math`, `remark-directive`, `remark-rehype`, `rehype-katex`,
`rehype-highlight` (server only), `hast-util-to-jsx-runtime` (client), `micromark` (inline marks),
plus test tooling per `03-hygiene §1`.

Retained deliberately, because each was checked and has no replacement: `@aws-sdk/*`, `jose`,
`google-auth-library`, `@react-oauth/google`, `three` + `@react-three/{fiber,drei}`, `sharp`,
`svgo` (T7 §3), `gray-matter` (front-matter survives — D6 §2 writes `formatVersion` into it),
`node-vibrant` (T8 §5.1), `highlight.js` (server-side only now), `uuid` (v7 ids), `glob`,
`server-only`.

Rationale for each removal and addition: `exec/X3-decisions.md`. Replacements:
- `color-convert` → `features/theme/color` (own OKLCh maths; nothing else needs conversions)
- `dayjs` + `date-fns` → `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` in `lib/datetime.ts`
- `lodash` → 14 call sites, each replaced by a named local helper or a language builtin
- `react-masonry-css` → CSS `columns` / `grid-template-rows: masonry` with a `columns` fallback
- `marked` → unified pipeline (`data/D2`)

**Every new dependency must be justified in an ADR before it is added.**

## 9. Feature module shape

```
features/<name>/
  index.ts        public surface: the only file other features may import
  model/          types + zod schemas
  <domain>.ts     pure logic
  ui/             components
  store.ts        zustand slice, if the feature owns state
  server/         server-only access, if any
  README.md       one screen: what this owns, what it does not
```

## 10. Commits and branches

- Branch per task ID from the ledger: `t/T2-04-tone-ramp`.
- Conventional Commits with the task ID in the scope: `feat(T2-04): tone ramp sampler`.
- One task per PR. A PR that closes a task must state the acceptance criteria from the
  ledger and how each was verified.
- No PR merges with a failing gate from `exec/X4-verification.md`.
