import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "dusk", name: "Dusk", surface: "dom",
  palette: scenePalette("mid"),
  cost: "medium",
  load: () => import("../scenes/dusk/DuskAnimatedBackground"),
});
