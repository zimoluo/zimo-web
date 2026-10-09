import { defineScene } from "./definition";

export const scene = defineScene({
  id: "underwater", name: "Underwater", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/underwater/UnderwaterAnimatedBackground"),
});
