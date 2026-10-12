import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "murk", name: "Murk", surface: "dom",
  palette: scenePalette("mid"),
  cost: "medium",
  load: () => import("../scenes/murk/MurkAnimatedBackground"),
});
