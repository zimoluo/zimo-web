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
        faviconList={[
          "about",
          "photos",
          "blog",
          "projects",
          "home",
          "perpetuity",
          "unity",
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "gold",
          "crimson",
          "bubbles",
          "vitreous",
          "scintillating",
          "memories",
          "bewitched",
          "underwater",
          "aquarium",
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "sky",
          "storm",
          "dusk",
          "eventide",
          "meadowland",
          "murk",
          "pixelland",
          "energize",
          "grass",
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={["vibrant", "marina", "mori", "cherry", "autumnal"]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "glitter",
          "celebration",
          "midnight",
          "stars",
          "penumbra",
          "spookfest",
          "halloween",
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "birthday",
          "birthday19",
          "christmas",
          "rainbow",
          "gallery",
          "gallery3D",
        ]}
      />
      <ThemeMakerFaviconsGallery className={faviconClass} />
    </div>
  );
}
