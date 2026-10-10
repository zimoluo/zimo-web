import type { NavigationKey } from "../../lib/navigation-types";
import CommandKeyIcon from "../../ui/icons/entries/CommandKeyIcon";
import NotebookIcon from "../../ui/icons/entries/NotebookIcon";
import AboutIcon from "../../ui/icons/navigation/AboutIcon";
import BlogIcon from "../../ui/icons/navigation/BlogIcon";
import DesignIcon from "../../ui/icons/navigation/DesignIcon";
import HomeIcon from "../../ui/icons/navigation/HomeIcon";
import ManagementIcon from "../../ui/icons/navigation/ManagementIcon";
import PhotosIcon from "../../ui/icons/navigation/PhotosIcon";
import ProjectsIcon from "../../ui/icons/navigation/ProjectsIcon";

export const iconTextMap: Record<NavigationKey, string> = {
  home: "Home",
  photos: "Album",
  blog: "Blog",
  projects: "Projects",
  about: "About",
  management: "Management",
  design: "Design",
  themeMaker: "Theme Studio",
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
