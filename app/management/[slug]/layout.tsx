import ReadingBlur from "@/components/widgets/ReadingBlur";
import { ReactNode } from "react";
import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import ShareButtonArray from "@/components/widgets/ShareButtonArray";
import ReadingLayout from "@/components/widgets/ReadingLayout";
import parseCustomMarkdown from "@/lib/markdownParser";
import ManagementHeader from "./ManagementHeader";
import ReadingContentProcessor from "@/components/widgets/ReadingContentProcessor";
import { getFullMarkdown } from "@/lib/downloadEntry";
import { Metadata } from "next";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";

interface Props {
  children?: ReactNode;
  params: { slug: string };
}

type ManagementArticle = ArticleCardDisplay & { content: string; slug: string };

const fetchDir = "about/text";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = (await fetchEntryBySlug(
    params.slug,
    fetchDir,
    "markdown"
  )) as ManagementArticle;

  return {
    title: `${post.title} | Management - Zimo Web`,
    description: restoreDisplayText(post.description || post.title),
    openGraph: {
      type: "article",
      title: post.title,
      description: restoreDisplayText(post.description || post.title),
      url: `/management/${post.slug}`,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: restoreDisplayText(post.description || post.title),
    },
    keywords: "Zimo Web, Management, Personal Website",
  };
}

export const revalidate = 25;

export default async function ManagementLayout({ params, children }: Props) {
  const { slug } = params;
  const post = (await fetchEntryBySlug(slug, fetchDir, "markdown", [
    "title",
    "date",
    "slug",
    "content",
    "description",
  ])) as ManagementArticle;

  return (
    <>
      <ReadingBlur />
      <ReadingLayout>
        <div className="absolute top-4 right-4 z-10">
          <ShareButtonArray
            title={post.title}
            description={getFullMarkdown(
              post.content,
              post.title,
              post.date,
              post.description
            )}
            slug={post.slug}
            section="management"
            platforms={["download"]}
            useMobileShare={false}
          />
        </div>
        <ManagementHeader {...post} />
        <div className="my-10 border-saturated border-t opacity-50" />
        <ReadingContentProcessor>
          {parseCustomMarkdown(post.content)}
        </ReadingContentProcessor>
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
