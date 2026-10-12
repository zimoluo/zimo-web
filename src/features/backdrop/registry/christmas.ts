import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "christmas", name: "Christmas", surface: "dom",
  palette: scenePalette("base", "mid", "highlight", "accent"),
  paletteHints: { base: "Full motion · light cord", mid: "Full motion · flickering lights" },
  cost: "medium",
  load: () => import("../scenes/christmas/ChristmasAnimatedBackground"),
});
