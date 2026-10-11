# Backdrop runtime synchronization

The backdrop feature keeps renderer state outside React so color and continuous parameter
changes update pixels without reconciling a scene subtree. Structural changes, routing and
quality settings reconcile the scene plan; palette values, opacity, scale, speed and shader
controls update stable renderer handles. Code comments are intentionally omitted to comply
with the repository CI policy; the external systems synchronized by effects are listed here.

| Effect owner | External system and purpose | Cleanup |
| --- | --- | --- |
| BackdropStack | Theme or Studio controller subscription, browser reduced-motion media query and connection save-data event synchronize the scene plan and live CSS variables. Explicit controller/source previews use a contained absolute host; the active page host uses the viewport. | Unsubscribe controller/store and remove browser listeners. |
| SceneCanvas | A document-wide renderer lease moves the same Canvas DOM into the focused/latest contained Studio host. Every new host receives an initial rendered frame; inactive hosts display their captured frame. Runtime listeners invalidate demand rendering, and a post-frame callback captures only during warmup or handoff. | Remove focus/pointer and runtime listeners; release the lease. When all WebGL hosts unmount, dispose the renderer and lose its context. |
| useSceneUniforms | Mutable WebGL uniform resources receive palette values converted to linear sRGB and continuous controls; the demand loop receives invalidation. | Remove the runtime resource listener. |
| RuntimeFrame | Scene geometry transforms and standard material opacity follow continuous runtime controls. | Remove the runtime resource listener. |
| MarkScene | The document-wide primary-mark lease synchronizes one animated glyph; secondary instances keep the static frame. | Release the lease and hand it to the next waiting primary instance. |
| Gallery3D Model | Cloned authored GLTF meshes receive a material whose color follows the runtime palette. | Remove the runtime listener and dispose the material. |
| Gallery3D scene | Browser pointer events supply tracking coordinates to the WebGL frame loop without React state. | Remove the pointer listener. |
| Gold | Instanced geometry attributes and material colors are uploaded to renderer resources; runtime controls invalidate demand rendering. | Remove runtime listeners and dispose the created material. |
| Birthday20 | Authored physics entities, pointer glow nodes, resize events and animation frames update DOM positions directly. The rich-quality child mounts these effects; static quality renders the authored asset without a frame loop. | Cancel the frame, remove pointer/resize listeners and remove owned DOM nodes. |
| BouncingCircle | The rich-quality browser frame loop updates the circle transform directly. | Cancel the frame. |
| ClickingCircle | Document clicks move the reduced-quality circle through ordinary React updates after an interaction. | Remove the document listener. |
| HalloweenPulse | Scheduled authored events synchronize temporary DOM decorations and optional sound with the browser. Only rich quality schedules them. | Clear schedules and remove owned nodes. |
| BlogPainting | After hydration, the current date and a random choice select one of the authored seasonal browser images by writing its DOM src. | No ongoing resource remains after the write. |

BlogPainting intentionally uses an ordinary decorative image: its source is selected after
hydration and changed directly on the DOM element. The narrow ESLint exception applies only
to this file; it does not relax image rules for other scenes. Its empty alt text preserves the
decorative role.

Birthday20 collision damping remains 1 for elastic collisions, with mass proportional to the
squared radius; the comment cleanup does not alter the newer main rendering or physics.

PaletteImage renders the authored image with its intrinsic proportions. The painted-artwork adapter changes its SVG paints or raster filter without replacing the image with an alpha stencil.
The gallery scene mark uses the first authored glyph tile rather than reconstructing the GLTF
camera image; ADR-046 records that distinction. SceneUniformState is a mutable renderer resource,
not React state. Scene layout seeds keep deterministic particle placement across quality changes.
Lazy renderer identities exist before loading scene code or WebGL dependencies.

Build tools keep authored SVG coordinates, IDs and defs order intact. SVG optimization exclusions
have explicit asset-specific reasons; generated posters are owned by their generator. Browser
icons await all fifteen writes. Scene poster and celebration generation are deterministic and
support checks for stale output. Exporting a CSS backdrop stack uses a self-contained SVG data
URL and an unmounted canvas only during PNG export, because Chromium taints foreignObject images
loaded from Blob URLs. This does not add a second runtime canvas.

