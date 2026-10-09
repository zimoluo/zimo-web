import { defineScene } from "./definition";

export const scene = defineScene({
  id: "murk", name: "Murk", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/murk/MurkAnimatedBackground"),
});
