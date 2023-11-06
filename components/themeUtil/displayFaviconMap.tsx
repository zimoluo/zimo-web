import PhotosFavicon from "../images/displayFavicon/PhotosFavicon";
import ProjectsFavicon from "../images/displayFavicon/ProjectsFavicon";

export const displayFaviconMap: Record<
  ThemeDisplayFavicon,
  typeof PhotosFavicon
> = {
  photos: PhotosFavicon,
  projects: ProjectsFavicon,
};
