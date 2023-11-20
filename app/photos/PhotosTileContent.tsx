import { computeRandomMultiplier } from "@/lib/photos/aspectRatioCalculator";
import Image from "next/image";

export default function PhotosTileContent(entry: PhotosEntry) {
  const randomMultiplier = computeRandomMultiplier(entry.images.url[0]);
  const [widthRatio, heightRatio] = entry.images.aspectRatio
    .split(":")
    .map(Number);
  const computedAspectRatio =
    widthRatio / heightRatio === 1
      ? 1
      : parseFloat(((widthRatio / heightRatio) * randomMultiplier).toFixed(3));

  return (
    <>
      <Image
        className="object-center w-full h-full object-cover"
        src={entry.images.url[0]}
        alt={`Cover of ${entry.title}`}
        width={288}
        height={288 / computedAspectRatio}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 select-none transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-90" />
      <div className="flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-90">
        <div className="sr-only opacity-0 pointer-events-none select-none">
          {entry.title}
        </div>
      </div>
    </>
  );
}
