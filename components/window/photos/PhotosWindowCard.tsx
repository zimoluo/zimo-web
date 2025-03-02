import Image from "next/image";
import { useEntryWindow } from "@/components/contexts/EntryWindowContext";
import { trimTitleText } from "@/lib/photos/helper";
import { formatDate } from "@/lib/dateUtil";
import { useTheme } from "@/components/contexts/ThemeContext";
import { generateShadeMap } from "@/lib/themeMaker/colorHelper";
import colorConvert from "color-convert";
import { useMemo } from "react";
import PhotosStackIcon from "@/components/assets/entries/PhotosStackIcon";

const { rgb } = colorConvert;

export default function PhotosWindowCard(entry: PhotosEntry) {
  const { setSlug, setIsMenuOpen, slug: currentSlug } = useEntryWindow();
  const { themeConfig } = useTheme();
  const cardTextColor = useMemo(
    () =>
      generateShadeMap(
        `#${rgb.hex(themeConfig.palette.primary).toLowerCase()}`,
        24
      ).shadeMap[0],
    [themeConfig.palette.primary]
  );

  const [widthRatio, heightRatio] = entry.images.aspectRatio
    .split(":")
    .map(Number);

  const titleText = trimTitleText(entry.title, 50);
  const date = formatDate(entry.date);

  return (
    <button
      className="w-full group text-start shadow-lg rounded-xl overflow-hidden"
      onClick={() => {
        if (entry.slug !== currentSlug) {
          setSlug(entry.slug);
        }
        setIsMenuOpen(false);
      }}
    >
      <div
        className="w-full h-28 px-4 py-4 backdrop-blur-2xl bg-widget-70 relative font-bold"
        style={{ color: cardTextColor }}
      >
        <div className="w-full h-full absolute top-0 left-0">
          <Image
            src={entry.images.url[0]}
            alt="First photo of the post"
            width={860}
            height={(860 / widthRatio) * heightRatio}
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="w-full h-full absolute top-0 left-0 bg-black opacity-45 group-hover:opacity-80 transition-opacity duration-300 ease-out" />
        <p className="relative opacity-90 text-lg">{titleText}</p>
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 w-full">
          <Image
            src={entry.authorProfile}
            alt="The profile picture of "
            width={80}
            height={80}
            className="w-auto h-6 aspect-square rounded-full shrink-0"
          />
          <p>{entry.author}</p>
          <div
            className="h-0 pointer-events-none select-none flex-grow touch-none"
            aria-hidden="true"
          />
          <PhotosStackIcon
            className="h-5 w-auto aspect-square -mr-0.5 visible"
            strokeWidth={2}
            color={cardTextColor}
          />
          <p>{entry.images.url.length}</p>
          <p>·</p>
          <p className="opacity-90">{date}</p>
          <div
            className="h-0 w-5 pointer-events-none select-none touch-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </button>
  );
}
