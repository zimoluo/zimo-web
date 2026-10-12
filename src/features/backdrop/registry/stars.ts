import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "stars", name: "Stars", surface: "dom",
  palette: scenePalette("highlight"),
  cost: "medium",
  params: { count: {kind:"number",label:"Stars",min:1,max:100,step:1,default:50} },
  load: () => import("../scenes/star/ShootingStars"),
});
