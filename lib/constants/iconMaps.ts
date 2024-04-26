import DisplayFavicon from "@/components/assets/DisplayFavicon";
import AboutIcon from "@/components/assets/navigation/AboutIcon";
import BlogIcon from "@/components/assets/navigation/BlogIcon";
import DesignIcon from "@/components/assets/navigation/DesignIcon";
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
  design: "Design",
};

export const iconImageMap: Record<NavigationKey, typeof DisplayFavicon> = {
  home: DisplayFavicon,
  photos: PhotosIcon,
  blog: BlogIcon,
  projects: ProjectsIcon,
  about: AboutIcon,
  management: ManagementIcon,
  design: DesignIcon,
};

export const likeIconMap: Record<NavigationKey, LikeIconType> = {
  about: "generic",
  blog: "generic",
  home: "generic",
  photos: "heart",
  projects: "star",
  management: "generic",
  design: "generic",
};
