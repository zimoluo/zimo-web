import orangeColor from "@/styles/themes/orange.module.css";
import tealColor from "@/styles/themes/teal.module.css";
import neutralColor from "@/styles/themes/neutral.module.css";
import fuchsiaColor from "@/styles/themes/fuchsia.module.css";
import aboutColor from "@/styles/themes/about.module.css";
import midnightColor from "@/styles/themes/midnight.module.css";
import cakeColor from "@/styles/themes/cake.module.css";

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
};
