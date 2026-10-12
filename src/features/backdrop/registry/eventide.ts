import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "eventide", name: "Eventide", surface: "dom",
  palette: scenePalette("mid"),
  cost: "medium",
  load: () => import("../scenes/eventide/EventideAnimatedBackground"),
});
