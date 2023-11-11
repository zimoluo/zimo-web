import BlogFavicon from "../images/displayFavicon/BlogFavicon";
import GenericFavicon from "../images/displayFavicon/GenericFavicon";
import HomeFavicon from "../images/displayFavicon/HomeFavicon";
import MidnightFavicon from "../images/displayFavicon/MidnightFavicon";
import PhotosFavicon from "../images/displayFavicon/PhotosFavicon";
import ProjectsFavicon from "../images/displayFavicon/ProjectsFavicon";

export const displayFaviconMap: Record<
  ThemeDisplayFavicon,
  typeof PhotosFavicon
> = {
  photos: PhotosFavicon,
  projects: ProjectsFavicon,
  generic: GenericFavicon,
  home: HomeFavicon,
  blog: BlogFavicon,
  midnight: MidnightFavicon,
};
