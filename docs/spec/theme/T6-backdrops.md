# T6 — Backdrops

Resolves F-13 – F-17. Location: `src/features/backdrop/`.

The brief: *"Great to add personality. But there are no configuration within each, and
crucially animated backgrounds are designed with a specific color scheme in mind, making
reusing them much harder."*

Both problems have the same root cause: a backdrop is registered as a **pre-instantiated
React element**, so there is no props channel and no palette channel.

```ts
// components/theme/util/backgroundAnimationMap.tsx — today
export const backgroundAnimationMap: Record<ThemeAnimatedBackgroundKey, ReactNode> = {
  photos: <PhotosAnimatedBackground />,
  velvet: <VelvetAnimatedBackground />,
  // …
};
```

## 1. Inventory

36 backdrops, 4 055 lines of `.tsx` plus 29 CSS Modules and one SCSS module.

| Class | Count | Examples |
| --- | --- | --- |
| DOM + CSS animation only | 12 | `sky` (16), `glitter` (20), `verdant` (32), `underwater` (44) |
| DOM + SVG assets | 19 | `home` (93), `photos` (333), `birthday20` (501), `projects` (272) |
| `@react-three/fiber` | 5 | `whiteout` (212), `velvet` (189), `planetoid` (409), `gold` (176), `gallery3D` (219) |

Three of the five r3f backdrops are the same shader (F-13): identical 65-line `NOISE_GLSL`
blocks, near-identical vertex shaders, and fragment shaders differing only in two `vec3`
constants.

| file | `baseColor` | `highlightColor` |
| --- | --- | --- |
| whiteout | `vec3(0.954, 0.961, 0.993)` | `vec3(0.792, 0.807, 0.89)` |
| velvet | `vec3(0.165, 0.11, 0.239)` | `vec3(0.451, 0.314, 0.588)` |
| planetoid | `vec3(0.11, 0.129, 0.09)` | `vec3(0.149, 0.29, 0)` |

Those two constants are precisely the theme palette, inlined into GLSL. That is F-14 in six
numbers.

## 2. The scene contract

A backdrop becomes a **scene module**: a component plus a declared parameter schema plus a
declared palette requirement.

```ts
export type SceneQuality = "still" | "reduced" | "rich";

export type SceneModule<P extends SceneParams = SceneParams> = {
  readonly id: SceneId;
  readonly name: string;
  /** "dom" scenes render into the backdrop stack; "r3f" scenes render into the shared canvas. */
  readonly surface: "dom" | "r3f";
  /** Zod schema. Drives validation AND the Studio's generated controls (T8 §5). */
  readonly schema: z.ZodType<P>;
  readonly defaults: P;
  /** Named colors this scene needs. Themes supply them; defaults are role references. */
  readonly palette: Readonly<Record<string, ColorRef>>;
  /** Optional: cost hint used by the quality resolver. */
  readonly cost?: "low" | "medium" | "high";
  readonly Component: SceneComponent<P>;
};

export type SceneComponent<P> = React.ComponentType<{
  readonly params: P;
  readonly palette: Readonly<Record<string, Oklch>>;
  readonly quality: SceneQuality;
}>;
```

Three things change as a consequence, all of them requirements from the brief:

1. **Configuration exists.** `params` is real, typed, validated, and per-theme.
2. **Palette is injected.** A scene never contains a color literal. `palette` names what it
   needs (`base`, `highlight`, `accent`, …); the theme decides where those come from.
3. **Quality is decided once**, by the resolver (§4), not 36 times by each scene (F-17).

Registry, mirroring T3 §6:

```ts
// features/backdrop/registry/index.ts
const registry = { "displaced-field": displacedField, "shooting-stars": shootingStars /* … */ }
  satisfies Record<string, SceneModule<never>>;
export type SceneId = keyof typeof registry;
```

`ThemeAnimatedBackgroundKey` (a hand-maintained 36-member union, F-09) is deleted.

## 3. Palette injection

A theme's backdrop configuration:

```ts
export type BackdropSource = {
  readonly scenes: readonly SceneRef[];
};

export type SceneRef = {
  readonly id: SceneId;
  readonly params?: Partial<SceneParams>;
  /** Overrides the scene's default palette requests. */
  readonly palette?: Readonly<Record<string, ColorRef>>;
  /** Route restriction, replacing the `pathname === "/"` checks scenes do today. */
  readonly only?: readonly NavigationKey[];
};
```

`resolve()` turns each `ColorRef` into an `Oklch` and `compile()` additionally emits
`--zw-backdrop-<sceneId>-<key>` so that **DOM scenes read their palette from CSS** and never
re-render on theme change. r3f scenes read the resolved `Oklch` values and write them into
uniforms (§5.3).

The default palette request set, which every scene should draw from unless it has a specific
need:

