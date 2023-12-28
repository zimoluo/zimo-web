import ReadingBlur from "@/components/widgets/ReadingBlur";
import { ReactNode } from "react";
import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import ShareButtonArray from "@/components/widgets/ShareButtonArray";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import BlogHeader from "./BlogHeader";
import Image from "next/image";
import { getCoverSrc } from "@/lib/blog/helper";
import ReadingLayout from "@/components/widgets/ReadingLayout";
import parseCustomMarkdown, {
  generateTOCSectionData,
} from "@/lib/markdownParser";
import ReadingContentProcessor from "../../../components/widgets/ReadingContentProcessor";
import CommentAreaWrapper from "../../../components/comments/CommentAreaWrapper";
import CommentAreaBundle from "@/components/comments/CommentAreaBundle";
import { Metadata } from "next";
import tocStyle from "@/components/widgets/toc.module.css";
import TableOfContents from "@/components/widgets/TableOfContents";
import TOCSettingApplier from "@/components/widgets/TOCSettingApplier";

interface Props {
  children?: ReactNode;
  params: { slug: string };
}

const fetchDir = "blog/text";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = (await fetchEntryBySlug(params.slug, fetchDir, "markdown", [
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

  return {
    title: `${post.title} | Blog - Zimo Web`,
    description: restoreDisplayText(post.description),
    openGraph: {
      type: "article",
      title: post.title,
      description: restoreDisplayText(post.description),
      url: `/blog/${post.slug}`,
      images: [
        {
          url: post.compatibleCover || getCoverSrc(post.coverImage, post.slug),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: restoreDisplayText(post.description),
      images: post.compatibleCover || getCoverSrc(post.coverImage, post.slug),
    },
    keywords: "Zimo Web, Zimo Luo, Blog, Personal Website",
  };
}

export const revalidate = 24;

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
      <TOCSettingApplier>
        <div
          className={`fixed -translate-x-full ${tocStyle["floating-placement"]} overflow-y-auto`}
        >
          <TableOfContents
            sections={generateTOCSectionData(post.content)}
            className={`${tocStyle.outside}`}
          />
        </div>
      </TOCSettingApplier>
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
        <hr className="my-10 border-saturated border-t opacity-50" />
        {coverSrc && post.displayCover ? (
          <div className="flex justify-center items-center mb-12">
            <Image
              src={coverSrc}
              alt={`Cover of ${post.title}`}
              width={384}
              height={384}
              className="h-auto w-full object-cover max-h-96 rounded-xl"
            />
          </div>
        ) : null}
        <ReadingContentProcessor isBlog={true}>
          {parseCustomMarkdown(post.content)}
        </ReadingContentProcessor>
        {children}
        <CommentAreaWrapper>
          <hr className="my-10 border-saturated border-t opacity-50" />
          <CommentAreaBundle location={`blog/comments/${slug}.json`} />
        </CommentAreaWrapper>
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
