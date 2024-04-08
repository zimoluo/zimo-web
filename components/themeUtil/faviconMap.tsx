import BirthdayFavicon from "../assets/displayFavicon/BirthdayFavicon";
import BlogFavicon from "../assets/displayFavicon/BlogFavicon";
import BubblesFavicon from "../assets/displayFavicon/BubblesFavicon";
import ChristmasFavicon from "../assets/displayFavicon/ChristmasFavicon";
import GenericFavicon from "../assets/displayFavicon/GenericFavicon";
import GlitterFavicon from "../assets/displayFavicon/GlitterFavicon";
import GoldFavicon from "../assets/displayFavicon/GoldFavicon";
import GrassFavicon from "../assets/displayFavicon/GrassFavicon";
import HalloweenFavicon from "../assets/displayFavicon/HalloweenFavicon";
import HomeFavicon from "../assets/displayFavicon/HomeFavicon";
import MidnightFavicon from "../assets/displayFavicon/MidnightFavicon";
import PhotosFavicon from "../assets/displayFavicon/PhotosFavicon";
import ProjectsFavicon from "../assets/displayFavicon/ProjectsFavicon";
import StarsFavicon from "../assets/displayFavicon/StarsFavicon";
import AdaptiveFavicon from "../assets/displayFavicon/AdaptiveFavicon";
import FaviconOutline from "../assets/displayFavicon/FaviconOutline";
import SkyFavicon from "../assets/displayFavicon/SkyFavicon";
import StormFavicon from "../assets/displayFavicon/StormFavicon";

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
  bubbles: BubblesFavicon,
  stars: StarsFavicon,
  christmas: ChristmasFavicon,
  grass: GrassFavicon,
  halloween: HalloweenFavicon,
  gold: GoldFavicon,
  adaptive: AdaptiveFavicon,
  outline: FaviconOutline,
  sky: SkyFavicon,
  storm: StormFavicon,
};
