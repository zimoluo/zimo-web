import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "underwater", name: "Underwater", surface: "dom",
  palette: scenePalette("mid", "veil"),
  cost: "medium",
  load: () => import("../scenes/underwater/UnderwaterAnimatedBackground"),
});
