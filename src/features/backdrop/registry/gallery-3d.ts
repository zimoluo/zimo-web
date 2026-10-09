import { defineScene } from "./definition";

export const scene = defineScene({
  id: "gallery-3d", name: "Gallery 3D", surface: "r3f",
  cost: "high",
  camera: { position: [0, 0, 30], fov: 70 },
  params: { tracking: {kind:"boolean",label:"Follow pointer",default:true} },
  load: () => import("../scenes/gallery3D/Gallery3DAnimatedBackground"),
});
