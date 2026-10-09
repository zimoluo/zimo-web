import { defineScene } from "./definition";

export const scene = defineScene({
  id: "celebration", name: "Celebration", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/celebration/CelebrationAnimatedBackground"),
});
