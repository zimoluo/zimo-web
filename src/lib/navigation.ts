import type { NavigationKey } from "./navigation-types";
export const routeKey = (pathname: string): NavigationKey => {
  const section = pathname.split("/")[1];
  if (section === "album" || section === "photos") return "photos";
  if (section === "blog" || section === "projects" || section === "about" || section === "management") return section;
  if (section === "notebook") return "notebook";
  if (section === "christmas-tree" || section === "christmasTree") return "christmasTree";
  if (section === "theme-maker" || section === "themeMaker" || section === "design" && pathname.split("/")[2] === "theme-maker") return "themeMaker";
  if (section === "design") return "design";
  return "home";
};
