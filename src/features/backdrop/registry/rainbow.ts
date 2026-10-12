import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "rainbow", name: "Rainbow", surface: "dom",
  palette: scenePalette("highlight"),
  cost: "medium",
  load: () => import("../scenes/rainbow/RainbowScroll"),
});
