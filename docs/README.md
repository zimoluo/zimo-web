# Zimo Web architecture

Start here for the maintained explanation of the running v11 application. These guides were checked against the running v11 implementation on October 12, 2026; the fidelity log records each verified follow-up. They distinguish implemented behavior from the conservative theme cleanup. They are not a claim that the visual or release audit is complete.

The durable design is a set of small contracts: validated content, semantic color/material roles, explicit interaction states, and owners for browser resources. Historical appearance equivalence is useful migration evidence; it should not dictate every future authoring decision. The original site's interaction craft, specular geometry, shadows, and concentric spacing remain design references.

| Read | Purpose |
| --- | --- |
| [Application runtime](architecture/application-runtime.md) | Request/first paint, browser startup, state ownership, rendering, and the module map |
| [Theme engine today](architecture/theme-engine.md) | Colors, appearances, materials, motion, marks, compilation, and present compromises |
| [Motion color contracts](operations/scene-palette-controls.md) | Declared renderer consumers, conditional controls, artwork coverage and native color checks |
| [Theme direction](architecture/theme-direction.md) | Preserved capabilities, careful theme porting, and focused execution improvements |
| [Navigation](architecture/navigation.md) | Header/sidebar/search continuity, state derivation, focus, and animation ownership |
| [Windows](architecture/windowing.md) | Identity, geometry, pointer gestures, stacking, persistence, and overlays |
| [Backend](architecture/backend.md) | Content objects, APIs, caches, identity, conditional writes, sync, and the v11 bucket namespace |

For changing the engine, read the two theme guides first, followed by the runtime guide. For maintaining a particular feature, start with its guide and follow its source links and change checklist.

## How the documentation is organized

`architecture/` explains current implementation and clearly labeled future decisions. [The application contracts](architecture.md) contain additional data/API details. `implementation/` records difficult interaction state maps and fidelity evidence; it is not the main architecture tutorial. `operations/` contains migration and resource runbooks. `spec/` is the original design brief and its decision history; historical inventories and acceptance counts there can predate the running implementation.

The current conservative direction is recorded as [ADR-052](spec/exec/X6-implementation-decisions.md#adr-052--preserve-theme-expressiveness-and-repair-porting-and-execution). It narrows the broader proposal in ADR-051 after the user's clarification. Proposed cleanup is distinct from shipped fixes. The [fidelity log](implementation/site-fidelity.md) remains the record of verified application changes and remaining visual gaps.

Code retains the comment ban. Resource ownership, effect rationale, and cross-feature contracts belong in these guides. Update the affected guide with a behavioral change; use a new ADR when changing a contract rather than quietly accumulating another exception.
