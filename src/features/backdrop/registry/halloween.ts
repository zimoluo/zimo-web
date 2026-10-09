import { defineScene } from "./definition";

export const scene = defineScene({
  id: "halloween", name: "Halloween", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/halloween/HalloweenAnimatedBackground"),
});
