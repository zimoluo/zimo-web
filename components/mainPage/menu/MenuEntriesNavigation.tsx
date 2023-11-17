import React from "react";
import Link from "next/link";
import DisplayFavicon from "@/components/images/DisplayFavicon";
import PhotosIcon from "@/components/images/navigation/PhotosIcon";
import AboutIcon from "@/components/images/navigation/AboutIcon";
import BlogIcon from "@/components/images/navigation/BlogIcon";
import ProjectsIcon from "@/components/images/navigation/ProjectsIcon";
import ManagementIcon from "@/components/images/navigation/ManagementIcon";
import MenuNavigationEntryText from "./MenuNavigationEntryText";

interface Props {
  item: NavigationKey;
}

const navIconMap = {
  home: DisplayFavicon,
  photos: PhotosIcon,
  blog: BlogIcon,
  projects: ProjectsIcon,
  about: AboutIcon,
  management: ManagementIcon,
};

export default function MenuEntriesNavigation({ item }: Props) {
  const NavigationIcon = navIconMap[item];

  return (
    <>
      <Link href={`/${item === "home" ? "" : item}`}>
        <div className="group cursor-pointer flex items-center my-4">
          <NavigationIcon className="h-8 md:h-10 w-auto aspect-square transform transition-transform duration-300 group-hover:scale-110" />
          <div className="flex-grow" />
          <MenuNavigationEntryText item={item} />
        </div>
      </Link>
      {item !== "management" && (
        <div className="border-primary border-0.4 border-opacity-20" />
      )}
    </>
  );
}
