import { ReactNode } from "react";
import PhotosAnimatedBackground from "../mainPage/backgroundAnimations/photos/PhotosAnimatedBackground";
import HomeAnimatedBackground from "../mainPage/backgroundAnimations/home/HomeAnimatedBackground";

export const backgroundAnimationMap: Record<
  ThemeAnimatedBackground,
  ReactNode
> = {
  photos: <PhotosAnimatedBackground />,
  projects: undefined,
  about: undefined,
  home: <HomeAnimatedBackground />,
  blog: undefined,
};
