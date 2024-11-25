import DuskFavicon from "@/components/assets/displayFavicon/custom/DuskFavicon";
import GalleryFavicon from "@/components/assets/displayFavicon/custom/GalleryFavicon";
import PixellandFavicon from "@/components/assets/displayFavicon/custom/PixellandFavicon";

export const customFaviconKeyMap: Record<
  CustomFaviconKey,
  typeof PixellandFavicon
> = {
  pixelland: PixellandFavicon,
  gallery: GalleryFavicon,
  dusk: DuskFavicon,
};
