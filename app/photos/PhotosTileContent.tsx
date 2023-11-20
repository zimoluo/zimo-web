import HeartIcon from "@/components/images/comment/likeButtons/HeartIcon";
import PhotosStackIcon from "@/components/images/entries/PhotosStackIcon";
import { getEntryLike } from "@/lib/dataLayer/server/commentManager";
import { computeRandomMultiplier } from "@/lib/photos/aspectRatioCalculator";
import Image from "next/image";

export default async function PhotosTileContent(entry: PhotosEntry) {
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
      <div className="sr-only opacity-0 pointer-events-none select-none flex-none">
        {entry.title}
      </div>
      <div className="flex flex-col justify-center items-start space-y-1 md:space-y-2.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-90">
        <div className="flex justify-center items-center">
          <PhotosStackIcon
            className="aspect-square w-5 md:w-7 h-auto mr-1.5 md:mr-2.5"
            color="#f5f5f5"
          />
          <div className="text-base md:text-xl text-neutral-100">
            {entry.images.url.length}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <HeartIcon
            className="aspect-square w-5 md:w-7 h-auto mr-1.5 md:mr-2.5"
            color="#f5f5f5"
          />
          <div className="text-base md:text-xl text-neutral-100">
            {(await getEntryLike(`photos/likedBy/${entry.slug}.json`)).length}
          </div>
        </div>
      </div>
    </>
  );
}
