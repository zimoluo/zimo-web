import aboutConfig from "../theme/config/about";
import autumnalConfig from "../theme/config/autumnal";
import birthdayConfig from "../theme/config/birthday";
import blogConfig from "../theme/config/blog";
import bubblesConfig from "../theme/config/bubbles";
import cherryConfig from "../theme/config/cherry";
import christmasConfig from "../theme/config/christmas";
import glitterConfig from "../theme/config/glitter";
import goldConfig from "../theme/config/gold";
import grassConfig from "../theme/config/grass";
import halloweenConfig from "../theme/config/halloween";
import homeConfig from "../theme/config/home";
import marinaConfig from "../theme/config/marina";
import midnightConfig from "../theme/config/midnight";
import moriConfig from "../theme/config/mori";
import oasisConfig from "../theme/config/oasis";
import penumbraConfig from "../theme/config/penumbra";
import photosConfig from "../theme/config/photos";
import pixellandConfig from "../theme/config/pixelland";
import plainDarkConfig from "../theme/config/plainDark";
import plainLightConfig from "../theme/config/plainLight";
import projectsConfig from "../theme/config/projects";
import rainbowConfig from "../theme/config/rainbow";
import scintillatingConfig from "../theme/config/scintillating";
import skyConfig from "../theme/config/sky";
import starsConfig from "../theme/config/stars";
import stormConfig from "../theme/config/storm";
import verdantConfig from "../theme/config/verdant";
import vitreousConfig from "../theme/config/vitreous";

export const themeKeyMap: Record<ThemeKey, ThemeDataConfig> = {
  photos: photosConfig,
  projects: projectsConfig,
  home: homeConfig,
  about: aboutConfig,
  blog: blogConfig,
  midnight: midnightConfig,
  glitter: glitterConfig,
  birthday: birthdayConfig,
  plainLight: plainLightConfig,
  plainDark: plainDarkConfig,
  rainbow: rainbowConfig,
  bubbles: bubblesConfig,
  stars: starsConfig,
  christmas: christmasConfig,
  grass: grassConfig,
  halloween: halloweenConfig,
  gold: goldConfig,
  autumnal: autumnalConfig,
  cherry: cherryConfig,
  marina: marinaConfig,
  mori: moriConfig,
  sky: skyConfig,
  storm: stormConfig,
  vitreous: vitreousConfig,
  pixelland: pixellandConfig,
  scintillating: scintillatingConfig,
  verdant: verdantConfig,
  custom: oasisConfig,
  penumbra: penumbraConfig,
};
