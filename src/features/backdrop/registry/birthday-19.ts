import { defineScene } from "./definition";

export const scene = defineScene({
  id: "birthday-19", name: "Birthday 19", surface: "dom",
  cost: "medium",
  themeable: false,
  load: () => import("../scenes/birthday19/Birthday19AnimatedBackground"),
});
