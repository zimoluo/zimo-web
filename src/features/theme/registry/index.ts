import type { ThemeSource } from "../model/types";
import about from "./themes/about";
import aquarium from "./themes/aquarium";
import autumnal from "./themes/autumnal";
import bewitched from "./themes/bewitched";
import birthday from "./themes/birthday";
import birthdayGeneric from "./themes/birthday-generic";
import birthday19 from "./themes/birthday19";
import birthday20 from "./themes/birthday20";
import blog from "./themes/blog";
import bubbles from "./themes/bubbles";
import celebration from "./themes/celebration";
import cherry from "./themes/cherry";
import christmas from "./themes/christmas";
import crimson from "./themes/crimson";
import cubistic from "./themes/cubistic";
import defaultEditor from "./themes/default-editor";
import dusk from "./themes/dusk";
import eep from "./themes/eep";
import energize from "./themes/energize";
import eventide from "./themes/eventide";
import gallery from "./themes/gallery";
import gallery3D from "./themes/gallery3-d";
import glitter from "./themes/glitter";
import gold from "./themes/gold";
import grass from "./themes/grass";
import halloween from "./themes/halloween";
import home from "./themes/home";
import lollipop from "./themes/lollipop";
import marina from "./themes/marina";
import meadowland from "./themes/meadowland";
import memories from "./themes/memories";
import midnight from "./themes/midnight";
import mori from "./themes/mori";
import murk from "./themes/murk";
import oasis from "./themes/oasis";
import penumbra from "./themes/penumbra";
import perpetuity from "./themes/perpetuity";
import photos from "./themes/photos";
import pixelland from "./themes/pixelland";
import plainBlack from "./themes/plain-black";
import plainDark from "./themes/plain-dark";
import plainGray from "./themes/plain-gray";
import plainLight from "./themes/plain-light";
import planetoid from "./themes/planetoid";
import projects from "./themes/projects";
import rainbow from "./themes/rainbow";
import scintillating from "./themes/scintillating";
import sky from "./themes/sky";
import spookfest from "./themes/spookfest";
import springField from "./themes/spring-field";
import stars from "./themes/stars";
import storm from "./themes/storm";
import underwater from "./themes/underwater";
import unity from "./themes/unity";
import velvet from "./themes/velvet";
import verdant from "./themes/verdant";
import vibrant from "./themes/vibrant";
import vitreous from "./themes/vitreous";
import whiteout from "./themes/whiteout";

const registry = {
  "about": about,
  "aquarium": aquarium,
  "autumnal": autumnal,
  "bewitched": bewitched,
  "birthday": birthday,
  "birthday-generic": birthdayGeneric,
  "birthday19": birthday19,
  "birthday20": birthday20,
  "blog": blog,
  "bubbles": bubbles,
  "celebration": celebration,
  "cherry": cherry,
  "christmas": christmas,
  "crimson": crimson,
  "cubistic": cubistic,
  "default-editor": defaultEditor,
  "dusk": dusk,
  "eep": eep,
  "energize": energize,
  "eventide": eventide,
  "gallery": gallery,
  "gallery3-d": gallery3D,
  "glitter": glitter,
  "gold": gold,
  "grass": grass,
  "halloween": halloween,
  "home": home,
  "lollipop": lollipop,
  "marina": marina,
  "meadowland": meadowland,
  "memories": memories,
  "midnight": midnight,
  "mori": mori,
  "murk": murk,
  "oasis": oasis,
  "penumbra": penumbra,
  "perpetuity": perpetuity,
  "photos": photos,
  "pixelland": pixelland,
  "plain-black": plainBlack,
  "plain-dark": plainDark,
  "plain-gray": plainGray,
  "plain-light": plainLight,
  "planetoid": planetoid,
  "projects": projects,
  "rainbow": rainbow,
  "scintillating": scintillating,
  "sky": sky,
  "spookfest": spookfest,
  "spring-field": springField,
  "stars": stars,
  "storm": storm,
  "underwater": underwater,
  "unity": unity,
  "velvet": velvet,
  "verdant": verdant,
  "vibrant": vibrant,
  "vitreous": vitreous,
  "whiteout": whiteout,
} satisfies Record<string, ThemeSource>;

export type ThemeId = keyof typeof registry;

export const themeIds = Object.keys(registry) as readonly ThemeId[];

export const getTheme = (id: ThemeId): ThemeSource => registry[id];

export const themeOrder: readonly ThemeId[] = [
  "about",
  "aquarium",
  "autumnal",
  "bewitched",
  "birthday",
  "birthday-generic",
  "birthday19",
  "birthday20",
  "blog",
  "bubbles",
  "celebration",
  "cherry",
  "christmas",
  "crimson",
  "cubistic",
  "default-editor",
  "dusk",
  "eep",
  "energize",
  "eventide",
  "gallery",
  "gallery3-d",
  "glitter",
  "gold",
  "grass",
  "halloween",
  "home",
  "lollipop",
  "marina",
  "meadowland",
  "memories",
  "midnight",
  "mori",
  "murk",
  "oasis",
  "penumbra",
  "perpetuity",
  "photos",
  "pixelland",
  "plain-black",
  "plain-dark",
  "plain-gray",
  "plain-light",
  "planetoid",
  "projects",
  "rainbow",
  "scintillating",
  "sky",
  "spookfest",
  "spring-field",
  "stars",
  "storm",
  "underwater",
  "unity",
  "velvet",
  "verdant",
  "vibrant",
  "vitreous",
  "whiteout",
];

export const listedThemeIds: readonly ThemeId[] = themeOrder.filter(
  (id) => getTheme(id).hidden !== true,
);
