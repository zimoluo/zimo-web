import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "celebration", name: "Celebration", surface: "dom",
  palette: scenePalette("accent"),
  cost: "medium",
  load: () => import("../scenes/celebration/CelebrationAnimatedBackground"),
});
