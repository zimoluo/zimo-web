import { defineScene } from "./definition";

export const scene = defineScene({
  id: "dusk", name: "Dusk", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/dusk/DuskAnimatedBackground"),
});
