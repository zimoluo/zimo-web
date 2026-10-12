import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "eep", name: "Eep", surface: "dom",
  cost: "medium",
  palette: scenePalette(),
  load: () => import("../scenes/eep/EepAnimatedBackground"),
});
