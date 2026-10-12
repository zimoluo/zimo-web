import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "glitter", name: "Glitter", surface: "dom",
  palette: scenePalette("mid", "highlight", "accent"),
  cost: "medium",
  load: () => import("../scenes/glitter/GlitterAnimatedBackground"),
});
