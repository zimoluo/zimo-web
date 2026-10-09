import { defineScene } from "./definition";

export const scene = defineScene({
  id: "midnight", name: "Midnight", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/midnight/MidnightAnimatedBackground"),
});