The page and Studio do not allocate separate WebGL contexts. One document renderer outlet moves
between their DOM planes. Initial hosts are warmed once, then focused or most recently mounted
contained previews receive the live renderer. Inactive hosts retain one captured frame; they
resume live rendering when the preview closes or focus changes. Capturing happens after a frame
while its drawing buffer is valid, without enabling preserveDrawingBuffer and without a per-frame
PNG serialization loop. All lazy scene content must signal readiness before capture. An unavailable
WebGL renderer leaves a CSS fallback rather than claiming to have captured authored pixels.

`tools/perf/backdrop-lease-smoke.mjs` verifies a page plus Studio plus a Studio window create only
one WebGL context and one backdrop canvas, retain the same canvas object across focus handoffs and SPA
navigation, recolor the live preview, and restore the page renderer. `RendererLease` unit tests
cover warmup, capture, focus, removal and structural refresh. The screenshot matrix tool captures
36 scenes under six palettes; it produces runtime/asset diagnostics and review sheets, not an
original-versus-new A/B fidelity assertion.

The six-palette browser review caught two static-rendering defects: assigning every pixel
landscape layer the same palette paint hid their authored silhouette differences, and paused
shooting stars began offscreen. Landscape layers now use distinct palette slots or blends,
while the still shooting-star layout places deterministic visible stars without an animation
loop. This retains their source masks and does not retire or consolidate scenes.

## Authored backdrop fidelity restoration

The Whiteout camera still uses the original position and field of view. Its tracked render view
is a square sized to the larger host dimension, centered horizontally and offset vertically by
40 percent of that square, matching the original 100lvmax canvas. Container query units retain
that framing in a bounded Studio preview. Its linear palette uniforms are encoded to the renderer
output color space; the original noise frequency 1.35, displacement 0.3 and time scale 0.03 are
the control defaults, and those uniforms now drive the authored deformation.

Whiteout and home titles render their original SVG artwork with its internal gradients and
opacity fade. The home moving layers likewise retain the authored neutral gradients, with the
title between the first/third layers and the foreground second layer. Those layers and their
translation use the host dimensions, matching the original viewport on the page and fitting
a contained preview. Whiteout keeps the title
below the wave plane, as in the original composition. These particular SVG illustrations are
authored decoration rather than flat recolorable stencils; replacing them with PaletteImage
had discarded their gradients. Other stencil scenes continue to receive palette paint.

Memories uses a single-color authored node SVG, so its stencil retains the original geometry
and transparency. Its palette reference controls the node paint independently of that artwork.

The renderer lease smoke scopes canvas queries to WebGL backdrop hosts. Theme Studio also uses
a separate 2D canvas for its color picker; that canvas does not create a WebGL context or belong
to the backdrop lease.

The live original comparison also found that the tracked Drei camera needed to look toward the origin, as the original Canvas camera did. Keeping the position and field of view alone did not preserve Whiteout framing. Project cog transforms now use independent placement wrappers and valid rotation keyframes; photo drift has explicit neutral transform defaults. Core DOM motifs remain visible when their animation is paused. These findings supersede earlier assumptions of visual parity based on retained source assets alone. See [site fidelity restoration](../implementation/site-fidelity.md).


## Original motion and painted artwork pass (2026-10-10)

All 36 animated themes were compared with the original live site in rich quality, using more than one frame. Delayed scenes were revisited after startup: Celebration's bursts, Birthday's balloons, and Bewitched's 40-second moon orbit. Different random seeds and capture phases are expected; identical frames are not the comparison criterion. The review checks silhouette, layering, transparency, motion paths, timing, framing, and source paint. The private paired captures live under `work/fidelity-audit/craft-motion/`.

