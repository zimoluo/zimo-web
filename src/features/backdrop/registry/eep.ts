import { defineScene } from "./definition";

export const scene = defineScene({
  id: "eep", name: "Eep", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/eep/EepAnimatedBackground"),
});
