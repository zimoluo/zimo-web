import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { computeRandomMultiplier } from "@/lib/photos/aspectRatioCalculator";
import Image from "next/image";
import galleryStyle from "./gallery.module.css";

interface Props {
  url: string;
  title: string;
  aspectRatio: string;
  text?: string;
}

export default function PhotosGalleryDisplay({
  url,
  aspectRatio,
  title,
  text = "",
}: Props) {
  const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
  const computedAspectRatio =
    (computeRandomMultiplier(url) * widthRatio) / heightRatio;

  const displayText = text.trim();

  return (
    <div
      className="w-42 md:w-72 h-auto rounded-xl overflow-hidden relative group"
      style={{ aspectRatio: `${computedAspectRatio}` }}
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
    </div>
  );
}