`build-palette-artwork.ts` derives 25 scene manifests from the original SVG and PNG assets. Vector geometry, internal gradients, alpha, layering, and keyframes remain authored. Each color records its original OKLCH paint and native palette reference. Palette changes apply a relative lightness, chroma, and hue adjustment to that paint; the native palette therefore retains the illustration instead of flattening it to five solid colors. Embedded CSS animation duration and delay scale together. Still quality pauses embedded animation. The generator has a freshness check in prebuild and CI.

Dusk, Eventide, Meadowland, Murk, and Pixelland retain their multicolor raster layers. They use a relative hue/saturation/brightness filter controlled by the scene's `mid` palette entry. This preserves the source's internal tonal differences; it is not independent recoloring of each raster pixel or layer. Studio exposes that consumed entry rather than inert extra controls. Grass also retains raster artwork alongside recolorable vector art. Blog, Photos, Projects, Birthday, Birthday19, Birthday20, and Whiteout title artwork now use generated vector palette manifests. Every scene can retain native colors while responding to consumed palette entries; fixed-appearance theme policy is separate from scene palette editing. Eep filters the page's actual colors and has no separate scene palette controls.

`usePaletteArtwork` owns the browser fetch, an immutable manifest promise cache, a scene-runtime subscription, and a child-list MutationObserver. It updates CSS artwork URLs and image sources directly when the palette, speed, or quality changes. React does not render on palette drag frames. Cleanup disconnects the observer, removes the subscription, and ignores late fetch responses. Failed asset loading preserves the original source image.

Whiteout, Velvet, and Planetoid retain the original encoded-sRGB shader blend, using explicit conversion from v11's linear color uniforms before blending. Native reference paints preserve authored shadows and highlights; palette edits move those paints relatively. The restored view sizes and offsets follow the original square wave/planet framing. `useSceneUniforms` owns its runtime subscription, invalidates after paint changes, and advances a local scene clock while quality is not still. Gold restores authored fog, lighting, material colors, normal transformation, sphere tessellation, expansion startup, and rotation. Its effect attaches owned fog to the shared Three scene, updates material/light paint, and restores previous fog only if it still owns that slot. Its material is disposed on cleanup. Gallery3D restores depth-dependent brightness and the original square-view pointer normalization; cloned model materials and pointer/media listeners are owned and released by the scene.

Birthday's balloons use the full original path, highlight cutout, pastel hue interval, randomized width/position/start height, 10–16 second travel, and five-balloon startup. Its effect owns the host SVG nodes, Web Animations, spawn timer, runtime subscription, and ResizeObserver. Palette updates repaint each balloon relative to its original random pastel; speed updates retime existing animations; resize resets the authored startup; cleanup cancels animations and scheduling and removes only its owned nodes. Distances use the host bounds so a contained preview cannot inherit page-sized motion. Midnight likewise observes its host bounds once on resize and moves its circle imperatively without reading layout each frame. Its frame and observer are released on cleanup.

Eep's original effect is a foreground backdrop filter, above interface content. Keeping it inside an isolated backdrop stack prevented the original interface hue sweep. The scene now owns a filter element in the page body or contained preview parent, with no pointer interception. A runtime subscription supplies speed, opacity, saturation, and pause state. Cleanup removes the subscription and element. Contained preview clipping keeps the filter out of the editor and other windows. Reduced-motion CSS pauses the sweep.

Gallery keeps its authored multicolor logo tiles. Underwater retains gradient transparency; Christmas retains dot tiling; Glitter, Rainbow, Stars, Midnight, and Celebration retain their original colored highlights or spectrum while responding to scene palette changes. These repairs supersede the earlier stencil-based landscape and single-paint assumptions above.


The October 11 appearance policy gives most built-ins both schemes, with explicit counterpart surface and backdrop overrides. Native artwork is the manifest reference, including when the user views the counterpart. Whiteout's title has its own DOM resource host beside its WebGL view and owns the same fetch/subscription/observer cleanup as the other image hosts. Studio's scene editor reads the selected appearance's backdrop, so a dark palette edit changes the dark preview and does not silently edit unused native paint. See [appearance and entry-page review](../implementation/site-fidelity.md#appearance-and-entry-page-review-2026-10-11).
