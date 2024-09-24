import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import ArticleCard from "./ArticleCard";
import { sectionDirectoryMap, sectionMethodMap } from "./ArticleCard";

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
