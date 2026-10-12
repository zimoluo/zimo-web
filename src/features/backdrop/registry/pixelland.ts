import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "pixelland", name: "Pixelland", surface: "dom",
  palette: scenePalette("mid"),
  cost: "medium",
  load: () => import("../scenes/pixelland/PixellandAnimatedBackground"),
});
