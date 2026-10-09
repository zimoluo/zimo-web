import { defineScene } from "./definition";

export const scene = defineScene({
  id: "stars", name: "Stars", surface: "dom",
  cost: "medium",
  params: { count: {kind:"number",label:"Stars",min:1,max:100,step:1,default:50} },
  load: () => import("../scenes/star/ShootingStars"),
});
