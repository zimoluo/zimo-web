import { ReactNode } from "react";
import PhotosAnimatedBackground from "../mainPage/backgroundAnimations/photos/PhotosAnimatedBackground";
import HomeAnimatedBackground from "../mainPage/backgroundAnimations/home/HomeAnimatedBackground";
import BlogAnimatedBackground from "../mainPage/backgroundAnimations/blog/BlogAnimatedBackground";
import ProjectsAnimatedBackground from "../mainPage/backgroundAnimations/projects/ProjectsAnimatedBackground";
import MidnightAnimatedBackground from "../mainPage/backgroundAnimations/midnight/MidnightAnimatedBackground";
import GlitterAnimatedBackground from "../mainPage/backgroundAnimations/glitter/GlitterAnimatedBackground";
import BirthdayBalloon from "../mainPage/backgroundAnimations/birthday/BirthdayBalloon";

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
  birthday: <BirthdayBalloon />,
};
