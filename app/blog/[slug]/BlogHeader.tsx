import BlogTitle from "./BlogTitle";
import BlogDescription from "./BlogDescription";
import Link from "next/link";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import BlogAuthor from "./BlogAuthor";
import TableOfContents from "@/components/widgets/TableOfContents";
import { generateTOCSectionData } from "@/lib/markdownParser";
import tocStyle from "@/components/widgets/toc.module.css";
import TOCSettingApplier from "@/components/widgets/TOCSettingApplier";
import TOCExistChecker from "@/components/widgets/TOCExistChecker";

interface Props {
  title: string;
  description: string;
  authorId: string;
  author: string;
  content: string;
  date: string;
  slug: string;
  tags?: string[];
}

export default function BlogHeader({
  title,
  description,
  authorId,
  author,
  content,
  date,
  slug,
  tags = [],
}: Props) {
  return (
    <>
      <BlogTitle>{title}</BlogTitle>
      <BlogDescription>{enrichTextContent(description)}</BlogDescription>
      <BlogAuthor
        authorId={authorId}
        author={author}
        content={content}
        date={date}
        slug={slug}
      />
      {tags.length > 0 && (
        <>
          <p className="sr-only">Tags of this article: </p>
          <div className="-mt-4 -mb-2">
            {tags.map((tag, index) => (
              <Link className="mr-1.5" href={`/blog/tags/${tag}`} key={index}>
                <span
                  key={index}
                  className="inline-block bg-saturated opacity-70 rounded-full px-2 my-0.5 py-0.5 text-sm font-bold text-light transition-transform duration-300 ease-in-out hover:scale-105 text-center"
                >
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
      <TOCSettingApplier>
        <TOCExistChecker markdown={content}>
          <div className={`mt-6 -mb-2 ${tocStyle.inAreaPlacement}`}>
            <TableOfContents
              sections={generateTOCSectionData(content)}
              className={`${tocStyle.intext}`}
            />
          </div>
        </TOCExistChecker>
      </TOCSettingApplier>
    </>
  );
}
