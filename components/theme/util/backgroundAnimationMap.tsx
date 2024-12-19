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
import GoldAnimatedBackground from "@/components/mainPage/backgroundAnimations/gold/GoldAnimatedBackground";
import SkyAnimatedBackground from "@/components/mainPage/backgroundAnimations/sky/SkyAnimatedBackground";
import StormAnimatedBackground from "@/components/mainPage/backgroundAnimations/storm/StormAnimatedBackground";
import PixellandAnimatedBackground from "@/components/mainPage/backgroundAnimations/pixelland/PixellandAnimatedBackground";
import VerdantAnimatedBackground from "@/components/mainPage/backgroundAnimations/verdant/VerdantAnimatedBackground";
import BewitchedAnimatedBackground from "@/components/mainPage/backgroundAnimations/bewitched/BewitchedAnimatedBackground";
import UnderwaterAnimatedBackground from "@/components/mainPage/backgroundAnimations/underwater/UnderwaterAnimatedBackground";
import CrimsonAnimatedBackground from "@/components/mainPage/backgroundAnimations/crimson/CrimsonAnimatedBackground";
import EepAnimatedBackground from "@/components/mainPage/backgroundAnimations/eep/EepAnimatedBackground";
import GalleryAnimatedBackground from "@/components/mainPage/backgroundAnimations/gallery/GalleryAnimatedBackground";
import PerpetuityAnimatedBackground from "@/components/mainPage/backgroundAnimations/perpetuity/PerpetuityAnimatedBackground";
import CelebrationAnimatedBackground from "@/components/mainPage/backgroundAnimations/celebration/CelebrationAnimatedBackground";
import Birthday19AnimatedBackground from "@/components/mainPage/backgroundAnimations/birthday19/Birthday19AnimatedBackground";
import DuskAnimatedBackground from "@/components/mainPage/backgroundAnimations/dusk/DuskAnimatedBackground";
import MurkAnimatedBackground from "@/components/mainPage/backgroundAnimations/murk/MurkAnimatedBackground";
import EventideAnimatedBackground from "@/components/mainPage/backgroundAnimations/eventide/EventideAnimatedBackground";
import MeadowlandAnimatedBackground from "@/components/mainPage/backgroundAnimations/meadowland/MeadowlandAnimatedBackground";

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
  gold: <GoldAnimatedBackground />,
  sky: <SkyAnimatedBackground />,
  storm: <StormAnimatedBackground />,
  pixelland: <PixellandAnimatedBackground />,
  verdant: <VerdantAnimatedBackground />,
  bewitched: <BewitchedAnimatedBackground />,
  underwater: <UnderwaterAnimatedBackground />,
  crimson: <CrimsonAnimatedBackground />,
  eep: <EepAnimatedBackground />,
  gallery: <GalleryAnimatedBackground />,
  perpetuity: <PerpetuityAnimatedBackground />,
  celebration: <CelebrationAnimatedBackground />,
  birthday19: <Birthday19AnimatedBackground />,
  dusk: <DuskAnimatedBackground />,
  murk: <MurkAnimatedBackground />,
  eventide: <EventideAnimatedBackground />,
  meadowland: <MeadowlandAnimatedBackground />,
};
