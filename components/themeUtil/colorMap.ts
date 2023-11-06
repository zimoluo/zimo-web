import orangeColor from "@/styles/themes/orange.module.css";
import tealColor from "@/styles/themes/teal.module.css";

export const colorMap: Record<
  ThemePalette,
  {
    readonly [key: string]: string;
  }
> = { orange: orangeColor, teal: tealColor };
