import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "sky", name: "Sky", surface: "dom",
  palette: scenePalette("veil"),
  cost: "medium",
  load: () => import("../scenes/sky/SkyAnimatedBackground"),
});
