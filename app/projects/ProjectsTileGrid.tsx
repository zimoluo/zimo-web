import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import ProjectsTileWrapper from "./ProjectsTileWrapper";
import ProjectsWindow from "./ProjectsWindow";
import tileGridStyle from "./projects-tile.module.css";
import ProjectsTileContent from "./ProjectsTileContent";

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
    </div>
  );
}
