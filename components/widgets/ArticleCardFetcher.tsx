import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import ArticleCard from "./ArticleCard";

export const sectionMethodMap: Record<EntrySection, "markdown" | "json"> = {
  blog: "markdown",
  management: "markdown",
  photos: "json",
  projects: "json",
};

export const sectionDirectoryMap: Record<EntrySection, string> = {
  blog: "blog/text",
  management: "about/text",
  photos: "photos/entries",
  projects: "projects/entries",
};

export default async function ArticleCardFetcher({
  section,
  slug,
  omitSectionType = false,
  useCalendarDate = false,
  className = "",
}: ArticleCardData & { className?: string }) {
  const { title, description, date, lastEditedDate } = (await fetchEntryBySlug(
    slug,
    sectionDirectoryMap[section],
    sectionMethodMap[section],
    ["title", "description", "date", "lastEditedDate"]
  )) as ArticleCardDisplay & { lastEditedDate?: string };
  return (
    <ArticleCard
      section={section}
      slug={slug}
      title={title}
      description={description || ""}
      date={lastEditedDate || date}
      omitSectionType={omitSectionType}
      useCalendarDate={useCalendarDate}
      className={className}
    />
  );
}
