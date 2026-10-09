import { defineScene } from "./definition";

export const scene = defineScene({
  id: "eventide", name: "Eventide", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/eventide/EventideAnimatedBackground"),
});
