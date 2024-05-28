"use client";

import BirthdayAnimatedBackground from "../birthday/BirthdayAnimatedBackground";
import BubblesAnimatedBackground from "../bubbles/BubblesAnimatedBackground";
import GlitterAnimatedBackground from "../glitter/GlitterAnimatedBackground";
import HalloweenAnimatedBackground from "../halloween/HalloweenAnimatedBackground";
import PixellandAnimatedBackground from "../pixelland/PixellandAnimatedBackground";
import ProjectsAnimatedBackground from "../projects/ProjectsAnimatedBackground";
import SkyAnimatedBackground from "../sky/SkyAnimatedBackground";
import ShootingStars from "../star/ShootingStars";

export default function AmalgamateAnimatedBackground() {
  return (
    <>
      <PixellandAnimatedBackground />
      <HalloweenAnimatedBackground />
      <GlitterAnimatedBackground />
      <BubblesAnimatedBackground />
      <ProjectsAnimatedBackground />
      <SkyAnimatedBackground />
      <ShootingStars />
      <BirthdayAnimatedBackground />
    </>
  );
}
