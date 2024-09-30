import Image from "next/image";
import { useEntryWindow } from "@/components/contexts/EntryWindowContext";
import { trimTitleText } from "@/lib/photos/helper";
import { formatDate } from "@/lib/dateUtil";

export default function PhotosWindowCard(entry: PhotosEntry) {
  const { setSlug, setIsMenuOpen, slug: currentSlug } = useEntryWindow();

  const [widthRatio, heightRatio] = entry.images.aspectRatio
    .split(":")
    .map(Number);

  const titleText = trimTitleText(entry.title, 50);
  const date = formatDate(entry.date);

  return (
    <button className="w-full group text-start">
      <div className="w-full h-28 px-4 py-4 rounded-xl backdrop-blur-lg shadow-lg bg-widget-70 relative">
        <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
          <Image
            src={entry.images.url[0]}
            alt="First photo of the post"
            width={400}
            height={(400 / widthRatio) * heightRatio}
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="w-full h-full absolute top-0 left-0 bg-black opacity-45 group-hover:opacity-75 transition-opacity duration-300 ease-out" />
        <p className="font-bold relative text-white text-opacity-90 text-lg">
          {titleText}
        </p>
        <div className="absolute bottom-1 right-1">
          <p className="text-white text-opacity-90">{date}</p>
        </div>
      </div>
    </button>
  );
}
