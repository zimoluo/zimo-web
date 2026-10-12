# Scene palette controls

Updated October 12, 2026. The palette shown by Theme Studio is a renderer capability declaration, not the full set of fields accepted by a saved theme. [Theme engine](../architecture/theme-engine.md) explains resolution; [backdrop runtime](backdrop-runtime.md) explains live synchronization.

## Ownership

Each of the 36 scene definitions must supply `palette`. `defineScene` no longer silently supplies five controls to every scene. `scenePalette` selects existing default references; a scene may instead declare its own reference map. The renderer must implement its advertised colors. Theme source palette records remain open, with aliases, tones and literals; imported extra fields are retained. This change does not restrict the serialized model, erase profile data, or merge distinct working color families.

`SceneColors` renders the declared controls and subscribes to the scene's parameters. `paletteConditions` hides a color for a disabled optional component: Blog's painting color disappears when Center painting is off, and returns with its authored value when enabled. `paletteHints` identifies colors belonging to rich-only components or a particular animation. Those colors remain authorable while a reduced preview omits their component; the full-motion requirement is explicit. Unknown scene IDs expose an unavailable-scene message rather than invented working controls.

The resolver still supplies the existing general fallback palette and preserves explicit source fields. Runtime DOM properties, SVG adaptation, raster filtering and shader uniforms consume that resolved data. Declaration changes affect the editor's truthful surface; they do not automatically recolor an existing composition. A custom renderer/slot must supply compatible source/default bindings as well as its declaration.

## Declared consumers

| Scene | Editable slots | Visible consumer |
| --- | --- | --- |
| Photos | mid, highlight, veil | Painted text/glass and pane material |
| Projects | highlight, accent, veil | Authored vector artwork |
| Home | base, veil | Lettering and wave artwork |
| Blog | base, mid, highlight, veil | Lettering, orb glow, optional painting, orb |
| Midnight | highlight | Circle |
| Glitter | mid, highlight, accent | Colored point/shadow families |
| Birthday | base, mid, highlight, accent, veil | Authored vector composition |
| Rainbow | highlight | Relative multicolor stripe palette |
| Bubbles | highlight | Bubble vector paints |
| Stars | highlight | Shooting-star paint |
| Christmas | base, mid, highlight, accent | Light cord, flicker phases and polka washes |
| Grass | base, mid, highlight | Layered vector artwork |
| Halloween | base, highlight, accent, veil | Authored decorations |
| Gold | base, highlight, veil | Emissive/material and fog/light paint |
| Sky | veil | Clouds |
| Storm | base, mid, highlight, veil | Cloud families and eye artwork |
| Pixelland | mid | Raster palette filter |
| Verdant | base, mid | Vector foliage families |
| Bewitched | veil | Moon artwork |
| Underwater | mid, veil | Radial light washes |
| Crimson | highlight, veil | Vector artwork |
| Eep | none | Filters existing page colors |
| Gallery | base, mid, highlight, accent, veil | Authored glyph artwork |
| Perpetuity | mid, accent, veil | Block artwork; accent also affects optional fireworks |
| Celebration | accent | Relative firework colors |
| Birthday 19 | base, mid, highlight, accent, veil | Authored vector composition |
| Dusk | mid | Raster palette filter |
| Murk | mid | Raster palette filter |
| Eventide | mid | Raster palette filter |
| Meadowland | mid | Raster palette filter |
| Memories | base, highlight | Node strokes and fills |
| Gallery 3D | highlight | Model material |
| Birthday 20 | mid, highlight, veil | Authored vector composition |
| Velvet | base, highlight | Shader material |
| Whiteout | base, highlight | Shader material and home lettering |
| Planetoid | base, highlight, accent | Planet and asteroid materials |

The catalog exposes 82 color families instead of the previous 155 fields. The reduction removes unsupported controls, not working renderer capabilities.

## Cases that require semantic review

A variable reference is insufficient evidence of a working color. Memories's alpha masks depended on several palette names, although only their opacity mattered; neutral opaque mask stops now express that directly. The node fill/stroke colors remain editable. Underwater's final radial stop was fully transparent; it now says `transparent` and does not advertise a highlight color.

Celebration's generated shadow list started with a zero-offset, zero-blur, zero-spread placeholder. Its highlight color painted nothing. The generator now omits that placeholder, and Celebration/Perpetuity expose the actual accent family. Storm's old accent assignment reached only tiny mostly overpainted white vector fragments; it did not provide a visible independently editable color family in the scene probe, so it is not offered as a motion color. Its underlying imported field remains intact. Christmas's mid color initially appeared inactive in a frozen first frame, but its bulb paint changes at the 85% flicker phase. It remains a supported control.

## Verification

`tools/perf/scene-palette-smoke.mjs` mutates every declared color through a real saved-profile source and compares rendered pixels. It isolates the backdrop, freezes CSS/SVG sampling, uses rich DOM compositions where required, and samples still WebGL material/geometry without time drift. Christmas includes the later flicker phase. `scene-palette-ui-smoke.mjs` checks actual controls, a live painted-artwork update without remounting, published/draft separation during editing, optional-component visibility and retained JSON values, unavailable scenes, and phone bounds.

These checks establish concrete consumers in representative compositions. They do not establish every animation phase, viewport, edited ramp, quality mode, browser or physical device. New artwork or renderer changes must update the declaration and rerun the mutation probe; a string match or uniform declaration is not an adequate replacement.

Blog's selected painting also had a binding defect: it changed an ordinary image's `src` without declaring its source to the palette adapter. The image now carries `data-palette-src`, including the selected seasonal source. The adapter observes only that source marker in addition to child insertion/removal; its own `src` paint writes do not trigger the observer. The mounted image and source-selection behavior are retained. A deterministic selection and unchanged-frame drift check in the native probe prevents a randomly different painting from being mistaken for a successful color edit.

Birthday 20's rich physics images also now declare their palette source, so newly inserted moving glyphs receive the same adaptation as still artwork. Its former base assignment reached only mask/clipping paint. The artwork builder preserves those structural containers verbatim, and the editor no longer treats their fill as a color family. Intrinsic-image sampling verifies rich glyph paint and coverage independently of moving positions. Planetoid's asteroid accent is checked in full motion with a color-population comparison; a still scene intentionally omits the asteroids and cannot establish that binding.