| key | default `ColorRef` | meaning |
| --- | --- | --- |
| `base` | `{ kind: "role", role: "brand" }` | the deep field color |
| `mid` | `{ kind: "tone", at: 0.62 }` | mid-tone mass |
| `highlight` | `{ kind: "tone", at: 0.30 }` | lit edges, speculars |
| `accent` | `{ kind: "role", role: "accent" }` | small saliently-colored elements |
| `veil` | `{ kind: "role", role: "panel" }` | atmospheric overlays |

`velvet`'s backdrop, migrated, is then the whole of what used to be a 189-line file:

```ts
backdrop: { scenes: [{
  id: "displaced-field",
  params: { noiseFrequency: 1.2, noiseAmplitude: 0.25, timeScale: 0.06, tilt: 0.4545 },
  palette: { base: { kind: "tone", at: 0.80 }, highlight: { kind: "tone", at: 0.56 } },
}] }
```

and `whiteout` and `planetoid` are the same scene id with different `params` and `palette`.
Three files of 810 lines collapse to one scene of ~120 plus three eight-line references — and
`velvet`'s field now works under any hue, which is O4.

### 3.1 SVG assets

19 scenes use SVG assets with baked-in fills (`public/theme/animated-background/**`). Those
cannot be palette-injected as static files. Three treatments, in order of preference:

1. **Inline the SVG as a React component** and let its fills reference
   `var(--zw-backdrop-…)`. Applies to the small, simple assets (`grass/bg.svg`,
   `christmas/polka`, `gallery`). Preferred.
2. **`mask-image` instead of `background-image`**, painting through with a themed color. The
   asset becomes a stencil. Applies to any single-color silhouette asset — the majority of
   the sprite sheets (`dusk`, `eventide`, `meadowland`, `murk`, `pixelland`).
