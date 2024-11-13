import Image from "next/image";
import cardStyle from "@/app/blog/blog-card.module.css";
import { formatDate } from "@/lib/dateUtil";
import { getAuthorImageSrc, readingTime } from "@/lib/blog/helper";
import BlogWindowTagButton from "./BlogWindowTagButton";
import { useEntryWindow } from "@/components/contexts/EntryWindowContext";

export default function BlogWindowCard({
  title,
  date,
  coverImage,
  author,
  authorId,
  content,
  lastEditedDate,
  slug,
  tags = [],
  showTags = false,
}: PostData & { showTags?: boolean }) {
  const readTime = readingTime(content);
  const postDate = lastEditedDate
    ? `Edited ${formatDate(lastEditedDate, false, true)}`
    : formatDate(date);

  const { setSlug, setIsMenuOpen, slug: currentSlug } = useEntryWindow();

  return (
    <div className="w-full">
      <div className="px-4 py-4 rounded-xl backdrop-blur-2xl shadow-lg bg-widget-70">
        <button
          className="flex flex-row w-full text-start"
          onClick={() => {
            if (slug !== currentSlug) {
              setSlug(slug);
            }
            setIsMenuOpen(false);
          }}
        >
          <div className="flex flex-col flex-grow min-h-28">
            <div className="flex flex-row items-center">
              <div className="rounded-full overflow-hidden h-6 w-fit flex justify-center items-center">
                <Image
                  src={`${getAuthorImageSrc(authorId)}`}
                  alt={`${author}'s Profile. What follows next is the name of the author. The h2 element after the author's name is the title.`}
                  className="h-full w-fit"
                  width={25}
                  height={25}
                />
              </div>
              <div className="ml-2 text-sm font-bold">{author}</div>
            </div>

            <h2 className="mt-3 text-lg font-bold">{title}</h2>

            <div className="flex-grow"></div>

            <p className="text-sm text-saturated opacity-80">
              {`${postDate}  ·  ${readTime}`}
            </p>
          </div>

          <div className="flex items-center">
            <div
              className={`max-w-28 h-28 ml-1.5 rounded-xl overflow-hidden ${cardStyle.coverWidth} flex items-center justify-end`}
            >
              <Image
                className="h-full w-auto object-cover object-center rounded-xl"
                src={coverImage}
                alt={`Cover of ${title}`}
                width={320}
                height={320}
              />
            </div>
          </div>
        </button>
        {showTags && tags.length > 0 && (
          <div className="mt-1.5 md:mt-2.5">
            {tags.map((tag, index) => (
              <BlogWindowTagButton key={index} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
