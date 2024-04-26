import GenericFavicon from "@/components/assets/displayFavicon/GenericFavicon";
import paletteStyle from "./palette.module.css";
import GoldFavicon from "@/components/assets/displayFavicon/GoldFavicon";
import SkyFavicon from "@/components/assets/displayFavicon/SkyFavicon";
import GlitterFavicon from "@/components/assets/displayFavicon/GlitterFavicon";
import BirthdayFavicon from "@/components/assets/displayFavicon/BirthdayFavicon";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import AdaptiveFavicon from "@/components/assets/displayFavicon/AdaptiveFavicon";
import marinaConfig from "@/components/theme/config/marina";

interface Props {
  className?: string;
}

export default function FaviconsGallery({ className = "" }: Props) {
  const faviconClass = "w-12 md:w-14";

  return (
    <div
      className={`${paletteStyle.favicons} items-center justify-center ${className}`}
    >
      <GenericFavicon className={faviconClass} />
      <GoldFavicon className={faviconClass} />
      <div style={generateInlineStyleObject(marinaConfig.palette)}>
        <AdaptiveFavicon className={faviconClass} />
      </div>
      <SkyFavicon className={faviconClass} />
      <GlitterFavicon className={faviconClass} />
      <BirthdayFavicon className={faviconClass} />
    </div>
  );
}
