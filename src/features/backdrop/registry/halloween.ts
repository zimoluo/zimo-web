import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "halloween", name: "Halloween", surface: "dom",
  palette: scenePalette("base", "highlight", "accent", "veil"),
  cost: "medium",
  load: () => import("../scenes/halloween/HalloweenAnimatedBackground"),
});
