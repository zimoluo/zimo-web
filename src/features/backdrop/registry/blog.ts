import { defineScene } from "./definition";

export const scene = defineScene({
  id: "blog", name: "Blog", surface: "dom",
  cost: "medium",
  themeable: false,
  params: { painting: {kind:"boolean",label:"Center painting",default:true} },
  load: () => import("../scenes/blog/BlogAnimatedBackground"),
});
