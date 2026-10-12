import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "bewitched", name: "Bewitched", surface: "dom",
  palette: scenePalette("veil"),
  cost: "medium",
  load: () => import("../scenes/bewitched/BewitchedAnimatedBackground"),
});
