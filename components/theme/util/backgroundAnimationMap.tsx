import { ReactNode } from "react";
import PhotosAnimatedBackground from "@/components/mainPage/backgroundAnimations/photos/PhotosAnimatedBackground";
import HomeAnimatedBackground from "@/components/mainPage/backgroundAnimations/home/HomeAnimatedBackground";
import BlogAnimatedBackground from "@/components/mainPage/backgroundAnimations/blog/BlogAnimatedBackground";
import ProjectsAnimatedBackground from "@/components/mainPage/backgroundAnimations/projects/ProjectsAnimatedBackground";
import MidnightAnimatedBackground from "@/components/mainPage/backgroundAnimations/midnight/MidnightAnimatedBackground";
import GlitterAnimatedBackground from "@/components/mainPage/backgroundAnimations/glitter/GlitterAnimatedBackground";
import BirthdayAnimatedBackground from "@/components/mainPage/backgroundAnimations/birthday/BirthdayAnimatedBackground";
import RainbowScroll from "@/components/mainPage/backgroundAnimations/rainbow/RainbowScroll";
import BubblesAnimatedBackground from "@/components/mainPage/backgroundAnimations/bubbles/BubblesAnimatedBackground";
import ShootingStars from "@/components/mainPage/backgroundAnimations/star/ShootingStars";
import ChristmasAnimatedBackground from "@/components/mainPage/backgroundAnimations/christmas/ChristmasAnimatedBackground";
import GrassAnimatedBackground from "@/components/mainPage/backgroundAnimations/grass/GrassAnimatedBackground";
import HalloweenAnimatedBackground from "@/components/mainPage/backgroundAnimations/halloween/HalloweenAnimatedBackground";
import AboutAnimatedBackground from "@/components/mainPage/backgroundAnimations/about/AboutAnimatedBackground";
import GoldAnimatedBackground from "@/components/mainPage/backgroundAnimations/gold/GoldAnimatedBackground";
import SkyAnimatedBackground from "@/components/mainPage/backgroundAnimations/sky/SkyAnimatedBackground";
import StormAnimatedBackground from "@/components/mainPage/backgroundAnimations/storm/StormAnimatedBackground";
import PixellandAnimatedBackground from "@/components/mainPage/backgroundAnimations/pixelland/PixellandAnimatedBackground";
import VerdantAnimatedBackground from "@/components/mainPage/backgroundAnimations/verdant/VerdantAnimatedBackground";
import BewitchedAnimatedBackground from "@/components/mainPage/backgroundAnimations/bewitched/BewitchedAnimatedBackground";
import UnderwaterAnimatedBackground from "@/components/mainPage/backgroundAnimations/underwater/UnderwaterAnimatedBackground";
import CrimsonAnimatedBackground from "@/components/mainPage/backgroundAnimations/crimson/CrimsonAnimatedBackground";
import EepAnimatedBackground from "@/components/mainPage/backgroundAnimations/eep/EepAnimatedBackground";

export const backgroundAnimationMap: Record<
  ThemeAnimatedBackgroundKey,
  ReactNode
> = {
  photos: <PhotosAnimatedBackground />,
  projects: <ProjectsAnimatedBackground />,
  home: <HomeAnimatedBackground />,
  blog: <BlogAnimatedBackground />,
  midnight: <MidnightAnimatedBackground />,
  glitter: <GlitterAnimatedBackground />,
  birthday: <BirthdayAnimatedBackground />,
  rainbow: <RainbowScroll />,
  bubbles: <BubblesAnimatedBackground />,
  stars: <ShootingStars />,
  christmas: <ChristmasAnimatedBackground />,
  grass: <GrassAnimatedBackground />,
  halloween: <HalloweenAnimatedBackground />,
  about: <AboutAnimatedBackground />,
  gold: <GoldAnimatedBackground />,
  sky: <SkyAnimatedBackground />,
  storm: <StormAnimatedBackground />,
  pixelland: <PixellandAnimatedBackground />,
  verdant: <VerdantAnimatedBackground />,
  bewitched: <BewitchedAnimatedBackground />,
  underwater: <UnderwaterAnimatedBackground />,
  crimson: <CrimsonAnimatedBackground />,
  eep: <EepAnimatedBackground />,
};
