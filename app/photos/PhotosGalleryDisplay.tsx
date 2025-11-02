import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { computeRandomMultiplier } from "@/lib/photos/aspectRatioCalculator";
import Image from "next/image";
import galleryStyle from "./gallery.module.css";
import PhotosGalleryWrapper from "./PhotosGalleryWrapper";

interface Props {
  url: string;
  title: string;
  aspectRatio: string;
  text?: string;
  flattenedAllImageUrls?: string[];
  imageAlts?: string[];
  totalIndex?: number;
}

export default function PhotosGalleryDisplay({
  url,
  aspectRatio,
  title,
  text = "",
  flattenedAllImageUrls = [],
  imageAlts = [],
  totalIndex = 0,
}: Props) {
  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
  const computedAspectRatio =
    (computeRandomMultiplier(url) * widthRatio) / heightRatio;

  const displayText = text.trim();

  return (
    <div
      className="w-[10.5rem] md:w-72 h-auto rounded-xl overflow-hidden group"
      style={{ aspectRatio: `${computedAspectRatio}` }}
    >
      <PhotosGalleryWrapper
        url={flattenedAllImageUrls}
        alt={imageAlts}
        index={totalIndex}
      >
        <Image
          className="object-center w-full h-full object-cover"
          src={url}
          alt={`Gallery of ${title}`}
          width={288}
          height={288 / computedAspectRatio}
        />
        {displayText && (
          <div className="absolute bottom-4 flex items-end justify-center w-full">
            <p
              className={`bottom-4 tracking-wide text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-50 text-xs md:text-sm px-3 py-1 rounded-3xl overflow-hidden transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${galleryStyle.text}`}
            >
              {enrichTextContent(displayText)}
            </p>
          </div>
        )}
      </PhotosGalleryWrapper>
    </div>
  );
}