3. **Declare the scene `palette: {}` and `themeable: false`.** For genuinely pictorial assets
   (`birthday20`'s illustration, `projects`' Kawarage animation, `photos`' composition) the
   honest answer is that they are artwork, not a palette application. They stay fixed, are
   flagged in the registry, and the Studio shows them as "fixed palette" rather than pretending
   otherwise.

Treatment 3 applies to 6 of 36 scenes. That is the accurate scope of "not all backdrops can be
made theme-agnostic", and it is a property of the artwork, not a limitation of the design.

## 4. Quality

One resolver, one decision:

```ts
export function resolveQuality(input: {
  readonly richness: "minimal" | "reduced" | "rich";
  readonly reducedMotion: boolean;
  readonly saveData: boolean;
  readonly cost: SceneModule["cost"];
}): SceneQuality;
```

Rules:
- `reducedMotion` ⇒ `"still"`, unconditionally. Scenes must render a composed static frame at
  `"still"`, not nothing — the backdrop is part of the theme's identity and removing it
  entirely is a worse experience than freezing it. This is the F-18 fix.
- `richness: "minimal"` ⇒ the backdrop stack is not mounted at all.
- `richness: "reduced"` ⇒ `"reduced"`.
- `saveData` (`navigator.connection.saveData`) ⇒ at most `"reduced"`.
- `cost: "high"` under `"reduced"` ⇒ `"still"`.

Scenes receive `quality` as a prop and must honour all three values. The 36 duplicated
`settings.backgroundRichness` reads disappear, along with 36 store subscriptions.

`prefers-reduced-motion` is read through one `useMediaQuery` in the backdrop host, not per
scene.

## 5. Hosting

```
features/backdrop/
  index.ts
  contract.ts          SceneModule, SceneComponent, SceneQuality
  registry/            one file per scene + index
  host/
    BackdropStack.tsx  mounts DOM scenes + the shared canvas, in z-order
    SceneCanvas.tsx    the single <Canvas>
    useSceneUniforms.ts
  glsl/
    noise/simplex3d.ts   the deduplicated NOISE_GLSL
    lighting/lambert.ts
    lighting/fresnel.ts
    compose.ts           `glsl` tagged template with #include-style resolution
```

### 5.1 One WebGL context

F-16: five scenes each mount `<Canvas>`, and a multi-scene theme mounts several. `SceneCanvas`
is mounted **once** by `BackdropStack` when at least one active scene has `surface: "r3f"`, and
every r3f scene renders as a child of it.

```tsx
<BackdropStack>
  {domScenes.map(s => <s.Component … />)}
  {r3fScenes.length > 0 && (
    <SceneCanvas>{r3fScenes.map(s => <s.Component … />)}</SceneCanvas>
  )}
</BackdropStack>
```

`SceneCanvas` owns camera, `dpr`, `frameloop`, and the mount transition (the
`opacity-0 blur-[5px] → opacity-100` choreography currently duplicated in all five files). At
`quality: "still"` it sets `frameloop="demand"` and renders exactly one frame.

`SceneCanvas` is loaded with `next/dynamic` and `ssr: false`, so three.js
(~600 KB parsed) is not in the initial bundle for the 31 themes that do not need it. Today
`backgroundAnimationMap.tsx` statically imports all 36 scenes including all five r3f ones,
so every visitor downloads three.js regardless of theme.

### 5.2 GLSL composition

```ts
// glsl/noise/simplex3d.ts
export const simplex3d = /* glsl */ `
  vec3 mod289(vec3 x) { … }
  float snoise(vec3 v) { … }
`;

// glsl/compose.ts
export const glsl = (strings: TemplateStringsArray, ...parts: string[]) =>
  dedupeChunks(String.raw({ raw: strings }, ...parts));
```

`dedupeChunks` removes repeated chunk bodies by identity so a shader that includes
`simplex3d` twice (directly and via a lighting helper) compiles once. Chunks are plain
exported strings — no build step, no `#include` preprocessor, no loader configuration.

### 5.3 Uniforms without re-renders

```ts
export function useSceneUniforms(
  palette: Readonly<Record<string, Oklch>>,
  params: SceneParams,
): React.RefObject<Record<string, THREE.IUniform>>;
```

Returns a stable ref. A `useFrame` callback inside the hook writes `uTime` and, when the
palette or params change, updates the corresponding uniform values **in place**. React never
re-renders the scene. Colors are converted `Oklch → linear sRGB` once per change and uploaded
as `vec3`, so the shader works in linear light — which is what the existing shaders already
assume with their `vec3(0.954, 0.961, 0.993)` literals.

Palette changes therefore animate: the Studio's hue slider continuously recolors a running
three.js scene with no remount. This is a capability the current architecture cannot express
at all.

## 6. Consolidations

Beyond the three-into-one shader, the classification in §1 makes further merges obvious. These
are the ones worth doing; the rest stay distinct because they are genuinely distinct artwork.

| New scene | Absorbs | Params |
| --- | --- | --- |
| `displaced-field` | whiteout, velvet | geometry, noise freq/amp, timeScale, tilt, camera |
| `displaced-sphere` | planetoid, gold | radius, noise, orbit count, orbit speed |
| `sprite-drift` | dusk, eventide, meadowland, murk, pixelland | sprite set, count, drift vector, speed, scale range |
| `particle-rise` | bubbles, glitter, star, memories | particle count, size range, speed, spawn edge, blend |
| `soft-clouds` | sky, storm(clouds), underwater | layer count, opacity, speed, scale |
| `polka-scroll` | christmas, crimson, gallery | motif, spacing, angle, speed |

36 scenes → **20–22**. Every merge is verified by A/B screenshot against the pre-migration build
at the theme that used it (`exec/X4 §4`); a merge that cannot reproduce its originals within
tolerance is abandoned and both scenes kept. Consolidation is opportunistic; correctness is not.

`Gallery3DAnimatedBackgroundSimple.tsx` — a second, unused copy of the gallery3D scene — is
deleted.

## 7. Multiple scenes

`animatedBackgroundKey` already accepts an array. `BackdropSource.scenes` keeps that, with
proper semantics: scenes composite in array order, `scenes[0]` furthest back. Each may carry
`only: ["home"]`, replacing the `pathname === "/" && themeKey === "whiteout"` checks scenes
currently perform themselves by reaching into `usePathname` and `useTheme`
(`WhiteoutAnimatedBackground.tsx:186`, `HomeAnimatedBackground.tsx:51`) — which is a scene
knowing about routing, and the reason those two scenes cannot be reused anywhere.

## 8. Acceptance

| # | Criterion |
| --- | --- |
| C1 | No file under `features/backdrop/registry/` contains a hex color, an `rgb(`, or a `vec3(` numeric literal used as a color |
| C2 | `NOISE_GLSL` appears exactly once in the repository |
| C3 | At most one `<canvas>` element exists in the DOM for any theme, on any route |
| C4 | three.js is absent from the initial JS for a theme whose scenes are all `surface: "dom"` (bundle analyzer) |
| C5 | Every scene renders correctly under a 6-theme × all-scenes matrix (gate S8), reviewed by screenshot |
| C6 | `prefers-reduced-motion: reduce` ⇒ every scene renders a static frame and issues no `requestAnimationFrame` after 500 ms (asserted by stubbing rAF) |
| C7 | Changing theme hue in the Studio recolors a running r3f scene with 0 React commits from the scene subtree |
| C8 | Every scene's `schema` validates its own `defaults` |
| C9 | Every scene id in every registry theme's `backdrop.scenes` exists (unit test over the registry) |
| C10 | Scene count ≤ 22 with every retired scene's originating theme screenshot-verified |
