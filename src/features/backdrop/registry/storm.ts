import { defineScene } from "./definition";

export const scene = defineScene({
  id: "storm", name: "Storm", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/storm/StormAnimatedBackground"),
});
