import { defineScene } from "./definition";

export const scene = defineScene({
  id: "home", name: "Home", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/home/HomeAnimatedBackground"),
});
