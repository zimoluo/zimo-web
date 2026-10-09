import { defineScene } from "./definition";

export const scene = defineScene({
  id: "bewitched", name: "Bewitched", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/bewitched/BewitchedAnimatedBackground"),
});
