import { defineScene } from "./definition";

export const scene = defineScene({
  id: "pixelland", name: "Pixelland", surface: "dom",
  cost: "medium",
  palette: { mid: { kind: "tone", at: 0.62 } },
  load: () => import("../scenes/pixelland/PixellandAnimatedBackground"),
});
