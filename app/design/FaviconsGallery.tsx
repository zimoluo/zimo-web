import paletteStyle from "./palette.module.css";
import { displayFaviconMap } from "@/components/themeUtil/faviconMap";
import { themeKeyMap } from "@/components/themeUtil/themeKeyMap";
import { colorMap } from "@/components/themeUtil/colorMap";
import DisplayFavicon from "@/components/assets/DisplayFavicon";

interface Props {
  className?: string;
}

export default function FaviconsGallery({ className = "" }: Props) {
  return (
    <div
      className={`${paletteStyle.favicons} items-center justify-center ${className}`}
    >
      {(
        [
          "about",
          "gold",
          "sky",
          "marina",
          "glitter",
          "birthday",
        ] as ThemeAvailable[]
      ).map((themeKey) => {
        const themeObject = themeKeyMap[themeKey];
        const FaviconComponent =
          displayFaviconMap[themeObject.displayFavicon || "generic"];
        return (
          <div
            key={themeKey}
            className={`${colorMap[themeObject.palette].colorPalette}`}
          >
            <FaviconComponent className="w-12 md:w-14" />
          </div>
        );
      })}
    </div>
  );
}
