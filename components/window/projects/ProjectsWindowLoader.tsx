import WindowDisplay from "@/components/widgets/WindowDisplay";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import { CommentProvider } from "@/components/contexts/CommentContext";
import ShareButtonArray from "@/components/widgets/ShareButtonArray";
import ProjectsHeader from "@/app/projects/ProjectsHeader";
import WindowReadingSettingsApplier from "../WindowReadingSettingsApplier";
import parseCustomMarkdown from "@/lib/markdownParser";
import clientWindowMarkdownComponentsMap from "@/lib/clientWindowMarkdownComponentsMap";
import CommentTypingArea from "@/components/comments/CommentTypingArea";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import EntryLikeButton from "@/components/comments/EntryLikeButton";
import EntryWindowLoader from "../EntryWindowLoader";

interface Props {
  slug: string;
}

export default function ProjectsWindowLoader({ slug }: Props) {
  return (
    <EntryWindowLoader<ProjectsEntry>
      slug={slug}
      entryType="projects/entries"
      entryFormat="json"
      fields={[
        "title",
        "slug",
        "description",
        "links",
        "date",
        "authors",
        "faviconFormat",
        "content",
        "images",
        "unlisted",
      ]}
      modifyEntry={(entry) => ({
        ...entry,
        content: (entry.content as unknown as string[]).join("\n") || "",
      })}
      renderContent={(entry) => (
        <WindowDisplay
          className="bg-widget-90"
          imageData={entry.images}
          display={
            <article className="w-full relative">
              <div className="absolute top-[10px] right-[10px] z-10">
                <ShareButtonArray
                  title={entry.title}
                  description={entry.description}
                  slug={slug}
                  section="projects"
                  requiresPlaceholder={true}
                />
              </div>
              <div className="px-6 md:px-10 pt-4 md:pt-4 pb-6 md:pb-8">
                <ProjectsHeader {...entry}>
                  <EntryLikeButton
                    resourceLocation={`projects/likedBy/${slug}.json`}
                  />
                </ProjectsHeader>
                <WindowReadingSettingsApplier slug={slug}>
                  {parseCustomMarkdown(
                    entry.content,
                    clientWindowMarkdownComponentsMap
                  )}
                </WindowReadingSettingsApplier>
                <CommentAreaWrapper>
                  <hr className="my-8 border-saturated border-t opacity-50" />
                  <CommentProvider
                    location={`projects/comments/${slug}.json`}
                    likeIconType="star"
                  >
                    <CommentTypingArea />
                    <div className="h-10 pointer-events-none select-none" />
                    <CommentCardContainer />
                  </CommentProvider>
                </CommentAreaWrapper>
              </div>
            </article>
          }
        />
      )}
    />
  );
}
