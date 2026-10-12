import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "storm", name: "Storm", surface: "dom",
  palette: scenePalette("base", "mid", "highlight", "veil"),
  cost: "medium",
  load: () => import("../scenes/storm/StormAnimatedBackground"),
});
