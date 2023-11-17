import Image from "next/image";
import EntryLikeButtonInitializer from "@/components/comments/EntryLikeButtonInitializer";
import { getAuthorImageSrc, readingTime } from "@/lib/blog/helper";
import { formatDate } from "@/lib/dateUtil";

interface Props {
  authorId: string;
  author: string;
  content: string;
  date: string;
  slug: string;
}

export default function BlogGrid({
  authorId,
  author,
  content,
  date,
  slug,
}: Props) {
  const readTime = readingTime(content);

  return (
    <div className="flex mt-10 mb-7">
      <div className="row-span-2 flex justify-center items-center w-10 h-auto mr-4">
        <div className="w-full h-auto rounded-full overflow-hidden flex justify-center items-center">
          <Image
            src={`${getAuthorImageSrc(authorId)}`}
            alt={`${author}'s Profile`}
            className="h-full w-fit"
            width={40}
            height={40}
          />
        </div>
      </div>

      <div className="grid grid-rows-2">
        <div className="flex justify-start items-center">
          <p className="text-md">{author}</p>
        </div>

        <div className="flex justify-start items-center">
          <p className="text-saturated text-sm opacity-80">{`${readTime}  ·  ${formatDate(
            date
          )}`}</p>
        </div>
      </div>
      <div className="flex-grow" />
      <EntryLikeButtonInitializer
        resourceLocation={`blog/likedBy/${slug}.json`}
      />
    </div>
  );
}
