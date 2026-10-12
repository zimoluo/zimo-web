import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "meadowland", name: "Meadowland", surface: "dom",
  palette: scenePalette("mid"),
  cost: "medium",
  load: () => import("../scenes/meadowland/MeadowlandAnimatedBackground"),
});
