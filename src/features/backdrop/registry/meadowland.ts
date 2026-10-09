import { defineScene } from "./definition";

export const scene = defineScene({
  id: "meadowland", name: "Meadowland", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/meadowland/MeadowlandAnimatedBackground"),
});
