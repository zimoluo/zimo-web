import { defineScene } from "./definition";

export const scene = defineScene({
  id: "memories", name: "Memories", surface: "dom",
  cost: "medium",
  load: () => import("../scenes/memories/MemoriesAnimatedBackground"),
});
