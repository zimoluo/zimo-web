import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "gallery", name: "Gallery", surface: "dom",
  palette: scenePalette("base", "mid", "highlight", "accent", "veil"),
  cost: "medium",
  load: () => import("../scenes/gallery/GalleryAnimatedBackground"),
});
