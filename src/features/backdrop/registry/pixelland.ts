import { defineScene } from "./definition";

export const scene = defineScene({
  id: "pixelland", name: "Pixelland", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/pixelland/PixellandAnimatedBackground"),
});
