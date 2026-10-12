import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "memories", name: "Memories", surface: "dom",
  palette: scenePalette("base", "highlight"),
  cost: "medium",
  load: () => import("../scenes/memories/MemoriesAnimatedBackground"),
});
