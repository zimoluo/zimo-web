import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "midnight", name: "Midnight", surface: "dom",
  palette: scenePalette("highlight"),
  cost: "medium",
  load: () => import("../scenes/midnight/MidnightAnimatedBackground"),
});
