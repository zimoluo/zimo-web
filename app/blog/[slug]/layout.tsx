import ReadingBlur from "@/components/entries/ReadingBlur";
import { ReactNode } from "react";
import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import ShareButtonArray from "@/components/entries/ShareButtonArray";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import BlogHeader from "./BlogHeader";
import Image from "next/image";
import { getCoverSrc } from "@/lib/blog/helper";
import { imageFallback } from "@/lib/imageFallback";
import ReadingLayout from "@/components/entries/ReadingLayout";

interface Props {
  children?: ReactNode;
  params: { slug: string };
}

const fetchDir = "blog/text";

export default async function BlogLayout({ params, children }: Props) {
  const { slug } = params;
  const post = (await fetchEntryBySlug(slug, fetchDir, "markdown", [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "coverImage",
    "description",
    "authorId",
    "displayCover",
    "tags",
    "compatibleCover",
  ])) as PostEntry;

  const coverSrc = getCoverSrc(post.coverImage, post.slug) || "data:null;,";

  return (
    <>
      <ReadingBlur />
      <ReadingLayout>
        <div className="absolute top-4 right-4 z-10">
          <ShareButtonArray
            title={post.title}
            description={restoreDisplayText(post.description)}
            slug={post.slug}
            section="blog"
          />
        </div>
        <BlogHeader
          title={post.title}
          description={post.description}
          authorId={post.authorId}
          author={post.author}
          content={post.content}
          date={post.date}
          slug={slug}
          tags={post.tags}
        />
        <div className={`my-10 border-saturated border-t opacity-50`} />
        {coverSrc && post.displayCover ? (
          <div className="flex justify-center items-center mb-12">
            <Image
              src={coverSrc}
              alt={`Cover of ${post.title}`}
              width={384}
              height={384}
              className="h-auto w-full object-cover max-h-96 rounded-xl"
              onError={imageFallback("/blog-fallback.svg")}
            />
          </div>
        ) : null}
        {children}
      </ReadingLayout>
    </>
  );
}

export async function generateStaticParams() {
  const posts = await fetchAllEntries(fetchDir, "markdown", ["slug"]);

  return posts.map((post) => {
    return {
      slug: post.slug as string,
    };
  });
}
