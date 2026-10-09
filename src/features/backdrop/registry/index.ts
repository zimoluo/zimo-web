import { scene as photos } from "./photos";
import { scene as projects } from "./projects";
import { scene as home } from "./home";
import { scene as blog } from "./blog";
import { scene as midnight } from "./midnight";
import { scene as glitter } from "./glitter";
import { scene as birthday } from "./birthday";
import { scene as rainbow } from "./rainbow";
import { scene as bubbles } from "./bubbles";
import { scene as stars } from "./stars";
import { scene as christmas } from "./christmas";
import { scene as grass } from "./grass";
import { scene as halloween } from "./halloween";
import { scene as gold } from "./gold";
import { scene as sky } from "./sky";
import { scene as storm } from "./storm";
import { scene as pixelland } from "./pixelland";
import { scene as verdant } from "./verdant";
import { scene as bewitched } from "./bewitched";
import { scene as underwater } from "./underwater";
import { scene as crimson } from "./crimson";
import { scene as eep } from "./eep";
import { scene as gallery } from "./gallery";
import { scene as perpetuity } from "./perpetuity";
import { scene as celebration } from "./celebration";
import { scene as birthday19 } from "./birthday-19";
import { scene as dusk } from "./dusk";
import { scene as murk } from "./murk";
import { scene as eventide } from "./eventide";
import { scene as meadowland } from "./meadowland";
import { scene as memories } from "./memories";
import { scene as gallery3D } from "./gallery-3d";
import { scene as birthday20 } from "./birthday-20";
import { scene as velvet } from "./velvet";
import { scene as whiteout } from "./whiteout";
import { scene as planetoid } from "./planetoid";
import type { SceneDefinition } from "./definition";
export const sceneRegistry = {
  "photos": photos,
  "projects": projects,
  "home": home,
  "blog": blog,
  "midnight": midnight,
  "glitter": glitter,
  "birthday": birthday,
  "rainbow": rainbow,
  "bubbles": bubbles,
  "stars": stars,
  "christmas": christmas,
  "grass": grass,
  "halloween": halloween,
  "gold": gold,
  "sky": sky,
  "storm": storm,
  "pixelland": pixelland,
  "verdant": verdant,
  "bewitched": bewitched,
  "underwater": underwater,
  "crimson": crimson,
  "eep": eep,
  "gallery": gallery,
  "perpetuity": perpetuity,
  "celebration": celebration,
  "birthday-19": birthday19,
  "dusk": dusk,
  "murk": murk,
  "eventide": eventide,
  "meadowland": meadowland,
  "memories": memories,
  "gallery-3d": gallery3D,
  "birthday-20": birthday20,
  "velvet": velvet,
  "whiteout": whiteout,
  "planetoid": planetoid,
} as const satisfies Readonly<Record<string, SceneDefinition>>;
export type SceneId = keyof typeof sceneRegistry;
export const sceneIds = Object.keys(sceneRegistry) as SceneId[];
const aliases: Readonly<Record<string, SceneId>> = { gallery3D: "gallery-3d", birthday19: "birthday-19", birthday20: "birthday-20" };
export function getScene(id: string): SceneDefinition | undefined {
  const canonical = aliases[id] ?? id;
  return Object.hasOwn(sceneRegistry, canonical) ? sceneRegistry[canonical as SceneId] : undefined;
}
export type { SceneDefinition } from "./definition";
