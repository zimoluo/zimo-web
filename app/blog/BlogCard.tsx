import Image from "next/image";
import Link from "next/link";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import cardStyle from "./blog-card.module.css";
import { formatDate } from "@/lib/dateUtil";
import { getAuthorImageSrc, readingTime } from "@/lib/blog/helper";
import BlogCardTagButton from "./BlogCardTagButton";

export default function BlogCard({
  title,
  date,
  coverImage,
  author,
  authorId,
  description,
  content,
  slug,
  tags = [],
}: PostData) {
  const readTime = readingTime(content);
  const postDate = formatDate(date);

  return (
    <Link href={`/blog/${slug}`}>
      <div className="px-4 py-4 rounded-xl backdrop-blur-md shadow-lg bg-widget-70">
        <div className="flex flex-row">
          <div className="flex flex-col flex-grow">
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

            <h2 className="mt-3 text-lg md:text-2xl font-bold">{title}</h2>

            <h3 className="hidden md:block text-lg text-saturated opacity-80 mb-2">
              {enrichTextContent(description)}
            </h3>

            <div className="flex-grow"></div>

            <p className="text-sm text-saturated opacity-80">
              {`${postDate}  ·  ${readTime}`}
            </p>
          </div>

          <div className="flex items-center">
            <div
              className={`w-auto h-28 md:h-36 ml-1.5 md:ml-2 rounded-xl overflow-hidden ${cardStyle["cover-width"]} flex items-center justify-end`}
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
        </div>
        {tags.length > 0 && (
          <div className="opacity-70 mt-1.5 md:mt-2.5">
            {tags.map((tag, index) => (
              <BlogCardTagButton key={index} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
