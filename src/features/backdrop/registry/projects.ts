import { defineScene } from "./definition";

export const scene = defineScene({
  id: "projects", name: "Projects", surface: "dom",
  cost: "medium",
  themeable: true,
  params: { spawnInterval: {kind:"number",label:"Code interval",min:100,max:10000,step:100,default:1800} },
  load: () => import("../scenes/projects/ProjectsAnimatedBackground"),
});
