import { defineScene } from "./definition";

export const scene = defineScene({
  id: "crimson", name: "Crimson", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/crimson/CrimsonAnimatedBackground"),
});
