import ImageViewer from "@/components/widgets/ImageViewer";
import MobileDesktopEntryRenderer from "@/components/widgets/MobileDesktopEntryRenderer";
import ReadingBlur from "@/components/widgets/ReadingBlur";
import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import { ReactNode } from "react";
import ProjectsArticle from "../ProjectsArticle";
import ProjectsWindow from "../ProjectsWindow";
import { Metadata } from "next";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import { generateFilterRobotsMeta } from "@/lib/siteMetadata";

const fetchDir = "projects/entries";

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const entry = (await fetchEntryBySlug(params.slug, fetchDir, "json", [
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
  ])) as ProjectsEntry & { unlisted: boolean };
  return {
    title: `${entry.title} | Projects - Zimo Web`,
    description: restoreDisplayText(entry.description),
    openGraph: {
      type: "article",
      title: entry.title,
      description: restoreDisplayText(entry.description),
      url: `/projects/${entry.slug}`,
      images: [{ url: entry.images.url[0] }],
    },
    twitter: {
      card: "summary",
      title: entry.title,
      description: restoreDisplayText(entry.description),
      images: entry.images.url[0],
    },
    keywords:
      "Zimo Web, Zimo Luo, Project, Coding, Programming, Personal Website",
    robots: generateFilterRobotsMeta(entry.unlisted),
  };
}

interface Props {
  children?: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ProjectsArticleLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

  const { slug } = params;
  const entry = (await fetchEntryBySlug(slug, fetchDir, "json", [
    "title",
    "slug",
    "description",
    "links",
    "date",
    "authors",
    "faviconFormat",
    "content",
    "images",
  ])) as ProjectsEntry;

  const processedEntry = {
    ...entry,
    content: (entry.content as unknown as string[]).join("\n") || "",
  } as ProjectsEntry;

  return (
    <MobileDesktopEntryRenderer
      mobile={
        <>
          <ReadingBlur />
          <div className="pt-[68px] sm:pt-[72px] bg-widget-90 mb-4 rounded-b-[2rem]">
            <div className="mx-6">
              <ImageViewer {...processedEntry.images} />
            </div>
            <div className="mt-1.5">
              <ProjectsArticle {...processedEntry} />
            </div>
          </div>
        </>
      }
      desktop={<ProjectsWindow {...processedEntry} />}
    />
  );
}

export async function generateStaticParams() {
  const entries = await fetchAllEntries(fetchDir, "json", ["slug"]);

  return entries.map((entry) => {
    return {
      slug: entry.slug as string,
    };
  });
}

export const revalidate = 24;
