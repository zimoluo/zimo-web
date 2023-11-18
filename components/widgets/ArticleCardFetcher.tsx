import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import ArticleCard from "./ArticleCard";

const sectionMethodMap: Record<EntrySection, "markdown" | "json"> = {
  blog: "markdown",
  management: "markdown",
  photos: "json",
  projects: "json",
};

const sectionDirectoryMap: Record<EntrySection, string> = {
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
  const { title, description, date } = (await fetchEntryBySlug(
    slug,
    sectionDirectoryMap[section],
    sectionMethodMap[section],
    ["title", "description", "date"]
  )) as ArticleCardDisplay;
  return (
    <ArticleCard
      section={section}
      slug={slug}
      title={title}
      description={description || ""}
      date={date}
      omitSectionType={omitSectionType}
      useCalendarDate={useCalendarDate}
      className={className}
    />
  );
}
