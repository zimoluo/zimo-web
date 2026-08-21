import type { CustomFaviconKey } from "../../../src/features/theme/model/v10-types";
import Gallery3DFavicon from "@/components/assets/displayFavicon/custom/Gallery3DFavicon";
import GalleryFavicon from "@/components/assets/displayFavicon/custom/GalleryFavicon";

export const customFaviconKeyMap: Record<
  CustomFaviconKey,
  typeof GalleryFavicon
> = {
  gallery: GalleryFavicon,
  gallery3D: Gallery3DFavicon,
};
