import ImageViewer from "@/components/widgets/ImageViewer";
import MobileDesktopEntryRenderer from "@/components/widgets/MobileDesktopEntryRenderer";
import ReadingBlur from "@/components/widgets/ReadingBlur";
import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import { imageViewerTextParser } from "@/lib/imageUtil";
import { ReactNode } from "react";
import ProjectsArticle from "../ProjectsArticle";
import ProjectsWindow from "../ProjectsWindow";

interface Props {
  children?: ReactNode;
  params: { slug: string };
}

export default async function ProjectsArticleLayout({
  children,
  params,
}: Props) {
  const { slug } = params;
  const entry = (await fetchEntryBySlug(slug, "projects/entries", "json", [
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

  const parsedImage = imageViewerTextParser(processedEntry.images);

  return (
    <MobileDesktopEntryRenderer
      mobile={
        <>
          <ReadingBlur />
          <div className="pt-16 bg-widget-90">
            <div className="mb-0 mx-6">
              <ImageViewer
                url={parsedImage.url}
                text={parsedImage.text}
                aspectRatio={parsedImage.aspectRatio}
                original={parsedImage.original}
                respectDefaultGridViewSettings={true}
              />
            </div>
            <div className="mt-4">
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
  const entries = await fetchAllEntries("projects/entries", "json", ["slug"]);

  return entries.map((entry) => {
    return {
      slug: entry.slug as string,
    };
  });
}

export const revalidate = 24;
