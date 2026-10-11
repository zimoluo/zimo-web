import { defineScene } from "./definition";

export const scene = defineScene({
  id: "murk", name: "Murk", surface: "dom",
  cost: "medium",
  palette: { mid: { kind: "tone", at: 0.62 } },
  load: () => import("../scenes/murk/MurkAnimatedBackground"),
});
