import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "photos", name: "Photos", surface: "dom",
  palette: scenePalette("mid", "highlight", "veil"),
  cost: "medium",
  themeable: true,
  load: () => import("../scenes/photos/PhotosAnimatedBackground"),
});
