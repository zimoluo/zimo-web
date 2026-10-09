import { defineScene } from "./definition";

export const scene = defineScene({
  id: "bubbles", name: "Bubbles", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/bubbles/BubblesAnimatedBackground"),
});
