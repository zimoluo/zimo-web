import { defineScene } from "./definition";

export const scene = defineScene({
  id: "dusk", name: "Dusk", surface: "dom",
  cost: "medium",
  palette: { mid: { kind: "tone", at: 0.62 } },
  load: () => import("../scenes/dusk/DuskAnimatedBackground"),
});
