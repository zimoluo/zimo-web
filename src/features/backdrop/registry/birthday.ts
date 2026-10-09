import { defineScene } from "./definition";

export const scene = defineScene({
  id: "birthday", name: "Birthday", surface: "dom",
  cost: "medium",
  themeable: false,
  params: { spawnInterval: {kind:"number",label:"Balloon interval",min:100,max:10000,step:100,default:1500} },
  load: () => import("../scenes/birthday/BirthdayAnimatedBackground"),
});
