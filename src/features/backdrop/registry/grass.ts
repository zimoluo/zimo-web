import { defineScene } from "./definition";

export const scene = defineScene({
  id: "grass", name: "Grass", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/grass/GrassAnimatedBackground"),
});
