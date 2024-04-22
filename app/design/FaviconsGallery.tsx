import GenericFavicon from "@/components/assets/displayFavicon/GenericFavicon";
import paletteStyle from "./palette.module.css";
import GoldFavicon from "@/components/assets/displayFavicon/GoldFavicon";
import SkyFavicon from "@/components/assets/displayFavicon/SkyFavicon";
import GlitterFavicon from "@/components/assets/displayFavicon/GlitterFavicon";
import PhotosFavicon from "@/components/assets/displayFavicon/PhotosFavicon";
import BirthdayFavicon from "@/components/assets/displayFavicon/BirthdayFavicon";

interface Props {
  className?: string;
}

export default function FaviconsGallery({ className = "" }: Props) {
  return (
    <div
      className={`${paletteStyle.favicons} items-center justify-center ${className}`}
    >
      <GenericFavicon className="w-12 md:w-14" />
      <GoldFavicon className="w-12 md:w-14" />
      <PhotosFavicon className="w-12 md:w-14" />
      <SkyFavicon className="w-12 md:w-14" />
      <GlitterFavicon className="w-12 md:w-14" />
      <BirthdayFavicon className="w-12 md:w-14" />
    </div>
  );
}
