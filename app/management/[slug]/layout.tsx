import ReadingBlur from "@/components/widgets/ReadingBlur";
import { ReactNode } from "react";
import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import ShareButtonArray from "@/components/widgets/ShareButtonArray";
import ReadingLayout from "@/components/widgets/ReadingLayout";
import parseCustomMarkdown, {
  generateTOCSectionData,
} from "@/lib/markdownParser";
import ManagementHeader from "./ManagementHeader";
import ReadingContentProcessor from "@/components/widgets/ReadingContentProcessor";
import { getFullMarkdown } from "@/lib/downloadEntry";
import { Metadata } from "next";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import TOCSettingApplier from "@/components/widgets/TOCSettingApplier";
import TableOfContents from "@/components/widgets/TableOfContents";
import tocStyle from "@/components/widgets/toc.module.css";
import TOCExistChecker from "@/components/widgets/TOCExistChecker";
import { generateFilterRobotsMeta } from "@/lib/siteMetadata";
import serverOnlyMarkdownComponentsMap from "@/lib/serverOnlyMarkdownComponentsMap";

interface Props {
  children?: ReactNode;
  params: Promise<{ slug: string }>;
}

const fetchDir = "about/text";

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = (await fetchEntryBySlug(params.slug, fetchDir, "markdown", [
    "title",
    "date",
    "slug",
    "content",
    "description",
    "unlisted",
  ])) as ManagementArticle;

  return {
    title: `${post.title} | Management - Zimo Web`,
    description: restoreDisplayText(post.description || "") || undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: restoreDisplayText(post.description || "") || undefined,
      url: `/management/${post.slug}`,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: restoreDisplayText(post.description || "") || undefined,
    },
    keywords: "Zimo Web, Zimo Luo, Management, Personal Website",
    robots: generateFilterRobotsMeta(post.unlisted),
  };
}

export const revalidate = 25;

export default async function ManagementLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

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
      <TOCSettingApplier>
        <TOCExistChecker markdown={post.content}>
          <div
            className={`fixed -translate-x-full ${tocStyle.floatingPlacement}`}
          >
            <TableOfContents
              sections={generateTOCSectionData(post.content)}
              className={`${tocStyle.outside}`}
              mode="shadow"
            />
          </div>
        </TOCExistChecker>
      </TOCSettingApplier>
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
        <hr className="my-10 border-saturated border-t opacity-50" />
        <ReadingContentProcessor>
          {parseCustomMarkdown(post.content, serverOnlyMarkdownComponentsMap)}
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
