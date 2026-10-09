import type { NavigationKey } from "@/src/lib/navigation-types";
import CommandKeyIcon from "@/src/ui/icons/entries/CommandKeyIcon";
import NotebookIcon from "@/src/ui/icons/entries/NotebookIcon";
import AboutIcon from "@/src/ui/icons/navigation/AboutIcon";
import BlogIcon from "@/src/ui/icons/navigation/BlogIcon";
import DesignIcon from "@/src/ui/icons/navigation/DesignIcon";
import HomeIcon from "@/src/ui/icons/navigation/HomeIcon";
import ManagementIcon from "@/src/ui/icons/navigation/ManagementIcon";
import PhotosIcon from "@/src/ui/icons/navigation/PhotosIcon";
import ProjectsIcon from "@/src/ui/icons/navigation/ProjectsIcon";

export const iconTextMap: Record<NavigationKey, string> = {
  home: "Home",
  photos: "Album",
  blog: "Blog",
  projects: "Projects",
  about: "About",
  management: "Management",
  design: "Design",
  themeMaker: "Theme Maker",
  notebook: "Notebook",
  christmasTree: "Christmas Tree",
};

export const iconImageMap: Record<NavigationKey, typeof HomeIcon> = {
  home: HomeIcon,
  photos: PhotosIcon,
  blog: BlogIcon,
  projects: ProjectsIcon,
  about: AboutIcon,
  management: ManagementIcon,
  design: DesignIcon,
  themeMaker: CommandKeyIcon,
  notebook: NotebookIcon,
  christmasTree: HomeIcon,
};
