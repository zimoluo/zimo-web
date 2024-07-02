import paletteStyle from "./palette.module.css";
import GalleryClickableFavicon from "./GalleryClickableFavicon";
import ThemeMakerFaviconsGallery from "./ThemeMakerFaviconsGallery";

interface Props {
  className?: string;
}

export default function FaviconsGallery({ className = "" }: Props) {
  const faviconClass = "w-12 md:w-14 h-12 md:h-14";

  return (
    <div
      className={`${paletteStyle.favicons} items-center justify-center ${className}`}
    >
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={["about", "photos", "blog", "projects", "home"]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "gold",
          "crimson",
          "bubbles",
          "vitreous",
          "scintillating",
          "bewitched",
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={["sky", "storm", "pixelland", "underwater", "grass"]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={["marina", "mori", "cherry", "autumnal"]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={["glitter", "midnight", "stars", "penumbra"]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "birthday",
          "christmas",
          "spookfest",
          "halloween",
          "rainbow",
        ]}
      />
      <ThemeMakerFaviconsGallery className={faviconClass} />
    </div>
  );
}
