import orangeColor from "@/styles/themes/orange.module.css";
import tealColor from "@/styles/themes/teal.module.css";
import neutralColor from "@/styles/themes/neutral.module.css";
import fuchsiaColor from "@/styles/themes/fuchsia.module.css";
import aboutColor from "@/styles/themes/about.module.css";
import midnightColor from "@/styles/themes/midnight.module.css";
import cakeColor from "@/styles/themes/cake.module.css";
import plainLightColor from "@/styles/themes/plain-light.module.css";
import plainDarkColor from "@/styles/themes/plain-dark.module.css";
import rainbowColor from "@/styles/themes/rainbow.module.css";
import blueColor from "@/styles/themes/blue.module.css";
import starsColor from "@/styles/themes/stars.module.css";
import christmasColor from "@/styles/themes/christmas.module.css";
import grassColor from "@/styles/themes/grass.module.css";
import halloweenColor from "@/styles/themes/halloween.module.css";
import goldColor from "@/styles/themes/gold.module.css";
import autumnalColor from "@/styles/themes/autumnal.module.css";
import cherryColor from "@/styles/themes/cherry.module.css";
import marinaColor from "@/styles/themes/marina.module.css";
import moriColor from "@/styles/themes/mori.module.css";
import skyColor from "@/styles/themes/sky.module.css";
import stormColor from "@/styles/themes/storm.module.css";
import vitreousColor from "@/styles/themes/vitreous.module.css";
import pixellandColor from "@/styles/themes/pixelland.module.css";
import scintillatingColor from "@/styles/themes/scintillating.module.css";
import verdantColor from "@/styles/themes/verdant.module.css";

export const colorMap: Record<
  ThemePalette,
  {
    readonly [key: string]: string;
  }
> = {
  orange: orangeColor,
  teal: tealColor,
  neutral: neutralColor,
  fuchsia: fuchsiaColor,
  about: aboutColor,
  midnight: midnightColor,
  cake: cakeColor,
  plainLight: plainLightColor,
  plainDark: plainDarkColor,
  rainbow: rainbowColor,
  blue: blueColor,
  stars: starsColor,
  christmas: christmasColor,
  grass: grassColor,
  halloween: halloweenColor,
  gold: goldColor,
  autumnal: autumnalColor,
  cherry: cherryColor,
  marina: marinaColor,
  mori: moriColor,
  sky: skyColor,
  storm: stormColor,
  vitreous: vitreousColor,
  pixelland: pixellandColor,
  scintillating: scintillatingColor,
  verdant: verdantColor,
};
