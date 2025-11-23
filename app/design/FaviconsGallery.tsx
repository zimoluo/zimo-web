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
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "sky",
          "storm",
          "penumbra",
          "underwater",
          "aquarium",
          "energize",
          "grass",
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={["dusk", "eventide", "meadowland", "murk", "pixelland"]}
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
          "spookfest",
          "halloween",
        ]}
      />
      <GalleryClickableFavicon
        className={faviconClass}
        faviconList={[
          "birthday",
          "birthday19",
          "birthday20",
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
