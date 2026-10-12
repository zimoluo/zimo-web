import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "blog", name: "Blog", surface: "dom",
  palette: scenePalette("base", "mid", "highlight", "veil"),
  paletteConditions: { highlight: { parameter: "painting", value: true } },
  paletteHints: { mid: "Full motion · orb glow", highlight: "Full motion · center painting", veil: "Full motion · center orb" },
  cost: "medium",
  themeable: true,
  params: { painting: {kind:"boolean",label:"Center painting",default:true} },
  load: () => import("../scenes/blog/BlogAnimatedBackground"),
});
