import CommandKeyIcon from "@/components/assets/entries/CommandKeyIcon";
import NotebookIcon from "@/components/assets/entries/NotebookIcon";
import AboutIcon from "@/components/assets/navigation/AboutIcon";
import BlogIcon from "@/components/assets/navigation/BlogIcon";
import DesignIcon from "@/components/assets/navigation/DesignIcon";
import HomeIcon from "@/components/assets/navigation/HomeIcon";
import ManagementIcon from "@/components/assets/navigation/ManagementIcon";
import PhotosIcon from "@/components/assets/navigation/PhotosIcon";
import ProjectsIcon from "@/components/assets/navigation/ProjectsIcon";

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
