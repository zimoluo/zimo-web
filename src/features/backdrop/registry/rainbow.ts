import { defineScene } from "./definition";

export const scene = defineScene({
  id: "rainbow", name: "Rainbow", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/rainbow/RainbowScroll"),
});
