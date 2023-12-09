import ShareButtonArray from "@/components/widgets/ShareButtonArray";
import ProjectsHeader from "./ProjectsHeader";
import ReadingContentProcessor from "@/components/widgets/ReadingContentProcessor";
import parseCustomMarkdown from "@/lib/markdownParser";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import CommentAreaBundle from "@/components/comments/CommentAreaBundle";

export default async function ProjectsArticle({
  title,
  description,
  links,
  date,
  authors,
  slug,
  faviconFormat,
  content,
}: Omit<ProjectsEntry, "images">) {
  return (
    <article className="w-full relative">
      <div className="absolute top-4 right-4 z-10">
        <ShareButtonArray
          title={title}
          description={description}
          slug={slug}
          section="projects"
        />
      </div>
      <div className="px-6 md:px-10 pt-4 md:pt-4 pb-6 md:pb-8">
        <ProjectsHeader
          title={title}
          description={description}
          links={links}
          date={date}
          authors={authors}
          slug={slug}
          faviconFormat={faviconFormat}
        />
        <ReadingContentProcessor>
          {parseCustomMarkdown(content)}
        </ReadingContentProcessor>
        <CommentAreaWrapper>
          <hr className="my-8 border-saturated border-t opacity-50" />
          <CommentAreaBundle location={`projects/comments/${slug}.json`} />
        </CommentAreaWrapper>
      </div>
    </article>
  );
}
