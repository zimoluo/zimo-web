import BirthdayFavicon from "../assets/displayFavicon/BirthdayFavicon";
import BlogFavicon from "../assets/displayFavicon/BlogFavicon";
import BubblesFavicon from "../assets/displayFavicon/BubblesFavicon";
import GenericFavicon from "../assets/displayFavicon/GenericFavicon";
import GlitterFavicon from "../assets/displayFavicon/GlitterFavicon";
import HomeFavicon from "../assets/displayFavicon/HomeFavicon";
import MidnightFavicon from "../assets/displayFavicon/MidnightFavicon";
import PhotosFavicon from "../assets/displayFavicon/PhotosFavicon";
import ProjectsFavicon from "../assets/displayFavicon/ProjectsFavicon";
import RainbowFavicon from "../assets/displayFavicon/RainbowFavicon";

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
  bubbles: BubblesFavicon,
};
