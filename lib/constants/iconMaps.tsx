import FaviconImage from "@/components/images/FaviconImage";
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

export const getIconFromKey = (key: IconKey, className: string = "") => {
  const icons = {
    home: <FaviconImage className={className} />,
    photos: <PhotosIcon className={className} />,
    blog: <BlogIcon className={className} />,
    projects: <ProjectsIcon className={className} />,
    about: <AboutIcon className={className} />,
    management: <ManagementIcon className={className} />,
  };

  return icons[key] || null;
};
