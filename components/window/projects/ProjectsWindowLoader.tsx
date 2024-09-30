"use client";

import { readEntryOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/widgets/LoadingScreen";
import { useEntryWindow } from "@/components/contexts/EntryWindowContext";
import _ from "lodash";
import ErrorScreen from "@/components/widgets/ErrorScreen";
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

interface Props {
  slug: string;
}

export default function ProjectsWindowLoader({ slug }: Props) {
  const [entry, setEntry] = useState<ProjectsEntry | null>(null);
  const [isError, setIsError] = useState(false);
  const { contentRef } = useEntryWindow();

  const readEntry = async () => {
    const entry = (await readEntryOnClient(slug, "projects/entries", "json", [
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
    ])) as ProjectsEntry;

    if (_.isEmpty(entry)) {
      setIsError(true);
      return;
    }

    setIsError(false);

    setEntry({
      ...entry,
      content: (entry.content as unknown as string[]).join("\n") || "",
      slug,
    });
  };

  useEffect(() => {
    readEntry();
  }, [slug]);

  if (isError) {
    return <ErrorScreen className="bg-widget-90" />;
  }

  if (!entry) {
    return <LoadingScreen className="bg-widget-90" />;
  }

  return (
    <div
      className={`w-full h-full overflow-y-auto bg-widget-90 relative`}
      ref={contentRef}
    >
      <WindowDisplay
        className="bg-widget-90"
        imageData={entry.images}
        display={
          <article className="w-full relative">
            <div className="absolute top-4 right-12 z-10">
              <ShareButtonArray
                title={entry.title}
                description={entry.description}
                slug={slug}
                section="projects"
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
    </div>
  );
}
