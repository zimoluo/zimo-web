import { defineScene } from "./definition";

export const scene = defineScene({
  id: "verdant", name: "Verdant", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/verdant/VerdantAnimatedBackground"),
});
