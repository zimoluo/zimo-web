import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "home", name: "Home", surface: "dom",
  palette: scenePalette("base", "veil"),
  cost: "medium",
  load: () => import("../scenes/home/HomeAnimatedBackground"),
});
