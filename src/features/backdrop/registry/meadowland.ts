import { defineScene } from "./definition";

export const scene = defineScene({
  id: "meadowland", name: "Meadowland", surface: "dom",
  cost: "medium",
  palette: { mid: { kind: "tone", at: 0.62 } },
  load: () => import("../scenes/meadowland/MeadowlandAnimatedBackground"),
});
