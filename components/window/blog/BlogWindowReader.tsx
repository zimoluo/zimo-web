"use client";

import parseCustomMarkdown, {
  generateTOCSectionData,
} from "@/lib/markdownParser";
import Image from "next/image";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import { CommentProvider } from "@/components/contexts/CommentContext";
import CommentTypingArea from "@/components/comments/CommentTypingArea";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import BlogTitle from "@/app/blog/[slug]/BlogTitle";
import {
  enrichTextContent,
  restoreDisplayText,
} from "@/lib/lightMarkUpProcessor";
import BlogDescription from "@/app/blog/[slug]/BlogDescription";
import ShareButtonArray from "@/components/widgets/ShareButtonArray";
import BlogAuthor from "@/app/blog/[slug]/BlogAuthor";
import EntryLikeButton from "@/components/comments/EntryLikeButton";
import clientWindowMarkdownComponentsMap from "@/lib/clientWindowMarkdownComponentsMap";
import BlogWindowTagButton from "./BlogWindowTagButton";
import WindowReadingSettingsApplier from "../WindowReadingSettingsApplier";
import TOCSettingApplier from "@/components/widgets/TOCSettingApplier";
import TOCExistChecker from "@/components/widgets/TOCExistChecker";
import TableOfContents from "@/components/widgets/TableOfContents";
import tocStyle from "@/components/widgets/toc.module.css";
import { useWindowAction } from "@/components/contexts/WindowActionContext";

export default function BlogWindowReader(post: PostEntry) {
  const tags = post.tags ?? [];
  const { uniqueId } = useWindowAction();

  return (
    <>
      <div className="absolute top-4 right-4">
        <ShareButtonArray
          title={post.title}
          description={restoreDisplayText(post.description)}
          slug={post.slug}
          section="blog"
        />
      </div>
      <BlogTitle>{post.title}</BlogTitle>
      <BlogDescription>
        {enrichTextContent(post.description || "")}
      </BlogDescription>
      <BlogAuthor {...post} mayIncludePublishDate={false}>
        <EntryLikeButton resourceLocation={`blog/likedBy/${post.slug}.json`} />
      </BlogAuthor>
      {tags.length > 0 && (
        <>
          <p className="sr-only">Tags of this article: </p>
          <div className="-mt-4 -mb-2">
            {tags.map((tag, index) => (
              <BlogWindowTagButton key={index} tag={tag} />
            ))}
          </div>
        </>
      )}
      <TOCSettingApplier>
        <TOCExistChecker markdown={post.content}>
          <div className="mt-6 -mb-2">
            <TableOfContents
              sections={generateTOCSectionData(post.content, uniqueId)}
              className={`${tocStyle.intext}`}
            />
          </div>
        </TOCExistChecker>
      </TOCSettingApplier>
      <hr className="my-10 border-saturated border-t opacity-50" />
      {post.coverImage && post.displayCover ? (
        <div className="flex justify-center items-center mb-12">
          <Image
            src={post.coverImage}
            alt={`Cover of ${post.title}`}
            width={384}
            height={384}
            className="h-auto w-full object-cover max-h-96 rounded-xl"
          />
        </div>
      ) : null}
      <WindowReadingSettingsApplier isBlog={true} slug={post.slug}>
        {parseCustomMarkdown(
          post.content,
          clientWindowMarkdownComponentsMap,
          uniqueId
        )}
      </WindowReadingSettingsApplier>
      <CommentAreaWrapper>
        <hr className="my-10 border-saturated border-t opacity-50" />
        <CommentProvider location={`blog/comments/${post.slug}.json`}>
          <CommentTypingArea />
          <div className="h-10 pointer-events-none select-none" />
          <CommentCardContainer />
        </CommentProvider>
      </CommentAreaWrapper>
    </>
  );
}
