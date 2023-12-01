import BirthdayFavicon from "../images/displayFavicon/BirthdayFavicon";
import BlogFavicon from "../images/displayFavicon/BlogFavicon";
import GenericFavicon from "../images/displayFavicon/GenericFavicon";
import GlitterFavicon from "../images/displayFavicon/GlitterFavicon";
import HomeFavicon from "../images/displayFavicon/HomeFavicon";
import MidnightFavicon from "../images/displayFavicon/MidnightFavicon";
import PhotosFavicon from "../images/displayFavicon/PhotosFavicon";
import ProjectsFavicon from "../images/displayFavicon/ProjectsFavicon";
import RainbowFavicon from "../images/displayFavicon/RainbowFavicon";

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
  glitter: GlitterFavicon,
  birthday: BirthdayFavicon,
  rainbow: RainbowFavicon,
};
