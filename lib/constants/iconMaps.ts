import DisplayFavicon from "@/components/images/DisplayFavicon";
import AboutIcon from "@/components/images/navigation/AboutIcon";
import BlogIcon from "@/components/images/navigation/BlogIcon";
import ManagementIcon from "@/components/images/navigation/ManagementIcon";
import PhotosIcon from "@/components/images/navigation/PhotosIcon";
import ProjectsIcon from "@/components/images/navigation/ProjectsIcon";

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
