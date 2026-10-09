import { defineScene } from "./definition";

export const scene = defineScene({
  id: "christmas", name: "Christmas", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/christmas/ChristmasAnimatedBackground"),
});
