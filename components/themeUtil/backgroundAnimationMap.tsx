import { ReactNode } from "react";
import PhotosAnimatedBackground from "../mainPage/backgroundAnimations/photos/PhotosAnimatedBackground";

export const backgroundAnimationMap: Record<
  ThemeAnimatedBackground,
  ReactNode
> = {
  photos: <PhotosAnimatedBackground />,
  projects: undefined,
};
