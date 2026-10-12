import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "bubbles", name: "Bubbles", surface: "dom",
  palette: scenePalette("highlight"),
  cost: "medium",
  load: () => import("../scenes/bubbles/BubblesAnimatedBackground"),
});
