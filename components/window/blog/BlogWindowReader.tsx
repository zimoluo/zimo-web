import ReadingContentProcessor from "@/components/widgets/ReadingContentProcessor";
import parseCustomMarkdown from "@/lib/markdownParser";
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

export default function BlogReader(post: PostEntry) {
  const tags = post.tags ?? [];

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
      <ReadingContentProcessor isBlog={true}>
        {parseCustomMarkdown(post.content, clientWindowMarkdownComponentsMap)}
      </ReadingContentProcessor>
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
