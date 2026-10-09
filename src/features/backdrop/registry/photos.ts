import { defineScene } from "./definition";

export const scene = defineScene({
  id: "photos", name: "Photos", surface: "dom",
  cost: "medium",
  themeable: false,
  load: () => import("../scenes/photos/PhotosAnimatedBackground"),
});
