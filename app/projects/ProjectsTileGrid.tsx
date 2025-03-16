import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import ProjectsTileWrapper from "./ProjectsTileWrapper";
import ProjectsWindow from "./ProjectsWindow";
import tileGridStyle from "./projects-tile.module.css";
import ProjectsTileContent from "./ProjectsTileContent";
import ProjectsTileGridWrapper from "./ProjectsTileGridWrapper";

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
    <ProjectsTileGridWrapper>
      <section className={`${tileGridStyle.grid} w-full`}>
        {filteredEntries.map((entry, index) => (
          <ProjectsTileWrapper
            key={index}
            popUpWindow={<ProjectsWindow {...entry} />}
            slug={entry.slug}
          >
            <ProjectsTileContent {...entry} />
          </ProjectsTileWrapper>
        ))}
      </section>
    </ProjectsTileGridWrapper>
  );
}
