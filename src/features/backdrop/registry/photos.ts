import { defineScene } from "./definition";

export const scene = defineScene({
  id: "photos", name: "Photos", surface: "dom",
  cost: "medium",
  themeable: true,
  load: () => import("../scenes/photos/PhotosAnimatedBackground"),
});
