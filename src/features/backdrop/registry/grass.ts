import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "grass", name: "Grass", surface: "dom",
  palette: scenePalette("base", "mid", "highlight"),
  cost: "medium",
  load: () => import("../scenes/grass/GrassAnimatedBackground"),
});
