import { defineScene } from "./definition";

export const scene = defineScene({
  id: "gallery", name: "Gallery", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/gallery/GalleryAnimatedBackground"),
});
