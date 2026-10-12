import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "crimson", name: "Crimson", surface: "dom",
  palette: scenePalette("highlight", "veil"),
  cost: "medium",
  load: () => import("../scenes/crimson/CrimsonAnimatedBackground"),
});
