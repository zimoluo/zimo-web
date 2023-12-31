import { ReactNode } from "react";
import PhotosAnimatedBackground from "../mainPage/backgroundAnimations/photos/PhotosAnimatedBackground";
import HomeAnimatedBackground from "../mainPage/backgroundAnimations/home/HomeAnimatedBackground";
import BlogAnimatedBackground from "../mainPage/backgroundAnimations/blog/BlogAnimatedBackground";
import ProjectsAnimatedBackground from "../mainPage/backgroundAnimations/projects/ProjectsAnimatedBackground";
import MidnightAnimatedBackground from "../mainPage/backgroundAnimations/midnight/MidnightAnimatedBackground";
import GlitterAnimatedBackground from "../mainPage/backgroundAnimations/glitter/GlitterAnimatedBackground";
import BirthdayAnimatedBackground from "../mainPage/backgroundAnimations/birthday/BirthdayAnimatedBackground";
import RainbowScroll from "../mainPage/backgroundAnimations/rainbow/RainbowScroll";
import BubblesAnimatedBackground from "../mainPage/backgroundAnimations/bubbles/BubblesAnimatedBackground";
import ShootingStars from "../mainPage/backgroundAnimations/star/ShootingStars";
import ChristmasAnimatedBackground from "../mainPage/backgroundAnimations/christmas/ChristmasAnimatedBackground";
import GrassAnimatedBackground from "../mainPage/backgroundAnimations/grass/GrassAnimatedBackground";

export const backgroundAnimationMap: Record<
  ThemeAnimatedBackground,
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
};
