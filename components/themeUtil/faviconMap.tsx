import GlitterFavicon from "../assets/displayFavicon/custom/GlitterFavicon";
import PenumbraFavicon from "../assets/displayFavicon/custom/PenumbraFavicon";

export const customFaviconKeyMap: Record<
  CustomFaviconKey,
  typeof PenumbraFavicon
> = {
  penumbra: PenumbraFavicon,
  glitter: GlitterFavicon,
};
