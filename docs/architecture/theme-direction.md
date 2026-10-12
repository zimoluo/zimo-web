# Theme engine direction

Updated October 12, 2026 after the user's clarification: retain the current v11 engine's expressive capabilities and favor careful porting and execution repairs over a broad redesign. [Current implementation](theme-engine.md) describes the running system. ADR-052 supersedes the broader refactor scope proposed in ADR-051.

## Preserve the engine's strengths

Keep the continuous OKLCh ramp, gamut-relative chroma, hue torsion, control stops, hue/chroma deviations, aliases, literals, single/paired appearances, mirroring, appearance overrides, layered gradients, lenses/alpha binding, variation, marks, scene palettes and parameters. These features solve real authoring problems. A fitted value with several decimal places is not by itself a design defect, and a high deviation count does not justify discarding the mechanism.

The original site's material geometry and interaction craft remain references: specular perimeter rendering, shadow spread, concentric corners, spacing and interruption behavior. Palette changes may improve a theme, but simplifying data is not a reason to flatten detailed artwork or make the engine less useful.

## Make porting more deliberate

Review each theme as a complete composition, in its intended appearance: roles, surface layers, mark, scene palette, animation and reading material. Check edited hues/chroma, contained previews, and rich/reduced/still scene quality as well as the untouched preset. Compare the native appearance to the original source and live site; assess a counterpart on its own merits.

Single appearances remain valid for themes intended to be fixed. Paired themes can use mirroring, inheritance and selective overrides. The requirement is predictable, reviewed results, not two duplicated sets of hand-authored data. Current counterpart/mark helpers can remain while their policy and treatments are made understandable and corrected. There is no mandate to delete `reviewedSchemes`, replace every tone deviation with a literal, or rewrite all 59 presets.

The source inventory in the current-engine guide identifies where to inspect, not a verdict that all generated/fitted paint is wrong. Where a counterpart looks weak, fix its treatment or declare its intended availability. Where a literal or adjustment accidentally makes an editable palette stop responding, trace and repair that binding without removing intentional fixed colors or multicolor relationships.

## Focused improvements within the current contracts

| Concern | Conservative action |
| --- | --- |
| Appearance rules | Explain mirroring/orientation/override precedence; add regressions for actual bad interactions before changing it |
| Counterpart publication | Keep useful shared recipes, make intended fixed/paired policy legible, and review individual treatments |
| Material reflection | Preserve authored rim/shadow drawing; correct color treatment where rendered evidence shows a defect |
| Scene artwork | Keep detail and native palette relationships; repair binding, speed, pause, bounds and cleanup per scene |
| Runtime cost | Bound memo/resource growth without rounding colors or weakening authoring precision; measure before broader caching work |
| Editor consistency | Ensure preview/site/export agree, reference controls retain their meaning, and interruption restores the correct state |
| Diagnostics | Report unsupported scene/parameter cases instead of presenting a silently incomplete result |
| Persistence | Preserve existing profiles; improve identity/versioning only when a concrete operation requires it |

Do not introduce a new serialized theme format, remove working authoring controls, or reorganize the engine merely to reduce the file count. Small shared helpers are useful when they make a port clearer, but should not become another hidden layer of theme-specific behavior.

## Work and verification

Continue in reviewable chunks: reproduce a defect, trace the original/source contract, fix the owning mechanism or theme treatment, and verify the affected compositions and interactions. Maintain an explicit distinction between a draft counterpart and a reviewed published appearance. Broader source/runtime normalization remains an option when supported by evidence; it is not the next blanket task.

Color-kernel changes must preserve exact output and gamut/ramp invariants. Port changes need original/native comparisons plus edited-palette checks. Appearance changes need single/paired, saved-profile round-trip and material/mark/backdrop coverage. Motion changes need normal/reduced behavior, interruption, contained bounds and resource cleanup. Keep the code-comment ban; rationale belongs in documentation.

The focused execution pass bounds the exact-coordinate gamut memo while retaining bit-identical color calculations, completes drag/resize cancellation rollback, suppresses unchanged focus writes, and retires removed draft scene properties. The existing surface/scene fidelity audit continues. These improve durability without changing the theme engine's authoring power. None of the broader architectural proposals from ADR-051 is considered implemented merely because it was documented.
