import DisplayFavicon from "@/components/assets/DisplayFavicon";
import AboutIcon from "@/components/assets/navigation/AboutIcon";
import BlogIcon from "@/components/assets/navigation/BlogIcon";
import ManagementIcon from "@/components/assets/navigation/ManagementIcon";
import PhotosIcon from "@/components/assets/navigation/PhotosIcon";
import ProjectsIcon from "@/components/assets/navigation/ProjectsIcon";

export const iconTextMap: { [key: string]: string } = {
  home: "Home",
  photos: "Album",
  blog: "Blog",
  projects: "Projects",
  about: "About",
  management: "Management",
};

export const iconImageMap = {
  home: DisplayFavicon,
  photos: PhotosIcon,
  blog: BlogIcon,
  projects: ProjectsIcon,
  about: AboutIcon,
  management: ManagementIcon,
};

export const likeIconMap: Record<NavigationKey, LikeIconType> = {
  about: "generic",
  blog: "generic",
  home: "generic",
  photos: "heart",
  projects: "star",
  management: "generic",
};
