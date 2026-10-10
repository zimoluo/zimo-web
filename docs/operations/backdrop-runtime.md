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

PaletteImage treats supplied artwork as an alpha stencil painted by CSS scene palette values.
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
