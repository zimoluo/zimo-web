import aboutTheme from "../theme/instances/about";
import autumnalTheme from "../theme/instances/autumnal";
import birthdayTheme from "../theme/instances/birthday";
import blogTheme from "../theme/instances/blog";
import bubblesTheme from "../theme/instances/bubbles";
import cherryTheme from "../theme/instances/cherry";
import christmasTheme from "../theme/instances/christmas";
import customTheme from "../theme/instances/custom";
import glitterTheme from "../theme/instances/glitter";
import goldTheme from "../theme/instances/gold";
import grassTheme from "../theme/instances/grass";
import halloweenTheme from "../theme/instances/halloween";
import homeTheme from "../theme/instances/home";
import marinaTheme from "../theme/instances/marina";
import midnightTheme from "../theme/instances/midnight";
import moriTheme from "../theme/instances/mori";
import penumbraTheme from "../theme/instances/penumbra";
import photosTheme from "../theme/instances/photos";
import pixellandTheme from "../theme/instances/pixelland";
import plainDarkTheme from "../theme/instances/plainDark";
import plainLightTheme from "../theme/instances/plainLight";
import projectsTheme from "../theme/instances/projects";
import rainbowTheme from "../theme/instances/rainbow";
import scintillatingTheme from "../theme/instances/scintillating";
import skyTheme from "../theme/instances/sky";
import starsTheme from "../theme/instances/stars";
import stormTheme from "../theme/instances/storm";
import verdantTheme from "../theme/instances/verdant";
import vitreousTheme from "../theme/instances/vitreous";

export const themeKeyMap: Record<ThemeKey, ThemeInstance> = {
  photos: photosTheme,
  projects: projectsTheme,
  home: homeTheme,
  about: aboutTheme,
  blog: blogTheme,
  midnight: midnightTheme,
  glitter: glitterTheme,
  birthday: birthdayTheme,
  plainLight: plainLightTheme,
  plainDark: plainDarkTheme,
  rainbow: rainbowTheme,
  bubbles: bubblesTheme,
  stars: starsTheme,
  christmas: christmasTheme,
  grass: grassTheme,
  halloween: halloweenTheme,
  gold: goldTheme,
  autumnal: autumnalTheme,
  cherry: cherryTheme,
  marina: marinaTheme,
  mori: moriTheme,
  sky: skyTheme,
  storm: stormTheme,
  vitreous: vitreousTheme,
  pixelland: pixellandTheme,
  scintillating: scintillatingTheme,
  verdant: verdantTheme,
  custom: customTheme,
  penumbra: penumbraTheme,
};
