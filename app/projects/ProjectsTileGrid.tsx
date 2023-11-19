import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import ProjectsTileWrapper from "./ProjectsTileWrapper";
import ProjectsTileDisplay from "./ProjectsTileDisplay";

export default async function ProjectsTileGrid() {
  const entries = await fetchAllEntries("projects/entries", "json", [
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
  ]);

  const processedEntries = await Promise.all(
    entries.map(async (entry) => {
      const content = entry.content.join("\n") || "";
      return {
        ...entry,
        content,
      };
    })
  );

  const filteredEntries = processedEntries.filter(
    (entry) => !(entry as ProjectsEntry & { unlisted: boolean }).unlisted
  ) as ProjectsEntry[];

  return (
    <div className="flex justify-center items-center px-6 md:px-18 mb-24 md:mb-28">
      <section className="project-tile-grid w-full">
        {filteredEntries.map((entry, index) => (
          <ProjectsTileWrapper key={index} popUpWindow={null} slug={entry.slug}>
            <ProjectsTileDisplay {...entry} />
          </ProjectsTileWrapper>
        ))}
      </section>
    </div>
  );
}
