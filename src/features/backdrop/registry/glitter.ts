import { defineScene } from "./definition";

export const scene = defineScene({
  id: "glitter", name: "Glitter", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/glitter/GlitterAnimatedBackground"),
});
