import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "birthday-19", name: "Birthday 19", surface: "dom",
  palette: scenePalette("base", "mid", "highlight", "accent", "veil"),
  cost: "medium",
  themeable: true,
  load: () => import("../scenes/birthday19/Birthday19AnimatedBackground"),
});
