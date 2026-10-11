import { defineScene } from "./definition";

export const scene = defineScene({
  id: "eventide", name: "Eventide", surface: "dom",
  cost: "medium",
  palette: { mid: { kind: "tone", at: 0.62 } },
  load: () => import("../scenes/eventide/EventideAnimatedBackground"),
});
