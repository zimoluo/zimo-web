import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "verdant", name: "Verdant", surface: "dom",
  palette: scenePalette("base", "mid"),
  cost: "medium",
  load: () => import("../scenes/verdant/VerdantAnimatedBackground"),
});
