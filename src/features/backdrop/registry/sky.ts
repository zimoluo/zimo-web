import { defineScene } from "./definition";

export const scene = defineScene({
  id: "sky", name: "Sky", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/sky/SkyAnimatedBackground"),
});
